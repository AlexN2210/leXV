import { useState } from 'react';
import { ChefHat } from 'lucide-react';

interface MenuItem {
  nom: string;
  description?: string;
  prix: string;
}

interface MenuCategory {
  nom: string;
  items: MenuItem[];
}

export const Menu = () => {
  const menuData: MenuCategory[] = [
    {
      nom: 'Snacks',
      items: [
        { nom: 'Cornet d\'oignons frits', description: 'Maison', prix: '3€' },
        { nom: 'Galette de pomme de terre', description: 'Pièce', prix: '3€' },
        { nom: 'Beignet d\'aubergine', description: 'Pièce', prix: '3€' },
        { nom: 'Frites fraîches', prix: '3€' },
      ],
    },
    {
      nom: 'Formules',
      items: [
        { nom: '4 Tenders "Maison" + Frites + Boisson', prix: '12€' },
        { nom: '2 Hauts de cuisse frits "Mariné maison" + Frites + Boisson', prix: '12€' },
        { nom: '6 Chicken drumsticks + Frites + Boisson', prix: '12€' },
        { nom: 'Boîte Mix', description: '4 Tenders + 2 Hauts de cuisse + 6 Chicken drumsticks', prix: '20€' },
        { nom: 'Supplément viande', prix: '4€' },
      ],
    },
    {
      nom: 'Menu Kids',
      items: [
        { nom: 'La boîte à LILY', description: '2 Tenders + Frites + POM\'POTE + Capri-Sun + Cadeau surprise', prix: '8€' },
      ],
    },
    {
      nom: 'Dessert',
      items: [
        { nom: 'Beignet long pomme ou chocolat', prix: '3€' },
      ],
    },
    {
      nom: 'Boissons',
      items: [
        { nom: 'Canette de soda 33cl', prix: '2€' },
        { nom: 'Bouteille d\'eau 50cl', description: 'Plate ou gazeuse', prix: '1,50€' },
      ],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>(menuData[0].nom);

  const selectedCategoryData = menuData.find((cat) => cat.nom === selectedCategory);

  return (
    <div className="bg-white text-black py-20 px-4 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <ChefHat size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Notre Menu</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de snacks savoureux, formules gourmandes et boissons
            rafraîchissantes, préparés avec des ingrédients frais de qualité.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {menuData.map((category) => (
            <button
              key={category.nom}
              onClick={() => setSelectedCategory(category.nom)}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 border-2 ${
                selectedCategory === category.nom
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              {category.nom}
            </button>
          ))}
        </div>

        {selectedCategoryData && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {selectedCategoryData.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-4 border-black overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold flex-1">{item.nom}</h3>
                      <span className="text-2xl font-bold whitespace-nowrap ml-4">
                        {item.prix}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 leading-relaxed italic">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedCategory === 'Formules' && (
              <div className="text-center bg-black text-white p-8 border-4 border-black">
                <p className="text-xl font-semibold">🍟 Nombreuses sauces aux choix 🍟</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
