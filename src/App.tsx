import { useState } from 'react';
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
  const [currentSection, setCurrentSection] = useState('accueil');

  const renderSection = () => {
    switch (currentSection) {
      case 'accueil':
        return <Accueil />;
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
        return <Accueil />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header currentSection={currentSection} onSectionChange={setCurrentSection} />
        <main className="pt-20">{renderSection()}</main>
        <Footer currentSection={currentSection} onSectionChange={setCurrentSection} />
      </div>
    </AuthProvider>
  );
}

export default App;
