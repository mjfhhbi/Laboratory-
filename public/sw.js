/**
 * Food Science AI - Service Worker
 * Version: 3.0.0 (App Shell v5 + Persistent Pyodide 0.26.4 Cache)
 *
 * Guarantees:
 * 1. Synchronous response.clone() BEFORE cache.put() — eliminates Response-already-used race bugs.
 * 2. Separate caches for App Shell (food-science-app-v5) vs Pyodide/SciPy (food-science-pyodide-v0.26.4)
 *    so app updates NEVER purge or re-download ~145 MB of Python WASM/wheel packages, and NEVER touch IndexedDB.
 * 3. Pre-caches all built Vite /assets/* bundles + KaTeX woff2 fonts via /precache-manifest.json on install.
 * 4. Rejects 200 OK text/html SPA fallbacks on /pyodide/* assets.
 * 5. Emits real-time byte-level download progress events during bulk scientific package caching.
 */

const APP_CACHE_NAME = 'food-science-app-v5';
const PYODIDE_CACHE_NAME = 'food-science-pyodide-v0.26.4';
const FONTS_CACHE_NAME = 'food-science-fonts-v1';

// Core Application Shell
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png'
];

// All 22 Pyodide 0.26.4 & Scientific Wheels Assets (138.75 MiB / 145.48 MB)
const PYODIDE_ASSET_SIZES = {
  '/pyodide/pyodide.mjs': 13779,
  '/pyodide/pyodide-lock.json': 106335,
  '/pyodide/pyodide.asm.js': 1229099,
  '/pyodide/pyodide.asm.wasm': 10088051,
  '/pyodide/python_stdlib.zip': 2341872,
  '/pyodide/numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.whl': 11959269,
  '/pyodide/scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl': 47107789,
  '/pyodide/sympy-1.12-py3-none-any.whl': 15800402,
  '/pyodide/pandas-2.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl': 23759073,
  '/pyodide/matplotlib-3.5.2-cp312-cp312-pyodide_2024_0_wasm32.whl': 15742868,
  '/pyodide/openblas-0.3.26.zip': 6117592,
  '/pyodide/pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl': 3042026,
  '/pyodide/fonttools-4.51.0-py3-none-any.whl': 4266602,
  '/pyodide/mpmath-1.3.0-py3-none-any.whl': 1519112,
  '/pyodide/pytz-2024.1-py2.py3-none-any.whl': 1083571,
  '/pyodide/python_dateutil-2.9.0.post0-py2.py3-none-any.whl': 444927,
  '/pyodide/pyparsing-3.1.2-py3-none-any.whl': 394748,
  '/pyodide/packaging-23.2-py3-none-any.whl': 194236,
  '/pyodide/kiwisolver-1.4.5-cp312-cp312-pyodide_2024_0_wasm32.whl': 133464,
  '/pyodide/matplotlib_pyodide-0.2.2-py3-none-any.whl': 77772,
  '/pyodide/six-1.16.0-py2.py3-none-any.whl': 38737,
  '/pyodide/cycler-0.12.1-py3-none-any.whl': 23552
};

const ALL_PYODIDE_ASSETS = Object.keys(PYODIDE_ASSET_SIZES);
const TOTAL_PYODIDE_BYTES = Object.values(PYODIDE_ASSET_SIZES).reduce((a, b) => a + b, 0);

function isValidPyodideResponse(url, response) {
  if (!response || !response.ok || response.status !== 200) return false;
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  // Reject HTML SPA fallback masquerading as a wheel/wasm/mjs asset
  if (contentType.includes('text/html')) return false;
  if (url.endsWith('.json') && !contentType.includes('json') && contentType.includes('text/html')) {
    return false;
  }
  return true;
}

function broadcastToClients(payload) {
  self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
    for (const client of clients) {
      client.postMessage(payload);
    }
  }).catch(() => {});
}

/**
 * Safely clone synchronously BEFORE respondWith consumes the body.
 */
