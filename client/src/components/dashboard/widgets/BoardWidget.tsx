import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Kanban,
  Plus,
  Settings,
  Maximize2,
  Calendar,
  Clock,
  Tag,
  X,
  Sparkles
} from 'lucide-react';
import { AuraBoard } from '../../widgets/AuraBoard';
import { useAuraBoard } from '@/hooks/useAuraBoard';
import { BoardCard } from '@/api/boards';
import { useMobile } from '@/hooks/useMobile';
import { useProjectStorage } from '@/hooks/useProjectStorage';

interface BoardWidgetProps {
  boardType?: 'project' | 'habit' | 'skill' | 'mood' | 'vision' | 'reading' | 'focus';
  title?: string;
  minimal?: boolean;
  onWidgetClick?: (widget: any) => void;
  className?: string;
}

export function BoardWidget({
  boardType = 'project',
  title,
  minimal = false,
  onWidgetClick,
  className = ''
}: BoardWidgetProps) {
  const [showFullBoard, setShowFullBoard] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [newCard, setNewCard] = useState<Partial<BoardCard>>({
    title: '',
    description: '',
    tags: [],
    estimate: 0
  });

  const { boards, isLoading, handleMoveCard, handleAddCard, handleUpdateCard } = useAuraBoard(boardType);
  const { activeProject } = useProjectStorage();
  const isMobile = useMobile();

  const board = boards[0];

  const handleAddCardSubmit = async () => {
    if (!newCard.title?.trim() || !selectedColumn) return;

    await handleAddCard(selectedColumn, {
      ...newCard,
      metadata: { xpReward: 15 }
    });
    setNewCard({ title: '', description: '', tags: [], estimate: 0 });
    setShowAddCard(false);
    setSelectedColumn('');
  };

  const handleWidgetClick = () => {
    if (minimal && onWidgetClick) {
      onWidgetClick({
        id: `board-${boardType}`,
        type: 'board',
        title: title || `${boardType.charAt(0).toUpperCase() + boardType.slice(1)} Board`,
        boardType,
        data: board
      });
    } else {
      setShowFullBoard(true);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className={`aspect-square p-4 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-500/30 rounded-xl shadow-lg animate-pulse ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-white/20 rounded"></div>
          <div className="h-3 bg-white/20 rounded w-3/4"></div>
        </div>
      </motion.div>
    );
  }

  // Minimal card view for grid
  if (minimal) {
    const totalCards = board?.columns.reduce((sum, col) => sum + col.cards.length, 0) || 0;
    const completedCards = board?.columns.find(col =>
      col.title.toLowerCase().includes('done') ||
      col.title.toLowerCase().includes('completed')
    )?.cards.length || 0;

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
          {title || `${boardType.charAt(0).toUpperCase() + boardType.slice(1)} Board`}
        </div>
        <div className="flex space-x-2 text-xs">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {totalCards} cards
          </Badge>
          {completedCards > 0 && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-200">
              {completedCards} done
            </Badge>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Card className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Kanban className="w-5 h-5 text-purple-500" />
              <span>{title || `${boardType.charAt(0).toUpperCase() + boardType.slice(1)} Board`}</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddCard(true)}
                className="hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <Plus className="w-4 h-4 text-purple-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullBoard(true)}
                className="hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <Maximize2 className="w-4 h-4 text-purple-600" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {board ? (
            <AuraBoard
              columns={board.columns}
              onCardMove={handleMoveCard}
              onAddCard={(colId) => {
                setSelectedColumn(colId);
                setShowAddCard(true);
              }}
              onEditCard={(cardId) => {
                console.log('Edit card:', cardId);
              }}
              compact={true}
              projectName={activeProject?.name}
            />
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Kanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No board available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Board Modal - Full Screen */}
      <Dialog open={showFullBoard} onOpenChange={setShowFullBoard}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-2">
              <Kanban className="w-6 h-6 text-purple-600" />
              <span>{title || `${boardType.charAt(0).toUpperCase() + boardType.slice(1)} Manager`}</span>
              {activeProject && (
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  {activeProject.name}
                </Badge>
              )}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullBoard(false)}
              className="hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Board Content */}
          <div className="flex-1 overflow-hidden">
            {board && (
              <AuraBoard
                columns={board.columns}
                onCardMove={handleMoveCard}
                onAddCard={(colId) => {
                  setSelectedColumn(colId);
                  setShowAddCard(true);
                }}
                onEditCard={(cardId) => {
                  console.log('Edit card:', cardId);
                }}
                compact={false}
                showAIChat={true}
                projectName={activeProject?.name || 'Project'}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Card Modal */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>Add New Card</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="card-title">Title</Label>
              <Input
                id="card-title"
                value={newCard.title || ''}
                onChange={(e) => setNewCard(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter card title..."
              />
            </div>

            <div>
              <Label htmlFor="card-description">Description</Label>
              <Textarea
                id="card-description"
                value={newCard.description || ''}
                onChange={(e) => setNewCard(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter card description..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="card-column">Column</Label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {board?.columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="card-estimate">Time Estimate (hours)</Label>
              <Input
                id="card-estimate"
                type="number"
                value={newCard.estimate || 0}
                onChange={(e) => setNewCard(prev => ({ ...prev, estimate: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddCard(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCardSubmit} 
                disabled={!newCard.title?.trim() || !selectedColumn}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}