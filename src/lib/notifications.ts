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

  if (Notification.permission === 'default') {
    console.log('🔔 Demande de permission (statut: default)...');
    try {
      const permission = await Notification.requestPermission();
      console.log('🔔 Permission accordée:', permission);
      
      if (permission === 'granted') {
        console.log('✅ Permission accordée avec succès');
        return true;
      } else {
        console.log('❌ Permission refusée:', permission);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  if (Notification.permission === 'denied') {
    console.log('❌ Permission refusée par l\'utilisateur');
    console.log('💡 Pour activer les notifications, allez dans les paramètres du navigateur');
    return false;
  }

  console.log('❌ Statut de permission inconnu:', Notification.permission);
  return false;
};

// Envoyer une notification via le Service Worker (pour téléphone verrouillé)
export const envoyerNotificationViaSW = async (titre: string, options?: NotificationOptions) => {
  console.log('🔔 Envoi notification via Service Worker:', titre);
  
  if (!serviceWorkerRegistration) {
    console.log('⚠️ Service Worker non initialisé, tentative d\'initialisation...');
    const initialized = await initialiserServiceWorker();
    if (!initialized) {
      console.log('❌ Impossible d\'initialiser le Service Worker');
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
      console.log('✅ Message envoyé au Service Worker');
      return true;
    } else {
      console.log('⚠️ Service Worker controller non disponible');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur envoi via Service Worker:', error);
    return false;
  }
};

export const envoyerNotification = (titre: string, options?: NotificationOptions) => {
  console.log('🔔 Tentative d\'envoi de notification:', titre);
  console.log('🔔 Permission actuelle:', Notification.permission);
  console.log('🔔 User Agent:', navigator.userAgent);
  
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
      console.log('🔔 Détection mobile:', isMobile);

      if (isMobile) {
        // Options spécifiques pour mobile
        notificationOptions.vibrate = [200, 100, 200, 100, 200];
        notificationOptions.requireInteraction = true;
        notificationOptions.silent = false;
        console.log('🔔 Options mobile appliquées');
      }

      const notification = new Notification(titre, notificationOptions);

      console.log('✅ Notification créée avec succès');
      console.log('🔔 Options utilisées:', notificationOptions);

      // Gestion des événements de notification
      notification.onclick = () => {
        console.log('🔔 Notification cliquée');
        window.focus();
        notification.close();
      };

      notification.onshow = () => {
        console.log('🔔 Notification affichée');
      };

      notification.onerror = (error) => {
        console.error('❌ Erreur de notification:', error);
      };

      // Fermer automatiquement après 15 secondes (plus long pour mobile)
      setTimeout(() => {
        notification.close();
        console.log('🔔 Notification fermée automatiquement');
      }, 15000);

      return notification;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification:', error);
    }
  } else {
    console.warn('⚠️ Permission de notification non accordée:', Notification.permission);
  }
  return null;
};

export const notifierNouvelleCommande = async (clientNom: string, montant: number) => {
  console.log('🛒 Notification nouvelle commande:', clientNom, montant);
  
  const titre = '🛒 Nouvelle Commande !';
  const message = `${clientNom} vient de commander pour ${montant.toFixed(2)}€`;
  
  // Essayer d'abord la notification via Service Worker (pour téléphone verrouillé)
  const swSuccess = await envoyerNotificationViaSW(titre, {
    body: message,
    tag: 'nouvelle-commande',
    requireInteraction: true,
  });
  
  if (swSuccess) {
    console.log('✅ Notification envoyée via Service Worker');
  } else {
    // Fallback : notification native
    const notification = envoyerNotification(titre, {
      body: message,
      tag: 'nouvelle-commande',
      requireInteraction: true,
    });
    
    // Si la notification native échoue aussi, utiliser l'alternative visuelle
    if (!notification) {
      console.log('📱 Utilisation de la notification visuelle alternative');
      afficherNotificationVisuelle(titre, message);
    }
  }
};

export const notifierNouveauContact = async (nom: string, typeEvenement: string) => {
  console.log('📧 Notification nouveau contact:', nom, typeEvenement);
  
  const titre = '📧 Nouvelle Demande de Contact !';
  const message = `${nom} - ${typeEvenement}`;
  
  // Essayer d'abord la notification via Service Worker (pour téléphone verrouillé)
  const swSuccess = await envoyerNotificationViaSW(titre, {
    body: message,
    tag: 'nouveau-contact',
    requireInteraction: true,
  });
  
  if (swSuccess) {
    console.log('✅ Notification envoyée via Service Worker');
  } else {
    // Fallback : notification native
    const notification = envoyerNotification(titre, {
      body: message,
      tag: 'nouveau-contact',
      requireInteraction: true,
    });
    
    // Si la notification native échoue aussi, utiliser l'alternative visuelle
    if (!notification) {
      console.log('📱 Utilisation de la notification visuelle alternative');
      afficherNotificationVisuelle(titre, message);
    }
  }
};

export const jouerSonNotification = () => {
  console.log('🔊 Lecture du son de notification...');
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
    console.log('✅ Son de notification joué');
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du son:', error);
  }
};

// Alternative pour mobile : notification visuelle dans l'interface
export const afficherNotificationVisuelle = (titre: string, message: string) => {
  console.log('📱 Affichage de notification visuelle:', titre, message);
  
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

