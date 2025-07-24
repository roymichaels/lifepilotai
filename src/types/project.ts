import type { ChatHistoryEntry } from './chat';
import type { Widget } from './widget';

export interface Project {
  id: string;
  name: string;
  icon: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    vision: string;
    metrics: string[];
    objective: string;
  };
  character: {
    role: string;
    level: number;
    xp: number;
    xpToNext: number;
    jobPerk: string;
  };
  milestones: ProjectMilestone[];
  widgets: Widget[];
  chatHistory: ChatHistoryEntry[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  deadline?: Date;
  dependencies: string[];
  effortEstimate?: string;
}

export interface ProjectTemplate {
  name: string;
  icon: string;
  category: string;
  suggestedRole: string;
  defaultObjective: string;
}
