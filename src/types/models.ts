import { ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  friends?: string[]; // User IDs
  preferences: UserPreferences;
  createdAt: number;
  lastActive: number;
  notificationTokens?: string[]; // FCM tokens for push notifications
  notificationPermission?: 'granted' | 'denied' | 'default';
}

export interface UserPreferences {
  reminderMethods: ('push' | 'email')[];
  notificationsEnabled: boolean;
  emailFrequency?: 'daily' | 'weekly' | 'none';
  theme?: 'light' | 'dark' | 'system';
  privacySettings: {
    shareProgress: boolean;
    shareFriends: boolean;
    shareHabits: boolean;
  };
}

export interface Habit {
  logs: any;
  name: ReactNode;
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  color?: string;
  icon?: string;
  frequency: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    days?: number[]; // 0 = Sunday, 6 = Saturday
    customInterval?: number;
    timesPerPeriod?: number;
  };
  timePreference?: {
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
    specificTime?: string; // HH:mm format
  };
  reminders: Reminder[];
  createdAt: number;
  archivedAt?: number;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = easiest, 5 = hardest
  isPublic: boolean;
}

export interface Reminder {
  id: string;
  habitId: string;
  type: 'push' | 'email';
  time: string; // HH:mm format
  days: number[]; // 0 = Sunday, 6 = Saturday
  message?: string;
  enabled: boolean;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  userId: string;
  completed: boolean;
  timestamp: number;
  notes?: string;
  mood?: 1 | 2 | 3 | 4 | 5; // 1 = worst, 5 = best
  difficulty?: 1 | 2 | 3 | 4 | 5; // 1 = easiest, 5 = hardest
}

export interface HabitStats {
  habitId: string;
  userId: string;
  streakCurrent: number;
  streakLongest: number;
  totalCompleted: number;
  successRate: number; // 0-100
  lastCompletedAt?: number;
  averageCompletionTime?: string; // HH:mm format
  patternInsights: string[];
}

export interface HabitRecommendation {
  id: string;
  userId: string;
  title: string;
  description: string;
  category?: string;
  estimatedDifficulty: 1 | 2 | 3 | 4 | 5;
  reasoning: string;
  suggestedFrequency: Habit['frequency'];
  suggestedTimePreference?: Habit['timePreference'];
  confidence: number; // 0-100
  basedOnHabits: string[]; // Habit IDs
}

export interface Challenge {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  habitId?: string; // Optional connection to a specific habit
  participants: string[]; // User IDs
  startDate: number;
  endDate: number;
  goal: {
    type: 'streak' | 'completion' | 'custom';
    target: number;
  };
  progress: Record<string, number>; // userId -> progress
}

export interface AnalyticsSnapshot {
  userId: string;
  timestamp: number;
  habitStats: Record<string, HabitStats>;
  overallSuccessRate: number;
  totalActiveHabits: number;
  topHabits: {
    habitId: string;
    successRate: number;
  }[];
  recommendationsGenerated: number;
}
