// Service Worker pour les notifications push
// Ce fichier permet de recevoir des notifications même quand l'app est fermée ou le téléphone verrouillé

const CACHE_NAME = 'le-xv-notifications-v1';
const NOTIFICATION_TITLE = 'LE XV Food Truck';

// Écouter les messages du script principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      ...options,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      silent: false,
      renotify: true,
      tag: options.tag || 'default',
    });
  }
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification cliquée:', event.notification.tag);
  
  event.notification.close();
  
  // Ouvrir l'application ou la ramener au premier plan
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si l'app est déjà ouverte, la ramener au premier plan
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Gérer les notifications push (pour l'avenir)
self.addEventListener('push', (event) => {
  console.log('📱 Push reçu:', event);
  
  if (event.data) {
    const data = event.data.json();
    const title = data.title || NOTIFICATION_TITLE;
    const options = {
      body: data.body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      silent: false,
      renotify: true,
      tag: data.tag || 'push',
      data: data.data,
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

// Gérer les erreurs
self.addEventListener('error', (event) => {
  console.error('❌ Erreur Service Worker:', event.error);
});

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installé');
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activé');
  event.waitUntil(self.clients.claim());
});
