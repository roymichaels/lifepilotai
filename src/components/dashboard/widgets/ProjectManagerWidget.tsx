import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Kanban, Plus, CheckCircle, Clock, Maximize2 } from 'lucide-react';
import { Checklist, ChecklistItem } from '@/components/ui/checklist';

interface ProjectManagerWidgetProps {
  cards?: ChecklistItem[];
  doneCount?: number;
  totalCount?: number;
  projectName?: string;
  onToggle?: (id: string) => void;
  onAddCard?: () => void;
  minimal?: boolean;
  onWidgetClick?: (widget: any) => void;
  className?: string;
}

export function ProjectManagerWidget({
  cards = [],
  doneCount = 0,
  totalCount,
  projectName = 'Project',
  onToggle,
  onAddCard,
  minimal = false,
  onWidgetClick,
  className = ''
}: ProjectManagerWidgetProps) {
  const [showModal, setShowModal] = useState(false);
  
  const actualTotalCount = totalCount || cards.length;
  const actualDoneCount = doneCount || cards.filter(card => card.completed).length;
  const pendingCount = actualTotalCount - actualDoneCount;

  const handleToggle = (id: string) => {
    onToggle?.(id);
  };

  const handleWidgetClick = () => {
    if (minimal && onWidgetClick) {
      onWidgetClick({
        id: 'project-manager',
        type: 'project',
        title: 'Project Manager',
        data: { cards, doneCount: actualDoneCount, totalCount: actualTotalCount }
      });
    } else {
      setShowModal(true);
    }
  };

  // Minimal card view for grid
  if (minimal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-square p-4 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-500/30 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-purple-500/25 hover:shadow-lg"
        onClick={handleWidgetClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Kanban className="w-8 h-8 text-white mb-2" />
        </motion.div>
        <div className="text-sm font-medium text-white text-center leading-tight mb-2">
          Project Manager
        </div>
        <div className="flex space-x-2 text-xs">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {actualTotalCount} tasks
          </Badge>
          {actualDoneCount > 0 && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-200">
              {actualDoneCount} done
            </Badge>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Kanban className="w-5 h-5 text-blue-400" />
              <span className="text-white">Project Manager</span>
            </CardTitle>
            <div className="flex space-x-2">
              {onAddCard && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddCard}
                  className="hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 text-white" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(true)}
                className="hover:bg-white/10"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Summary Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white">{actualDoneCount} done</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-white">{pendingCount} pending</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
              {actualTotalCount} total
            </Badge>
          </div>

          {/* Preview of top items */}
          <div className="space-y-2">
            {cards.slice(0, 3).map((card) => (
              <div
                key={card.id}
                className="flex items-center space-x-2 p-2 rounded bg-white/5"
              >
                <div className={`w-2 h-2 rounded-full ${
                  card.completed ? 'bg-green-400' : 'bg-orange-400'
                }`} />
                <span className={`text-sm flex-1 ${
                  card.completed ? 'text-white/60 line-through' : 'text-white'
                }`}>
                  {card.title}
                </span>
              </div>
            ))}
            
            {cards.length > 3 && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(true)}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  +{cards.length - 3} more items
                </Button>
              </div>
            )}

            {cards.length === 0 && (
              <div className="text-center py-4 text-white/60">
                <Kanban className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks yet</p>
                {onAddCard && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAddCard}
                    className="mt-2 text-blue-400 hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add first task
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Project Manager Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2">
              <Kanban className="w-6 h-6 text-blue-500" />
              <span>Project Manager</span>
            </DialogTitle>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {actualDoneCount} Completed
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {pendingCount} Pending
              </Badge>
              <Badge variant="outline">
                {actualTotalCount} Total
              </Badge>
            </div>
          </DialogHeader>

          <div className="mt-6">
            <Checklist
              items={cards}
              onToggle={handleToggle}
              showPriority={true}
              showTags={true}
              maxHeight="max-h-96"
              className="text-gray-900 dark:text-white"
            />
          </div>

          {onAddCard && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={onAddCard}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Task
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
