import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDaysSinceCreation = (habit: { createdAt?: string }) => {
  if (!habit.createdAt) return 1;
  const creationDate = new Date(habit.createdAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - creationDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

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
  createdAt?: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Profile {
  color1?: string;
  [key: string]: any;
}