function cacheResponseSafely(cacheName, request, networkResponse) {
  if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
    return;
  }
  let cloned;
  try {
    cloned = networkResponse.clone();
  } catch {
    return;
  }

  caches.open(cacheName)
    .then((cache) => cache.put(request, cloned))
    .catch((err) => {
      if (err && err.name === 'QuotaExceededError') {
        broadcastToClients({
          type: 'STORAGE_QUOTA_EXCEEDED',
          messageFa: 'هشدار حافظه: ظرفیت کش مرورگر برای ذخیره آفلاین فایل‌های جدید پر شده است.'
        });
      }
    });
}

async function discoverAppBundleAssets() {
  const discovered = new Set(APP_SHELL_ASSETS);

  // 1. Read production precache-manifest.json generated at Vite build time
  try {
    const manifestRes = await fetch('/precache-manifest.json', { cache: 'no-store' });
    const ct = (manifestRes.headers.get('content-type') || '').toLowerCase();
    if (manifestRes.ok && ct.includes('json')) {
      const json = await manifestRes.json();
      if (Array.isArray(json.assets)) {
        for (const asset of json.assets) {
          if (typeof asset === 'string' && asset.startsWith('/')) {
            discovered.add(asset);
          }
        }
      }
    }
  } catch {
    // Expected in dev server if precache-manifest.json is not emitted
  }

  // 2. Fallback: extract referenced /assets/* & /src/* assets from /index.html
  try {
    const indexRes = await fetch('/index.html', { cache: 'no-store' });
    if (indexRes.ok) {
      const html = await indexRes.text();
      const matches = html.matchAll(/(?:src|href)=["'](\/(?:assets|src)\/[^"']+)["']/g);
      for (const m of matches) {
        if (m[1]) discovered.add(m[1]);
      }
    }
  } catch {
    // ignore
  }

  return Array.from(discovered);
}

// 1. Install Event - Pre-cache App Shell + Built Bundles + Core WASM Loader
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const appCache = await caches.open(APP_CACHE_NAME);
      const bundleAssets = await discoverAppBundleAssets();

      // Cache shell + JS/CSS/woff2 assets robustly without failing install on single optional file
      await Promise.all(
        bundleAssets.map(async (assetUrl) => {
          try {
            const res = await fetch(assetUrl, { cache: 'no-cache' });
            if (res.ok && res.status === 200) {
              await appCache.put(assetUrl, res);
            }
          } catch {
            // Skip unreachable optional dev resource
          }
        })
      );

      // Ensure core Pyodide loader files are seeded into dedicated persistent Pyodide cache
      const pyodideCache = await caches.open(PYODIDE_CACHE_NAME);
      const coreLoaderAssets = [
        '/pyodide/pyodide.mjs',
        '/pyodide/pyodide-lock.json',
        '/pyodide/pyodide.asm.js',
        '/pyodide/pyodide.asm.wasm',
        '/pyodide/python_stdlib.zip'
      ];
      for (const asset of coreLoaderAssets) {
        try {
          const already = await pyodideCache.match(asset);
          if (!already) {
            const res = await fetch(asset);
            if (isValidPyodideResponse(asset, res)) {
              await pyodideCache.put(asset, res);
            }
          }
        } catch {
          // Non-blocking
        }
      }

      // Activate immediately only on fresh install (no active controller yet);
      // if upgrading an active app, let UI offer seamless update or apply cleanly.
      if (!self.registration.active) {
        await self.skipWaiting();
      }
    })()
  );
});

// 2. Activate Event - Clean ONLY stale App Shell caches; PRESERVE Pyodide cache & IndexedDB
self.addEventListener('activate', (event) => {
  const KEEP_CACHES = new Set([APP_CACHE_NAME, PYODIDE_CACHE_NAME, FONTS_CACHE_NAME]);
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (!KEEP_CACHES.has(key)) {
            return caches.delete(key);
          }
          return Promise.resolve(false);
        })
      );
      await self.clients.claim();
    })()
  );
});

