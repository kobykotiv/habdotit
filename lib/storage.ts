import { Task, Event, Asset, Template, AnalyticsData } from './types';
import { supabase, isDemoMode } from './supabaseClient';

const STORAGE_KEYS = {
  TASKS: 'app_tasks',
  EVENTS: 'app_events',
  ASSETS: 'app_assets',
  TEMPLATES: 'app_templates',
  ANALYTICS: 'app_analytics',
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
}

export const storage = StorageManager.getInstance();
