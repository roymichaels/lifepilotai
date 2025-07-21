import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

export function RewardsPage() {
  const achievements = [
    {
      _id: '1',
      title: 'First Steps',
      description: 'Completed your first task',
      icon: '🎯'
    },
    {
      _id: '2',
      title: 'Streak Master',
      description: 'Maintained a 7-day streak',
      icon: '🔥'
    },
    {
      _id: '3',
      title: 'Goal Crusher',
      description: 'Completed 5 goals',
      icon: '🏆'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement._id} className="p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{achievement.title}</h3>
                <p className="text-gray-600">{achievement.description}</p>
              </div>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}