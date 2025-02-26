import type { HabitSuggestion } from "./habitSuggestions"

export const HABIT_CATEGORIES = [
  { value: "health-positive", label: "Health (Positive)", emoji: "🍎", color: "text-green-600" },
  { value: "productivity", label: "Productivity", emoji: "⚡", color: "text-blue-600" },
  { value: "mindfulness", label: "Mindfulness", emoji: "🧘", color: "text-purple-600" },
  { value: "learning", label: "Learning", emoji: "📚", color: "text-yellow-600" },
  { value: "creativity", label: "Creativity", emoji: "🎨", color: "text-pink-600" },
  { value: "relationships", label: "Relationships", emoji: "❤️", color: "text-red-600" },
  { value: "fitness", label: "Fitness", emoji: "🏃", color: "text-emerald-600" },
  { value: "substances-track", label: "Substances", emoji: "🚭", color: "text-gray-600" },
] as const

export const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "hourly", label: "Hourly" },
  { value: "weekly", label: "Weekly" },
  { value: "every-15-minutes", label: "Every 15 Minutes" },
] as const

export const DATA_SOVEREIGNTY_MESSAGE =
  "Your data is stored in cookies on your device. Accept cookies to enable data saving and Carbon ads. Remember to backup regularly to keep your habits data safe!"

export const QUICK_START_HABITS: HabitSuggestion[] = [
  {
    name: "Daily Exercise",
    category: "physical-activity",
    description: "Start with 10 minutes of any physical activity",
    difficulty: "easy",
    tags: ["fitness", "health", "movement", "beginner", "exercise"]
  },
  {
    name: "Mindful Meditation",
    category: "mental-wellbeing",
    description: "Take 5 minutes to breathe and center yourself",
    difficulty: "easy",
    tags: ["mindfulness", "mental health", "relaxation", "meditation", "stress reduction"]
  },
  {
    name: "Drink Water",
    category: "health-positive",
    description: "Stay hydrated throughout the day",
    difficulty: "easy",
    tags: ["hydration", "health", "water", "wellness", "daily habits"]
  },
  {
    name: "Read Daily",
    category: "productivity",
    description: "Read at least 10 pages every day",
    difficulty: "medium",
    tags: ["reading", "learning", "education", "personal development", "knowledge"]
  },
  {
    name: "Sleep Schedule",
    category: "health-positive",
    description: "Maintain consistent sleep and wake times",
    difficulty: "medium",
    tags: ["sleep", "health", "routine", "rest", "wellness"]
  }
]
