import { Truck, Clock, MapPin, Star } from 'lucide-react';

export const Accueil = () => {
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
            backgroundImage: 'url(https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=1920)',
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
              Bienvenue au <strong>XV</strong>, votre food truck artisanal qui sillonne les rues pour vous
              offrir une expérience culinaire unique. Nous sommes passionnés par la création de burgers
              authentiques et de snacks savoureux, préparés avec des ingrédients frais et de qualité.
            </p>
            <p className="text-lg leading-relaxed">
              Notre mission est simple : vous faire découvrir des saveurs exceptionnelles dans une
              ambiance conviviale. Chaque plat est préparé avec soin et amour, pour garantir une
              satisfaction à chaque bouchée.
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
