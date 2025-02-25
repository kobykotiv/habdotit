export async function requestHealthKitPermissions() {
  if (typeof window !== 'undefined' && 'healthKit' in window) {
    try {
      // @ts-ignore - HealthKit types
      const healthKit = window.healthKit
      await healthKit.requestAuthorization([
        'steps',
        'distance',
        'calories',
        'heart_rate',
        'sleep_analysis'
      ])
      return true
    } catch (error) {
      console.error('HealthKit permission error:', error)
      return false
    }
  }
  return false
}

export async function syncHealthData(habitId: string, date: string) {
  if (typeof window !== 'undefined' && 'healthKit' in window) {
    try {
      // @ts-ignore - HealthKit types
      const healthKit = window.healthKit
      const data = await healthKit.queryWorkouts({
        startDate: new Date(date),
        endDate: new Date(date)
      })
      return data
    } catch (error) {
      console.error('HealthKit sync error:', error)
      return null
    }
  }
  return null
}
