import { useState, useEffect } from 'react';
import { Mail, CheckCircle, Clock, X, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DemandeContact {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  type_evenement: string;
  date_evenement: string | null;
  nombre_personnes: number | null;
  lieu: string | null;
  message: string | null;
  statut: string;
  created_at: string;
}

export const GestionContacts = () => {
  const [demandes, setDemandes] = useState<DemandeContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('toutes');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchDemandes();

    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(() => {
      fetchDemandes();
    }, 30000);

    // Écoute en temps réel
    const channel = supabase
      .channel('demandes-contact-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'demandes_contact' }, 
        () => {
          fetchDemandes();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      channel.unsubscribe();
    };
  }, []);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('demandes_contact')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemandes(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('demandes_contact')
        .update({ statut: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchDemandes();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;

    try {
      const { error } = await supabase
        .from('demandes_contact')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchDemandes();
      alert('Demande supprimée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (statut: string) => {
    const styles = {
      nouvelle: 'bg-yellow-100 text-yellow-800 border-yellow-800',
      en_cours: 'bg-blue-100 text-blue-800 border-blue-800',
      traitee: 'bg-green-100 text-green-800 border-green-800',
      annulee: 'bg-red-100 text-red-800 border-red-800',
    };

    const labels = {
      nouvelle: 'Nouvelle',
      en_cours: 'En Cours',
      traitee: 'Traitée',
      annulee: 'Annulée',
    };

    return (
      <span className={`px-3 py-1 text-sm font-semibold border-2 ${styles[statut as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[statut as keyof typeof labels] || statut}
      </span>
    );
  };

  const filteredDemandes = demandes.filter((demande) => {
    if (filter === 'toutes') return true;
    return demande.statut === filter;
  });

  return (
    <div className="border-4 border-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Mail size={28} />
          Demandes de Contact & Événements
        </h3>
        <button
          onClick={() => fetchDemandes()}
          className="bg-black text-white px-4 py-2 font-semibold hover:bg-gray-800 text-sm"
        >
          🔄 Rafraîchir
        </button>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('toutes')}
          className={`px-4 py-2 font-semibold border-2 ${
            filter === 'toutes' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          Toutes ({demandes.length})
        </button>
        <button
          onClick={() => setFilter('nouvelle')}
          className={`px-4 py-2 font-semibold border-2 ${
            filter === 'nouvelle' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          Nouvelles ({demandes.filter(d => d.statut === 'nouvelle').length})
        </button>
        <button
          onClick={() => setFilter('en_cours')}
          className={`px-4 py-2 font-semibold border-2 ${
            filter === 'en_cours' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          En Cours ({demandes.filter(d => d.statut === 'en_cours').length})
        </button>
        <button
          onClick={() => setFilter('traitee')}
          className={`px-4 py-2 font-semibold border-2 ${
            filter === 'traitee' ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
          }`}
        >
          Traitées ({demandes.filter(d => d.statut === 'traitee').length})
        </button>
      </div>

      {/* Liste des demandes */}
      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : filteredDemandes.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          Aucune demande de contact
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDemandes.map((demande) => (
            <div key={demande.id} className="border-2 border-black">
              {/* En-tête */}
              <div className="bg-black text-white p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xl font-bold">{demande.nom}</h4>
                  <p className="text-sm text-gray-300">{demande.type_evenement}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(demande.statut)}
                  <button
                    onClick={() => setExpandedId(expandedId === demande.id ? null : demande.id)}
                    className="bg-white text-black p-2 hover:bg-gray-200"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm"><strong>📧 Email:</strong> {demande.email}</p>
                    <p className="text-sm"><strong>📞 Téléphone:</strong> {demande.telephone}</p>
                  </div>
                  <div>
                    {demande.date_evenement && (
                      <p className="text-sm"><strong>📅 Date:</strong> {new Date(demande.date_evenement).toLocaleDateString('fr-FR')}</p>
                    )}
                    {demande.nombre_personnes && (
                      <p className="text-sm"><strong>👥 Personnes:</strong> {demande.nombre_personnes}</p>
                    )}
                    {demande.lieu && (
                      <p className="text-sm"><strong>📍 Lieu:</strong> {demande.lieu}</p>
                    )}
                  </div>
                </div>

                {expandedId === demande.id && demande.message && (
                  <div className="mb-4 p-3 bg-gray-50 border-2 border-gray-300">
                    <p className="font-semibold mb-2">💬 Message:</p>
                    <p className="text-sm whitespace-pre-wrap">{demande.message}</p>
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-4">
                  Reçu le: {new Date(demande.created_at).toLocaleString('fr-FR')}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {demande.statut === 'nouvelle' && (
                    <button
                      onClick={() => handleStatusChange(demande.id, 'en_cours')}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
                    >
                      <Clock size={18} />
                      Prendre en Charge
                    </button>
                  )}
                  {demande.statut === 'en_cours' && (
                    <button
                      onClick={() => handleStatusChange(demande.id, 'traitee')}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700"
                    >
                      <CheckCircle size={18} />
                      Marquer comme Traitée
                    </button>
                  )}
                  {demande.statut !== 'annulee' && (
                    <button
                      onClick={() => handleStatusChange(demande.id, 'annulee')}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 font-semibold hover:bg-red-700"
                    >
                      <X size={18} />
                      Annuler
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(demande.id)}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 font-semibold hover:bg-gray-700"
                  >
                    <X size={18} />
                    Supprimer
                  </button>
                  <a
                    href={`tel:${demande.telephone}`}
                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 font-semibold hover:bg-gray-900"
                  >
                    📞 Appeler
                  </a>
                  <a
                    href={`mailto:${demande.email}`}
                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 font-semibold hover:bg-gray-900"
                  >
                    📧 Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-green-50 border-2 border-green-600 p-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
          <p className="font-semibold text-green-800">
            Mise à jour automatique en temps réel
          </p>
        </div>
      </div>
    </div>
  );
};

