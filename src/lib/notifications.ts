// Service de gestion des notifications push

export const demanderPermissionNotifications = async (): Promise<boolean> => {
  console.log('🔔 Vérification des permissions de notification...');
  
  if (!('Notification' in window)) {
    console.log('❌ Les notifications ne sont pas supportées par ce navigateur');
    return false;
  }

  console.log('🔔 Permission actuelle:', Notification.permission);

  if (Notification.permission === 'granted') {
    console.log('✅ Permission déjà accordée');
    return true;
  }

  if (Notification.permission !== 'denied') {
    console.log('🔔 Demande de permission...');
    const permission = await Notification.requestPermission();
    console.log('🔔 Permission accordée:', permission);
    return permission === 'granted';
  }

  console.log('❌ Permission refusée ou non disponible');
  return false;
};

export const envoyerNotification = (titre: string, options?: NotificationOptions) => {
  console.log('🔔 Tentative d\'envoi de notification:', titre);
  console.log('🔔 Permission actuelle:', Notification.permission);
  
  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(titre, {
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [200, 100, 200],
        ...options,
      });

      console.log('✅ Notification créée avec succès');

      // Fermer automatiquement après 10 secondes
      setTimeout(() => {
        notification.close();
        console.log('🔔 Notification fermée automatiquement');
      }, 10000);

      return notification;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification:', error);
    }
  } else {
    console.warn('⚠️ Permission de notification non accordée:', Notification.permission);
  }
  return null;
};

export const notifierNouvelleCommande = (clientNom: string, montant: number) => {
  console.log('🛒 Notification nouvelle commande:', clientNom, montant);
  envoyerNotification('🛒 Nouvelle Commande !', {
    body: `${clientNom} vient de commander pour ${montant.toFixed(2)}€`,
    tag: 'nouvelle-commande',
    requireInteraction: true,
  });
};

export const notifierNouveauContact = (nom: string, typeEvenement: string) => {
  console.log('📧 Notification nouveau contact:', nom, typeEvenement);
  envoyerNotification('📧 Nouvelle Demande de Contact !', {
    body: `${nom} - ${typeEvenement}`,
    tag: 'nouveau-contact',
    requireInteraction: true,
  });
};

export const jouerSonNotification = () => {
  // Créer un son simple pour attirer l'attention
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

