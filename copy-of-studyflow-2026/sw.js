
const CACHE_NAME = 'studyflow-v2.1';
const ASSETS = [
  'index.html',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'manifest.json',
  'services/constants.tsx',
  'services/geminiService.ts',
  'components/PlanForm.tsx',
  'components/PlanCard.tsx',
  'components/PlanDetail.tsx',
  'components/StatsView.tsx',
  'components/ProjectView.tsx',
  'components/PomodoroTimer.tsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 確保即使某些資源失敗，主要外殼也能安裝
      return Promise.allSettled(
        ASSETS.map(asset => cache.add(asset))
      );
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
});

self.addEventListener('fetch', (event) => {
  // 忽略 AI API 請求
  if (event.request.url.includes('generativelanguage.googleapis.com')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      
      return fetch(event.request).then((fetchRes) => {
        // 只快取有效的 GET 請求
        if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== 'basic' && !event.request.url.includes('esm.sh')) {
          return fetchRes;
        }

        const responseToCache = fetchRes.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return fetchRes;
      });
    })
  );
});
