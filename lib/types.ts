export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
}

export interface Event {
  id: string;
  type: string;
  timestamp: string;
  data: any;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  tags: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
  data: string; // Base64 encoded content
}

export interface Template {
  id: string;
  name: string;
  content: string;
  parentId?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  eventCounts: { [key: string]: number };
  taskCompletionRate: number;
  activeTemplates: number;
  totalAssets: number;
}
