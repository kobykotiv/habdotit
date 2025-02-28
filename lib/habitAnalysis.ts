import * as tf from '@tensorflow/tfjs';
import { Habit } from './types';

export interface HabitPattern {
  habitId: string;
  habitName: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  dayOfWeek: string;
  consistency: number;
  predictedSuccess: number;
}

export async function analyzeHabitPatterns(habits: Habit[]): Promise<HabitPattern[]> {
  const patterns: HabitPattern[] = [];
  
  for (const habit of habits) {
    const timestamps = Object.keys(habit.logs)
      .filter(date => habit.logs[date])
      .map(date => new Date(date).getTime());
    
    if (timestamps.length < 7) continue; // Skip habits with too few data points

    // Convert timestamps to features (day of week, hour of day)
    const features = timestamps.map(ts => {
      const date = new Date(ts);
      return [
        date.getDay(), // 0-6 for day of week
        date.getHours() // 0-23 for hour of day
      ];
    });

    try {
      // Prepare training data
      const trainingData = tf.tensor2d(features);
      
      // Simple clustering to find patterns
      const numClusters = 3;
      const kmeans = await trainKMeansModel(trainingData, numClusters);
      
      // Get cluster assignments
      const predictions = await kmeans.predict(trainingData) as tf.Tensor;
      const assignments = (await predictions.argMax(-1).array()) as number[];
      
      // Analyze clusters to determine patterns
      const clusters = new Array(numClusters).fill(0).map(() => [] as number[]);
      assignments.forEach((cluster, idx) => {
        clusters[cluster].push(features[idx][1]); // Store hours for each cluster
      });

      // Calculate most common time of day for the habit
      const averageHours = clusters.map(hours => 
        hours.reduce((sum, h) => sum + h, 0) / (hours.length || 1)
      );

      const timeOfDay = determineTimeOfDay(averageHours[0]);
      
      // Calculate consistency score (0-1)
      const consistency = calculateConsistency(timestamps);
      
      // Use recent data to predict future success
      const predictedSuccess = predictSuccessLikelihood(timestamps);

      patterns.push({
        habitId: habit.id,
        habitName: habit.name,
        timeOfDay,
        dayOfWeek: getDayWithHighestSuccess(timestamps),
        consistency,
        predictedSuccess
      });
    } catch (error) {
      console.error(`Error analyzing habit ${habit.name}:`, error);
    }
  }

  return patterns;
}

async function trainKMeansModel(data: tf.Tensor, numClusters: number): Promise<tf.Sequential> {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ units: numClusters, activation: 'softmax', inputShape: [2] })
    ]
  });

  const learningRate = 0.01;
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: 'categoricalCrossentropy'
  });

  // Simple training process
  await model.fit(data, tf.zeros([data.shape[0], numClusters]), {
    epochs: 50,
    verbose: 0
  });

  return model;
}

function determineTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function calculateConsistency(timestamps: number[]): number {
  if (timestamps.length < 2) return 0;
  
  // Calculate average time between completions
  const intervals = timestamps
    .slice(1)
    .map((ts, i) => ts - timestamps[i]);
  
  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const variance = intervals
    .map(interval => Math.pow(interval - avgInterval, 2))
    .reduce((sum, sq) => sum + sq, 0) / intervals.length;
  
  // Convert variance to a 0-1 score (lower variance = higher consistency)
  const maxVariance = Math.pow(24 * 60 * 60 * 1000, 2); // One day squared
  return Math.max(0, 1 - (variance / maxVariance));
}

function predictSuccessLikelihood(timestamps: number[]): number {
  if (timestamps.length < 7) return 0.5;
  
  // Look at the last 7 days
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const last7Days = Array.from({ length: 7 }, (_, i) => 
    timestamps.some(ts => 
      ts > now - (i + 1) * oneDay && 
      ts <= now - i * oneDay
    )
  );
  
  // Calculate success rate
  return last7Days.filter(Boolean).length / 7;
}

function getDayWithHighestSuccess(timestamps: number[]): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = new Array(7).fill(0);
  
  timestamps.forEach(ts => {
    const day = new Date(ts).getDay();
    dayCounts[day]++;
  });
  
  const maxDay = dayCounts.indexOf(Math.max(...dayCounts));
  return days[maxDay];
}
