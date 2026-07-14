const CACHE_NAME = 'purelive-v1.0';
const CORE_FILES = [
  './dr-smoothie-ai-v2.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Network first for API calls, cache first for assets
  if (event.request.url.includes('anthropic.com') || 
      event.request.url.includes('youtube.com') ||
      event.request.url.includes('googleapis.com')) {
    event.respondWith(fetch(event.request).catch(() => new Response('Offline', {status: 503})));
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return resp;
        }))
        .catch(() => caches.match('./dr-smoothie-ai-v2.html'))
    );
  }
});
