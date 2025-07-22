import api from './api';

// A static set of widgets used when OpenAI is unavailable
const fallbackWidgets = [
        {
          id: 'goals-progress',
          type: 'progress',
          title: 'Goal Progress',
          icon: 'target',
          data: [
            { id: 1, title: 'Learn React Advanced Patterns', progress: 75, trend: '+15% this week' },
            { id: 2, title: 'Run 5K in under 25 minutes', progress: 60, trend: '+8% this week' },
            { id: 3, title: 'Read 24 books this year', progress: 45, trend: '+12% this month' },
            { id: 4, title: 'Build side project MVP', progress: 30, trend: '+20% this week' }
          ],
          config: {
            showProgress: true,
            actions: [{ label: 'View All Goals', action: 'view-goals' }]
          }
        },
        {
          id: 'daily-focus',
          type: 'list',
          title: 'Daily Focus',
          icon: 'star',
          data: [
            { id: 1, title: 'Complete project proposal', completed: false, priority: 'high' },
            { id: 2, title: 'Review team feedback', completed: true, priority: 'medium' },
            { id: 3, title: 'Update portfolio website', completed: false, priority: 'medium' },
            { id: 4, title: 'Plan weekend activities', completed: false, priority: 'low' },
            { id: 5, title: 'Call mom', completed: true, priority: 'high' }
          ]
        },
        {
          id: 'analytics-dashboard',
          type: 'analytics',
          title: 'Analytics Dashboard',
          icon: 'activity',
          data: [],
          config: {
            actions: [{ label: 'View Analytics', action: 'view-analytics' }]
          }
        },
        {
          id: 'project-manager',
          type: 'project',
          title: 'Project Manager',
          icon: 'kanban',
          data: [
            { id: 1, title: 'Design system architecture', completed: false, priority: 'high', description: 'Plan the overall system design', tags: ['architecture', 'planning'] },
            { id: 2, title: 'Implement user authentication', completed: true, priority: 'high', description: 'Add login and registration functionality', tags: ['backend', 'security'] },
            { id: 3, title: 'Create dashboard wireframes', completed: false, priority: 'medium', description: 'Design the main dashboard layout', tags: ['design', 'ui'] },
            { id: 4, title: 'Set up CI/CD pipeline', completed: false, priority: 'medium', description: 'Automate deployment process', tags: ['devops', 'automation'] },
            { id: 5, title: 'Write API documentation', completed: true, priority: 'low', description: 'Document all API endpoints', tags: ['documentation'] }
          ],
          config: {
            actions: [{ label: 'View All Tasks', action: 'view-tasks' }]
          }
        },
        {
          id: 'project-board',
          type: 'board',
          boardType: 'project',
          title: 'Project Board',
          icon: 'kanban',
          data: []
        },
        {
          id: 'values-wheel',
          type: 'chart',
          chartType: 'pie',
          title: 'Core Values',
          icon: 'heart',
          data: [
            { name: 'Growth', value: 25 },
            { name: 'Family', value: 20 },
            { name: 'Health', value: 18 },
            { name: 'Creativity', value: 15 },
            { name: 'Adventure', value: 12 },
            { name: 'Service', value: 10 }
          ],
          config: {
            colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1']
          }
        },
        {
          id: 'skills-radar',
          type: 'chart',
          chartType: 'radar',
          title: 'Skills Development',
          icon: 'brain',
          data: [
            { skill: 'Leadership', current: 7, target: 9 },
            { skill: 'Communication', current: 8, target: 9 },
            { skill: 'Technical', current: 6, target: 8 },
            { skill: 'Creativity', current: 5, target: 7 },
            { skill: 'Strategy', current: 6, target: 8 },
            { skill: 'Empathy', current: 8, target: 9 }
          ]
        },
        {
          id: 'mood-tracker',
          type: 'chart',
          chartType: 'line',
          title: 'Mood Tracker',
          icon: 'heart',
          data: [
            { date: 'Mon', value: 4 },
            { date: 'Tue', value: 3 },
            { date: 'Wed', value: 5 },
            { date: 'Thu', value: 4 },
            { date: 'Fri', value: 5 },
            { date: 'Sat', value: 4 },
            { date: 'Sun', value: 4 }
          ],
          config: {
            colors: ['#F59E0B']
          }
        },
        {
          id: 'habit-streaks',
          type: 'list',
          title: 'Habit Streaks',
          icon: 'flame',
          data: [
            { id: 1, name: 'Morning Meditation', streak: 12, target: 7, thisWeek: 6 },
            { id: 2, name: 'Exercise', streak: 8, target: 5, thisWeek: 4 },
            { id: 3, name: 'Read for 30min', streak: 15, target: 7, thisWeek: 7 },
            { id: 4, name: 'Drink 8 glasses water', streak: 5, target: 7, thisWeek: 5 }
          ]
        },
        {
          id: 'weekly-stats',
          type: 'chart',
          chartType: 'bar',
          title: 'Weekly Performance',
          icon: 'activity',
          data: [
            { name: 'Mon', value: 85 },
            { name: 'Tue', value: 92 },
            { name: 'Wed', value: 78 },
            { name: 'Thu', value: 95 },
            { name: 'Fri', value: 88 },
            { name: 'Sat', value: 76 },
            { name: 'Sun', value: 82 }
          ]
        },
        {
          id: 'focus-time',
          type: 'metric',
          title: 'Focus Time Today',
          icon: 'clock',
          data: [
            {
              value: 4.5,
              unit: 'hours',
              description: 'Deep work sessions completed',
              trend: '+30% vs yesterday'
            }
          ]
        },
        // Additional board widgets
        {
          id: 'habit-board',
          type: 'board',
          boardType: 'habit',
          title: 'Habit Builder',
          icon: 'kanban',
          data: []
        },
        {
          id: 'skill-board',
          type: 'board',
          boardType: 'skill',
          title: 'Skill Roadmap',
          icon: 'kanban',
          data: []
        },
        {
          id: 'mood-board',
          type: 'board',
          boardType: 'mood',
          title: 'Mood Board',
          icon: 'kanban',
          data: []
        }
      ];

