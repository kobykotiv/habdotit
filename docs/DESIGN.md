# Privacy-First Habit Tracker Design Document

## Core Principles

1. Data Sovereignty: All user data stays on their device using cookies/localStorage
2. No Analytics/Tracking: Remove Carbon ads and analytics components
3. Offline-First: Full functionality without internet connection
4. Zero Data Sharing: No cloud sync or social features
5. Local Export/Backup: Allow users to backup their data as JSON files

## Data Storage

### Habit Data Structure
Utilizing existing types from `types.ts`:
- `Habit`: Core tracking entity
- `HabitLog`: Daily completion records
- `Category`: Habit categorization
- `Achievement`: Local accomplishments

### Storage Implementation
- Remove `supabaseClient.ts` dependency
- Modify `storage.ts` to only use localStorage
- Remove analytics tracking from event logging
- Keep achievement system (runs locally)

## Key Components to Modify

1. Remove from `/components`:
- `CarbonAds.tsx`
- `AnalyticsDashboard.tsx`
- `CookieConsent.tsx` (not needed for essential cookies)

2. Modify `HabitTracker.tsx`:
- Remove analytics/tracking hooks
- Keep core habit management features
- Retain offline-capable streak calculations
- Keep local achievement system

3. Update `sw.js`:
- Keep offline caching
- Remove push notifications (privacy concern)
- Focus on offline availability

4. Modify `constants.ts`:
- Update `DATA_SOVEREIGNTY_MESSAGE`
- Keep categories and frequency options
- Remove analytics-related constants

## Privacy Features

### Data Storage
