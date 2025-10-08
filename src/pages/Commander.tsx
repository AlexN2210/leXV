import { useEffect, useState } from 'react';
import { ShoppingCart, CheckCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

interface CartItem {
  menuItem: MenuItem;
  quantite: number;
}

export const Commander = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [arrets, setArrets] = useState<Arret[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    lieu: '',
    jour: '',
    arretId: '',
    dateRetrait: '',
    heureRetrait: '',
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
    .map(a => ({ jour: a.jour, id: a.id, horaire_debut: a.horaire_debut, horaire_fin: a.horaire_fin }));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes, arretsRes] = await Promise.all([
        supabase.from('menu_categories').select('*').order('ordre'),
        supabase.from('menu_items').select('*').eq('disponible', true).order('ordre'),
        supabase.from('arrets').select('*').eq('actif', true).order('jour'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (itemsRes.data) setMenuItems(itemsRes.data);
      if (arretsRes.data) setArrets(arretsRes.data);
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

      setSuccess(true);
      setCart([]);
      setFormData({
        lieu: '',
        jour: '',
        arretId: '',
        dateRetrait: '',
        heureRetrait: '',
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
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle size={80} className="mx-auto mb-6 text-black" />
          <h2 className="text-4xl font-bold mb-4">Commande Confirmée !</h2>
          <p className="text-xl text-gray-600 mb-8">
            Votre commande a été enregistrée avec succès. Nous la préparons avec soin !
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Nouvelle Commande
          </button>
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
                          <button
                            onClick={() => addToCart(item)}
                            className="ml-4 bg-black text-white p-2 hover:bg-gray-800 transition-colors"
                          >
                            <Plus size={20} />
                          </button>
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
              <div className="bg-black text-white p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Panier</h2>
                {cart.length === 0 ? (
                  <p className="text-gray-400">Votre panier est vide</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.menuItem.id} className="border-b border-gray-700 pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold">{item.menuItem.nom}</span>
                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, -1)}
                                className="bg-white text-black w-8 h-8 flex items-center justify-center hover:bg-gray-200"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-bold">{item.quantite}</span>
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, 1)}
                                className="bg-white text-black w-8 h-8 flex items-center justify-center hover:bg-gray-200"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <span className="font-bold">
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
                      <input
                        type="date"
                        required
                        value={formData.dateRetrait}
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          const dayOfWeek = selectedDate.getDay();
                          const joursFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                          
                          if (joursFr[dayOfWeek] === formData.jour) {
                            setFormData({ ...formData, dateRetrait: e.target.value });
                          } else {
                            alert(`Veuillez sélectionner un ${formData.jour}`);
                          }
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border-2 border-black p-3"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Sélectionnez un {formData.jour}
                      </p>
                    </div>
                  )}

                  {formData.jour && (
                    <div>
                      <label className="block font-semibold mb-2">Heure de Retrait *</label>
                      <input
                        type="time"
                        required
                        value={formData.heureRetrait}
                        onChange={(e) => {
                          const selectedTime = e.target.value;
                          const jourInfo = joursDisponibles.find(j => j.jour === formData.jour);
                          
                          if (jourInfo && selectedTime >= jourInfo.horaire_debut && selectedTime <= jourInfo.horaire_fin) {
                            setFormData({ ...formData, heureRetrait: selectedTime });
                          } else {
                            alert(`L'heure doit être entre ${jourInfo?.horaire_debut} et ${jourInfo?.horaire_fin}`);
                            setFormData({ ...formData, heureRetrait: '' });
                          }
                        }}
                        min={joursDisponibles.find(j => j.jour === formData.jour)?.horaire_debut}
                        max={joursDisponibles.find(j => j.jour === formData.jour)?.horaire_fin}
                        step="900"
                        className="w-full border-2 border-black p-3"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Horaires disponibles : {joursDisponibles.find(j => j.jour === formData.jour)?.horaire_debut} - {joursDisponibles.find(j => j.jour === formData.jour)?.horaire_fin} (par tranches de 15 min)
                      </p>
                    </div>
                  )}

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
