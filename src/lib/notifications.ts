// Service de gestion des notifications push

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

// Initialiser le Service Worker
export const initialiserServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    console.log('❌ Service Worker non supporté');
    return false;
  }

  try {
    console.log('🔧 Enregistrement du Service Worker...');
    const registration = await navigator.serviceWorker.register('/sw-notifications.js', {
      scope: '/'
    });
    
    serviceWorkerRegistration = registration;
    console.log('✅ Service Worker enregistré:', registration);
    
    // Attendre que le Service Worker soit prêt
    await navigator.serviceWorker.ready;
    console.log('✅ Service Worker prêt');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur Service Worker:', error);
    return false;
  }
};

export const demanderPermissionNotifications = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      return false;
    }
  }

  return false;
};

// Envoyer une notification via le Service Worker (pour téléphone verrouillé)
export const envoyerNotificationViaSW = async (titre: string, options?: NotificationOptions) => {
  if (!serviceWorkerRegistration) {
    const initialized = await initialiserServiceWorker();
    if (!initialized) {
      return false;
    }
  }

  try {
    // Envoyer un message au Service Worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: titre,
        options: {
          body: options?.body || '',
          tag: options?.tag || 'default',
          data: options?.data || {},
          ...options,
        }
      });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const envoyerNotification = (titre: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    try {
      // Options optimisées pour mobile
      const notificationOptions: NotificationOptions = {
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        silent: false,
        renotify: true,
        ...options,
      };

      // Détecter si on est sur mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // Options spécifiques pour mobile
        notificationOptions.vibrate = [200, 100, 200, 100, 200];
        notificationOptions.requireInteraction = true;
        notificationOptions.silent = false;
      }

      const notification = new Notification(titre, notificationOptions);

      // Gestion des événements de notification
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Fermer automatiquement après 15 secondes
      setTimeout(() => {
        notification.close();
      }, 15000);

      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  }
  return null;
};

export const notifierNouvelleCommande = async (clientNom: string, montant: number) => {
  const titre = '🛒 Nouvelle Commande !';
  const message = `${clientNom} vient de commander pour ${montant.toFixed(2)}€`;
  
  // Essayer d'abord la notification via Service Worker (pour téléphone verrouillé)
  const swSuccess = await envoyerNotificationViaSW(titre, {
    body: message,
    tag: 'nouvelle-commande',
    requireInteraction: true,
  });
  
  if (!swSuccess) {
    // Fallback : notification native
    const notification = envoyerNotification(titre, {
      body: message,
      tag: 'nouvelle-commande',
      requireInteraction: true,
    });
    
    // Si la notification native échoue aussi, utiliser l'alternative visuelle
    if (!notification) {
      afficherNotificationVisuelle(titre, message);
    }
  }
};

export const notifierNouveauContact = async (nom: string, typeEvenement: string) => {
  const titre = '📧 Nouvelle Demande de Contact !';
  const message = `${nom} - ${typeEvenement}`;
  
  // Essayer d'abord la notification via Service Worker (pour téléphone verrouillé)
  const swSuccess = await envoyerNotificationViaSW(titre, {
    body: message,
    tag: 'nouveau-contact',
    requireInteraction: true,
  });
  
  if (!swSuccess) {
    // Fallback : notification native
    const notification = envoyerNotification(titre, {
      body: message,
      tag: 'nouveau-contact',
      requireInteraction: true,
    });
    
    // Si la notification native échoue aussi, utiliser l'alternative visuelle
    if (!notification) {
      afficherNotificationVisuelle(titre, message);
    }
  }
};

export const jouerSonNotification = () => {
  try {
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
  } catch (error) {
    // Son optionnel, pas d'erreur critique
  }
};

// Alternative pour mobile : notification visuelle dans l'interface
export const afficherNotificationVisuelle = (titre: string, message: string) => {
  
  // Créer un élément de notification visuelle
  const notificationElement = document.createElement('div');
  notificationElement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 300px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notificationElement.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">${titre}</div>
    <div>${message}</div>
  `;
  
  // Ajouter l'animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notificationElement);
  
  // Supprimer après 5 secondes
  setTimeout(() => {
    notificationElement.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      if (notificationElement.parentNode) {
        notificationElement.parentNode.removeChild(notificationElement);
      }
    }, 300);
  }, 5000);
  
  return notificationElement;
};

