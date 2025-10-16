import { useState } from 'react';

interface FooterProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const Footer = ({ currentSection, onSectionChange }: FooterProps) => {
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);
  const [activeSection, setActiveSection] = useState<'mentions' | 'cgv' | 'confidentialite'>('mentions');
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
              <h3 className="text-xl font-bold mb-6 text-center">Informations Légales</h3>
              
              {/* Navigation entre les sections */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                  onClick={() => setActiveSection('mentions')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 ${
                    activeSection === 'mentions'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Mentions Légales
                </button>
                <button
                  onClick={() => setActiveSection('cgv')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 ${
                    activeSection === 'cgv'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  CGV
                </button>
                <button
                  onClick={() => setActiveSection('confidentialite')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 ${
                    activeSection === 'confidentialite'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Confidentialité
                </button>
              </div>

              {/* Section Mentions Légales */}
              {activeSection === 'mentions' && (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">STEVE LE XV - Food Truck</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p><strong>Dénomination :</strong> STEVE LE XV</p>
                      <p><strong>Forme juridique :</strong> Entrepreneur individuel</p>
                      <p><strong>Adresse du siège :</strong> 23 AVENUE DE LA GARE, 34560 POUSSAN</p>
                      <p><strong>SIRET :</strong> 99020744100017</p>
                      <p><strong>Code APE :</strong> 56.10C - Restauration de type rapide</p>
                      <p><strong>Propriétaire :</strong> M. STEVE NOMINE</p>
                      <p><strong>Responsable de publication :</strong> M. STEVE NOMINE</p>
                      <p><strong>État :</strong> Actif</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">Hébergement du site</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                      <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                      <p><strong>Base de données :</strong> Supabase (PostgreSQL)</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">Conception et développement</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p><strong>Développeur :</strong> Alexis NOMINE</p>
                      <p><strong>Entreprise :</strong> LAAL</p>
                      <p><strong>Adresse :</strong> 41 RUE JEAN POUYAT, 87100 LIMOGES</p>
                      <p><strong>SIRET :</strong> 87801064400010</p>
                      <p><strong>Site web :</strong> <a href="https://www.alexisdevfullstack.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">www.alexisdevfullstack.com</a></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section CGV */}
              {activeSection === 'cgv' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">1. Produits et Services</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>STEVE LE XV propose des produits de restauration rapide :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Burgers artisanaux</li>
                        <li>Snacks et accompagnements</li>
                        <li>Boissons</li>
                        <li>Produits frais préparés sur place</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">2. Commandes et Paiement</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p><strong>Commandes :</strong> Les commandes peuvent être passées via le site web ou directement sur place.</p>
                      <p><strong>Paiement :</strong> Espèces, carte bancaire, paiement mobile acceptés.</p>
                      <p><strong>Prix :</strong> Tous les prix sont indiqués en euros TTC et peuvent être modifiés sans préavis.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">3. Livraison et Retrait</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p><strong>Retrait sur place :</strong> Les commandes sont à retirer aux emplacements indiqués selon les horaires d'ouverture.</p>
                      <p><strong>Horaires :</strong> Mardi et Jeudi (18h-22h) - Place du marché aux raisins, Villeveynac</p>
                      <p><strong>Mercredi et Vendredi (18h-22h) - Complexe sportif des Baux, Poussan</strong></p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">4. Droit de Rétractation</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>Conformément à l'article L. 221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats de fourniture de biens alimentaires destinés à être livrés rapidement.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">5. Responsabilité</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>STEVE LE XV s'engage à fournir des produits de qualité. En cas de problème, contactez-nous au 06 85 84 30 20 ou par email à stevelexv@gmail.com</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Confidentialité */}
              {activeSection === 'confidentialite' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">1. Collecte des Données</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>Nous collectons les données suivantes :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Nom et prénom (pour les commandes)</li>
                        <li>Adresse email (pour les confirmations)</li>
                        <li>Numéro de téléphone (pour les livraisons)</li>
                        <li>Données de localisation (pour les emplacements)</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">2. Finalité du Traitement</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>Vos données sont utilisées pour :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Traiter vos commandes</li>
                        <li>Vous contacter concernant vos commandes</li>
                        <li>Améliorer nos services</li>
                        <li>Respecter nos obligations légales</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">3. Vos Droits</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Droit d'accès à vos données</li>
                        <li>Droit de rectification</li>
                        <li>Droit d'effacement</li>
                        <li>Droit à la portabilité</li>
                        <li>Droit d'opposition</li>
                      </ul>
                      <p>Pour exercer ces droits, contactez-nous à : stevelexv@gmail.com</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">4. Cookies</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>Ce site utilise des cookies techniques nécessaires au fonctionnement :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Cookies de session pour la navigation</li>
                        <li>Cookies de préférences utilisateur</li>
                        <li>Cookies de sécurité</li>
                      </ul>
                      <p>Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-yellow-400">5. Contact</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>Pour toute question concernant vos données personnelles :</p>
                      <p><strong>Email :</strong> stevelexv@gmail.com</p>
                      <p><strong>Téléphone :</strong> 06 85 84 30 20</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-700 text-center">
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
