import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Habit as HabitType, Achievement, Profile } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDaysSinceCreation = (habit: Pick<HabitType, 'createdAt'>) => {
  if (!habit.createdAt) return 1;
  const creationDate = new Date(habit.createdAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - creationDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

// Re-export types for convenience
export type {Achievement, Profile };

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string;
  reminderTime: string;
  notes: string;
  createdAt: string;
  updatedAt: string;  // Required field
  logs: Record<string, boolean>;
  currentStreak: number;
  longestStreak: number;
  level: number;
  points: number;
}
