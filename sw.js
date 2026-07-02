// Equiprovet Service Worker — offline + cache strategie
const CACHE = 'equiprovet-v8';
const STATIC = [
  '/', '/producten', '/wetenschap', '/over-ons', '/nieuws', '/contact',
  '/de/', '/de/produkte', '/de/wissenschaft', '/de/ueber-uns', '/de/neuigkeiten', '/de/kontakt',
  '/css/styles.css', '/js/main.js',
  '/images/logo.png', '/images/hero-horse-leg-v2.webp', '/images/alpha2eq-centrifuge.webp',
  '/images/ha-injection.webp', '/images/noltrex-joint.webp', '/images/bisphosphonate-horse.webp',
];

// Install: cache static assets
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

// Activate: verwijder oude caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Fetch: Cache First voor statische assets, Network First voor HTML
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  if (url.pathname.match(/\.css$/)) {
    // Network first voor CSS — altijd vers bij updates
    e.respondWith(fetch(e.request).then(res => {
      caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => caches.match(e.request)));
  } else if (url.pathname.match(/\.(js|jpg|webp|png|svg|woff2)$/)) {
    // Cache first — statische assets die zelden wijzigen
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    })));
  } else {
    // Network first — HTML pagina's
    e.respondWith(fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request)));
  }
});
