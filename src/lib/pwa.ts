/**
 * Food Science AI - PWA, Service Worker, Update Lifecycle & Offline Package Manager
 */

type InstallPromptCallback = (canInstall: boolean) => void;
type SwUpdateCallback = (hasUpdate: boolean) => void;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface PrecacheProgress {
  currentFile: string;
  completedFiles: number;
  totalFiles: number;
  downloadedBytes: number;
  totalBytes: number;
  percent: number;
}

export interface PackageCacheEntry {
  cached: boolean;
  sizeBytes: number;
}

export interface OfflinePackagesSummary {
  packagesStatus: Record<string, PackageCacheEntry>;
  totalCachedBytes: number;
  totalRequiredBytes: number;
  cachedFilesCount: number;
  totalFilesCount: number;
  appShellFilesCount: number;
}

export interface ServiceWorkerRuntimeStatus {
  supported: boolean;
  registered: boolean;
  controlling: boolean;
  state: 'not_supported' | 'not_registered' | 'installing' | 'waiting_update' | 'active';
  scope: string | null;
  appCacheName: string;
  pyodideCacheName: string;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let waitingRegistration: ServiceWorkerRegistration | null = null;
const installListeners = new Set<InstallPromptCallback>();
const updateListeners = new Set<SwUpdateCallback>();
const precacheProgressListeners = new Set<(progress: PrecacheProgress) => void>();

export const SW_APP_CACHE_NAME = 'food-science-app-v5';
export const SW_CACHE_NAME = 'food-science-pyodide-v0.26.4';

export const PYODIDE_ASSET_SIZES: Record<string, number> = {
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

export const ALL_PYODIDE_ASSETS = Object.keys(PYODIDE_ASSET_SIZES);
export const TOTAL_PYODIDE_BYTES = Object.values(PYODIDE_ASSET_SIZES).reduce((a, b) => a + b, 0);

function notifyUpdateListeners(available: boolean) {
  updateListeners.forEach((cb) => cb(available));
}

export function isCapacitorNative(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

/**
 * Initializes Service Worker registration, update listeners, and PWA install prompt listeners
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    installListeners.forEach((cb) => cb(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installListeners.forEach((cb) => cb(false));
  });

  if (isCapacitorNative()) {
    return;
  }

  if ('serviceWorker' in navigator) {
    // Receive real-time SW messages (download progress, storage quota)
    navigator.serviceWorker.addEventListener('message', (event) => {
      const payload = event.data;
      if (!payload) return;
      if (payload.type === 'PRECACHE_PROGRESS') {
        precacheProgressListeners.forEach((cb) => cb(payload as PrecacheProgress));
      }
    });

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          if (registration.waiting) {
            waitingRegistration = registration;
            notifyUpdateListeners(true);
          }

          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                waitingRegistration = registration;
                notifyUpdateListeners(true);
              }
            });
          });
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    });
  }
}

export function subscribeToInstallPrompt(callback: InstallPromptCallback): () => void {
  installListeners.add(callback);
  callback(deferredPrompt !== null);
  return () => {
    installListeners.delete(callback);
  };
}

export function subscribeToSwUpdate(callback: SwUpdateCallback): () => void {
  updateListeners.add(callback);
  callback(waitingRegistration?.waiting != null);
  return () => {
    updateListeners.delete(callback);
  };
}

export async function checkForSwUpdate(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return false;
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return false;
  await reg.update();
  if (reg.waiting) {
    waitingRegistration = reg;
    notifyUpdateListeners(true);
    return true;
  }
  return false;
}

/**
 * Applies a waiting Service Worker update without clearing Pyodide cache or IndexedDB
 */
export async function applySwUpdate(): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  const reg = waitingRegistration || (await navigator.serviceWorker.getRegistration());
  if (!reg?.waiting) return;

  await new Promise<void>((resolve) => {
    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', done, { once: true });
    reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
    setTimeout(done, 1500);
  });

  window.location.reload();
}

export async function getServiceWorkerRuntimeStatus(): Promise<ServiceWorkerRuntimeStatus> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return {
      supported: false,
      registered: false,
      controlling: false,
      state: 'not_supported',
      scope: null,
      appCacheName: SW_APP_CACHE_NAME,
      pyodideCacheName: SW_CACHE_NAME
    };
  }

