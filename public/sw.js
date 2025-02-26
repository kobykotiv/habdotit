const CACHE_NAME = 'habit-tracker-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        OFFLINE_URL,
        '/manifest.json',
        '/icon.png',
        '/styles.css',
        // Add other static assets here
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  
  event.waitUntil(
    self.registration.showNotification(data.title || "New Notification", {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: data.data,
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-habits') {
    event.waitUntil(syncHabits());
  }
});

async function syncHabits() {
  // Implement habit syncing logic here
  const habits = await localforage.getItem('pending_habits');
  if (habits) {
    await fetch('/api/sync', {
      method: 'POST',
      body: JSON.stringify(habits)
    });
    await localforage.removeItem('pending_habits');
  }
}

self.addEventListener("push", (event) => {
  // You can use event.data to customize behavior
  const data = event.data ? event.data.json() : {}
  
  // Optionally show a notification
  const title = data.title || "Automatic Check-In"
  const options = {
    body: data.body || "Your habit has been checked in automatically.",
    // additional options
  }
  
  event.waitUntil(
    (async () => {
      // Trigger automatic check-in by calling your API endpoint
      await fetch("/api/auto-checkin")
      // Show notification to user (if needed)
      await self.registration.showNotification(title, options)
    })()
  )
});
