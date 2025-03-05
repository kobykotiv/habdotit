import { Habit, HabitEntry, HabitRecommendation, HabitStats } from '../types/models';

interface PredictionInput {
    userId: string;
    habitTitle: string;
    category: string;
    difficulty: number;
    currentHabits: string[];
    successRates: number[];
}

export async function predictSuccessRate(input: PredictionInput): Promise<number> {
    // Simplified prediction logic - in a real app, this would use ML
    const baseRate = 70;
    const difficultyImpact = (5 - input.difficulty) * 5;
    const habitCount = input.currentHabits.length;
    const averageSuccess = input.successRates.reduce((a, b) => a + b, 0) / input.successRates.length || 0;

    return Math.min(95, Math.max(30, baseRate + difficultyImpact + (habitCount * 2) + (averageSuccess - 50)));
}

export class RecommendationsGeneratorService {
    private generateId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    private readonly habitCategories = [
        { 
            name: 'health',
            habits: [
                'Daily exercise',
                'Drink water',
                'Meditation',
                'Take vitamins',
                'Track meals',
                'Morning stretch',
                'Walk 10000 steps',
                'Sleep 8 hours',
                'Balanced breakfast',
                'Take lunch break',
                'Evening workout',
                'Track water intake',
                'Meal prep',
                'Stand every hour',
                'Healthy snacks'
            ]
        },
        { 
            name: 'productivity',
            habits: [
                'Journal writing',
                'Set daily goals',
                'Time blocking',
                'Read for 30 mins',
                'Morning planning',
                'Email management',
                'Task prioritization',
                'Focus sessions',
                'Weekly review',
                'Digital declutter',
                'Inbox zero',
                'Project tracking',
                'Daily retrospective',
                'Schedule tomorrow',
                'Break timer'
            ]
        },
        { 
            name: 'learning',
            habits: [
                'Learn new language',
                'Practice skills',
                'Take online course',
                'Read educational content',
                'Watch tutorials',
                'Code practice',
                'Study session',
                'Write blog post',
                'Teach someone',
                'Review notes',
                'Research topic',
                'Summarize learning',
                'Problem solving',
                'Read technical book',
                'Join study group'
            ]
        },
        { 
            name: 'mental health',
            habits: [
                'Gratitude journaling',
                'Mindfulness practice',
                'Social connections',
                'Screen-free time',
                'Deep breathing',
                'Nature walk',
                'Call friend',
                'Self reflection',
                'Positive affirmations',
                'Stress management',
                'Digital sunset',
                'Hobby time',
                'Music break',
                'Art therapy',
                'Meditation session'
            ]
        },
        {
            name: 'addiction recovery',
            habits: [
                'Check-in with sponsor',
                'Attend support group',
                'Practice urge surfing',
                'Trigger journaling',
                'Daily reflection',
                'Recovery reading',
                'Progressive relaxation',
                'Stress tracking',
                'Healthy replacement activity',
                'Call support person',
                'Mindful check-in',
                'Celebrate milestones',
                'Write recovery goals',
                'Practice self-compassion',
                'Environmental changes'
            ]
        },
        {
            name: 'lifestyle',
            habits: [
                'Declutter space',
                'Plant care',
                'Budget tracking',
                'Cook at home',
                'Morning routine',
                'Evening routine',
                'Digital organization',
                'Weekly cleaning',
                'Sustainable practices',
                'Family time',
                'Creative expression',
                'Financial planning',
                'Home maintenance',
                'Community service',
                'Social networking'
            ]
        }
    ];

    private getDifficulty(habitTitle: string): 1 | 2 | 3 | 4 | 5 {
        // Simplified difficulty rating (1-5)
        return Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5;
    }

    async generateRecommendations(
        userId: string,
        currentHabits: Habit[],
        habitEntries: HabitEntry[]
    ): Promise<HabitRecommendation[]> {
        const recommendations: HabitRecommendation[] = [];
        const currentHabitTitles = currentHabits.map(h => h.title);
        const habitStats = this.calculateHabitStats(habitEntries);

        for (const category of this.habitCategories) {
            const availableHabits = category.habits.filter(h => !currentHabitTitles.includes(h));
            
            if (availableHabits.length === 0) continue;

            const selectedHabit = availableHabits[Math.floor(Math.random() * availableHabits.length)];
            const difficulty = this.getDifficulty(selectedHabit);
            
            const successRate = await predictSuccessRate({
                userId,
                habitTitle: selectedHabit,
                category: category.name,
                difficulty,
                currentHabits: currentHabitTitles,
                successRates: habitStats.map(s => s.successRate)
            });

            recommendations.push({
                id: this.generateId(),
                userId,
                title: selectedHabit,
                description: `Recommended based on your current habits and success patterns.`,
                category: category.name,
                estimatedDifficulty: difficulty,
                reasoning: `This habit aligns with your interests in ${category.name} and has a predicted success rate of ${successRate}%.`,
                suggestedFrequency: {
                    type: 'daily',
                    timesPerPeriod: 1
                },
                confidence: successRate,
                basedOnHabits: currentHabitTitles
            });
        }

        return recommendations;
    }

    private calculateHabitStats(entries: HabitEntry[]): HabitStats[] {
        const habitMap = new Map<string, { completed: number; total: number }>();
 
        entries.forEach(entry => {
            const stats = habitMap.get(entry.habitId) || { completed: 0, total: 0 };
            stats.completed += entry.completed ? 1 : 0;
            stats.total += 1;
            habitMap.set(entry.habitId, stats);
        });

        return Array.from(habitMap.entries()).map(([habitId, stats]) => ({
            habitId,
            userId: '', // You might want to pass userId as a parameter
            successRate: (stats.completed / stats.total) * 100,
            streakCurrent: 0, // Add logic to calculate these values
            streakLongest: 0,
            totalCompleted: stats.completed,
            patternInsights: []
        }));
    }
}

export default new RecommendationsGeneratorService();
