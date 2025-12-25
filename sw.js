
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
  const url = new URL(event.request.url);
  
  // 排除開發所需的外部資源與原始碼檔案，讓它們走網絡以供編譯器 (esm.sh/run) 處理
  if (
    url.hostname.includes('esm.sh') || 
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.ts')
  ) {
    return; // 不調用 respondWith，讓請求直接發送到網絡
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // 如果網絡失敗且無快取，則回傳 null
        return null;
      });
    })
  );
});
