import { useState } from 'react';

interface FooterProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const Footer = ({ currentSection, onSectionChange }: FooterProps) => {
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);
  return (
    <footer className="bg-black text-white border-t border-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">LE XV</h3>
            <p className="text-gray-300 text-sm">
              Food truck artisanal proposant des burgers et snacks de qualité
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Téléphone: 06 85 84 30 20</p>
              <p>Email: stevelexv@gmail.com</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Horaires</h4>
            <div className="text-gray-300 text-sm space-y-1">
              <p>Mardi - Vendredi</p>
              <p>18h00 - 22h00</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Le XV. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowMentionsLegales(!showMentionsLegales)}
                className="text-sm uppercase tracking-wide transition-all duration-300 hover:text-gray-300"
              >
                Mentions légales
              </button>
              <button
                onClick={() => onSectionChange('admin')}
                className={`text-sm uppercase tracking-wide transition-all duration-300 hover:text-gray-300 ${
                  currentSection === 'admin' ? 'border-b-2 border-white pb-1' : ''
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Section des mentions légales */}
        {showMentionsLegales && (
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-6 text-center">Mentions Légales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Informations sur LE XV */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-yellow-400">STEVE LE XV</h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p><strong>Dénomination :</strong> STEVE LE XV</p>
                    <p><strong>Adresse :</strong> 23 AVENUE DE LA GARE, 34560 POUSSAN</p>
                    <p><strong>SIRET :</strong> 99020744100017</p>
                    <p><strong>Activité :</strong> 56.10C - Restauration de type rapide</p>
                    <p><strong>Propriétaire :</strong> M. STEVE NOMINE</p>
                    <p><strong>Statut :</strong> Entrepreneur individuel</p>
                    <p><strong>État :</strong> Actif</p>
                  </div>
                </div>

                {/* Informations sur le développeur */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-yellow-400">Conception du site</h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p><strong>Développeur :</strong> Alexis NOMINE</p>
                    <p><strong>Entreprise :</strong> LAAL</p>
                    <p><strong>Adresse :</strong> 41 RUE JEAN POUYAT, 87100 LIMOGES</p>
                    <p><strong>SIRET :</strong> 87801064400010</p>
                    <p><strong>Activité :</strong> 47.91A - Vente à distance sur catalogue général</p>
                    <p><strong>Site web :</strong> <a href="https://www.alexisdevfullstack.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">www.alexisdevfullstack.com</a></p>
                    <p><strong>Statut :</strong> Entrepreneur individuel (PME)</p>
                    <p><strong>État :</strong> Actif</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-lg font-semibold mb-4 text-yellow-400">Hébergement et Données</h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p><strong>Hébergement :</strong> Vercel Inc.</p>
                  <p><strong>Base de données :</strong> Supabase (PostgreSQL)</p>
                  <p><strong>Protection des données :</strong> Conformément au RGPD</p>
                  <p><strong>Cookies :</strong> Ce site utilise des cookies techniques nécessaires au fonctionnement</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <p className="text-xs text-gray-400">
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};
