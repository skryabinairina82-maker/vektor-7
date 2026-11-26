// Офлайн-кэш: после первого открытия тренажёр работает без интернета.
const CACHE = 'v7-510a4f07';
const FILES = ["./","index.html","original.html","homework.html","classroom.html","teacher.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('v7-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// сначала из кэша (быстро и без интернета), в фоне обновляем
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => {
    const net = fetch(e.request).then((r) => { if (r.ok) caches.open(CACHE).then((c) => c.put(e.request, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