// 3. Fetch Event - Deterministic Caching Strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // Never intercept API endpoints or Vite HMR internals
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/@vite') || url.pathname.startsWith('/@react-refresh')) {
    return;
  }

  // A. Navigation requests (HTML SPA shell) -> Network First with offline App Shell fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          cacheResponseSafely(APP_CACHE_NAME, request, networkResponse);
          // Also refresh root '/' & '/index.html' cache when navigating root
          if (url.pathname === '/' || url.pathname === '/index.html') {
            cacheResponseSafely(APP_CACHE_NAME, '/index.html', networkResponse);
            cacheResponseSafely(APP_CACHE_NAME, '/', networkResponse);
          }
          return networkResponse;
        })
        .catch(async () => {
          const appCache = await caches.open(APP_CACHE_NAME);
          return (
            (await appCache.match(request)) ||
            (await appCache.match('/')) ||
            (await appCache.match('/index.html')) ||
            (await caches.match('/')) ||
            (await caches.match('/index.html')) ||
            new Response('صفحه در حافظه آفلاین یافت نشد.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            })
          );
        })
    );
    return;
  }

  // B. Pyodide runtime & scientific wheels -> Cache First inside dedicated PYODIDE_CACHE_NAME
  if (url.pathname.startsWith('/pyodide/')) {
    event.respondWith(
      (async () => {
        const pyCache = await caches.open(PYODIDE_CACHE_NAME);
        const cached = (await pyCache.match(request)) || (await pyCache.match(url.pathname));
        if (cached && isValidPyodideResponse(url.pathname, cached)) {
          return cached;
        }
        try {
          const networkResponse = await fetch(request);
          if (isValidPyodideResponse(url.pathname, networkResponse)) {
            cacheResponseSafely(PYODIDE_CACHE_NAME, url.pathname, networkResponse);
          }
          return networkResponse;
        } catch {
          return new Response('Pyodide asset unavailable offline', { status: 404 });
        }
      })()
    );
    return;
  }

  // C. External Google Fonts -> Stale While Revalidate in separate FONTS_CACHE_NAME
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      (async () => {
        const fontCache = await caches.open(FONTS_CACHE_NAME);
        const cached = await fontCache.match(request);
        const networkPromise = fetch(request)
          .then((res) => {
            cacheResponseSafely(FONTS_CACHE_NAME, request, res);
            return res;
          })
          .catch(() => cached || new Response('', { status: 204 }));
        return cached || networkPromise;
      })()
    );
    return;
  }

  // D. Same-origin Static App Assets (JS, CSS, woff2, images, manifests)
  const isStatic =
    url.origin === self.location.origin &&
    (request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image' ||
      request.destination === 'font' ||
      request.destination === 'worker' ||
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/src/') ||
      url.pathname.endsWith('.json') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg'));

  if (isStatic) {
    event.respondWith(
      (async () => {
        const appCache = await caches.open(APP_CACHE_NAME);
        const cached = (await appCache.match(request)) || (await caches.match(request));
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            cacheResponseSafely(APP_CACHE_NAME, request, networkResponse);
            return networkResponse;
          })
          .catch(async () => {
            return (
              cached ||
              (await appCache.match(request)) ||
              new Response('Asset unavailable offline', { status: 503 })
            );
          });

        return cached || networkFetch;
      })()
    );
    return;
  }

  // E. Default same-origin fallback (Network first -> App Cache)
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          cacheResponseSafely(APP_CACHE_NAME, request, networkResponse);
          return networkResponse;
        })
        .catch(async () => (await caches.match(request)) || new Response('Resource unavailable offline', { status: 503 }))
    );
  }
});

