interface FooterProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const Footer = ({ currentSection, onSectionChange }: FooterProps) => {
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
              <p>Lundi - Vendredi</p>
              <p>12h00 - 14h00</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Le XV. Tous droits réservés.
            </p>
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
    </footer>
  );
};
