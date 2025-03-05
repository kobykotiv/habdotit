const CACHE_NAME = 'habit-tracker-v1';
const OFFLINE_URL = '/offline.html';
const reminderTimers = new Map();

// Cache management
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        OFFLINE_URL,
        '/manifest.json',
        '/icons/notification-icon.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Offline support
self.addEventListener('fetch', (event) => {
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

// Notification handling
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SCHEDULE_REMINDER':
      handleScheduleReminder(payload);
      break;
    case 'CANCEL_REMINDER':
      handleCancelReminder(payload);
      break;
  }
});

function handleScheduleReminder({ reminder }) {
  if (reminderTimers.has(reminder.id)) {
    clearTimeout(reminderTimers.get(reminder.id));
  }

  const timer = setInterval(() => {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':');
    
    if (reminder.days.includes(now.getDay()) &&
        now.getHours() === parseInt(hours) &&
        now.getMinutes() === parseInt(minutes)) {
      showReminder(reminder);
    }
  }, 60000); // Check every minute

  reminderTimers.set(reminder.id, timer);
}

function handleCancelReminder({ reminderId }) {
  if (reminderTimers.has(reminderId)) {
    clearTimeout(reminderTimers.get(reminderId));
    reminderTimers.delete(reminderId);
  }
}

function showReminder(reminder) {
  self.registration.showNotification('Habit Reminder', {
    body: `Time for your habit!`,
    icon: '/icons/notification-icon.png',
    data: { habitId: reminder.habitId },
    requireInteraction: true
  });
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow('/');
      }
    })
  );
});
