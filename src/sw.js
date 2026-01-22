import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

// Precaching code provided by Workbox
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()
clientsClaim()

// Push Notification Handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? { title: '새 알림', body: '내용이 없습니다.' };
  
  const options = {
    body: data.body,
    icon: data.icon || '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: {
      url: data.url || '/' // URL to open on click
    },
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'open',
        title: '보기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
