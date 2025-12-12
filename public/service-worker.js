const CACHE_NAME = 'movie-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // TMDB API: network-first, fallback to cache
  if (url.hostname.includes('api.themoviedb.org')) {
    event.respondWith(
      fetch(req).then(res => {
        caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Static assets / HTML: cache-first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => {
      // offline fallback for HTML pages
      if (req.headers.get('accept')?.includes('text/html')) {
        return caches.match('/index.html');
      }
    }))
  );
});
