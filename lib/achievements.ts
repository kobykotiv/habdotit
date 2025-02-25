export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: any) => boolean;
  points: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-habit",
    title: "Getting Started",
    description: "Create your first habit",
    icon: "🌱",
    condition: (stats) => stats.totalHabits >= 1,
    points: 10
  },
  {
    id: "week-streak",
    title: "Weekly Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    condition: (stats) => stats.longestStreak >= 7,
    points: 50
  },
  {
    id: "month-streak",
    title: "Habit Master",
    description: "Maintain a 30-day streak",
    icon: "👑",
    condition: (stats) => stats.longestStreak >= 30,
    points: 200
  },
  {
    id: "multi-habit",
    title: "Multi-tasker",
    description: "Track 3 habits simultaneously",
    icon: "🎯",
    condition: (stats) => stats.activeHabits >= 3,
    points: 30
  }
]

export function checkAchievements(stats: any): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.condition(stats));
}

export function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}
