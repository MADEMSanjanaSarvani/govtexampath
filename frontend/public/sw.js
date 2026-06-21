const CACHE_VERSION = 'v5';
const CACHE_NAME = 'govtexampath-cache-' + CACHE_VERSION;

const APP_SHELL_FILES = [
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_FILES);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('govtexampath-cache-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: route requests to the appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API calls: network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML pages / navigation: network-first with offline fallback
  event.respondWith(networkFirstWithOfflineFallback(request));
});

function isStaticAsset(pathname) {
  return /\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i.test(pathname);
}

// Cache-first: try cache, fall back to network, and cache the response
function cacheFirst(request) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      return cachedResponse;
    }
    return fetch(request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return networkResponse;
    });
  });
}

// Network-first: try network, fall back to cache
function networkFirst(request) {
  return fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return networkResponse;
    })
    .catch(() => {
      return caches.match(request);
    });
}

// Network-only for HTML pages — never serve stale cached HTML
function networkFirstWithOfflineFallback(request) {
  return fetch(request)
    .then((networkResponse) => {
      return networkResponse;
    })
    .catch(() => {
      return new Response(
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>GovtExamPath - Offline</title><style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb;color:#374151;text-align:center}div{max-width:400px;padding:2rem}h1{font-size:1.5rem}button{margin-top:1rem;padding:0.75rem 2rem;background:#3b82f6;color:white;border:none;border-radius:12px;font-size:1rem;cursor:pointer}</style></head><body><div><h1>You are offline</h1><p>Please check your internet connection and try again.</p><button onclick="location.reload()">Retry</button></div></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    });
}

// Push notification handler — receives push even when site is closed
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'GovtExamPath';
    const options = {
      body: data.body || '',
      icon: data.icon || '/logo192.png',
      badge: data.badge || '/logo192.png',
      data: data.data || {},
      vibrate: [200, 100, 200],
      tag: data.data?.notificationId || 'govtexampath-notification',
      renotify: true,
      requireInteraction: false,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('GovtExamPath', {
        body: text,
        icon: '/logo192.png',
      })
    );
  }
});

// Handle notification click — opens the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
