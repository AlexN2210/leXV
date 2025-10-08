import { useState, useEffect } from 'react';
import { Clock, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Horaire {
  id: string;
  jour: string;
  horaire_debut: string;
  horaire_fin: string;
  actif: boolean;
}

export const GestionHoraires = () => {
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHoraires();
  }, []);

  const fetchHoraires = async () => {
    try {
      const { data, error } = await supabase
        .from('horaires')
        .select('*')
        .order('jour');
      
      if (error) throw error;
      setHoraires(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    try {
      const horaire = horaires.find(h => h.id === id);
      if (!horaire) return;

      const { error } = await supabase
        .from('horaires')
        .update({
          horaire_debut: horaire.horaire_debut,
          horaire_fin: horaire.horaire_fin,
          actif: horaire.actif,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      alert('Horaires mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const updateHoraireField = (id: string, field: keyof Horaire, value: any) => {
    setHoraires(horaires.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const joursOrdre = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const horairesTries = [...horaires].sort((a, b) => 
    joursOrdre.indexOf(a.jour) - joursOrdre.indexOf(b.jour)
  );

  return (
    <div className="border-4 border-black p-6">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock size={28} />
        Gestion des Horaires
      </h3>

      <div className="space-y-4">
        {horairesTries.map((horaire) => (
          <div 
            key={horaire.id} 
            className={`border-2 border-black p-4 ${horaire.actif ? 'bg-white' : 'bg-gray-100'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <p className="font-bold text-lg">{horaire.jour}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ouverture</label>
                <input
                  type="time"
                  value={horaire.horaire_debut?.substring(0, 5) || ''}
                  onChange={(e) => updateHoraireField(horaire.id, 'horaire_debut', e.target.value)}
                  className="w-full border-2 border-black p-2"
                  disabled={!horaire.actif}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Fermeture</label>
                <input
                  type="time"
                  value={horaire.horaire_fin?.substring(0, 5) || ''}
                  onChange={(e) => updateHoraireField(horaire.id, 'horaire_fin', e.target.value)}
                  className="w-full border-2 border-black p-2"
                  disabled={!horaire.actif}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={horaire.actif}
                    onChange={(e) => updateHoraireField(horaire.id, 'actif', e.target.checked)}
                    className="w-6 h-6"
                  />
                  <span className="font-semibold">Actif</span>
                </label>
                <button
                  onClick={() => handleUpdate(horaire.id)}
                  disabled={loading}
                  className="bg-black text-white p-2 hover:bg-gray-800 disabled:bg-gray-400"
                  title="Enregistrer"
                >
                  <Save size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border-2 border-blue-300 p-4 text-sm">
        <p className="font-semibold mb-2">ℹ️ Information :</p>
        <p>Les horaires définis ici seront utilisés pour les créneaux de retrait dans la page Commander.</p>
        <p>Décochez "Actif" pour désactiver un jour de présence.</p>
      </div>
    </div>
  );
};

