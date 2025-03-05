export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, any>;
}

export interface ReminderSchedule {
  id: string;
  habitId: string;
  time: string; // HH:mm format
  days: number[]; // 0-6 for Sunday-Saturday
  enabled: boolean;
}

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';
