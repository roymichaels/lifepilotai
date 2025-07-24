import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Clock } from 'lucide-react';

export function TasksPage() {
  const tasks = [
    {
      _id: '1',
      title: 'Review React documentation',
      completed: false,
      category: 'Learning',
      estimatedTime: 30
    },
    {
      _id: '2',
      title: 'Complete morning workout',
      completed: true,
      category: 'Fitness',
      estimatedTime: 45
    },
    {
      _id: '3',
      title: 'Write project proposal',
      completed: false,
      category: 'Work',
      estimatedTime: 60
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task._id} className="p-6">
            <div className="flex items-center gap-3">
              <CheckSquare className={`w-5 h-5 ${task.completed ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{task.category}</Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.estimatedTime}min
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
