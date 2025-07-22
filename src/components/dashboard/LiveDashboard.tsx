import React from 'react';
import { motion } from 'framer-motion';
import { useChatContext } from '@/contexts/ChatContext';
import { UniversalWidget } from './widgets/UniversalWidget';
import { EmptyWidget } from './widgets/EmptyWidget';

interface LiveDashboardProps {
  onWidgetClick?: (widget: any) => void;
}

export function LiveDashboard({ onWidgetClick }: LiveDashboardProps) {
  const { activeWidgets, handleWidgetAction } = useChatContext();

  if (activeWidgets.length === 0) {
    // Show empty state with placeholder widgets
    return (
      <>
        {Array.from({ length: 9 }).map((_, index) => (
          <EmptyWidget key={index} index={index} />
        ))}
      </>
    );
  }

  return (
    <>
      {activeWidgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <UniversalWidget
            {...widget}
            onAction={handleWidgetAction}
            onWidgetClick={onWidgetClick}
            minimal={true}
            className="aspect-square"
          />
        </motion.div>
      ))}
      {/* Fill remaining slots with empty widgets */}
      {Array.from({ length: Math.max(0, 9 - activeWidgets.length) }).map((_, index) => (
        <EmptyWidget key={`empty-${index}`} index={activeWidgets.length + index} />
      ))}
    </>
  );
}