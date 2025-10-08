import { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

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

export const Localisation = () => {
  const [arrets, setArrets] = useState<Arret[]>([]);
  const [loading] = useState(false);

  useEffect(() => {
    // Données statiques des arrêts
    const arretsStatiques: Arret[] = [
      {
        id: '1',
        nom: 'Place du marché aux raisins',
        adresse: 'Villeveynac',
        latitude: 43.50103759765625,
        longitude: 3.602396249771118,
        jour: 'Mardi et Jeudi',
        horaire_debut: '18h00',
        horaire_fin: '22h00',
        actif: true,
      },
      {
        id: '2',
        nom: 'Complexe sportif des Baux',
        adresse: 'Poussan',
        latitude: 43.4827231,
        longitude: 3.6569117,
        jour: 'Mercredi et Vendredi',
        horaire_debut: '18h00',
        horaire_fin: '22h00',
        actif: true,
      },
    ];
    
    setArrets(arretsStatiques);
  }, []);

  const getWazeUrl = (latitude: number, longitude: number) => {
    return `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  };

  const getGoogleMapsUrl = (latitude: number, longitude: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };

  const jourOrdre: { [key: string]: number } = {
    'Lundi': 1,
    'Mardi': 2,
    'Mercredi': 3,
    'Jeudi': 4,
    'Vendredi': 5,
    'Samedi': 6,
    'Dimanche': 7,
  };

  const arretsTries = [...arrets].sort((a, b) => {
    return (jourOrdre[a.jour] || 0) - (jourOrdre[b.jour] || 0);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-black">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black py-20 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-8">
          Où Nous Trouver
        </h1>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Découvrez nos différents emplacements et planifiez votre visite. Utilisez les liens de
          navigation pour vous guider directement jusqu'à nous.
        </p>

        <div className="mb-16 aspect-video w-full bg-gray-200 border-4 border-black rounded-lg overflow-hidden">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=3.55%2C43.45%2C3.70%2C43.55&layer=mapnik"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Carte des emplacements"
          ></iframe>
        </div>
        
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            📍 <strong>Emplacement 1 :</strong> Place du marché aux raisins, Villeveynac (Mardi et Jeudi)
          </p>
          <p className="text-lg text-gray-600">
            📍 <strong>Emplacement 2 :</strong> Complexe sportif des Baux, Poussan (Mercredi et Vendredi)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {arretsTries.map((arret) => (
            <div
              key={arret.id}
              className="bg-black text-white p-6 border-4 border-black hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-start mb-4">
                <MapPin size={28} className="mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">{arret.nom}</h3>
                  <p className="text-gray-300 text-sm">{arret.adresse}</p>
                </div>
              </div>

              <div className="flex items-center mb-6 text-gray-300">
                <Clock size={20} className="mr-2" />
                <div>
                  <p className="font-semibold">{arret.jour}</p>
                  <p className="text-sm">
                    {arret.horaire_debut} - {arret.horaire_fin}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={getWazeUrl(arret.latitude, arret.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white text-black px-4 py-3 text-center font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  Waze
                </a>
                <a
                  href={getGoogleMapsUrl(arret.latitude, arret.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white text-black px-4 py-3 text-center font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  Maps
                </a>
              </div>
            </div>
          ))}
        </div>

        {arrets.length === 0 && (
          <div className="text-center py-20">
            <MapPin size={64} className="mx-auto mb-6 text-gray-400" />
            <p className="text-xl text-gray-600">
              Aucun emplacement disponible pour le moment. Revenez bientôt !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};