/**
 * MasterDocs Offline Service Worker (v1)
 * Enables complete offline reading & interaction across all 21 Frontend tracks.
 */

const SHELL_CACHE = 'masterdocs-shell-v1';
const RUNTIME_CACHE = 'masterdocs-runtime-v1';

const CORE_SHELL_ASSETS = [
  '/',
  '/docs',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
  '/manifest.webmanifest',
];

// Install: Pre-cache essential app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(CORE_SHELL_ASSETS).catch((err) => {
        console.warn('[MasterDocs SW] Pre-caching shell assets non-fatal warning:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: Evict obsolete caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== SHELL_CACHE && key !== RUNTIME_CACHE) {
            return caches.delete(key);
          }
          return null;
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: Smart routing strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and non-http(s) schemas
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Skip Vite dev-server HMR internal pings and extensions
  if (url.pathname.includes('/@vite/') || url.pathname.includes('/__vite_ping') || url.pathname.includes('/@fs/')) {
    return;
  }

  // 1. Navigation requests (HTML SPA Routing)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback: Match requested URL first, else fallback to index.html shell
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          const cachedDocs = await caches.match('/docs');
          if (cachedDocs) return cachedDocs;

          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;

          const cachedRoot = await caches.match('/');
          if (cachedRoot) return cachedRoot;

          return new Response('<h1>MasterDocs is offline</h1><p>Please check your connection.</p>', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        })
    );
    return;
  }

  // 2. Static Assets (Scripts, Styles, Fonts, Images, SVGs, Data JSONs)
  const isStaticAsset =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.json') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Stale-while-revalidate for static assets
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => null);

        // Return cached if available immediately, otherwise wait for network
        return cachedResponse || fetchPromise.then((res) => res || cachedResponse);
      })
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Client Communication (Precache 21 tracks on-demand & cache maintenance)
self.addEventListener('message', async (event) => {
  if (!event.data || !event.data.type) return;

  if (event.data.type === 'CACHE_ALL_TRACKS') {
    const urlsToCache = event.data.urls || [];
    const total = urlsToCache.length;
    const cache = await caches.open(RUNTIME_CACHE);

    let cachedCount = 0;
    for (let i = 0; i < urlsToCache.length; i++) {
      const url = urlsToCache[i];
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (err) {
        console.warn(`[MasterDocs SW] Failed to cache track item: ${url}`, err);
      }
      cachedCount++;

      // Broadcast progress to all matching clients
      const clients = await self.clients.matchAll();
      for (const client of clients) {
        client.postMessage({
          type: 'CACHE_TRACKS_PROGRESS',
          cached: cachedCount,
          total,
          percent: Math.round((cachedCount / total) * 100),
          currentUrl: url,
          done: cachedCount === total,
        });
      }
    }
  }

  if (event.data.type === 'CLEAR_OFFLINE_CACHE') {
    await caches.delete(RUNTIME_CACHE);
    await caches.delete(SHELL_CACHE);
    const clients = await self.clients.matchAll();
    for (const client of clients) {
      client.postMessage({
        type: 'CACHE_CLEARED_SUCCESS',
      });
    }
  }
});