// 4. Message Event - Storage Audit, Real-time Byte Progress Pre-caching & Seamless Updates
self.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'SKIP_WAITING') {
    await self.skipWaiting();
    event.ports[0]?.postMessage({ ok: true });
    return;
  }

  if (data.type === 'GET_SW_INFO') {
    const appCache = await caches.open(APP_CACHE_NAME);
    const pyCache = await caches.open(PYODIDE_CACHE_NAME);
    const appKeys = await appCache.keys();
    const pyKeys = await pyCache.keys();
    event.ports[0]?.postMessage({
      appCacheName: APP_CACHE_NAME,
      pyodideCacheName: PYODIDE_CACHE_NAME,
      appAssetsCached: appKeys.length,
      pyodideAssetsCached: pyKeys.length,
      pyodideAssetsTotal: ALL_PYODIDE_ASSETS.length
    });
    return;
  }

  if (data.type === 'CHECK_STORAGE') {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const available = quota > usage ? quota - usage : 0;
      const percent = quota > 0 ? (usage / quota) * 100 : 0;
      event.ports[0]?.postMessage({
        usageBytes: usage,
        quotaBytes: quota,
        availableBytes: available,
        usedPercent: Math.round(percent * 10) / 10
      });
    } else {
      event.ports[0]?.postMessage({
        usageBytes: 0,
        quotaBytes: 0,
        availableBytes: 1024 * 1024 * 1024,
        usedPercent: 0
      });
    }
    return;
  }

  if (data.type === 'CHECK_PACKAGES_CACHE_STATUS') {
    const pyCache = await caches.open(PYODIDE_CACHE_NAME);
    const targetPackages = [
      { name: 'core', url: '/pyodide/pyodide.asm.wasm' },
      { name: 'stdlib', url: '/pyodide/python_stdlib.zip' },
      { name: 'openblas', url: '/pyodide/openblas-0.3.26.zip' },
      { name: 'numpy', url: '/pyodide/numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.whl' },
      { name: 'scipy', url: '/pyodide/scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl' },
      { name: 'sympy', url: '/pyodide/sympy-1.12-py3-none-any.whl' },
      { name: 'pandas', url: '/pyodide/pandas-2.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl' },
      { name: 'matplotlib', url: '/pyodide/matplotlib-3.5.2-cp312-cp312-pyodide_2024_0_wasm32.whl' }
    ];

    const results = {};
    for (const pkg of targetPackages) {
      const matched = await pyCache.match(pkg.url);
      if (matched && isValidPyodideResponse(pkg.url, matched)) {
        const blob = await matched.clone().blob();
        results[pkg.name] = { cached: true, sizeBytes: blob.size };
      } else {
        results[pkg.name] = { cached: false, sizeBytes: 0 };
      }
    }

    let totalCachedPyodideBytes = 0;
    let totalCachedPyodideFiles = 0;
    for (const url of ALL_PYODIDE_ASSETS) {
      const m = await pyCache.match(url);
      if (m && isValidPyodideResponse(url, m)) {
        totalCachedPyodideFiles++;
        totalCachedPyodideBytes += PYODIDE_ASSET_SIZES[url] || 0;
      }
    }

    const appCache = await caches.open(APP_CACHE_NAME);
    const appKeys = await appCache.keys();

    event.ports[0]?.postMessage({
      packagesStatus: results,
      totalCachedBytes: totalCachedPyodideBytes,
      totalRequiredBytes: TOTAL_PYODIDE_BYTES,
      cachedFilesCount: totalCachedPyodideFiles,
      totalFilesCount: ALL_PYODIDE_ASSETS.length,
      appShellFilesCount: appKeys.length
    });
    return;
  }

  // Bulk Pre-Cache all 22 Pyodide assets with real byte-level progress
  if (data.type === 'PRECACHE_ALL_PACKAGES') {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const available = (estimate.quota || 0) - (estimate.usage || 0);
        if (available < 160 * 1024 * 1024 && estimate.quota) {
          event.ports[0]?.postMessage({
            success: false,
            totalAssets: ALL_PYODIDE_ASSETS.length,
            cachedCount: 0,
            downloadedBytes: 0,
            totalBytes: TOTAL_PYODIDE_BYTES,
            errorFa: 'فضای ذخیره‌سازی آزاد مرورگر برای کش کامل بسته‌های علمی کافی نیست (حداقل ۱۶۰ مگابایت نیاز است).'
          });
          return;
        }
      }

      const pyCache = await caches.open(PYODIDE_CACHE_NAME);
      let cachedCount = 0;
      let completedBytes = 0;
      const failedAssets = [];

      for (const assetUrl of ALL_PYODIDE_ASSETS) {
        const expectedSize = PYODIDE_ASSET_SIZES[assetUrl] || 0;
        const shortName = assetUrl.replace('/pyodide/', '');

        try {
          const existing = await pyCache.match(assetUrl);
          if (existing && isValidPyodideResponse(assetUrl, existing)) {
            cachedCount++;
            completedBytes += expectedSize;
            broadcastToClients({
              type: 'PRECACHE_PROGRESS',
              currentFile: shortName,
              completedFiles: cachedCount + failedAssets.length,
              totalFiles: ALL_PYODIDE_ASSETS.length,
              downloadedBytes: completedBytes,
              totalBytes: TOTAL_PYODIDE_BYTES,
              percent: Math.min(100, Math.round((completedBytes / TOTAL_PYODIDE_BYTES) * 100))
            });
            continue;
          }

          const res = await fetch(assetUrl);
          if (!isValidPyodideResponse(assetUrl, res)) {
            failedAssets.push(assetUrl);
            continue;
          }

          // Clone before reading or stream into Blob to report chunk-by-chunk progress
          if (res.body && typeof res.body.getReader === 'function') {
            const reader = res.body.getReader();
            const chunks = [];
            let fileReceived = 0;
            let lastBroadcastAt = 0;

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
              fileReceived += value.byteLength;

              const now = Date.now();
              if (now - lastBroadcastAt > 120) {
                lastBroadcastAt = now;
                const liveBytes = completedBytes + fileReceived;
                broadcastToClients({
                  type: 'PRECACHE_PROGRESS',
                  currentFile: shortName,
                  completedFiles: cachedCount + failedAssets.length,
                  totalFiles: ALL_PYODIDE_ASSETS.length,
                  downloadedBytes: liveBytes,
                  totalBytes: TOTAL_PYODIDE_BYTES,
                  percent: Math.min(99, Math.round((liveBytes / TOTAL_PYODIDE_BYTES) * 100))
                });
              }
            }

            const blob = new Blob(chunks, {
              type: res.headers.get('content-type') || 'application/octet-stream'
            });
            const reconstructed = new Response(blob, {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
                'Content-Length': String(blob.size)
              }
            });
            await pyCache.put(assetUrl, reconstructed);
            completedBytes += blob.size || expectedSize;
            cachedCount++;
          } else {
            await pyCache.put(assetUrl, res);
            completedBytes += expectedSize;
            cachedCount++;
          }

          broadcastToClients({
            type: 'PRECACHE_PROGRESS',
            currentFile: shortName,
            completedFiles: cachedCount + failedAssets.length,
            totalFiles: ALL_PYODIDE_ASSETS.length,
            downloadedBytes: completedBytes,
            totalBytes: TOTAL_PYODIDE_BYTES,
            percent: Math.min(100, Math.round((completedBytes / TOTAL_PYODIDE_BYTES) * 100))
          });
        } catch {
          failedAssets.push(assetUrl);
        }
      }

      event.ports[0]?.postMessage({
        success: failedAssets.length === 0,
        totalAssets: ALL_PYODIDE_ASSETS.length,
        cachedCount,
        downloadedBytes: completedBytes,
        totalBytes: TOTAL_PYODIDE_BYTES,
        failedAssets
      });
    } catch (err) {
      event.ports[0]?.postMessage({
        success: false,
        totalAssets: ALL_PYODIDE_ASSETS.length,
        cachedCount: 0,
        downloadedBytes: 0,
        totalBytes: TOTAL_PYODIDE_BYTES,
        errorFa: `خطا در کش بسته‌ها: ${err.message || String(err)}`
      });
    }
    return;
  }

  // Clear ONLY App Shell cache (preserves Pyodide & IndexedDB) OR explicitly clear Pyodide cache
  if (data.type === 'CLEAR_CACHE') {
    await caches.delete(APP_CACHE_NAME);
    event.ports[0]?.postMessage({ status: 'app_cache_cleared', pyodidePreserved: true });
    return;
  }

  if (data.type === 'CLEAR_PYODIDE_CACHE') {
    await caches.delete(PYODIDE_CACHE_NAME);
    event.ports[0]?.postMessage({ status: 'pyodide_cache_cleared' });
  }
});
