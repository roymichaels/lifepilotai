import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scroll, Target, CheckCircle, Clock, Star } from 'lucide-react';
import { useCharacter } from '@/hooks/useCharacter';
import { Quest } from '@/api/character';

interface QuestLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuestLog({ isOpen, onClose }: QuestLogProps) {
  const { character, completeQuest } = useCharacter();

  if (!character) return null;

  const handleCompleteQuest = async (questId: string) => {
    await completeQuest(questId);
  };

  const QuestCard = ({ quest }: { quest: Quest }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className={`${
        quest.status === 'done' 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-white dark:bg-gray-800'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              {quest.status === 'done' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Target className="w-5 h-5 text-blue-500" />
              )}
              <span>{quest.title}</span>
            </CardTitle>
            <Badge variant={quest.status === 'done' ? 'default' : 'secondary'}>
              +{quest.xpReward} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {quest.description}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
              {quest.category}
            </Badge>
            
            {quest.status === 'active' && (
              <Button
                size="sm"
                onClick={() => handleCompleteQuest(quest.id)}
                className="bg-green-500 hover:bg-green-600"
              >
                Complete Quest
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2">
            <Scroll className="w-6 h-6 text-blue-500" />
            <span>Quest Log</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Active ({character.activeQuests.length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Completed ({character.completedQuests.length})</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <ScrollArea className="h-[400px] pr-4">
              {character.activeQuests.length > 0 ? (
                character.activeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active quests. Chat with Aura to discover new adventures!</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="completed">
            <ScrollArea className="h-[400px] pr-4">
              {character.completedQuests.length > 0 ? (
                character.completedQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No completed quests yet. Start your journey!</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}