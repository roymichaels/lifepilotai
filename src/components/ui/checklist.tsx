import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  description?: string;
  tags?: string[];
}

interface ChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  className?: string;
  showPriority?: boolean;
  showTags?: boolean;
  maxHeight?: string;
}

export function Checklist({
  items,
  onToggle,
  className = '',
  showPriority = true,
  showTags = false,
  maxHeight = 'max-h-40'
}: ChecklistProps) {
  return (
    <div className={`space-y-3 overflow-y-auto ${maxHeight} ${className}`}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          whileHover={{ x: 4 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(item.id)}
            className="p-0 h-auto hover:bg-transparent"
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-white/40" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <span className={`text-sm ${
              item.completed ? 'text-white/60 line-through' : 'text-white'
            }`}>
              {item.title}
            </span>
            
            {item.description && (
              <p className="text-xs text-white/50 mt-1 line-clamp-2">
                {item.description}
              </p>
            )}

            {showTags && item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {showPriority && item.priority === 'high' && (
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          )}
        </motion.div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No items yet</p>
        </div>
      )}
    </div>
  );
}
