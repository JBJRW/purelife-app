// ================================================================
// PureLife — Service Worker (sw.js)
// Web Push Notifications + Offline cache
// JRMB Food Network LLC · 2026
// ================================================================

const CACHE = 'purelife-v2';
const STATIC = ['/', '/purelife-logo.png', '/dr-smoothie-avatar.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── PUSH NOTIFICATIONS ──────────────────────────────────────────
self.addEventListener('push', e => {
  let data = { title: 'PureLife', body: '¡Hora de tu smoothie! 🥤', icon: '/purelife-logo.png', badge: '/purelife-logo.png' };
  try { data = { ...data, ...e.data.json() }; } catch {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/purelife-logo.png',
      badge: data.badge || '/purelife-logo.png',
      tag: data.tag || 'purelife-reminder',
      data: { url: data.url || '/', reminderId: data.reminderId },
      actions: [
        { action: 'open', title: '🥤 Abrir PureLife' },
        { action: 'dismiss', title: 'Posponer 1h' },
      ],
      requireInteraction: false,
      vibrate: [200, 100, 200],
    })
  );
});

// ── NOTIFICATION CLICK ──────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const existing = cls.find(c => c.url.includes(self.location.origin));
      if (existing) { existing.focus(); existing.navigate(url); }
      else clients.openWindow(url);
    })
  );
});

// ── FETCH (network-first: siempre intenta red primero, cache solo si offline) ──
// CRÍTICO: estrategia cache-first anterior servía el bundle JS viejo para
// siempre porque el nombre del CACHE no cambiaba entre deploys, y el
// 'activate' que purga cachés viejos nunca se disparaba. Esto bloqueaba
// que cualquier cambio de código se reflejara en navegadores que ya
// habían cacheado la app una vez.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return; // No cachear APIs

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, resClone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('/')))
  );
});