  const reg = await navigator.serviceWorker.getRegistration();
  const controlling = Boolean(navigator.serviceWorker.controller);
  let state: ServiceWorkerRuntimeStatus['state'] = 'not_registered';
  if (reg) {
    if (reg.waiting) state = 'waiting_update';
    else if (reg.installing) state = 'installing';
    else if (reg.active) state = 'active';
  }

  return {
    supported: true,
    registered: Boolean(reg),
    controlling,
    state,
    scope: reg?.scope || null,
    appCacheName: SW_APP_CACHE_NAME,
    pyodideCacheName: SW_CACHE_NAME
  };
}

export async function promptInstallApp(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }

  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installListeners.forEach((cb) => cb(false));
  return outcome === 'accepted';
}

export function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIosSafariDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isSafari = /safari/.test(ua) && !/crios|fxios|edgios/.test(ua);
  return isIos && isSafari;
}

export interface PrecachePackagesResult {
  success: boolean;
  totalAssets: number;
  cachedCount: number;
  downloadedBytes?: number;
  totalBytes?: number;
  failedAssets?: string[];
  errorFa?: string;
}

function sendSwMessage<T>(payload: Record<string, unknown>, timeoutMs = 180000): Promise<T | null> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(null);
  }
  const controller = navigator.serviceWorker.controller;
  if (!controller) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), timeoutMs);
    channel.port1.onmessage = (event) => {
      clearTimeout(timer);
      resolve(event.data as T);
    };
    controller.postMessage(payload, [channel.port2]);
  });
}

function isValidLocalAssetResponse(res: Response): boolean {
  if (!res || !res.ok || res.status !== 200) return false;
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  return !ct.includes('text/html');
}

/**
 * Triggers offline caching of all 22 Pyodide & SciPy assets with live byte progress.
 */
export async function precacheAllScientificPackages(
  onProgress?: (progress: PrecacheProgress) => void
): Promise<PrecachePackagesResult> {
  if (onProgress) {
    precacheProgressListeners.add(onProgress);
  }

  try {
    const swResponse = await sendSwMessage<PrecachePackagesResult>({ type: 'PRECACHE_ALL_PACKAGES' });
    if (swResponse) {
      return swResponse;
    }

    if (typeof caches === 'undefined') {
      return {
        success: false,
        totalAssets: ALL_PYODIDE_ASSETS.length,
        cachedCount: 0,
        downloadedBytes: 0,
        totalBytes: TOTAL_PYODIDE_BYTES,
        errorFa: 'مرورگر از Cache API پشتیبانی نمی‌کند.'
      };
    }

    const cache = await caches.open(SW_CACHE_NAME);
    let cachedCount = 0;
    let downloadedBytes = 0;
    const failedAssets: string[] = [];

    for (const url of ALL_PYODIDE_ASSETS) {
      const expected = PYODIDE_ASSET_SIZES[url] || 0;
      const shortName = url.replace('/pyodide/', '');

      try {
        const existing = await cache.match(url);
        if (existing && isValidLocalAssetResponse(existing)) {
          cachedCount++;
          downloadedBytes += expected;
        } else {
          const res = await fetch(url);
          if (isValidLocalAssetResponse(res)) {
            if (res.body && typeof res.body.getReader === 'function') {
              const reader = res.body.getReader();
              const chunks: Uint8Array[] = [];
              let received = 0;
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                  chunks.push(value);
                  received += value.byteLength;
                  onProgress?.({
                    currentFile: shortName,
                    completedFiles: cachedCount + failedAssets.length,
                    totalFiles: ALL_PYODIDE_ASSETS.length,
                    downloadedBytes: downloadedBytes + received,
                    totalBytes: TOTAL_PYODIDE_BYTES,
                    percent: Math.min(99, Math.round(((downloadedBytes + received) / TOTAL_PYODIDE_BYTES) * 100))
                  });
                }
              }
              const blobParts: BlobPart[] = chunks.map((c) => new Uint8Array(c));
              const blob = new Blob(blobParts, {
                type: res.headers.get('content-type') || 'application/octet-stream'
              });
              const rebuilt = new Response(blob, {
                status: 200,
                headers: {
                  'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
                  'Content-Length': String(blob.size)
                }
              });
              await cache.put(url, rebuilt);
              downloadedBytes += blob.size || expected;
            } else {
              await cache.put(url, res);
              downloadedBytes += expected;
            }
            cachedCount++;
          } else {
            failedAssets.push(url);
          }
        }
      } catch {
        failedAssets.push(url);
      }

      onProgress?.({
        currentFile: shortName,
        completedFiles: cachedCount + failedAssets.length,
        totalFiles: ALL_PYODIDE_ASSETS.length,
        downloadedBytes,
        totalBytes: TOTAL_PYODIDE_BYTES,
        percent: Math.min(100, Math.round((downloadedBytes / TOTAL_PYODIDE_BYTES) * 100))
      });
    }

    return {
      success: failedAssets.length === 0,
      totalAssets: ALL_PYODIDE_ASSETS.length,
      cachedCount,
      downloadedBytes,
      totalBytes: TOTAL_PYODIDE_BYTES,
      failedAssets
    };
  } finally {
    if (onProgress) {
      precacheProgressListeners.delete(onProgress);
    }
  }
}

