import { HabitEntry } from '../types/models';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

export function calculateStreak(entries: HabitEntry[]): StreakResult {
  if (entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate = new Date().setHours(0, 0, 0, 0);

  // Calculate current streak
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.timestamp).setHours(0, 0, 0, 0);
    const dayDiff = Math.floor((lastDate - entryDate) / (1000 * 60 * 60 * 24));

    if (!entry.completed) {
      break;
    }

    if (dayDiff <= 1) {
      currentStreak++;
      lastDate = entryDate;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let tempStreak = 0;
  lastDate = 0;

  sortedEntries.reverse().forEach(entry => {
    const entryDate = new Date(entry.timestamp).setHours(0, 0, 0, 0);
    const dayDiff = lastDate ? Math.floor((entryDate - lastDate) / (1000 * 60 * 60 * 24)) : 0;

    if (entry.completed) {
      if (dayDiff <= 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      lastDate = entryDate;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  return { currentStreak, longestStreak };
}
