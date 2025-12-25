
const CACHE_NAME = 'studyflow-v2.5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 讓所有的編譯器請求與 API 請求直接通過，不進入快取，避免空白頁
  if (
    event.request.url.includes('esm.sh') || 
    event.request.url.includes('googleapis') ||
    event.request.url.endsWith('.tsx') ||
    event.request.url.endsWith('.ts')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
