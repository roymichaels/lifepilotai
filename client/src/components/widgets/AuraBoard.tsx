import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreVertical,
  Calendar,
  Clock,
  Tag,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  Mic,
  X
} from 'lucide-react';
import { BoardCard, BoardColumn } from '@/api/boards';
import { useMobile } from '@/hooks/useMobile';
import { useChatContext } from '@/contexts/ChatContext';
import { useCharacter } from '@/hooks/useCharacter';

interface AuraBoardProps<T = BoardCard> {
  columns: BoardColumn[];
  onCardMove: (cardId: string, fromColId: string, toColId: string) => void;
  onAddCard?: (colId: string, afterCardId?: string) => void;
  onEditCard?: (cardId: string) => void;
  onDeleteCard?: (cardId: string) => void;
  compact?: boolean;
  draggable?: boolean;
  className?: string;
  showAIChat?: boolean;
  projectName?: string;
}

export function AuraBoard({
  columns,
  onCardMove,
  onAddCard,
  onEditCard,
  onDeleteCard,
  compact = false,
  draggable = true,
  className = '',
  showAIChat = false,
  projectName = 'Project'
}: AuraBoardProps) {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const [showAddCardChat, setShowAddCardChat] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [aiChatMessage, setAiChatMessage] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{id: string, sender: 'user' | 'aura', content: string}>>([]);
  
  const isMobile = useMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useChatContext();
  const { gainXP } = useCharacter();

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    if (!draggable) return;
    setDraggedCard(cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    if (!draggable) return;
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    if (!draggable || !draggedCard) return;
    e.preventDefault();

    const sourceColumn = columns.find(col =>
      col.cards.some(card => card.id === draggedCard)
    );

    if (sourceColumn && sourceColumn.id !== columnId) {
      onCardMove(draggedCard, sourceColumn.id, columnId);
      
      // Award XP based on column transition
      const targetColumn = columns.find(col => col.id === columnId);
      if (targetColumn?.title.toLowerCase().includes('progress')) {
        await gainXP(10, 'Started Task');
      } else if (targetColumn?.title.toLowerCase().includes('done') || targetColumn?.title.toLowerCase().includes('complete')) {
        await gainXP(25, 'Completed Task');
      }
    }

    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const handleAICardCreation = async (columnId: string) => {
    if (!newCardTitle.trim()) return;

    // Simulate AI enhancement of the card
    const aiResponse = await sendMessage(`Create a project task: ${newCardTitle} for ${projectName}`);
    
    onAddCard?.(columnId);
    setShowAddCardChat(null);
    setNewCardTitle('');
    
    // Award XP for creating a task
    await gainXP(5, 'Created Task');
  };

  const handleAIChatSend = async () => {
    if (!aiChatMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: aiChatMessage
    };

    setAiChatHistory(prev => [...prev, userMessage]);
    setAiChatMessage('');

    // Simulate AI response
    setTimeout(() => {
      const auraResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'aura' as const,
        content: `I can help you with that! Based on your project progress, I suggest focusing on the tasks in your "In Progress" column. Would you like me to create some sub-tasks or prioritize your backlog?`
      };
      setAiChatHistory(prev => [...prev, auraResponse]);
    }, 1000);
  };

  const renderCard = (card: BoardCard, columnId: string) => (
    <motion.div
      key={card.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group cursor-pointer ${draggedCard === card.id ? 'opacity-50' : ''}`}
      draggable={draggable}
      onDragStart={(e) => handleDragStart(e, card.id)}
      onDragEnd={handleDragEnd}
    >
      <Card className="mb-3 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
              {card.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditCard?.(card.id)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteCard?.(card.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {card.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {card.description}
            </p>
          )}

          {card.progress !== undefined && card.progress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{card.progress}%</span>
              </div>
              <Progress value={card.progress} className="h-1" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {card.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1 py-0 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {tag}
                </Badge>
              ))}
              {card.tags && card.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{card.tags.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              {card.estimate && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {card.estimate}h
                </div>
              )}
              {card.dueDate && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(card.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* XP Badge */}
          <div className="mt-2 flex justify-end">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
              +{card.metadata?.xpReward || 15} XP
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAddCardChat = (columnId: string) => (
    <AnimatePresence>
      {showAddCardChat === columnId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center mb-2">
            <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              What's the next milestone for {projectName}?
            </span>
          </div>
          <div className="flex space-x-2">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Describe your task..."
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAICardCreation(columnId)}
            />
            <Button
              size="sm"
              onClick={() => handleAICardCreation(columnId)}
              disabled={!newCardTitle.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Send className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAddCardChat(null)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderColumn = (column: BoardColumn, index: number) => (
    <motion.div
      key={column.id}
      className={`flex-shrink-0 ${isMobile && !compact ? 'w-80' : 'w-72'} ${compact ? 'w-64' : ''}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`h-full bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm border-2 transition-colors ${
        dragOverColumn === column.id ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color || '#6b7280' }}
              />
              <span className="text-gray-900 dark:text-white">{column.title}</span>
              <Badge variant="secondary" className="text-xs bg-white/60 dark:bg-gray-700/60">
                {column.cards.length}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddCardChat(column.id)}
              className="h-6 w-6 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              <Plus className="w-3 h-3 text-purple-600" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4">
          <div
            className="min-h-[200px] space-y-0"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {renderAddCardChat(column.id)}
            
            <AnimatePresence>
              {column.cards.map((card) => renderCard(card, column.id))}
            </AnimatePresence>

            {column.cards.length === 0 && !showAddCardChat && (
              <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-600 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                Drop cards here or click + to add
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // AI Chat Sidebar for full-screen mode
  const renderAIChatSidebar = () => (
    <div className="w-80 bg-gradient-to-b from-purple-50/80 to-blue-50/80 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm border-l border-purple-200 dark:border-purple-700 flex flex-col">
      <div className="p-4 border-b border-purple-200 dark:border-purple-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Aura Assistant</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">AI Project Helper</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {aiChatHistory.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ask me about your project, or I can help you create better tasks!
              </p>
            </div>
          )}
          
          {aiChatHistory.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-purple-200 dark:border-purple-700">
        <div className="flex space-x-2">
          <Input
            value={aiChatMessage}
            onChange={(e) => setAiChatMessage(e.target.value)}
            placeholder="Ask Aura about your project..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleAIChatSend()}
          />
          <Button
            size="sm"
            onClick={handleAIChatSend}
            disabled={!aiChatMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile carousel view
  if (isMobile && compact) {
    const currentColumn = columns[currentColumnIndex];

    return (
      <div className={`aura-board-mobile ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentColumnIndex(Math.max(0, currentColumnIndex - 1))}
            disabled={currentColumnIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {currentColumn?.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentColumnIndex + 1} of {columns.length}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentColumnIndex(Math.min(columns.length - 1, currentColumnIndex + 1))}
            disabled={currentColumnIndex === columns.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {currentColumn && (
          <div className="w-full">
            {renderColumn(currentColumn, 0)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`aura-board flex ${className}`}>
      <ScrollArea className="flex-1">
        <div className="flex space-x-4 p-1 min-w-max">
          {columns.map((column, index) => renderColumn(column, index))}
        </div>
      </ScrollArea>
      
      {showAIChat && renderAIChatSidebar()}
    </div>
  );
}