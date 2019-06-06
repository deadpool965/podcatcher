/* eslint-disable no-restricted-globals */

// Server will fill the next 2 lines. Do not change it.
const buildFiles = [];
const CACHE_NAME = 'CACHE_NAME';

const urlsToCache = [
  '/',
  'https://fonts.googleapis.com/css?family=Bungee&font-display=swap',
  'https://fonts.gstatic.com/s/bungee/v4/N0bU2SZBIuF2PU_0DXR1.woff2',
  'https://unpkg.com/ionicons@4.5.5/dist/css/ionicons.min.css',
  'https://unpkg.com/ionicons@4.5.5/dist/fonts/ionicons.woff2?v=4.5.4',
  'https://unpkg.com/ionicons@4.5.5/dist/fonts/ionicons.woff2',
  ...buildFiles,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache)),
  );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Loop through old cache names
    // and delete them
    caches
      .keys()
      .then(cacheNames => Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return undefined;
        }),
      )),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // cache hit
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then((res) => {
            if (!res || res.status !== 200 || res.type !== 'basic') {
              return res;
            }

            const url = new URL(res.clone().url);
            if (/\.(jpg|jpeg|png)$/.test(url.pathname)) {
              const responseToClone = res.clone();
              caches
                .open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToClone));
            }

            return res;
          });
      }),
  );
});
