import React, { useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { toast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';

export function ProactiveTipsToast() {
  const { proactiveTips, refreshProactiveTips } = useChatContext();
  const prevCountRef = useRef(proactiveTips.length);

  useEffect(() => {
    if (proactiveTips.length > prevCountRef.current) {
      const newTips = proactiveTips.slice(prevCountRef.current);
      newTips.forEach((tip) =>
        toast({
          title: 'Proactive Tip',
          description: tip
        })
      );
      prevCountRef.current = proactiveTips.length;
    }
  }, [proactiveTips]);

  const handleRefresh = async () => {
    await refreshProactiveTips();
  };

  return (
    <Button
      onClick={handleRefresh}
      size="icon"
      variant="ghost"
      className="fixed bottom-4 right-4 z-[1001]"
      aria-label="Refresh Tips"
    >
      <RefreshCw className="w-5 h-5" />
    </Button>
  );
}
