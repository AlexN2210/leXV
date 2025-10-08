import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Admin {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export const GestionAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      // Récupérer les utilisateurs via la table auth.users (lecture seule)
      const { data, error } = await supabase.rpc('get_admin_users');
      
      if (error) {
        console.log('Impossible de récupérer la liste des admins via RPC');
        // On affiche un message mais ça n'empêche pas le fonctionnement
      } else {
        setAdmins(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          emailRedirectTo: undefined,
        }
      });

      if (error) throw error;

      alert(`Admin créé avec succès ! Email: ${newAdminEmail}`);
      setNewAdminEmail('');
      setNewAdminPassword('');
      await fetchAdmins();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'admin:', error);
      if (error.message?.includes('already registered')) {
        alert('Cet email est déjà enregistré');
      } else {
        alert('Erreur lors de l\'ajout de l\'admin: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-4 border-black p-6">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserPlus size={28} />
        Gestion des Administrateurs
      </h3>

      <form onSubmit={handleAddAdmin} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Email de l'admin</label>
            <input
              type="email"
              required
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="w-full border-2 border-black p-3"
              placeholder="nouvel.admin@lexv.fr"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Mot de passe</label>
            <input
              type="password"
              required
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              className="w-full border-2 border-black p-3"
              placeholder="••••••••"
              minLength={8}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter un Admin'}
        </button>
      </form>

      {admins.length > 0 && (
        <div className="mt-6">
          <h4 className="font-bold text-lg mb-4">Administrateurs existants :</h4>
          <div className="space-y-2">
            {admins.map((admin) => (
              <div key={admin.id} className="flex justify-between items-center border-2 border-gray-300 p-3 bg-gray-50">
                <div>
                  <p className="font-semibold">{admin.email}</p>
                  <p className="text-sm text-gray-600">
                    Créé le: {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  {admin.last_sign_in_at && (
                    <p className="text-sm text-gray-500">
                      Dernière connexion: {new Date(admin.last_sign_in_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-green-600" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border-2 border-blue-300 p-4 text-sm">
        <p className="font-semibold mb-2">ℹ️ Information :</p>
        <p>Les nouveaux administrateurs recevront un email de confirmation automatiquement.</p>
        <p className="mt-2">Pour supprimer un admin, utilisez le Dashboard Supabase :</p>
        <a 
          href="https://supabase.com/dashboard/project/wbdxpoiisfgzszegbxns/auth/users"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Gérer les utilisateurs →
        </a>
      </div>
    </div>
  );
};

