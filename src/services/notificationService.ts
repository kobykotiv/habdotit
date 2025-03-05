import { NotificationPayload, ReminderSchedule, NotificationPermissionStatus } from '../types/notifications';

export class NotificationService {
  private static instance: NotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private readonly STORAGE_KEY = 'notification_settings';

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      return true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      return false;
    }
  }

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    try {
      const permission = await Notification.requestPermission();
      this.savePermissionStatus(permission as NotificationPermissionStatus);
      return permission as NotificationPermissionStatus;
    } catch (error) {
      console.error('Failed to request permission:', error);
      return 'denied';
    }
  }

  private savePermissionStatus(status: NotificationPermissionStatus): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ permission: status }));
  }

  async scheduleReminder(reminder: ReminderSchedule): Promise<boolean> {
    if (!this.swRegistration) return false;

    try {
      // Store reminder in localStorage
      const reminders = this.getStoredReminders();
      reminders.push(reminder);
      localStorage.setItem('reminders', JSON.stringify(reminders));

      // Notify service worker
      await this.swRegistration.active?.postMessage({
        type: 'SCHEDULE_REMINDER',
        payload: { reminder }
      });
      return true;
    } catch (error) {
      console.error('Failed to schedule reminder:', error);
      return false;
    }
  }

  async cancelReminder(reminderId: string): Promise<boolean> {
    if (!this.swRegistration) return false;

    try {
      // Remove reminder from localStorage
      const reminders = this.getStoredReminders();
      const updatedReminders = reminders.filter(r => r.id !== reminderId);
      localStorage.setItem('reminders', JSON.stringify(updatedReminders));

      // Notify service worker
      await this.swRegistration.active?.postMessage({
        type: 'CANCEL_REMINDER',
        payload: { reminderId }
      });
      return true;
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
      return false;
    }
  }

  private getStoredReminders(): ReminderSchedule[] {
    const stored = localStorage.getItem('reminders');
    return stored ? JSON.parse(stored) : [];
  }

  async showNotification(payload: NotificationPayload): Promise<void> {
    if (Notification.permission !== 'granted') return;

    new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icons/notification-icon.png',
      data: payload.data
    });
  }

  getPermissionStatus(): NotificationPermissionStatus {
    if (!this.isSupported()) return 'denied';
    return Notification.permission as NotificationPermissionStatus;
  }
}

export const notificationService = NotificationService.getInstance();