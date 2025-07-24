import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crown, Zap, Target, Heart, Sparkles } from 'lucide-react';
import { useCharacter } from '@/hooks/useCharacter';
import { SkillTree } from './SkillTree';

const jobIcons = {
  'Strategist': Crown,
  'Zen Master': Heart,
  'Explorer': Target
};

const jobPerks = {
  'Strategist': '+10% XP on skill-based tasks',
  'Zen Master': '+15% XP on habit completion',
  'Explorer': '+20% XP on creative projects'
};

export function CharacterSheet() {
  const { character, isLoading, xpAnimation, levelUpAnimation } = useCharacter();
  const [showFullSheet, setShowFullSheet] = useState(false);

  if (isLoading || !character) {
    return (
      <div className="character-sheet-mini bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-2"></div>
        <div className="h-4 bg-white/20 rounded"></div>
      </div>
    );
  }

  const JobIcon = jobIcons[character.currentJob];
  const xpProgress = (character.xp / character.xpToNext) * 100;

  return (
    <>
      {/* Mini Character Sheet */}
      <motion.div
        className="character-sheet-mini bg-gradient-to-br from-purple-800/30 to-indigo-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-3 cursor-pointer"
        onClick={() => setShowFullSheet(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              animate={levelUpAnimation ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <JobIcon className="w-5 h-5 text-white" />
            </motion.div>
            {levelUpAnimation && (
              <motion.div
                className="absolute inset-0 bg-yellow-400 rounded-full"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">Lv.{character.level}</span>
              <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 text-xs">
                {character.currentJob}
              </Badge>
            </div>
            
            <div className="mt-1">
              <Progress value={xpProgress} className="h-2 bg-white/20" />
              <div className="text-xs text-white/60 mt-1">
                {character.xp}/{character.xpToNext} XP
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* XP Animation */}
      <AnimatePresence>
        {xpAnimation && (
          <motion.div
            className="fixed top-20 left-4 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ duration: 2 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              +{xpAnimation.amount} XP
              <div className="text-xs opacity-80">{xpAnimation.source}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Character Sheet Modal */}
      <Dialog open={showFullSheet} onOpenChange={setShowFullSheet}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Character Sheet
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Character Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <JobIcon className="w-6 h-6 text-purple-500" />
                  <span>{character.currentJob}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
                    <div className="text-2xl font-bold">{character.level}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                    <div className="text-2xl font-bold">{character.xp} XP</div>
                    <Progress value={xpProgress} className="mt-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      {character.xpToNext - character.xp} XP to next level
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Job Perk</div>
                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {jobPerks[character.currentJob]}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Skill Tree */}
            <SkillTree />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
