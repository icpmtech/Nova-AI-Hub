
const CACHE_NAME = 'nova-ai-hub-cache-v1';
const FILES_TO_CACHE = [
  '/dashboard.html',
  '/manifest.json',
  '/service-worker.js',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  if (evt.request.mode !== 'navigate') return;
  evt.respondWith(
    fetch(evt.request).catch(() => caches.match('/responsive-dashboard.html'))
  );
});
