
const CACHE_NAME = 'studyflow-v2.6';
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
  // 排除第三方庫與 API 請求，確保開發中版本即時更新
  if (
    event.request.url.includes('esm.sh') || 
    event.request.url.includes('googleapis') ||
    event.request.url.includes('googleSearch') ||
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
