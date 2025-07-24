import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

export function GoalsPage() {
  const goals = [
    {
      _id: '1',
      title: 'Master React Advanced Patterns',
      progress: 75,
      category: 'Learning',
      status: 'active'
    },
    {
      _id: '2',
      title: 'Complete Marathon Training',
      progress: 60,
      category: 'Fitness',
      status: 'active'
    },
    {
      _id: '3',
      title: 'Build Side Project',
      progress: 30,
      category: 'Career',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal._id} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">{goal.title}</h3>
              <Badge variant="secondary">{goal.category}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
