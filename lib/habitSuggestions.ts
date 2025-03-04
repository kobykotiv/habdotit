export interface HabitSuggestion {
  name: string;
  category: string;
  tags: string[];
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  replacementFor?: string;
}

export interface CategoryMap {
  [key: string]: {
    label: string;
    color: string;
    emoji: string;
  }
}

export const CATEGORIES: CategoryMap = {
  'health-positive': { label: 'Health (Positive)', color: 'text-green-500', emoji: '🍎' },
  'health-negative': { label: 'Health (Track & Reduce)', color: 'text-red-500', emoji: '🍔' },
  'substances-track': { label: 'Substances (Track)', color: 'text-purple-500', emoji: '🍷' },
  'substances-recovery': { label: 'Recovery & Sobriety', color: 'text-blue-500', emoji: '🌱' },
  'mental-wellbeing': { label: 'Mental Wellbeing', color: 'text-pink-500', emoji: '🧠' },
  'productivity': { label: 'Productivity', color: 'text-blue-500', emoji: '📚' },
  'compulsive-behaviors': { label: 'Compulsive Behaviors', color: 'text-orange-500', emoji: '🔄' },
  'physical-activity': { label: 'Physical Activity', color: 'text-green-600', emoji: '🏃‍♂️' }
}

// Comprehensive list of habit and addiction tracking suggestions
export const HABIT_SUGGESTIONS: HabitSuggestion[] = [
  // Substance tracking and recovery
  {
    name: "No Alcohol",
    category: "substances-recovery",
    tags: ["sobriety", "alcohol", "recovery", "abstinence", "health"],
    description: "Track days without consuming alcohol",
    difficulty: "hard"
  },
  {
    name: "Cigarette Reduction",
    category: "substances-track",
    tags: ["smoking", "tobacco", "nicotine", "reduction", "health"],
    description: "Track and gradually reduce cigarette consumption",
    difficulty: "hard"
  },
  {
    name: "Caffeine Intake",
    category: "substances-track",
    tags: ["coffee", "tea", "energy drinks", "caffeine", "moderation"],
    description: "Monitor daily caffeine consumption",
    difficulty: "medium"
  },
  {
    name: "Recovery Meeting Attendance",
    category: "substances-recovery",
    tags: ["support group", "AA", "NA", "recovery", "addiction"],
    description: "Track attendance at recovery or support group meetings",
    difficulty: "medium"
  },
  {
    name: "Sobriety Streak",
    category: "substances-recovery",
    tags: ["clean time", "sobriety", "recovery", "addiction"],
    description: "Track consecutive days of sobriety",
    difficulty: "hard"
  },
  {
    name: "Cannabis Use",
    category: "substances-track",
    tags: ["marijuana", "weed", "pot", "THC", "tracking"],
    description: "Monitor cannabis consumption frequency and amount",
    difficulty: "medium"
  },
  {
    name: "Medication Adherence",
    category: "health-positive",
    tags: ["medicine", "prescription", "treatment", "healthcare"],
    description: "Track taking prescribed medications as directed",
    difficulty: "easy"
  },

  // Compulsive behaviors
  {
    name: "Social Media Usage",
    category: "compulsive-behaviors",
    tags: ["screen time", "digital", "addiction", "phone", "reduction"],
    description: "Track and limit time spent on social media platforms",
    difficulty: "hard",
    replacementFor: "Excessive scrolling"
  },
  {
    name: "No Online Shopping",
    category: "compulsive-behaviors",
    tags: ["spending", "shopping", "impulse buying", "e-commerce"],
    description: "Track days without making online purchases",
    difficulty: "medium"
  },
  {
    name: "Gaming Limitation",
    category: "compulsive-behaviors",
    tags: ["video games", "gaming", "screen time", "digital", "balance"],
    description: "Set and respect limits for gaming time",
    difficulty: "hard"
  },
  {
    name: "No Gambling",
    category: "compulsive-behaviors",
    tags: ["betting", "casino", "lottery", "recovery", "finances"],
    description: "Track abstinence from gambling activities",
    difficulty: "hard"
  },
  {
    name: "Mindful Eating",
    category: "health-positive",
    tags: ["binge eating", "emotional eating", "nutrition", "awareness"],
    description: "Practice awareness during meals, avoid distractions",
    difficulty: "medium",
    replacementFor: "Binge eating"
  },
  {
    name: "No Nail Biting",
    category: "compulsive-behaviors",
    tags: ["body-focused", "habits", "anxiety", "stress management"],
    description: "Track and reduce nail biting behavior",
    difficulty: "medium"
  },
  {
    name: "Phone-Free Time",
    category: "compulsive-behaviors",
    tags: ["digital detox", "screen time", "technology", "mindfulness"],
    description: "Dedicated daily time without phone use",
    difficulty: "medium",
    replacementFor: "Phone addiction"
  },

  // Mental wellbeing habits
  {
    name: "Daily Meditation",
    category: "mental-wellbeing",
    tags: ["mindfulness", "relaxation", "stress reduction", "mental health"],
    description: "Regular meditation practice for mental clarity",
    difficulty: "medium",
    replacementFor: "Anxiety spiraling"
  },
  {
    name: "Gratitude Journal",
    category: "mental-wellbeing",
    tags: ["positivity", "reflection", "mental health", "wellbeing"],
    description: "Write down things you're grateful for each day",
    difficulty: "easy"
  },
  {
    name: "Stress Management",
    category: "mental-wellbeing",
    tags: ["coping skills", "relaxation", "mental health", "self-care"],
    description: "Practice healthy stress management techniques daily",
    difficulty: "medium"
  },
  {
    name: "Sleep Hygiene",
    category: "health-positive",
    tags: ["sleep", "rest", "recovery", "health", "routine"],
    description: "Maintain a consistent sleep schedule and habits",
    difficulty: "medium"
  },

  // Physical health habits
  {
    name: "Daily Exercise",
    category: "physical-activity",
    tags: ["fitness", "movement", "health", "strength", "cardio"],
    description: "Regular physical activity of any kind",
    difficulty: "medium"
  },
  {
    name: "Hydration",
    category: "health-positive",
    tags: ["water", "drinking", "health", "basics"],
    description: "Track daily water intake",
    difficulty: "easy"
  },
  {
    name: "Nutrition Goals",
    category: "health-positive",
    tags: ["food", "eating", "health", "diet"],
    description: "Track adherence to nutritional goals or plans",
    difficulty: "medium"
  },
  {
    name: "Step Count",
    category: "physical-activity",
    tags: ["walking", "movement", "fitness", "activity"],
    description: "Track daily steps for increased activity",
    difficulty: "easy"
  },

  // Recovery-oriented habits
  {
    name: "Trigger Awareness",
    category: "substances-recovery",
    tags: ["mindfulness", "recovery", "prevention", "self-awareness"],
    description: "Identify and track exposure to addiction triggers",
    difficulty: "hard"
  },
  {
    name: "Urge Surfing",
    category: "substances-recovery",
    tags: ["coping skill", "recovery", "technique", "mindfulness"],
    description: "Practice the technique of riding out cravings",
    difficulty: "hard"
  },
  {
    name: "Recovery Reading",
    category: "substances-recovery",
    tags: ["education", "support", "literature", "growth"],
    description: "Spend time reading recovery-related material",
    difficulty: "easy"
  },
  {
    name: "Check-in With Sponsor",
    category: "substances-recovery",
    tags: ["support", "accountability", "recovery", "connection"],
    description: "Regular communication with recovery sponsor or mentor",
    difficulty: "medium"
  }
];

export function searchHabits(query: string): HabitSuggestion[] {
  if (!query || query.trim() === '') return [];
  
  const lowerQuery = query.toLowerCase().trim();
  
  return HABIT_SUGGESTIONS.filter(habit => {
    // Check name
    if (habit.name.toLowerCase().includes(lowerQuery)) return true;
    
    // Check tags
    if (habit.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
    
    // Check category
    if (CATEGORIES[habit.category].label.toLowerCase().includes(lowerQuery)) return true;
    
    // Check description
    if (habit.description?.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
  }).sort((a, b) => {
    // Prioritize matches in the name
    const aNameMatch = a.name.toLowerCase().includes(lowerQuery);
    const bNameMatch = b.name.toLowerCase().includes(lowerQuery);
    
    if (aNameMatch && !bNameMatch) return -1;
    if (!aNameMatch && bNameMatch) return 1;
    
    return 0;
  });
}
