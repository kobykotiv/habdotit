export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string;
  reminderTime: string;
  notes: string;
  logs: { [key: string]: boolean };
  currentStreak: number;
  longestStreak: number;
  level: number;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ShareModalStats {
  totalCompletions: number;
  totalHabits: number;
  longestStreak: number;
}

export interface ShareModalProps {
  stats: ShareModalStats;
  achievements: Achievement[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
}

export interface Event {
  id: string;
  type: string;
  timestamp: string;
  data: any;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  tags: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
  data: string; // Base64 encoded content
}

export interface Template {
  id: string;
  name: string;
  content: string;
  parentId?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  eventCounts: { [key: string]: number };
  taskCompletionRate: number;
  activeTemplates: number;
  totalAssets: number;
}

export interface Profile {
  color1?: string;
  [key: string]: any;
}
