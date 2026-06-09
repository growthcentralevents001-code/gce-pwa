const CACHE_NAME = 'gce-pwa-v2';
const API_CACHE_NAME = 'gce-api-v2';

// URLs to cache on install (static assets)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event – cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(err => console.error('Failed to cache static assets', err))
  );
  self.skipWaiting();
});

// Fetch event – network-first for API, cache-first for static
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // For Supabase API requests – try network, fallback to cache
  if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).then(response => {
        // Clone response and cache it
        const responseClone = response.clone();
        caches.open(API_CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        // Offline: try cache
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // For static assets (HTML, JS, CSS, images) – cache-first
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        // Cache new responses
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    }).catch(() => {
      // If offline and not cached, show a fallback page
      if (event.request.mode === 'navigate') {
        return caches.match('/offline');
      }
      return new Response('Offline – content not available', { status: 503 });
    })
  );
});

// Activate – clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== API_CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});