export async function getOfflinePackagesSummary(): Promise<OfflinePackagesSummary> {
  const swResponse = await sendSwMessage<OfflinePackagesSummary>(
    { type: 'CHECK_PACKAGES_CACHE_STATUS' },
    15000
  );
  if (swResponse?.packagesStatus) {
    return swResponse;
  }

  const targets = [
    { name: 'core', url: '/pyodide/pyodide.asm.wasm' },
    { name: 'stdlib', url: '/pyodide/python_stdlib.zip' },
    { name: 'openblas', url: '/pyodide/openblas-0.3.26.zip' },
    { name: 'numpy', url: '/pyodide/numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.whl' },
    { name: 'scipy', url: '/pyodide/scipy-1.12.0-cp312-cp312-pyodide_2024_0_wasm32.whl' },
    { name: 'sympy', url: '/pyodide/sympy-1.12-py3-none-any.whl' },
    { name: 'pandas', url: '/pyodide/pandas-2.2.0-cp312-cp312-pyodide_2024_0_wasm32.whl' },
    { name: 'matplotlib', url: '/pyodide/matplotlib-3.5.2-cp312-cp312-pyodide_2024_0_wasm32.whl' }
  ];

  const packagesStatus: Record<string, PackageCacheEntry> = {};
  if (typeof caches === 'undefined') {
    for (const t of targets) packagesStatus[t.name] = { cached: false, sizeBytes: 0 };
    return {
      packagesStatus,
      totalCachedBytes: 0,
      totalRequiredBytes: TOTAL_PYODIDE_BYTES,
      cachedFilesCount: 0,
      totalFilesCount: ALL_PYODIDE_ASSETS.length,
      appShellFilesCount: 0
    };
  }

  const pyCache = await caches.open(SW_CACHE_NAME);
  for (const t of targets) {
    const matched = await pyCache.match(t.url);
    if (matched && isValidLocalAssetResponse(matched)) {
      const blob = await matched.clone().blob();
      packagesStatus[t.name] = { cached: true, sizeBytes: blob.size };
    } else {
      packagesStatus[t.name] = { cached: false, sizeBytes: 0 };
    }
  }

  let totalCachedBytes = 0;
  let cachedFilesCount = 0;
  for (const url of ALL_PYODIDE_ASSETS) {
    const m = await pyCache.match(url);
    if (m && isValidLocalAssetResponse(m)) {
      cachedFilesCount++;
      totalCachedBytes += PYODIDE_ASSET_SIZES[url] || 0;
    }
  }

  const appCache = await caches.open(SW_APP_CACHE_NAME);
  const appKeys = await appCache.keys();

  return {
    packagesStatus,
    totalCachedBytes,
    totalRequiredBytes: TOTAL_PYODIDE_BYTES,
    cachedFilesCount,
    totalFilesCount: ALL_PYODIDE_ASSETS.length,
    appShellFilesCount: appKeys.length
  };
}

export async function getOfflinePackagesCacheStatus(): Promise<Record<string, PackageCacheEntry>> {
  const summary = await getOfflinePackagesSummary();
  return summary.packagesStatus;
}

export async function clearScientificPackagesCache(): Promise<void> {
  const swResponse = await sendSwMessage<{ status: string }>({ type: 'CLEAR_PYODIDE_CACHE' }, 10000);
  if (!swResponse && typeof caches !== 'undefined') {
    await caches.delete(SW_CACHE_NAME);
  }
}
