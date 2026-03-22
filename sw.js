// MedNote Service Worker — Push Notifications
const CACHE_NAME = 'mednote-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Listen for messages from the main thread to show notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: icon || '/pill-icon.png',
      badge: '/pill-icon.png',
      vibrate: [200, 100, 200],
      tag: 'mednote-reminder',
      requireInteraction: true,
      actions: [
        { action: 'taken', title: '✅ Taken' },
        { action: 'snooze', title: '⏰ Snooze 10min' },
      ],
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'snooze') {
    // Snooze for 10 minutes
    setTimeout(() => {
      self.registration.showNotification(event.notification.title, {
        body: event.notification.body + ' (Snoozed reminder)',
        vibrate: [200, 100, 200],
        tag: 'mednote-reminder-snooze',
        requireInteraction: true,
      });
    }, 10 * 60 * 1000);
  }
  // Focus or open the app
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
