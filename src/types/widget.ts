export type WidgetType =
  | 'chart'
  | 'progress'
  | 'list'
  | 'metric'
  | 'calendar'
  | 'board'
  | 'project'
  | 'analytics';

export interface WidgetAction {
  label: string;
  action: string;
}

export interface WidgetConfig {
  colors?: string[];
  showProgress?: boolean;
  interactive?: boolean;
  height?: number;
  actions?: WidgetAction[];
}

export interface Widget<T = Record<string, unknown>> {
  id: string;
  type: WidgetType;
  title: string;
  icon?: string;
  data: T[];
  boardType?: 'project' | 'habit' | 'skill' | 'mood' | 'vision' | 'reading' | 'focus';
  chartType?: 'pie' | 'line' | 'radar' | 'bar';
  config?: WidgetConfig;
}

