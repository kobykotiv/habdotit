import { Habit, Reminder, User } from '../types/models';
import { notificationService } from '@/services/notificationService';

export class NotificationService {
  private static instance: NotificationService;
  private hasPermission: boolean = false;
  private readonly VAPID_PUBLIC_KEY = 'BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk';
  private swRegistration: ServiceWorkerRegistration | null = null;
  private registeredServiceWorker = false;
  getRemindersForH: any;

  private constructor() {
    this.checkPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service
   */
  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported by this browser');
      return false;
    }
    
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      this.registeredServiceWorker = true;
      return true;
    } catch (error) {
      console.error('Failed to register service worker:', error);
      return false;
    }
  }

  /**
   * Check if the browser supports notifications
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Request permission to send notifications
   */
  async requestPermission(userId: string): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      
      // Update user's permission status
      await updateDoc(doc(db, 'users', userId), {
        notificationPermission: permission
      });

      if (permission === 'granted') {
        await this.registerDevice(userId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  async registerDevice(userId: string): Promise<void> {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging, { vapidKey: this.VAPID_PUBLIC_KEY });

      if (token) {
        // Add token to user's tokens array
        await updateDoc(doc(db, 'users', userId), {
          notificationTokens: arrayUnion(token)
        });

        // Set up message handler
        onMessage(messaging, (payload) => {
          this.handleForegroundMessage(payload);
        });
      }
    } catch (error) {
      console.error('Failed to register device:', error);
    }
  }

  async unregisterDevice(userId: string, token: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        notificationTokens: arrayRemove(token)
      });
    } catch (error) {
      console.error('Failed to unregister device:', error);
    }
  }

  private handleForegroundMessage(payload: any): void {
    // Show notification when app is in foreground
    if (Notification.permission === 'granted') {
      const { title, body } = payload.notification;
      new Notification(title, {
        body,
        icon: '/icons/notification-icon.png'
      });
    }
  }

  async checkPermission(): Promise<NotificationPermission> {
    return Notification.permission;
  }

  /**
   * Subscribe a user to push notifications
   */
  async subscribeToPush(userId: string): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY)
      });
      
      // Store subscription on server
      await this.saveSubscription(userId, subscription);
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }
  saveSubscription(userId: string, subscription: PushSubscription) {
    throw new Error('Method not implemented.');
  }

  /**
   * Schedule reminders for a habit
   */
  async scheduleReminders(habit: Habit, reminders: Reminder[]): Promise<void> {
    // Store reminders in database
    for (const reminder of reminders) {
      await this.storeReminder(reminder);
    }
    
    // If any reminders are due soon, register them with the service worker
    const soonReminders = reminders.filter(reminder => {
      return this.isReminderSoon(reminder);
    });
    
    if (soonReminders.length > 0 && this.registeredServiceWorker) {
      const registration = await navigator.serviceWorker.ready;
      
      for (const reminder of soonReminders) {
        const nextTime = this.calculateNextReminderTime(reminder);
        
        if (nextTime) {
          // Send message to service worker to schedule notification
          registration.active?.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            payload: {
              id: reminder.id,
              title: `Habit Reminder: ${habit.title}`,
              body: reminder.message || `Time for your habit: ${habit.title}`,
              timestamp: nextTime.getTime()
            }
          });
        }
      }
    }
  }
  storeReminder(reminder: Reminder) {
    throw new Error('Method not implemented.');
  }
  isReminderSoon(reminder: Reminder): unknown {
    throw new Error('Method not implemented.');
  }
  calculateNextReminderTime(reminder: Reminder): Date | null {
    throw new Error('Method not implemented.');
  }

  /**
   * Cancel reminders for a habit
   */
  async cancelReminders(habitId: string): Promise<void> {
    // Get all reminders for this habit
    const reminders = await this.getRemindersForH
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async scheduleNotification(habit: Habit): Promise<void> {
    if (!this.hasPermission) return;
    
    const notification = new Notification(`Time to ${habit.name}!`, {
      body: `Don't forget your daily habit: ${habit.name}`,
      icon: '/favicon.ico',
      tag: `habit-${habit.id}`,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

NotificationService.getInstance();