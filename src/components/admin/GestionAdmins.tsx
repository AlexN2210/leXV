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
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, created_at, last_login_at')
        .eq('actif', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAdmins(data?.map(d => ({
        id: d.id,
        email: d.email,
        created_at: d.created_at,
        last_sign_in_at: d.last_login_at
      })) || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Créer uniquement dans notre table admins (pas dans Supabase Auth)
      const { error: adminError } = await supabase
        .from('admins')
        .insert([{
          email: newAdminEmail,
          password_hash: newAdminPassword,
          actif: true
        }]);

      if (adminError) throw adminError;

      alert(`✅ Admin créé avec succès !\n\n📧 Email: ${newAdminEmail}\n🔑 Mot de passe: ${newAdminPassword}\n\n⚠️ IMPORTANT: Copiez ces identifiants maintenant !\n\nL'admin doit aussi être créé manuellement dans Supabase Auth:\n1. Allez sur Dashboard → Authentication → Users\n2. Cliquez "Add User"\n3. Utilisez le même email et mot de passe\n4. Cochez "Auto Confirm User"`);
      
      setNewAdminEmail('');
      setNewAdminPassword('');
      await fetchAdmins();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'admin:', error);
      if (error.message?.includes('duplicate key')) {
        alert('Cet email est déjà enregistré');
      } else {
        alert('Erreur lors de l\'ajout de l\'admin: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (email === 'admin@lexv.fr') {
      alert('Impossible de supprimer l\'admin principal !');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'admin ${email} ?`)) return;

    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Admin supprimé avec succès !');
      await fetchAdmins();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
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
                  {admin.email !== 'admin@lexv.fr' && (
                    <button
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                      className="bg-red-600 text-white p-2 hover:bg-red-700"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-yellow-50 border-2 border-yellow-600 p-4 text-sm">
        <p className="font-semibold mb-2">⚠️ Procédure pour ajouter un admin :</p>
        <ol className="list-decimal list-inside space-y-1 text-yellow-900">
          <li>Remplissez le formulaire ci-dessus et cliquez sur "Ajouter un Admin"</li>
          <li>Copiez l'email et le mot de passe affichés dans l'alerte</li>
          <li>Allez sur le <a href="https://supabase.com/dashboard/project/wbdxpoiisfgzszegbxns/auth/users" target="_blank" className="text-blue-600 underline">Dashboard Supabase</a></li>
          <li>Cliquez sur "Add User" et utilisez le même email/mot de passe</li>
          <li>Cochez "Auto Confirm User" puis créez l'utilisateur</li>
        </ol>
        <p className="mt-3 font-semibold">🔒 L'admin principal (admin@lexv.fr) ne peut pas être supprimé.</p>
      </div>
    </div>
  );
};

