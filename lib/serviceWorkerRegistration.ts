export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

export const checkOnlineStatus = (): boolean => {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
};
