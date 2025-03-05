import { Task, Event, Asset, Template, AnalyticsData, Habit } from './types';
import { supabase, isDemoMode } from './supabaseClient';

const STORAGE_KEYS = {
  TASKS: 'app_tasks',
  EVENTS: 'app_events',
  ASSETS: 'app_assets',
  TEMPLATES: 'app_templates',
  ANALYTICS: 'app_analytics',
  HABITS: 'habits',
  PROFILE: 'profile',
  ENTRIES: 'habit_entries',
  SETTINGS: 'settings'
} as const;

class StorageManager {
  private static instance: StorageManager;
  private isDemo: boolean;

  private constructor() {
    this.isDemo = isDemoMode();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private async getFromDemo<T>(key: string): Promise<T[]> {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private async setToDemo<T>(key: string, value: T[]): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  private async getFromSupabase<T>(table: string): Promise<T[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return [];
    }
    return data || [];
  }

  private async setToSupabase<T extends { id: string }>(table: string, value: T): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.from(table).upsert(value);
    if (error) {
      console.error(`Error saving to ${table}:`, error);
    }
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return this.isDemo
      ? this.getFromDemo<Task>(STORAGE_KEYS.TASKS)
      : this.getFromSupabase<Task>('tasks');
  }

  async addTask(task: Task): Promise<void> {
    if (this.isDemo) {
      const tasks = await this.getTasks();
      tasks.push(task);
      await this.setToDemo(STORAGE_KEYS.TASKS, tasks);
    } else {
      await this.setToSupabase('tasks', task);
    }
    
    await this.logEvent({
      id: crypto.randomUUID(),
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      data: { taskId: task.id },
    });
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return this.isDemo
      ? this.getFromDemo<Event>(STORAGE_KEYS.EVENTS)
      : this.getFromSupabase<Event>('events');
  }

  async logEvent(event: Event): Promise<void> {
    if (this.isDemo) {
      const events = await this.getEvents();
      events.push(event);
      await this.setToDemo(STORAGE_KEYS.EVENTS, events);
    } else {
      await this.setToSupabase('events', event);
    }
  }

  // Assets
  async getAssets(): Promise<Asset[]> {
    return this.isDemo
      ? this.getFromDemo<Asset>(STORAGE_KEYS.ASSETS)
      : this.getFromSupabase<Asset>('assets');
  }

  async addAsset(asset: Asset): Promise<void> {
    if (this.isDemo) {
      const assets = await this.getAssets();
      assets.push(asset);
      await this.setToDemo(STORAGE_KEYS.ASSETS, assets);
    } else {
      await this.setToSupabase('assets', asset);
    }
    
    await this.logEvent({
      id: crypto.randomUUID(),
      type: 'ASSET_CREATED',
      timestamp: new Date().toISOString(),
      data: { assetId: asset.id },
    });
  }

  // Templates
  async getTemplates(): Promise<Template[]> {
    return this.isDemo
      ? this.getFromDemo<Template>(STORAGE_KEYS.TEMPLATES)
      : this.getFromSupabase<Template>('templates');
  }

  async addTemplate(template: Template): Promise<void> {
    if (this.isDemo) {
      const templates = await this.getTemplates();
      templates.push(template);
      await this.setToDemo(STORAGE_KEYS.TEMPLATES, templates);
    } else {
      await this.setToSupabase('templates', template);
    }
    
    await this.logEvent({
      id: crypto.randomUUID(),
      type: 'TEMPLATE_CREATED',
      timestamp: new Date().toISOString(),
      data: { templateId: template.id },
    });
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const [events, tasks, templates, assets] = await Promise.all([
      this.getEvents(),
      this.getTasks(),
      this.getTemplates(),
      this.getAssets(),
    ]);

    // Calculate event counts
    const eventCounts = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate task completion rate
    const completedTasks = tasks.filter(task => task.completed).length;
    const taskCompletionRate = tasks.length > 0 ? completedTasks / tasks.length : 0;

    return {
      eventCounts,
      taskCompletionRate,
      activeTemplates: templates.length,
      totalAssets: assets.length,
    };
  }

  // Habits
  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      this.getStorage().setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
      throw new Error('Failed to save habits');
    }
  }

  async getHabits(): Promise<Habit[]> {
    try {
      const habits = this.getStorage().getItem(STORAGE_KEYS.HABITS);
      return habits ? JSON.parse(habits) : [];
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  }

  async deleteHabit(habitId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      try {
        const habits = await this.getHabits();
        const filteredHabits = habits.filter(h => h.id !== habitId);
        await this.saveHabits(filteredHabits);
      } catch (error) {
        console.error('Error deleting habit:', error);
        throw new Error('Failed to delete habit');
      }
    }
  }

  async clearAllData(): Promise<void> {
    if (confirm('WARNING: This will delete all your habit data. This action cannot be undone. Are you sure?')) {
      if (confirm('Last chance: Are you REALLY sure you want to delete all your data?')) {
        try {
          this.getStorage().clear();
        } catch (error) {
          console.error('Error clearing data:', error);
          throw new Error('Failed to clear data');
        }
      }
    }
  }

  async exportData(): Promise<string> {
    try {
      const data = {
        habits: await this.getHabits(),
        profile: this.getStorage().getItem(STORAGE_KEYS.PROFILE),
        entries: this.getStorage().getItem(STORAGE_KEYS.ENTRIES),
        settings: this.getStorage().getItem(STORAGE_KEYS.SETTINGS)
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.habits) {
        throw new Error('Invalid data format');
      }
      
      if (confirm('Importing data will overwrite your existing data. Continue?')) {
        await this.saveHabits(data.habits);
        if (data.profile) {
          this.getStorage().setItem(STORAGE_KEYS.PROFILE, data.profile);
        }
        if (data.entries) {
          this.getStorage().setItem(STORAGE_KEYS.ENTRIES, data.entries);
        }
        if (data.settings) {
          this.getStorage().setItem(STORAGE_KEYS.SETTINGS, data.settings);
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  private getStorage() {
    return window.localStorage;
  }
}

export const storage = StorageManager.getInstance();

export class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async importData(text: string): Promise<void> {
    // Implementation here
  }
}
