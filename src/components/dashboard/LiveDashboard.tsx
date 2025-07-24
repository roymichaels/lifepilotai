import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useChatContext } from '@/contexts/ChatContext';
import { UniversalWidget } from './widgets/UniversalWidget';
import { EmptyWidget } from './widgets/EmptyWidget';

interface LiveDashboardProps {
  onWidgetClick?: (widget: any) => void;
}

function useResponsiveColumns() {
  const getColumns = () => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  const [columns, setColumns] = useState(getColumns());

  useEffect(() => {
    const handleResize = () => setColumns(getColumns());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
}

export function LiveDashboard({ onWidgetClick }: LiveDashboardProps) {
  const { activeWidgets, handleWidgetAction } = useChatContext();
  const columns = useResponsiveColumns();

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
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
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
    </div>
  );
}
