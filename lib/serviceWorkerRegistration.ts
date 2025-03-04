interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface SyncRegistration {
  register(tag: string): Promise<void>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncRegistration;
  periodicSync?: {
    register(tag: string, options: { minInterval: number }): Promise<void>;
  };
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js') as ExtendedServiceWorkerRegistration;
    console.log('Service Worker registered successfully:', registration);

    // Setup periodic sync if supported
    if ('periodicSync' in registration) {
      try {
        await registration.periodicSync?.register('habit-sync', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours
        });
      } catch (error) {
        console.log('Periodic sync could not be registered:', error);
      }
    }

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New content is available, show update prompt
          showUpdatePrompt();
        }
      });
    });
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

export const checkOnlineStatus = (): boolean => {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
};

// Listen for online/offline events
export const setupNetworkListeners = (
  onOnline?: () => void,
  onOffline?: () => void
) => {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    onOnline?.();
    syncData();
  });

  window.addEventListener('offline', () => {
    onOffline?.();
  });
};

// Handle PWA installation
export const setupInstallPrompt = (
  onCanInstall: (show: () => Promise<void>) => void
) => {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    // Notify that we can install the PWA
    onCanInstall(showInstallPrompt);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    // Optional: Track successful installation
    console.log('PWA was installed');
  });
};

// Show PWA install prompt
export const showInstallPrompt = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('User accepted the PWA installation');
  }
  
  deferredPrompt = null;
};

// Show update prompt
const showUpdatePrompt = () => {
  // You can implement your own UI for this
  if (confirm('New version available! Click OK to update.')) {
    window.location.reload();
  }
};

// Sync data when coming back online
const syncData = async () => {
  try {
    const registration = await navigator.serviceWorker.ready as ExtendedServiceWorkerRegistration;
    if (registration.sync) {
      await registration.sync.register('sync-habits');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
};

// Check if app is installed
export const isPWAInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Force reload all service workers and refresh page
export const forceUpdate = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map(reg => reg.unregister()));
  window.location.reload();
};
