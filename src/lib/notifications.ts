// Service de gestion des notifications push

export const demanderPermissionNotifications = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Les notifications ne sont pas supportées par ce navigateur');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const envoyerNotification = (titre: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(titre, {
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [200, 100, 200],
        ...options,
      });

      // Fermer automatiquement après 10 secondes
      setTimeout(() => notification.close(), 10000);

      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  }
  return null;
};

export const notifierNouvelleCommande = (clientNom: string, montant: number) => {
  envoyerNotification('🛒 Nouvelle Commande !', {
    body: `${clientNom} vient de commander pour ${montant.toFixed(2)}€`,
    tag: 'nouvelle-commande',
    requireInteraction: true,
  });
};

export const notifierNouveauContact = (nom: string, typeEvenement: string) => {
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

