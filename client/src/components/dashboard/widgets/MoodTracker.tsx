import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useMoodData } from '@/api/dashboard';
import { Heart, Smile, Meh, Frown } from 'lucide-react';

const moodIcons = {
  1: Frown,
  2: Meh,
  3: Meh,
  4: Smile,
  5: Smile
};

export function MoodTracker(props: any) {
  const { data: moodData, isLoading } = useMoodData();

  if (isLoading) {
    return (
      <motion.div {...props} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-white/20 rounded"></div>
        </div>
      </motion.div>
    );
  }

  const currentMood = moodData?.[moodData.length - 1]?.mood || 3;
  const MoodIcon = moodIcons[currentMood as keyof typeof moodIcons];

  return (
    <motion.div {...props} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">Mood Tracker</h3>
        </div>
        <div className="flex items-center space-x-2">
          <MoodIcon className="w-6 h-6 text-yellow-400" />
          <span className="text-white text-sm">{currentMood}/5</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="70%">
        <LineChart data={moodData}>
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'white', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            domain={[1, 5]}
            tick={{ fill: 'white', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}