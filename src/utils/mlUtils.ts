interface PredictionInput {
  userId: string;
  habitTitle: string;
  category: string;
  difficulty: number;
  currentHabits: string[];
  successRates: number[];
}

export async function predictSuccessRate(input: PredictionInput): Promise<number> {
  // This is a simplified prediction model
  // In a real implementation, this would use actual ML models
  
  const baseScore = 75; // Start with an optimistic base score
  let adjustedScore = baseScore;
  
  // Adjust based on current habits success rates
  const averageSuccessRate = input.successRates.length > 0
    ? input.successRates.reduce((a, b) => a + b, 0) / input.successRates.length
    : 75;
    
  adjustedScore += (averageSuccessRate - 75) * 0.2;
  
  // Adjust based on difficulty
  adjustedScore -= (input.difficulty - 3) * 5;
  
  // Adjust based on number of current habits
  if (input.currentHabits.length > 5) {
    adjustedScore -= (input.currentHabits.length - 5) * 2;
  }
  
  // Ensure score is between 0 and 100
  return Math.min(Math.max(Math.round(adjustedScore), 0), 100);
}

export async function predictHabitDifficulty(
  habitTitle: string,
  category: string,
  userHistory: { difficulty: number, success: boolean }[]
): Promise<number> {
  // Placeholder for more sophisticated ML-based difficulty prediction
  const defaultDifficulty = 3;
  
  if (userHistory.length === 0) {
    return defaultDifficulty;
  }
  
  const successRate = userHistory.filter(h => h.success).length / userHistory.length;
  const avgDifficulty = userHistory.reduce((sum, h) => sum + h.difficulty, 0) / userHistory.length;
  
  if (successRate > 0.8) {
    return Math.min(avgDifficulty + 1, 5);
  } else if (successRate < 0.4) {
    return Math.max(avgDifficulty - 1, 1);
  }
  
  return Math.round(avgDifficulty);
}
