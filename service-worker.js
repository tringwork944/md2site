const CACHE_VERSION = 'md2site-v1';
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const CONTENT_CACHE = `${CACHE_VERSION}-content`;
const HOME_SECTIONS = ['01', '02', '03', '04'];
const APP_SHELL = [
  './',
  './index.html',
  './404.html',
  './pages/',
  './pages/index.html',
  './pages/index.md',
  './assets/js/content-runtime.js?v=3',
  './assets/js/client-cache.js?v=1',
  './assets/js/theme-init.js?v=5',
  './assets/js/page-router.js?v=70',
  './assets/js/site-shell.js?v=20',
  './assets/js/app.js?v=37',
  './assets/css/main.css?v=80',
  './assets/css/site-shell.css?v=7',
  './assets/templates/pages/page-basic-01/style.css?v=2',
  './assets/templates/pages/page-basic-01/index.js?v=5',
  './assets/templates/body/runtime.js?v=1',
  './assets/templates/body/body-basic-01/style.css?v=15',
  './assets/templates/body/body-basic-01/index.js?v=1',
  './assets/templates/sections/runtime.js?v=4',
  './assets/templates/header/header-basic-01/index.js?v=1',
  './assets/templates/footer/footer-basic-01/index.js?v=3',
  './assets/content/languages/index.md',
  './assets/content/vi/common.md',
  './assets/content/vi/seo.md',
  './pages/content/vi/home.md',
  ...HOME_SECTIONS.flatMap((number) => [
    `./assets/templates/sections/div-basic-${number}/style.css?v=26`,
    `./assets/templates/sections/div-basic-${number}/index.js?v=10`
  ])
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ASSET_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const activeCaches = new Set([PAGE_CACHE, ASSET_CACHE, CONTENT_CACHE]);
    await Promise.all((await caches.keys())
      .filter((name) => name.startsWith('md2site-') && !activeCaches.has(name))
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

function pageCacheKey(request) {
  const url = new URL(request.url);
  url.search = '';
  url.hash = '';
  if (url.pathname.endsWith('/pages/index.html')) url.pathname = url.pathname.replace(/index\.html$/, '');
  return url.href;
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);
  const key = pageCacheKey(request);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(key, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(key)
      || await caches.match(new URL('./pages/', self.registration.scope).href)
      || await caches.match(new URL('./404.html', self.registration.scope).href);
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName, event) {
  const cache = await caches.open(cacheName);
  if (request.cache === 'reload' || request.cache === 'no-store') {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
    return response;
  }
  const cached = await cache.match(request);
  const update = fetch(request).then(async (response) => {
    if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
    return response;
  });

  if (cached) {
    event.waitUntil(update.catch(() => undefined));
    return cached;
  }
  return update;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (/\.md$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, CONTENT_CACHE, event));
    return;
  }

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE, event));
  }
});
