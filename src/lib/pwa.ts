/**
 * Food Science AI - PWA and Service Worker Management
 */

type InstallPromptCallback = (canInstall: boolean) => void;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<InstallPromptCallback>();

/**
 * Initializes Service Worker registration and PWA install prompt listeners
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;

  // 1. Listen for PWA installation prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    installListeners.forEach((cb) => cb(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installListeners.forEach((cb) => cb(false));
    console.log('Food Science AI PWA was installed successfully.');
  });

  // 2. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully with scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    });
  }
}

/**
 * Hook or subscriber for PWA install capability
 */
export function subscribeToInstallPrompt(callback: InstallPromptCallback): () => void {
  installListeners.add(callback);
  callback(deferredPrompt !== null);
  return () => {
    installListeners.delete(callback);
  };
}

/**
 * Triggers the browser native PWA install prompt
 */
export async function promptInstallApp(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installListeners.forEach((cb) => cb(false));
  return outcome === 'accepted';
}

/**
 * Checks if the application is running in standalone PWA mode
 */
export function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}
