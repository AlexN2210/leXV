import { useEffect, useState, useRef } from 'react';
import { Lock, LogOut, Package, CheckCircle, Clock, X, Settings, ShoppingBag, Download, Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { GestionAdmins } from '../components/admin/GestionAdmins';
import { GestionArrets } from '../components/admin/GestionArrets';
import { GestionHoraires } from '../components/admin/GestionHoraires';
import { GestionMenu } from '../components/admin/GestionMenu';
import { GestionContacts } from '../components/admin/GestionContacts';
import { Financier } from '../components/admin/Financier';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { demanderPermissionNotifications, notifierNouvelleCommande, notifierNouveauContact, jouerSonNotification } from '../lib/notifications';

interface CommandeItem {
  id: string;
  menu_item_id: string;
  quantite: number;
  prix_unitaire: number;
  menu_items: {
    nom: string;
  };
}

interface Commande {
  id: string;
  client_nom: string;
  client_telephone: string;
  client_email: string | null;
  date_retrait: string;
  heure_retrait: string;
  statut: string;
  montant_total: number;
  created_at: string;
  arrets: {
    nom: string;
  } | null;
  commande_items: CommandeItem[];
}

export const Admin = () => {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { isInstallable, isInstalled, handleInstallClick } = usePWAInstall();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('tous');
  const [activeTab, setActiveTab] = useState<'commandes' | 'parametres' | 'financier'>('commandes');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const commandesCountRef = useRef<number>(0);
  const contactsCountRef = useRef<number>(0);

  useEffect(() => {
    if (user) {
      fetchCommandes();
      initNotifications();
      
      // Rafraîchissement automatique toutes les 10 secondes
      const interval = setInterval(() => {
        fetchCommandes();
      }, 10000);

      // Écouter les changements en temps réel pour les commandes
      const commandesChannel = supabase
        .channel('commandes-changes')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'commandes' }, 
          (payload) => {
            fetchCommandes();
            // Notifier nouvelle commande
            if (notificationsEnabled && payload.new) {
              const commande = payload.new as any;
              notifierNouvelleCommande(commande.client_nom, commande.montant_total);
              jouerSonNotification();
            }
          }
        )
        .subscribe();

      // Écouter les changements en temps réel pour les contacts
      const contactsChannel = supabase
        .channel('contacts-changes')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'demandes_contact' }, 
          (payload) => {
            // Notifier nouveau contact
            if (notificationsEnabled && payload.new) {
              const contact = payload.new as any;
              notifierNouveauContact(contact.nom, contact.type_evenement);
              jouerSonNotification();
            }
          }
        )
        .subscribe();

      return () => {
        clearInterval(interval);
        commandesChannel.unsubscribe();
        contactsChannel.unsubscribe();
      };
    }
  }, [user, notificationsEnabled]);

  const initNotifications = async () => {
    const hasPermission = await demanderPermissionNotifications();
    setNotificationsEnabled(hasPermission);
  };

  const fetchCommandes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('commandes')
        .select(`
          *,
          arrets (nom),
          commande_items (
            id,
            menu_item_id,
            quantite,
            prix_unitaire,
            menu_items (nom)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommandes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      if (error.message?.includes('Invalid login credentials')) {
        setLoginError('Email ou mot de passe incorrect');
      } else if (error.message?.includes('Email not confirmed')) {
        setLoginError('Veuillez confirmer votre email avant de vous connecter');
      } else {
        setLoginError('Erreur de connexion. Veuillez réessayer.');
      }
    }
  };

  const handleStatusChange = async (commandeId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update({ statut: newStatus, updated_at: new Date().toISOString() })
        .eq('id', commandeId);

      if (error) throw error;
      fetchCommandes();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (statut: string) => {
    const styles = {
      en_attente: 'bg-yellow-100 text-yellow-800 border-yellow-800',
      en_preparation: 'bg-blue-100 text-blue-800 border-blue-800',
      prete: 'bg-green-100 text-green-800 border-green-800',
      recuperee: 'bg-gray-100 text-gray-800 border-gray-800',
      annulee: 'bg-red-100 text-red-800 border-red-800',
    };

    const labels = {
      en_attente: 'En Attente',
      en_preparation: 'En Préparation',
      prete: 'Prête',
      recuperee: 'Récupérée',
      annulee: 'Annulée',
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-semibold border-2 ${
          styles[statut as keyof typeof styles] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {labels[statut as keyof typeof labels] || statut}
      </span>
    );
  };

  const filteredCommandes = commandes.filter((commande) => {
    if (filter === 'tous') return true;
    return commande.statut === filter;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-black">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Lock size={64} className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-2">LE XV</h1>
            <h2 className="text-2xl font-bold mb-2">Espace Admin</h2>
            <p className="text-gray-600">Connectez-vous pour accéder au backoffice</p>
          </div>

          <form onSubmit={handleLogin} className="border-4 border-black p-8">
            {loginError && (
              <div className="bg-red-100 border-2 border-red-800 text-red-800 p-4 mb-6">
                {loginError}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-black"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 text-lg font-bold hover:bg-gray-800 transition-colors"
              >
                Se Connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black py-20 px-4 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-wrap justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-bold mb-2">LE XV - Backoffice</h1>
            <p className="text-gray-600">Administration</p>
            {isInstalled && (
              <p className="text-xs text-green-600 mt-1">📱 Application installée</p>
            )}
          </div>
          <div className="flex gap-3">
            {isInstallable && !isInstalled && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-semibold hover:bg-green-700 transition-colors"
              >
                <Download size={20} />
                Installer l'App
              </button>
            )}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="mb-8 flex gap-4 border-b-4 border-black overflow-x-auto">
          <button
            onClick={() => setActiveTab('commandes')}
            className={`flex items-center gap-2 px-8 py-4 font-bold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'commandes'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <ShoppingBag size={24} />
            Commandes
          </button>
          <button
            onClick={() => setActiveTab('financier')}
            className={`flex items-center gap-2 px-8 py-4 font-bold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'financier'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <TrendingUp size={24} />
            Financier
          </button>
          <button
            onClick={() => setActiveTab('parametres')}
            className={`flex items-center gap-2 px-8 py-4 font-bold text-lg transition-colors whitespace-nowrap ${
              activeTab === 'parametres'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <Settings size={24} />
            Paramètres
          </button>
        </div>

        {/* Contenu de l'onglet Commandes */}
        {activeTab === 'commandes' && (
          <>
            <div className="mb-6 bg-green-50 border-2 border-green-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                <p className="font-semibold text-green-800">
                  Mise à jour automatique en temps réel
                </p>
              </div>
              <button
                onClick={() => fetchCommandes()}
                className="bg-black text-white px-4 py-2 font-semibold hover:bg-gray-800 text-sm"
              >
                🔄 Rafraîchir
              </button>
            </div>

            <div className="mb-8 flex flex-wrap gap-4">
              <button
                onClick={() => setFilter('tous')}
                className={`px-6 py-3 font-semibold border-2 transition-colors ${
                  filter === 'tous'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                Toutes ({commandes.length})
              </button>
              <button
                onClick={() => setFilter('en_attente')}
                className={`px-6 py-3 font-semibold border-2 transition-colors ${
                  filter === 'en_attente'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                En Attente ({commandes.filter((c) => c.statut === 'en_attente').length})
              </button>
              <button
                onClick={() => setFilter('en_preparation')}
                className={`px-6 py-3 font-semibold border-2 transition-colors ${
                  filter === 'en_preparation'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                En Préparation ({commandes.filter((c) => c.statut === 'en_preparation').length})
              </button>
              <button
                onClick={() => setFilter('prete')}
                className={`px-6 py-3 font-semibold border-2 transition-colors ${
                  filter === 'prete'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                Prêtes ({commandes.filter((c) => c.statut === 'prete').length})
              </button>
            </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-2xl">Chargement des commandes...</div>
          </div>
        ) : filteredCommandes.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto mb-6 text-gray-400" />
            <p className="text-xl text-gray-600">Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCommandes.map((commande) => (
              <div
                key={commande.id}
                className="border-4 border-black bg-white hover:shadow-2xl transition-all"
              >
                {/* En-tête de la card */}
                <div className="bg-black text-white p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">{commande.client_nom}</h3>
                    <p className="text-sm text-gray-300">
                      Commande #{commande.id.substring(0, 8)}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(commande.statut)}
                  </div>
                </div>

                {/* Contenu de la card */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Informations client */}
                    <div>
                      <h4 className="font-bold text-lg mb-3 border-b-2 border-black pb-2">
                        👤 Informations Client
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Nom:</span> {commande.client_nom}</p>
                        <p><span className="font-semibold">Téléphone:</span> {commande.client_telephone}</p>
                        {commande.client_email && (
                          <p><span className="font-semibold">Email:</span> {commande.client_email}</p>
                        )}
                      </div>
                    </div>

                    {/* Informations de retrait */}
                    <div>
                      <h4 className="font-bold text-lg mb-3 border-b-2 border-black pb-2">
                        📍 Informations de Retrait
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Lieu:</span> {commande.arrets?.nom || 'N/A'}</p>
                        <p><span className="font-semibold">Date:</span> {new Date(commande.date_retrait).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><span className="font-semibold">Heure:</span> {commande.heure_retrait}</p>
                        <p className="text-xs text-gray-500 mt-3">
                          Commandé le: {new Date(commande.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Articles commandés */}
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-3 border-b-2 border-black pb-2">
                      🍔 Articles Commandés
                    </h4>
                    <div className="space-y-2">
                      {commande.commande_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-gray-50 p-4 border-2 border-black"
                        >
                          <div>
                            <span className="font-bold text-lg">{item.quantite}x</span>
                            <span className="ml-2 font-semibold">{item.menu_items.nom}</span>
                            <p className="text-xs text-gray-600 ml-8">
                              Prix unitaire: {item.prix_unitaire.toFixed(2)}€
                            </p>
                          </div>
                          <span className="font-bold text-lg">
                            {(item.quantite * item.prix_unitaire).toFixed(2)}€
                          </span>
                        </div>
                      ))}
                      <div className="bg-black text-white p-4 border-2 border-black flex justify-between items-center mt-4">
                        <span className="font-bold text-xl">TOTAL</span>
                        <span className="font-bold text-3xl">{commande.montant_total.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions sur la commande */}
                  <div className="border-t-2 border-gray-200 pt-4">
                    <h4 className="font-bold text-lg mb-3">⚡ Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      {commande.statut === 'en_attente' && (
                        <button
                          onClick={() => handleStatusChange(commande.id, 'en_preparation')}
                          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <Clock size={20} />
                          Mettre en Préparation
                        </button>
                      )}
                      {commande.statut === 'en_preparation' && (
                        <button
                          onClick={() => handleStatusChange(commande.id, 'prete')}
                          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-semibold hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={20} />
                          Marquer comme Prête
                        </button>
                      )}
                      {commande.statut === 'prete' && (
                        <button
                          onClick={() => handleStatusChange(commande.id, 'recuperee')}
                          className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 font-semibold hover:bg-gray-700 transition-colors"
                        >
                          <Package size={20} />
                          Marquer comme Récupérée
                        </button>
                      )}
                      {commande.statut !== 'annulee' && commande.statut !== 'recuperee' && (
                        <button
                          onClick={() => handleStatusChange(commande.id, 'annulee')}
                          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors"
                        >
                          <X size={20} />
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* Contenu de l'onglet Financier */}
        {activeTab === 'financier' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Statistiques Financières</h2>
            <Financier />
          </div>
        )}

        {/* Contenu de l'onglet Paramètres */}
        {activeTab === 'parametres' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Paramètres et Configuration</h2>
            <p className="text-gray-600 mb-8">Gérez les paramètres de votre food truck</p>
            
            {/* Carte Notifications */}
            <div className="border-4 border-black p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Bell size={28} />
                Notifications Push
              </h3>
              <p className="text-gray-700 mb-4">
                Activez les notifications pour être alerté en temps réel des nouvelles commandes et demandes de contact.
              </p>
              
              {notificationsEnabled ? (
                <div className="bg-green-100 border-2 border-green-600 p-4 text-green-800">
                  <p className="font-semibold">✓ Notifications activées</p>
                  <p className="text-sm mt-2">Vous recevrez une alerte à chaque nouvelle commande ou demande de contact.</p>
                  <button
                    onClick={async () => {
                      const hasPermission = await demanderPermissionNotifications();
                      setNotificationsEnabled(hasPermission);
                    }}
                    className="mt-3 bg-green-700 text-white px-4 py-2 font-semibold hover:bg-green-800 text-sm"
                  >
                    Vérifier les Permissions
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={async () => {
                      const hasPermission = await demanderPermissionNotifications();
                      setNotificationsEnabled(hasPermission);
                      if (hasPermission) {
                        alert('✅ Notifications activées ! Vous recevrez maintenant des alertes pour les nouvelles commandes et contacts.');
                      } else {
                        alert('❌ Permission refusée. Activez les notifications dans les paramètres de votre navigateur.');
                      }
                    }}
                    className="flex items-center gap-2 bg-orange-600 text-white px-8 py-4 text-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    <Bell size={24} />
                    Activer les Notifications
                  </button>
                  <p className="text-xs text-gray-600 mt-3">
                    * Votre navigateur vous demandera la permission d'envoyer des notifications
                  </p>
                </div>
              )}
            </div>

            {/* Carte PWA Installation */}
            <div className="border-4 border-black p-6 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Download size={28} />
                Application Mobile (PWA)
              </h3>
              <p className="text-gray-700 mb-4">
                Installez l'application admin sur votre téléphone ou tablette pour un accès rapide et une expérience optimale.
              </p>
              
              {isInstalled ? (
                <div className="bg-green-100 border-2 border-green-600 p-4 text-green-800">
                  <p className="font-semibold">✓ Application déjà installée</p>
                  <p className="text-sm mt-2">Vous pouvez accéder à l'admin depuis l'icône sur votre écran d'accueil.</p>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 bg-green-600 text-white px-8 py-4 text-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Download size={24} />
                  Installer l'Application Admin
                </button>
              ) : (
                <div className="bg-blue-100 border-2 border-blue-600 p-4 text-blue-800">
                  <p className="font-semibold">📱 Installation disponible sur mobile</p>
                  <p className="text-sm mt-2">
                    Pour installer l'application :
                  </p>
                  <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                    <li><strong>Sur Android :</strong> Menu (⋮) → "Ajouter à l'écran d'accueil"</li>
                    <li><strong>Sur iOS :</strong> Bouton Partager → "Sur l'écran d'accueil"</li>
                    <li><strong>Sur PC :</strong> Icône d'installation dans la barre d'adresse</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Gestion des Demandes de Contact */}
            <GestionContacts />

            {/* Gestion des Admins */}
            <GestionAdmins />

            {/* Gestion des Arrêts */}
            <GestionArrets />

            {/* Gestion des Horaires */}
            <GestionHoraires />

            {/* Gestion du Menu */}
            <GestionMenu />
          </div>
        )}
      </div>
    </div>
  );
};
