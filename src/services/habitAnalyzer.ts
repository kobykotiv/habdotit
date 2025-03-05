import { Habit, HabitEntry, HabitStats } from '../types/models';
import { calculateStreak } from '../utils/streakCalculator';

export class HabitAnalyzerService {
  /**
   * Calculate habit statistics based on entries
   */
  calculateHabitStats(habit: Habit, entries: HabitEntry[]): HabitStats {
    const habitEntries = entries.filter(entry => entry.habitId === habit.id);
    const completedEntries = habitEntries.filter(entry => entry.completed);
    
    // Calculate success rate
    const successRate = habitEntries.length > 0 
      ? (completedEntries.length / habitEntries.length) * 100 
      : 0;
    
    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreak(habitEntries);
    
    // Find average completion time
    const completionTimes = completedEntries
      .map(entry => new Date(entry.timestamp))
      .map(date => `${date.getHours()}:${date.getMinutes()}`);
    
    const averageCompletionTime = this.calculateAverageTime(completionTimes);
    
    // Generate pattern insights
    const patternInsights = this.generatePatternInsights(habit, habitEntries);
    
    return {
      habitId: habit.id,
      userId: habit.userId,
      streakCurrent: currentStreak,
      streakLongest: longestStreak,
      totalCompleted: completedEntries.length,
      successRate,
      lastCompletedAt: completedEntries.length > 0 
        ? Math.max(...completedEntries.map(e => e.timestamp))
        : undefined,
      averageCompletionTime,
      patternInsights
    };
  }
  
  /**
   * Generate insights about habit completion patterns
   */
  private generatePatternInsights(habit: Habit, entries: HabitEntry[]): string[] {
    const insights: string[] = [];
    const completedEntries = entries.filter(entry => entry.completed);
    
    if (completedEntries.length < 5) {
      insights.push("Not enough data to generate meaningful insights yet.");
      return insights;
    }
    
    // Find best days
    const daySuccess = this.calculateDaySuccess(completedEntries);
    const bestDay = Object.entries(daySuccess)
      .sort((a, b) => b[1] - a[1])
      .shift();
      
    if (bestDay && bestDay[1] > 0.7) {
      insights.push(`You're most successful at this habit on ${this.getDayName(parseInt(bestDay[0]))}.`);
    }
    
    // Find best time of day
    const timeOfDaySuccess = this.calculateTimeOfDaySuccess(completedEntries);
    const bestTimeOfDay = Object.entries(timeOfDaySuccess)
      .sort((a, b) => b[1] - a[1])
      .shift();
      
    if (bestTimeOfDay && bestTimeOfDay[1] > 0.7) {
      insights.push(`You tend to complete this habit most in the ${bestTimeOfDay[0]}.`);
    }
    
    // Detect improvement or decline
    const recentTrend = this.detectRecentTrend(entries);
    if (recentTrend > 0.1) {
      insights.push("You're improving at maintaining this habit recently.");
    } else if (recentTrend < -0.1) {
      insights.push("You've been struggling with this habit recently.");
    }
    
    return insights;
  }
  
  private calculateDaySuccess(entries: HabitEntry[]): Record<number, number> {
    const dayEntries: Record<number, HabitEntry[]> = {};
    
    // Group entries by day of week
    entries.forEach(entry => {
      const day = new Date(entry.timestamp).getDay();
      if (!dayEntries[day]) dayEntries[day] = [];
      dayEntries[day].push(entry);
    });
    
    // Calculate success rate for each day
    const result: Record<number, number> = {};
    Object.entries(dayEntries).forEach(([day, dayEntries]) => {
      const completedCount = dayEntries.filter(e => e.completed).length;
      result[parseInt(day)] = completedCount / dayEntries.length;
    });
    
    return result;
  }
  
  private calculateTimeOfDaySuccess(entries: HabitEntry[]): Record<string, number> {
    const timeCategories = {
      'morning': [5, 11],   // 5:00 AM - 11:59 AM
      'afternoon': [12, 16], // 12:00 PM - 4:59 PM
      'evening': [17, 21],   // 5:00 PM - 9:59 PM
      'night': [22, 4]       // 10:00 PM - 4:59 AM
    };
    
    const timeEntries: Record<string, HabitEntry[]> = {
      'morning': [],
      'afternoon': [],
      'evening': [],
      'night': []
    };
    
    // Group entries by time of day
    entries.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      
      for (const [timeOfDay, [start, end]] of Object.entries(timeCategories)) {
        if (start <= end) {
          if (hour >= start && hour <= end) {
            timeEntries[timeOfDay].push(entry);
            break;
          }
        } else {
          // Handle night case that spans across midnight
          if (hour >= start || hour <= end) {
            timeEntries[timeOfDay].push(entry);
            break;
          }
        }
      }
    });
    
    // Calculate success rate for each time of day
    const result: Record<string, number> = {};
    Object.entries(timeEntries).forEach(([timeOfDay, entries]) => {
      if (entries.length === 0) return;
      const completedCount = entries.filter(e => e.completed).length;
      result[timeOfDay] = completedCount / entries.length;
    });
    
    return result;
  }
  
  private detectRecentTrend(entries: HabitEntry[]): number {
    if (entries.length < 10) return 0;
    
    // Sort entries by timestamp
    const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    
    // Get first half and second half success rates
    const midpoint = Math.floor(sortedEntries.length / 2);
    const firstHalf = sortedEntries.slice(0, midpoint);
    const secondHalf = sortedEntries.slice(midpoint);
    
    const firstHalfSuccess = firstHalf.filter(e => e.completed).length / firstHalf.length;
    const secondHalfSuccess = secondHalf.filter(e => e.completed).length / secondHalf.length;
    
    return secondHalfSuccess - firstHalfSuccess;
  }
  
  private calculateAverageTime(times: string[]): string | undefined {
    if (times.length === 0) return undefined;
    
    let totalMinutes = 0;
    
    times.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      totalMinutes += hours * 60 + minutes;
    });
    
    const avgMinutes = Math.round(totalMinutes / times.length);
    const hours = Math.floor(avgMinutes / 60);
    const mins = avgMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
  
  private getDayName(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }
}

export default new HabitAnalyzerService();
