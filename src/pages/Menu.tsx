import { useEffect, useState } from 'react';
import { ChefHat } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MenuItem {
  id: string;
  nom: string;
  description: string;
  prix: number;
  image_url: string | null;
  disponible: boolean;
  ordre: number;
}

interface MenuCategory {
  id: string;
  nom: string;
  ordre: number;
  items: MenuItem[];
}

export const Menu = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .order('ordre');

      if (categoriesError) throw categoriesError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('disponible', true)
        .order('ordre');

      if (itemsError) throw itemsError;

      const categoriesWithItems = (categoriesData || []).map((category) => ({
        ...category,
        items: (itemsData || []).filter((item) => item.category_id === category.id),
      }));

      setCategories(categoriesWithItems);
      if (categoriesWithItems.length > 0) {
        setSelectedCategory(categoriesWithItems[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du menu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-black">Chargement du menu...</div>
      </div>
    );
  }

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="bg-white text-black py-20 px-4 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <ChefHat size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Notre Menu</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de burgers artisanaux, snacks savoureux et boissons
            rafraîchissantes, préparés avec des ingrédients frais de qualité.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 border-2 ${
                selectedCategory === category.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              {category.nom}
            </button>
          ))}
        </div>

        {selectedCategoryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedCategoryData.items.map((item) => (
              <div
                key={item.id}
                className="bg-white border-4 border-black overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
              >
                {item.image_url && (
                  <div className="aspect-video overflow-hidden bg-gray-200">
                    <img
                      src={item.image_url}
                      alt={item.nom}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold">{item.nom}</h3>
                    <span className="text-2xl font-bold whitespace-nowrap ml-4">
                      {item.prix.toFixed(2)}€
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCategoryData && selectedCategoryData.items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Aucun plat disponible dans cette catégorie.</p>
          </div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-20">
            <ChefHat size={64} className="mx-auto mb-6 text-gray-400" />
            <p className="text-xl text-gray-600">
              Le menu est en cours de préparation. Revenez bientôt !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
