const isBrowser = typeof window !== 'undefined';

interface HealthKitData {
  steps: number;
  distance: number;
  calories: number;
  heart_rate: number;
  sleep_analysis: any;
}

interface HealthKit {
  requestAuthorization: (permissions: string[]) => Promise<boolean>;
  queryWorkouts: (options: { startDate: Date; endDate: Date }) => Promise<HealthKitData>;
}

declare global {
  interface Window {
    healthKit?: HealthKit;
  }
}

export async function requestHealthKitPermissions() {
  if (!isBrowser || !window.healthKit) {
    return false;
  }

  try {
    const granted = await window.healthKit.requestAuthorization([
      'steps',
      'distance',
      'calories',
      'heart_rate',
      'sleep_analysis'
    ]);
    return granted;
  } catch (error) {
    console.error('HealthKit permission error:', error);
    return false;
  }
}

export async function syncHealthData(habitId: string, date: string) {
  if (!isBrowser || !window.healthKit) {
    return null;
  }

  try {
    const data = await window.healthKit.queryWorkouts({
      startDate: new Date(date),
      endDate: new Date(date)
    });
    return data;
  } catch (error) {
    console.error('HealthKit sync error:', error);
    return null;
  }
}
