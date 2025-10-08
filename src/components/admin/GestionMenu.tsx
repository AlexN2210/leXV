import { useState, useEffect } from 'react';
import { ChefHat, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MenuItem {
  id: string;
  category_id: string;
  nom: string;
  description: string;
  prix: number;
  disponible: boolean;
  ordre: number;
}

interface MenuCategory {
  id: string;
  nom: string;
  ordre: number;
}

export const GestionMenu = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    category_id: '',
    nom: '',
    description: '',
    prix: 0,
    disponible: true,
    ordre: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase.from('menu_categories').select('*').order('ordre'),
        supabase.from('menu_items').select('*').order('ordre'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (itemsRes.data) setMenuItems(itemsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('menu_items').insert([formData]);
      if (error) throw error;

      await fetchData();
      setShowAddForm(false);
      resetForm();
      alert('Plat ajouté avec succès !');
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
      const item = menuItems.find(i => i.id === id);
      if (!item) return;

      const { error } = await supabase
        .from('menu_items')
        .update({
          nom: item.nom,
          description: item.description,
          prix: item.prix,
          disponible: item.disponible,
          ordre: item.ordre,
        })
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      alert('Plat modifié avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;

      await fetchData();
      alert('Plat supprimé avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      nom: '',
      description: '',
      prix: 0,
      disponible: true,
      ordre: 0,
    });
  };

  const updateMenuItemField = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(menuItems.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="border-4 border-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <ChefHat size={28} />
          Gestion du Menu
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 font-semibold hover:bg-gray-800"
        >
          <Plus size={20} />
          Ajouter un Plat
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 border-2 border-gray-300 p-6 mb-6">
          <h4 className="font-bold text-lg mb-4">Nouveau Plat</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">Catégorie *</label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border-2 border-black p-2"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-2">Nom du plat *</label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border-2 border-black p-2"
                rows={2}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Ordre d'affichage</label>
              <input
                type="number"
                value={formData.ordre}
                onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={formData.disponible}
                  onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                  className="w-6 h-6"
                />
                <span className="font-semibold">Disponible</span>
              </label>
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

      {/* Liste des plats par catégorie */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryItems = menuItems.filter(item => item.category_id === category.id);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id}>
              <h4 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">
                {category.nom} ({categoryItems.length})
              </h4>
              <div className="space-y-3">
                {categoryItems.map((item) => (
                  <div key={item.id} className="border-2 border-black p-4">
                    {editingId === item.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={item.nom}
                            onChange={(e) => updateMenuItemField(item.id, 'nom', e.target.value)}
                            className="border-2 border-black p-2"
                            placeholder="Nom du plat"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={item.prix}
                            onChange={(e) => updateMenuItemField(item.id, 'prix', parseFloat(e.target.value))}
                            className="border-2 border-black p-2"
                            placeholder="Prix"
                          />
                          <textarea
                            value={item.description || ''}
                            onChange={(e) => updateMenuItemField(item.id, 'description', e.target.value)}
                            className="md:col-span-2 border-2 border-black p-2"
                            placeholder="Description"
                            rows={2}
                          />
                          <input
                            type="number"
                            value={item.ordre}
                            onChange={(e) => updateMenuItemField(item.id, 'ordre', parseInt(e.target.value))}
                            className="border-2 border-black p-2"
                            placeholder="Ordre"
                          />
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.disponible}
                              onChange={(e) => updateMenuItemField(item.id, 'disponible', e.target.checked)}
                              className="w-6 h-6"
                            />
                            <span className="font-semibold">Disponible</span>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(item.id)}
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
                          <h5 className="font-bold text-lg">{item.nom}</h5>
                          {item.description && (
                            <p className="text-gray-600 italic text-sm">{item.description}</p>
                          )}
                          <p className="font-bold text-lg mt-1">{item.prix.toFixed(2)}€</p>
                          <p className={`text-sm font-semibold ${item.disponible ? 'text-green-600' : 'text-red-600'}`}>
                            {item.disponible ? '✓ Disponible' : '✗ Indisponible'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingId(item.id)}
                            className="bg-blue-600 text-white p-2 hover:bg-blue-700"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
        })}
      </div>
    </div>
  );
};

