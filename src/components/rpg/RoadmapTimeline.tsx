import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Circle, Lock, Star, Target, Heart, Brain, Zap, Calendar } from 'lucide-react';
import { getRoadmap } from '@/api/roadmap';
import { Milestone } from '@/api/roadmap';
import { useCharacter } from '@/hooks/useCharacter';
import { useMobile } from '@/hooks/useMobile';

const categoryIcons = {
  foundation: Heart,
  planning: Target,
  habits: Calendar,
  development: Brain,
  productivity: Zap
};

export function RoadmapTimeline() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { character } = useCharacter();
  const isMobile = useMobile();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await getRoadmap();
        setMilestones((response as any).milestones);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  if (isLoading) {
    return (
      <div className="roadmap-timeline bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-3">
        <div className="animate-pulse flex space-x-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-10 h-10 bg-white/20 rounded-full flex-shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  const isUnlocked = (milestone: Milestone) => {
    return character && character.level >= milestone.requiredLevel;
  };

  return (
    <div className="roadmap-timeline bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-3">
      <div className="flex items-center space-x-2 mb-3">
        <Star className="w-4 h-4 text-yellow-400" />
        <h3 className="text-white font-semibold text-sm">LifeQuest Roadmap</h3>
      </div>

      <ScrollArea className="w-full">
        <div className="flex space-x-3 pb-2">
          {milestones.map((milestone, index) => {
            const CategoryIcon = categoryIcons[milestone.category as keyof typeof categoryIcons] || Target;
            const unlocked = isUnlocked(milestone);

            return (
              <motion.div
                key={milestone.id}
                className="flex-shrink-0 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Connection line */}
                {index < milestones.length - 1 && (
                  <div className="absolute top-5 left-10 w-6 h-0.5 bg-white/20"></div>
                )}

                <div className="flex flex-col items-center space-y-1 w-12">
                  {/* Milestone node - reduced size */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      milestone.completed
                        ? 'bg-green-500 border-green-400 shadow-md shadow-green-500/50'
                        : unlocked
                        ? 'bg-blue-500 border-blue-400 shadow-md shadow-blue-500/50 cursor-pointer hover:scale-110'
                        : 'bg-gray-600 border-gray-500 opacity-50'
                    }`}
                    whileHover={unlocked ? { scale: 1.1 } : {}}
                    whileTap={unlocked ? { scale: 0.95 } : {}}
                  >
                    {milestone.completed ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : unlocked ? (
                      <CategoryIcon className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </motion.div>

                  {/* Milestone info - smaller text */}
                  {!isMobile && (
                    <div className="text-center">
                      <div className="text-xs text-white font-medium truncate w-12 leading-tight">
                        {milestone.title}
                      </div>
                    </div>
                  )}

                  {/* Reward badge - smaller */}
                  <Badge
                    variant={milestone.completed ? 'default' : 'secondary'}
                    className="text-xs px-1 py-0 h-4 bg-gray-800 text-gray-300"
                  >
                    +{milestone.xpReward}
                  </Badge>

                  {/* Level requirement - smaller */}
                  <div className="text-xs text-white/60">
                    Lv.{milestone.requiredLevel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
