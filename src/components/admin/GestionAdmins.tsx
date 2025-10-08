import { useState } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';

export const GestionAdmins = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Implémenter l'ajout d'admin via Supabase Admin API
      alert('Fonctionnalité à venir : Ajout d\'admin');
      setNewAdminEmail('');
      setNewAdminPassword('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'admin:', error);
      alert('Erreur lors de l\'ajout de l\'admin');
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

      <div className="bg-gray-50 border-2 border-gray-300 p-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">ℹ️ Information importante :</p>
        <p>Pour ajouter ou supprimer des administrateurs, utilisez le Dashboard Supabase :</p>
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

