import * as tf from "@tensorflow/tfjs";
import { Habit } from "./types";
import { NotificationService } from "../src/services/notificationService";

export interface HabitPattern {
  habitId: string;
  habitName: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  dayOfWeek: string;
  consistency: number;
  predictedSuccess: number;
}

export async function analyzeHabitPatterns(
  habits: Habit[]
): Promise<HabitPattern[]> {
  const patterns: HabitPattern[] = [];
  const notificationService = NotificationService.getInstance();
  const notificationsToSchedule = [];

  for (const habit of habits) {
    const timestamps = Object.keys(habit.logs)
      .filter((date) => habit.logs[date])
      .map((date) => new Date(date).getTime());

    if (timestamps.length < 7) continue;

    const features = timestamps.map((ts) => {
      const date = new Date(ts);
      return { day: date.getDay(), hour: date.getHours() };
    });

    try {
      const { timeOfDay, dayOfWeek } = await analyzeHabitData(features);
      const consistency = calculateConsistency(timestamps);
      const predictedSuccess = predictSuccessLikelihood(timestamps);

      patterns.push({
        habitId: habit.id,
        habitName: habit.name,
        timeOfDay,
        dayOfWeek,
        consistency,
        predictedSuccess,
      });

      if (predictedSuccess < 0.5) {
        const preferredTime = getTimeOfDayPreference(timeOfDay);
        notificationsToSchedule.push({
          id: habit.id,
          name: habit.name,
          message: `Time to work on your habit: ${habit.name}`,
        });
      }
    } catch (error) {
      console.error(`Error analyzing habit ${habit.name}:`, error);
    }
  }

  for (const notification of notificationsToSchedule) {
    await notificationService.scheduleNotification(notification);
  }

  return patterns;
}

async function analyzeHabitData(
  features: { day: number; hour: number }[]
): Promise<{
  timeOfDay: "morning" | "afternoon" | "evening";
  dayOfWeek: string;
}> {
  const numClusters = 3;
  const clusters = await performKMeans(features, numClusters);
  const averageHours = clusters.map(
    (hours) => hours.reduce((sum, h) => sum + h, 0) / (hours.length || 1)
  );
  const timeOfDay = determineTimeOfDay(averageHours[0]);
  const dayOfWeek = getDayWithHighestSuccess(features);
  return { timeOfDay, dayOfWeek };
}

async function performKMeans(
  features: { day: number; hour: number }[],
  numClusters: number
): Promise<number[][]> {
  const data = features.map((f) => [f.day, f.hour]);
  const tensorData = tf.tensor2d(data);
  const clusters: number[][] = new Array(numClusters).fill(0).map(() => []);
  const centroids = tf
    .randomUniform([numClusters, 2])
    .arraySync() as number[][];
  const iterations = 10;

  for (let i = 0; i < iterations; i++) {
    const distances = tf.stack(
      centroids.map((c) => tf.sum(tf.square(tensorData.sub(c)), 1))
    );
    const assignments = tf.argMin(distances, 0).arraySync() as number[];

    clusters.forEach((cluster) => (cluster.length = 0));
    assignments.forEach((cluster, idx) => {
      if (clusters[cluster]) {
        clusters[cluster].push(features[idx].hour);
      }
    });

    centroids.forEach((centroid, clusterIndex) => {
      const clusterPoints = data.filter(
        (_, idx) => assignments[idx] === clusterIndex
      );
      if (clusterPoints.length > 0) {
        const average = clusterPoints
          .reduce(
            (sum, point) => [sum[0] + point[0], sum[1] + point[1]],
            [0, 0]
          )
          .map((val) => val / clusterPoints.length);
        centroids[clusterIndex] = average;
      }
    });
  }
  return clusters;
}

function determineTimeOfDay(hour: number): "morning" | "afternoon" | "evening" {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function calculateConsistency(timestamps: number[]): number {
  if (timestamps.length < 2) return 0;
  const intervals = timestamps.slice(1).map((ts, i) => ts - timestamps[i]);
  const avgInterval =
    intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const variance =
    intervals
      .map((interval) => Math.pow(interval - avgInterval, 2))
      .reduce((sum, sq) => sum + sq, 0) / intervals.length;
  const maxVariance = Math.pow(24 * 60 * 60 * 1000, 2);
  return Math.max(0, 1 - variance / maxVariance);
}

function predictSuccessLikelihood(timestamps: number[]): number {
  if (timestamps.length < 7) return 0.5;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    timestamps.some(
      (ts) => ts > now - (i + 1) * oneDay && ts <= now - i * oneDay
    )
  );
  return last7Days.filter(Boolean).length / 7;
}

function getDayWithHighestSuccess(
  features: { day: number; hour: number }[]
): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayCounts = new Array(7).fill(0);
  features.forEach((f) => dayCounts[f.day]++);
  const maxDay = dayCounts.indexOf(Math.max(...dayCounts));
  return days[maxDay];
}

function getTimeOfDayPreference(
  timeOfDay: "morning" | "afternoon" | "evening"
): string {
  return timeOfDay === "morning"
    ? "08:00"
    : timeOfDay === "afternoon"
    ? "13:00"
    : "18:00";
}
