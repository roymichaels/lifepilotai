import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { getAchievements } from '@/api/rewards';
import { motion } from 'framer-motion';

export function RewardsModal() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await getAchievements();
        setAchievements((response as any).achievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
