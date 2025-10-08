import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Arret {
  id: string;
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  jour: string;
  horaire_debut: string;
  horaire_fin: string;
  actif: boolean;
}

export const GestionArrets = () => {
  const [arrets, setArrets] = useState<Arret[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    latitude: 0,
    longitude: 0,
    jour: '',
    horaire_debut: '18:00',
    horaire_fin: '22:00',
    actif: true,
  });

  useEffect(() => {
    fetchArrets();
  }, []);

  const fetchArrets = async () => {
    try {
      const { data, error } = await supabase
        .from('arrets')
        .select('*')
        .order('jour');
      
      if (error) throw error;
      setArrets(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('arrets').insert([formData]);
      if (error) throw error;

      await fetchArrets();
      setShowAddForm(false);
      resetForm();
      alert('Arrêt ajouté avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    try {
      const arret = arrets.find(a => a.id === id);
      if (!arret) return;

      const { error } = await supabase
        .from('arrets')
        .update(arret)
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      alert('Arrêt modifié avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet arrêt ?')) return;

    try {
      const { error } = await supabase.from('arrets').delete().eq('id', id);
      if (error) throw error;

      await fetchArrets();
      alert('Arrêt supprimé avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      adresse: '',
      latitude: 0,
      longitude: 0,
      jour: '',
      horaire_debut: '18:00',
      horaire_fin: '22:00',
      actif: true,
    });
  };

  const updateArretField = (id: string, field: keyof Arret, value: any) => {
    setArrets(arrets.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="border-4 border-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <MapPin size={28} />
          Gestion des Emplacements
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 font-semibold hover:bg-gray-800"
        >
          <Plus size={20} />
          Ajouter un Emplacement
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 border-2 border-gray-300 p-6 mb-6">
          <h4 className="font-bold text-lg mb-4">Nouvel Emplacement</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">Nom *</label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Adresse *</label>
              <input
                type="text"
                required
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Latitude *</label>
              <input
                type="number"
                step="0.00000001"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Longitude *</label>
              <input
                type="number"
                step="0.00000001"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Jour *</label>
              <select
                required
                value={formData.jour}
                onChange={(e) => setFormData({ ...formData, jour: e.target.value })}
                className="w-full border-2 border-black p-2"
              >
                <option value="">Sélectionnez un jour</option>
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Actif</label>
              <input
                type="checkbox"
                checked={formData.actif}
                onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                className="w-6 h-6"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2 font-semibold hover:bg-gray-800 disabled:bg-gray-400"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="bg-gray-300 text-black px-6 py-2 font-semibold hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {arrets.map((arret) => (
          <div key={arret.id} className="border-2 border-black p-4">
            {editingId === arret.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={arret.nom}
                    onChange={(e) => updateArretField(arret.id, 'nom', e.target.value)}
                    className="border-2 border-black p-2"
                    placeholder="Nom"
                  />
                  <input
                    type="text"
                    value={arret.adresse}
                    onChange={(e) => updateArretField(arret.id, 'adresse', e.target.value)}
                    className="border-2 border-black p-2"
                    placeholder="Adresse"
                  />
                  <input
                    type="number"
                    step="0.00000001"
                    value={arret.latitude}
                    onChange={(e) => updateArretField(arret.id, 'latitude', parseFloat(e.target.value))}
                    className="border-2 border-black p-2"
                    placeholder="Latitude"
                  />
                  <input
                    type="number"
                    step="0.00000001"
                    value={arret.longitude}
                    onChange={(e) => updateArretField(arret.id, 'longitude', parseFloat(e.target.value))}
                    className="border-2 border-black p-2"
                    placeholder="Longitude"
                  />
                  <select
                    value={arret.jour}
                    onChange={(e) => updateArretField(arret.id, 'jour', e.target.value)}
                    className="border-2 border-black p-2"
                  >
                    <option value="Lundi">Lundi</option>
                    <option value="Mardi">Mardi</option>
                    <option value="Mercredi">Mercredi</option>
                    <option value="Jeudi">Jeudi</option>
                    <option value="Vendredi">Vendredi</option>
                    <option value="Samedi">Samedi</option>
                    <option value="Dimanche">Dimanche</option>
                  </select>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={arret.actif}
                      onChange={(e) => updateArretField(arret.id, 'actif', e.target.checked)}
                      className="w-6 h-6"
                    />
                    <span className="font-semibold">Actif</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(arret.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700"
                  >
                    <Save size={18} />
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-2 bg-gray-300 text-black px-4 py-2 font-semibold hover:bg-gray-400"
                  >
                    <X size={18} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg">{arret.nom}</h4>
                  <p className="text-gray-600">{arret.adresse}</p>
                  <p className="text-sm text-gray-500">
                    {arret.jour} • GPS: {arret.latitude}, {arret.longitude}
                  </p>
                  <p className={`text-sm font-semibold ${arret.actif ? 'text-green-600' : 'text-red-600'}`}>
                    {arret.actif ? '✓ Actif' : '✗ Inactif'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(arret.id)}
                    className="bg-blue-600 text-white p-2 hover:bg-blue-700"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(arret.id)}
                    className="bg-red-600 text-white p-2 hover:bg-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

