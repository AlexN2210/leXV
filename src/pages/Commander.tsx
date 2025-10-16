import { useEffect, useState } from 'react';
import { ShoppingCart, CheckCircle, Plus, Minus, Trash2, Mail, Printer, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { envoyerEmailConfirmation, genererRecapitulatifCommande, telechargerRecapitulatifPDF } from '../lib/emailService';

interface MenuItem {
  id: string;
  nom: string;
  description: string;
  prix: number;
  category_id: string;
  disponible: boolean;
}

interface MenuCategory {
  id: string;
  nom: string;
  ordre: number;
}

interface Arret {
  id: string;
  nom: string;
  jour: string;
  horaire_debut: string;
  horaire_fin: string;
}

interface Horaire {
  id: string;
  jour: string;
  horaire_debut: string;
  horaire_fin: string;
  actif: boolean;
}

interface CartItem {
  menuItem: MenuItem;
  quantite: number;
}

export const Commander = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [arrets, setArrets] = useState<Arret[]>([]);
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recapitulatif, setRecapitulatif] = useState('');
  const [commandeData, setCommandeData] = useState<any>(null);

  const [formData, setFormData] = useState({
    lieu: '',
    jour: '',
    arretId: '',
    dateRetrait: '',
    heureRetrait: '',
    clientPrenom: '',
    clientNom: '',
    clientTelephone: '',
    clientEmail: '',
  });

  // Récupérer les lieux uniques
  const lieux = Array.from(new Set(arrets.map(a => a.nom))).map(nom => ({
    nom,
    adresse: arrets.find(a => a.nom === nom)?.adresse || ''
  }));

  // Filtrer les jours disponibles pour le lieu sélectionné
  const joursDisponibles = arrets
    .filter(a => a.nom === formData.lieu)
    .map(a => {
      // Récupérer les horaires depuis la table horaires
      const horaireJour = horaires.find(h => h.jour === a.jour);
      console.log('Horaires pour', a.jour, ':', horaireJour?.horaire_debut, '-', horaireJour?.horaire_fin);
      return { 
        jour: a.jour, 
        id: a.id, 
        horaire_debut: horaireJour?.horaire_debut || '18:00', 
        horaire_fin: horaireJour?.horaire_fin || '22:00' 
      };
    });

  // Générer les prochaines dates disponibles pour le jour sélectionné
  const getProchainesdates = (jour: string) => {
    const dates = [];
    const joursFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const jourIndex = joursFr.indexOf(jour);
    const today = new Date();
    
    // Générer les 8 prochaines occurrences du jour sélectionné
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() === jourIndex) {
        dates.push(date.toISOString().split('T')[0]);
      }
      if (dates.length >= 8) break;
    }
    return dates;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes, arretsRes, horairesRes] = await Promise.all([
        supabase.from('menu_categories').select('*').order('ordre'),
        supabase.from('menu_items').select('*').eq('disponible', true).order('ordre'),
        supabase.from('arrets').select('*').eq('actif', true).order('jour'),
        supabase.from('horaires').select('*').eq('actif', true),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (itemsRes.data) setMenuItems(itemsRes.data);
      if (arretsRes.data) {
        console.log('Arrêts chargés:', arretsRes.data);
        setArrets(arretsRes.data);
      }
      if (horairesRes.data) {
        console.log('Horaires chargés:', horairesRes.data);
        setHoraires(horairesRes.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find((item) => item.menuItem.id === menuItem.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { menuItem, quantite: 1 }]);
    }
  };

  const getCartItemQuantity = (menuItemId: string) => {
    const item = cart.find((item) => item.menuItem.id === menuItemId);
    return item ? item.quantite : 0;
  };

  const updateQuantity = (menuItemId: string, change: number) => {
    setCart(
      cart
        .map((item) =>
          item.menuItem.id === menuItemId
            ? { ...item, quantite: item.quantite + change }
            : item
        )
        .filter((item) => item.quantite > 0)
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter((item) => item.menuItem.id !== menuItemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.menuItem.prix * item.quantite, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Veuillez ajouter au moins un article à votre commande');
      return;
    }

    setSubmitting(true);

    try {
      const { data: commandeData, error: commandeError } = await supabase
        .from('commandes')
        .insert({
          arret_id: formData.arretId,
          client_prenom: formData.clientPrenom,
          client_nom: formData.clientNom,
          client_telephone: formData.clientTelephone,
          client_email: formData.clientEmail,
          date_retrait: formData.dateRetrait,
          heure_retrait: formData.heureRetrait,
          statut: 'en_attente',
          montant_total: calculateTotal(),
        })
        .select()
        .single();

      if (commandeError) throw commandeError;

      const commandeItems = cart.map((item) => ({
        commande_id: commandeData.id,
        menu_item_id: item.menuItem.id,
        quantite: item.quantite,
        prix_unitaire: item.menuItem.prix,
      }));

      const { error: itemsError } = await supabase
        .from('commande_items')
        .insert(commandeItems);

      if (itemsError) throw itemsError;

      // Préparer les données pour l'email
      const emailData = {
        clientPrenom: formData.clientPrenom,
        clientNom: formData.clientNom,
        clientEmail: formData.clientEmail,
        clientTelephone: formData.clientTelephone,
        lieu: formData.lieu,
        jour: formData.jour,
        dateRetrait: formData.dateRetrait,
        heureRetrait: formData.heureRetrait,
        articles: cart.map(item => ({
          nom: item.menuItem.nom,
          quantite: item.quantite,
          prix: item.menuItem.prix
        })),
        total: calculateTotal(),
        numeroCommande: commandeData.id.substring(0, 8).toUpperCase()
      };

      // Sauvegarder les données de la commande pour le PDF
      setCommandeData(emailData);

      // Générer le récapitulatif
      const recap = genererRecapitulatifCommande(emailData);
      setRecapitulatif(recap);

      // Tenter d'envoyer l'email (si configuré)
      if (formData.clientEmail) {
        await envoyerEmailConfirmation(emailData);
      }

      setSuccess(true);
      setCart([]);
      setFormData({
        lieu: '',
        jour: '',
        arretId: '',
        dateRetrait: '',
        heureRetrait: '',
        clientPrenom: '',
        clientNom: '',
        clientTelephone: '',
        clientEmail: '',
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-black">Chargement...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <CheckCircle size={80} className="mx-auto mb-6 text-green-600" />
            <h2 className="text-4xl font-bold mb-4">Commande Confirmée !</h2>
            <p className="text-xl text-gray-600">
              Votre commande a été enregistrée avec succès. Nous la préparons avec soin !
            </p>
          </div>

          {/* Récapitulatif de la commande */}
          <div className="border-4 border-black p-6 mb-6 bg-white">
            <h3 className="text-2xl font-bold mb-4 text-center">📋 Récapitulatif</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-6 border-2 border-gray-300 overflow-x-auto">
              {recapitulatif}
            </pre>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (commandeData) {
                  telechargerRecapitulatifPDF(commandeData);
                }
              }}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Download size={20} />
              Télécharger PDF
            </button>
            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`<pre style="font-family: monospace; white-space: pre-wrap; padding: 20px;">${recapitulatif}</pre>`);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
              className="flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <Printer size={20} />
              Imprimer
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(recapitulatif);
                alert('Récapitulatif copié dans le presse-papier !');
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Mail size={20} />
              Copier
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setRecapitulatif('');
                setCommandeData(null);
              }}
              className="bg-black text-white px-6 py-3 text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Nouvelle Commande
            </button>
          </div>

          <div className="mt-6 bg-green-50 border-2 border-green-600 p-4 text-center">
            <p className="text-green-800 font-semibold">
              💬 Vous recevrez une notification par SMS ou appel téléphonique quand votre commande sera prête !
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black py-20 px-4 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <ShoppingCart size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Commander</h1>
          <p className="text-xl text-gray-600">
            Sélectionnez vos plats et remplissez le formulaire pour passer commande
          </p>
        </div>

        {/* Indicateur de panier mobile */}
        {cart.length > 0 && (
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <button
              onClick={() => {
                const panierElement = document.getElementById('panier-mobile');
                if (panierElement) {
                  panierElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-black text-white p-4 rounded-full shadow-lg flex items-center gap-3 hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={24} />
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">{cart.length} article{cart.length > 1 ? 's' : ''}</span>
                <span className="font-bold text-sm">{calculateTotal().toFixed(2)}€</span>
              </div>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Sélection des Plats</h2>
            {categories.length === 0 && menuItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600">
                  Aucun plat disponible pour le moment. Revenez bientôt !
                </p>
              </div>
            ) : (
              categories.map((category) => {
                const categoryItems = menuItems.filter(
                  (item) => item.category_id === category.id
                );
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id} className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 border-b-2 border-black pb-2">
                      {category.nom}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          className="border-2 border-black p-4 flex justify-between items-start hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{item.nom}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1 italic">
                                {item.description}
                              </p>
                            )}
                            <p className="font-bold mt-2">{item.prix.toFixed(2)}€</p>
                          </div>
                          {getCartItemQuantity(item.id) === 0 ? (
                            <button
                              onClick={() => addToCart(item)}
                              className="ml-4 bg-black text-white p-3 hover:bg-gray-800 transition-colors rounded-lg"
                            >
                              <Plus size={24} />
                            </button>
                          ) : (
                            <div className="ml-4 flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="bg-gray-600 text-white w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition-colors rounded-lg"
                              >
                                <Minus size={20} />
                              </button>
                              <span className="font-bold text-xl min-w-[32px] text-center">
                                {getCartItemQuantity(item.id)}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="bg-black text-white w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors rounded-lg"
                              >
                                <Plus size={20} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div id="panier-mobile" className="bg-black text-white p-6 mb-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingCart size={24} />
                  Panier
                </h2>
                {cart.length === 0 ? (
                  <p className="text-gray-400">Votre panier est vide</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.menuItem.id} className="border-b border-gray-700 pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-lg">{item.menuItem.nom}</span>
                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, -1)}
                                className="bg-white text-black w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg"
                              >
                                <Minus size={18} />
                              </button>
                              <span className="font-bold text-xl min-w-[32px] text-center">{item.quantite}</span>
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, 1)}
                                className="bg-white text-black w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                            <span className="font-bold text-lg">
                              {(item.menuItem.prix * item.quantite).toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-2xl font-bold border-t border-gray-700 pt-4">
                      Total: {calculateTotal().toFixed(2)}€
                    </div>
                  </>
                )}
              </div>

              <form onSubmit={handleSubmit} className="border-4 border-black p-6">
                <h2 className="text-2xl font-bold mb-4">Informations</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">Lieu de Retrait *</label>
                    <select
                      required
                      value={formData.lieu}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          lieu: e.target.value,
                          jour: '',
                          arretId: ''
                        });
                      }}
                      className="w-full border-2 border-black p-3"
                    >
                      <option value="">Sélectionnez un lieu</option>
                      {lieux.map((lieu) => (
                        <option key={lieu.nom} value={lieu.nom}>
                          {lieu.nom} - {lieu.adresse}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.lieu && (
                    <div>
                      <label className="block font-semibold mb-2">Jour de Retrait *</label>
                      <select
                        required
                        value={formData.jour}
                        onChange={(e) => {
                          const jourSelectionne = joursDisponibles.find(j => j.jour === e.target.value);
                          setFormData({ 
                            ...formData, 
                            jour: e.target.value,
                            arretId: jourSelectionne?.id || ''
                          });
                        }}
                        className="w-full border-2 border-black p-3"
                      >
                        <option value="">Sélectionnez un jour</option>
                        {joursDisponibles.map((jour) => (
                          <option key={jour.jour} value={jour.jour}>
                            {jour.jour} ({jour.horaire_debut} - {jour.horaire_fin})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.jour && (
                    <div>
                      <label className="block font-semibold mb-2">Date de Retrait *</label>
                      <select
                        required
                        value={formData.dateRetrait}
                        onChange={(e) =>
                          setFormData({ ...formData, dateRetrait: e.target.value })
                        }
                        className="w-full border-2 border-black p-3"
                      >
                        <option value="">Sélectionnez une date</option>
                        {getProchainesdates(formData.jour).map((date) => {
                          const dateObj = new Date(date);
                          const options: Intl.DateTimeFormatOptions = { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          };
                          const dateFormatee = dateObj.toLocaleDateString('fr-FR', options);
                          return (
                            <option key={date} value={date}>
                              {dateFormatee}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-sm text-gray-600 mt-1">
                        Prochains {formData.jour}s disponibles
                      </p>
                    </div>
                  )}

                  {formData.jour && (
                    <div>
                      <label className="block font-semibold mb-2">Heure de Retrait *</label>
                      <select
                        required
                        value={formData.heureRetrait}
                        onChange={(e) =>
                          setFormData({ ...formData, heureRetrait: e.target.value })
                        }
                        className="w-full border-2 border-black p-3"
                      >
                        <option value="">Sélectionnez une heure</option>
                        {(() => {
                          const jourInfo = joursDisponibles.find(j => j.jour === formData.jour);
                          if (!jourInfo) return null;
                          
                          const heureDebut = jourInfo.horaire_debut?.substring(0, 5) || '18:00';
                          const heureFin = jourInfo.horaire_fin?.substring(0, 5) || '22:00';
                          
                          // Convertir les heures en minutes
                          const [heureD, minuteD] = heureDebut.split(':').map(Number);
                          const [heureF, minuteF] = heureFin.split(':').map(Number);
                          const minutesDebut = heureD * 60 + minuteD;
                          const minutesFin = heureF * 60 + minuteF;
                          
                          // Générer les créneaux de 15 minutes
                          const creneaux = [];
                          for (let minutes = minutesDebut; minutes <= minutesFin; minutes += 15) {
                            const h = Math.floor(minutes / 60);
                            const m = minutes % 60;
                            const heure = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                            creneaux.push(heure);
                          }
                          
                          return creneaux.map(heure => (
                            <option key={heure} value={heure}>
                              {heure}
                            </option>
                          ));
                        })()}
                      </select>
                      <p className="text-sm text-gray-600 mt-1">
                        Créneaux disponibles par tranches de 15 minutes
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold mb-2">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientPrenom}
                      onChange={(e) =>
                        setFormData({ ...formData, clientPrenom: e.target.value })
                      }
                      className="w-full border-2 border-black p-3"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientNom}
                      onChange={(e) =>
                        setFormData({ ...formData, clientNom: e.target.value })
                      }
                      className="w-full border-2 border-black p-3"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.clientTelephone}
                      onChange={(e) =>
                        setFormData({ ...formData, clientTelephone: e.target.value })
                      }
                      className="w-full border-2 border-black p-3"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, clientEmail: e.target.value })
                      }
                      className="w-full border-2 border-black p-3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || cart.length === 0}
                    className="w-full bg-black text-white py-4 text-lg font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Envoi en cours...' : 'Valider la Commande'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