export const generateWidgets = async (
  context: string,
  activeWidgets: string[] = []
) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (apiKey) {
    try {
      const body = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are Aura, an assistant that suggests dashboard widgets based on the user\'s context. Return JSON with a `widgets` array.'
          },
          { role: 'user', content: context }
        ]
      };

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim() || '';

      try {
        const parsed = JSON.parse(content);
        const widgets = Array.isArray(parsed.widgets) ? parsed.widgets : [];
        const filtered = widgets.filter((w: any) => !activeWidgets.includes(w.id));
        return { widgets: filtered };
      } catch (err) {
        console.error('generateWidgets: failed to parse AI response', err);
      }
    } catch (err) {
      console.error('generateWidgets: OpenAI request failed', err);
    }
  }

  // Keyword fallback
  return new Promise<{ widgets: any[] }>((resolve) => {
    setTimeout(() => {
      const availableWidgets = fallbackWidgets;

      let selectedWidgets: any[] = [];

      const lower = context.toLowerCase();
      if (lower.includes('goal')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'goals-progress'));
      }
      if (lower.includes('skill')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'skills-radar'));
      }
      if (lower.includes('value')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'values-wheel'));
      }
      if (lower.includes('focus') || lower.includes('today')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'daily-focus'));
      }
      if (lower.includes('mood') || lower.includes('feel')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'mood-tracker'));
      }
      if (lower.includes('habit')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'habit-streaks'));
      }
      if (lower.includes('performance') || lower.includes('week')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'weekly-stats'));
      }
      if (lower.includes('time') || lower.includes('productivity')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'focus-time'));
      }
      if (lower.includes('analytics') || lower.includes('dashboard') || lower.includes('metrics')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'analytics-dashboard'));
      }
      if (lower.includes('project') || lower.includes('task') || lower.includes('manage')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'project-manager'));
      }
      if (lower.includes('board') || lower.includes('kanban')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'project-board'));
      }
      if (lower.includes('habit') && (lower.includes('board') || lower.includes('track'))) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'habit-board'));
      }
      if (lower.includes('skill') && (lower.includes('board') || lower.includes('roadmap'))) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'skill-board'));
      }
      if (lower.includes('mood') && lower.includes('board')) {
        selectedWidgets.push(availableWidgets.find((w) => w.id === 'mood-board'));
      }

      if (selectedWidgets.length === 0) {
        selectedWidgets = [
          availableWidgets.find((w) => w.id === 'goals-progress'),
          availableWidgets.find((w) => w.id === 'daily-focus'),
          availableWidgets.find((w) => w.id === 'analytics-dashboard')
        ];
      }

      selectedWidgets = selectedWidgets
        .filter(Boolean)
        .filter((widget) => !activeWidgets.includes(widget.id));

      resolve({ widgets: selectedWidgets });
    }, 800);
  });
};

// Description: Update widgets with new data based on chat context
// Endpoint: POST /widgets/update
// Request: { context: string, widgets: WidgetData[] }
// Response: { widgets: WidgetData[] }
export const updateWidgets = async (context: string, widgets: any[]) => {
  return new Promise<{ widgets: any[] }>((resolve) => {
    setTimeout(() => {
      const lower = context.toLowerCase();
      const updated = widgets.map((w) => {
        if (w.id === 'goals-progress' && lower.includes('goal')) {
          return {
            ...w,
            data: w.data.map((g: any) => ({
              ...g,
              progress: Math.min(100, g.progress + 5)
            }))
          };
        }
        if (w.id === 'habit-streaks' && lower.includes('habit')) {
          return {
            ...w,
            data: w.data.map((h: any) => ({
              ...h,
              streak: h.streak + 1
            }))
          };
        }
        if (w.id === 'mood-tracker' && lower.includes('mood')) {
          const mood = Math.max(1, Math.min(5, Math.round(Math.random() * 5)));
          return { ...w, data: [...w.data.slice(1), { date: 'Today', mood }] };
        }
        return w;
      });
      resolve({ widgets: updated });
    }, 300);
  });
};