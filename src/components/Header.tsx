import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const Header = ({ currentSection, onSectionChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'localisation', label: 'Localisation' },
    { id: 'menu', label: 'Menu' },
    { id: 'commander', label: 'Commander' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div
            className="text-3xl font-bold tracking-wider cursor-pointer"
            onClick={() => handleSectionClick('accueil')}
          >
            LE XV
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`text-sm uppercase tracking-wide transition-all duration-300 hover:text-gray-300 ${
                  currentSection === section.id ? 'border-b-2 border-white pb-1' : ''
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`text-left text-lg uppercase tracking-wide py-2 transition-colors hover:text-gray-300 ${
                  currentSection === section.id ? 'text-white font-bold' : 'text-gray-400'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
