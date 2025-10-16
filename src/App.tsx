import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Accueil } from './pages/Accueil';
import { Localisation } from './pages/Localisation';
import { Menu } from './pages/Menu';
import { Commander } from './pages/Commander';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

function App() {
  // Déterminer la section initiale
  const getInitialSection = () => {
    // Si lancé depuis la PWA ou hash #admin dans l'URL
    const hash = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(window.location.search);
    
    if (hash === 'admin' || urlParams.get('admin') === 'true') {
      return 'admin';
    }
    return 'accueil';
  };

  const [currentSection, setCurrentSection] = useState(getInitialSection());

  const renderSection = () => {
    switch (currentSection) {
      case 'accueil':
        return <Accueil onSectionChange={setCurrentSection} />;
      case 'localisation':
        return <Localisation />;
      case 'menu':
        return <Menu />;
      case 'commander':
        return <Commander />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return <Admin />;
      default:
        return <Accueil onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header currentSection={currentSection} onSectionChange={setCurrentSection} />
        <main className="pt-20">{renderSection()}</main>
        <Footer currentSection={currentSection} onSectionChange={setCurrentSection} />
        <Analytics />
      </div>
    </AuthProvider>
  );
}

export default App;
