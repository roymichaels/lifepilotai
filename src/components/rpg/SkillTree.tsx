import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, Zap } from 'lucide-react';
import { getSkillTree } from '@/api/character';
import { SkillNode } from '@/api/character';
import { useCharacter } from '@/hooks/useCharacter';

export function SkillTree() {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { character } = useCharacter();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkillTree();
        setSkills((response as any).skills);
      } catch (error) {
        console.error('Error fetching skill tree:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const canUnlock = (skill: SkillNode) => {
    if (skill.unlocked) return false;
    if (!character) return false;
    if (character.xp < skill.xpCost) return false;
    
    return skill.prerequisites.every(prereq => 
      character.unlockedSkills.includes(prereq)
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Skill Tree</h3>
        
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                skill.unlocked
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : canUnlock(skill)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    skill.unlocked
                      ? 'bg-green-500 text-white'
                      : canUnlock(skill)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-400 text-gray-600'
                  }`}>
                    {skill.unlocked ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : canUnlock(skill) ? (
                      <Zap className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {skill.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {skill.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant={skill.unlocked ? 'default' : 'secondary'}>
                    {skill.unlocked ? 'Unlocked' : `${skill.xpCost} XP`}
                  </Badge>
                  
                  {canUnlock(skill) && (
                    <Button
                      size="sm"
                      className="mt-2 bg-blue-500 hover:bg-blue-600"
                      onClick={() => {
                        // Handle skill unlock
                        console.log('Unlock skill:', skill.id);
                      }}
                    >
                      Unlock
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
