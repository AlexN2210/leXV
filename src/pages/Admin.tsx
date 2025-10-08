import { useEffect, useState } from 'react';
import { Lock, LogOut, Package, CheckCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('tous');

  useEffect(() => {
    if (user) {
      fetchCommandes();
    }
  }, [user]);

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
                  placeholder="admin@lexv.fr"
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
                  placeholder="••••••••"
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
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-2">Backoffice Admin</h1>
            <p className="text-gray-600">Gestion des commandes</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
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
                className="border-4 border-black p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-wrap justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{commande.client_nom}</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Téléphone: {commande.client_telephone}</p>
                      {commande.client_email && <p>Email: {commande.client_email}</p>}
                      <p>Retrait: {commande.arrets?.nom}</p>
                      <p>
                        Date: {new Date(commande.date_retrait).toLocaleDateString('fr-FR')} à{' '}
                        {commande.heure_retrait}
                      </p>
                      <p className="text-sm text-gray-500">
                        Commandé le:{' '}
                        {new Date(commande.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-4">{getStatusBadge(commande.statut)}</div>
                    <div className="text-3xl font-bold">
                      {commande.montant_total.toFixed(2)}€
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-3">Articles commandés:</h4>
                  <div className="space-y-2">
                    {commande.commande_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between bg-gray-50 p-3 border-2 border-gray-300"
                      >
                        <span>
                          {item.quantite}x {item.menu_items.nom}
                        </span>
                        <span className="font-semibold">
                          {(item.quantite * item.prix_unitaire).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
