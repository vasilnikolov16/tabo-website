// TÁBO service worker.
// Мрежата е винаги първа (за да излизат новите цени и промени веднага);
// кешът се ползва само когато няма интернет.
const CACHE = 'tabo-v1';
const CORE = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'manifest.webmanifest',
  'assets/icon-192.png',
  'assets/photo-og.jpg',
  'assets/photo-chicken.jpg',
  'assets/photo-fries.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html')))
  );
});
