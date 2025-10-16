import { Truck, Clock, MapPin, Star, ChefHat, ShoppingCart, Mail } from 'lucide-react';

interface AccueilProps {
  onSectionChange?: (section: string) => void;
}

export const Accueil = ({ onSectionChange }: AccueilProps) => {
  const photos = [
    '/1000044178 (1).jpg',
    '/1000044205.jpg',
    '/1000044219.jpg',
    '/1000044225 (1).jpg',
    '/1000044227 (1).jpg',
    '/1000044229 (1).jpg',
  ];

  return (
    <div className="bg-white text-black">
      <section className="relative h-screen flex items-center justify-center bg-black text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url(/photoacc.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl md:text-9xl font-bold tracking-wider mb-6">LE XV</h1>
          <p className="text-xl md:text-3xl tracking-wide mb-8">Food Truck Artisanal</p>
          <div className="w-32 h-1 bg-white mx-auto"></div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Notre Histoire</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
              Au Food Truck Le XV, nous parcourons les rues pour vous proposer une expérience culinaire authentique et conviviale. Ici, chaque bouchée est pensée pour ravir vos papilles, avec des recettes simples mais généreuses.
            </p>
            <p className="text-lg leading-relaxed">
              Nous mettons un point d'honneur à préparer des snacks et formules maison, faits à partir d'ingrédients frais et sélectionnés. Que ce soit un cornet d'oignons frits, des frites fraîches, des tenders ou des drumsticks, tout est cuisiné avec soin.
            </p>
            <p className="text-lg leading-relaxed">
              Notre mission ? Vous offrir des saveurs marquées et accessibles, dans une ambiance chaleureuse et décontractée. Chaque plat vous invite à partager un moment gourmand, rapide mais sans compromis sur la qualité.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Pourquoi Nous Choisir</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-white rounded-full">
                <Star size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Qualité Premium</h3>
              <p className="text-gray-300">
                Ingrédients frais sélectionnés avec soin pour vous garantir le meilleur goût
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-white rounded-full">
                <Clock size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Service Rapide</h3>
              <p className="text-gray-300">
                Commandez en ligne et récupérez votre repas en quelques minutes
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-white rounded-full">
                <MapPin size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Proche de Vous</h3>
              <p className="text-gray-300">
                Plusieurs emplacements dans la ville pour vous servir facilement
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Accès Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {/* Card Localisation */}
            <button
              onClick={() => onSectionChange?.('localisation')}
              className="border-4 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer"
            >
              <MapPin size={48} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-2">Localisation</h3>
              <p className="text-sm">Où nous trouver</p>
            </button>

            {/* Card Menu */}
            <button
              onClick={() => onSectionChange?.('menu')}
              className="border-4 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer"
            >
              <ChefHat size={48} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-2">Menu</h3>
              <p className="text-sm">Découvrez nos plats</p>
            </button>

            {/* Card Commander */}
            <button
              onClick={() => onSectionChange?.('commander')}
              className="border-4 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer"
            >
              <ShoppingCart size={48} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-2">Commander</h3>
              <p className="text-sm">Passez commande</p>
            </button>

            {/* Card Contact */}
            <button
              onClick={() => onSectionChange?.('contact')}
              className="border-4 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 group cursor-pointer"
            >
              <Mail size={48} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-2">Contact</h3>
              <p className="text-sm">Événements privés</p>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Galerie Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden group cursor-pointer border-4 border-black"
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <Truck size={64} className="mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Retrouvez-nous</h2>
          <p className="text-xl text-gray-300 mb-8">
            Consultez nos emplacements et commandez dès maintenant pour profiter de nos délicieux plats
          </p>
        </div>
      </section>
    </div>
  );
};
