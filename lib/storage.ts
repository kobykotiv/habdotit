import { Task, Event, Asset, Template, AnalyticsData } from './types';

const STORAGE_KEYS = {
  TASKS: 'app_tasks',
  EVENTS: 'app_events',
  ASSETS: 'app_assets',
  TEMPLATES: 'app_templates',
  ANALYTICS: 'app_analytics',
} as const;

class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private getItem<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, value: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Tasks
  getTasks(): Task[] {
    return this.getItem<Task>(STORAGE_KEYS.TASKS);
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.setItem(STORAGE_KEYS.TASKS, tasks);
    this.logEvent({
      id: crypto.randomUUID(),
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      data: { taskId: task.id },
    });
  }

  // Events
  getEvents(): Event[] {
    return this.getItem<Event>(STORAGE_KEYS.EVENTS);
  }

  logEvent(event: Event): void {
    const events = this.getEvents();
    events.push(event);
    this.setItem(STORAGE_KEYS.EVENTS, events);
  }

  // Assets
  getAssets(): Asset[] {
    return this.getItem<Asset>(STORAGE_KEYS.ASSETS);
  }

  addAsset(asset: Asset): void {
    const assets = this.getAssets();
    assets.push(asset);
    this.setItem(STORAGE_KEYS.ASSETS, assets);
    this.logEvent({
      id: crypto.randomUUID(),
      type: 'ASSET_CREATED',
      timestamp: new Date().toISOString(),
      data: { assetId: asset.id },
    });
  }

  // Templates
  getTemplates(): Template[] {
    return this.getItem<Template>(STORAGE_KEYS.TEMPLATES);
  }

  addTemplate(template: Template): void {
    const templates = this.getTemplates();
    templates.push(template);
    this.setItem(STORAGE_KEYS.TEMPLATES, templates);
    this.logEvent({
      id: crypto.randomUUID(),
      type: 'TEMPLATE_CREATED',
      timestamp: new Date().toISOString(),
      data: { templateId: template.id },
    });
  }

  // Analytics
  getAnalytics(): AnalyticsData {
    const events = this.getEvents();
    const tasks = this.getTasks();
    const templates = this.getTemplates();
    const assets = this.getAssets();

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
