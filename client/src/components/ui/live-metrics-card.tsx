import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LiveMetricsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  unit?: string;
  icon: React.ReactNode;
  color?: 'orange' | 'green' | 'blue' | 'purple';
  isLive?: boolean;
}

export function LiveMetricsCard({
  title,
  value,
  previousValue,
  unit = '',
  icon,
  color = 'blue',
  isLive = false
}: LiveMetricsCardProps) {
  const colorClasses = {
    orange: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    blue: 'from-blue-500/20 to-purple-500/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
  };

  const trend = previousValue !== undefined ? value - previousValue : 0;
  const isPositive = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl border shadow-2xl`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <p className="text-sm font-medium text-gray-300">{title}</p>
                <div className="flex items-center gap-2">
                  <motion.span
                    key={value}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-white"
                  >
                    {value}
                  </motion.span>
                  <span className="text-sm text-gray-400">{unit}</span>
                </div>
              </div>
            </div>
            {isLive && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-500 rounded-full"
              />
            )}
          </div>
          {previousValue !== undefined && trend !== 0 && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{trend}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}