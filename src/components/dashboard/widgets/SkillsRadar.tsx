import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { useSkillsData } from '@/api/dashboard';

export function SkillsRadar(props: any) {
  const { data: skillsData, isLoading } = useSkillsData();

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

  return (
    <motion.div {...props} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-64">
      <h3 className="text-lg font-semibold text-white mb-4">Skills Radar</h3>

      <ResponsiveContainer width="100%" height="70%">
        <RadarChart data={skillsData}>
          <PolarGrid stroke="rgba(255,255,255,0.2)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: 'white', fontSize: 12 }} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={{ fill: 'white', fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Current Level"
            dataKey="current"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Target Level"
            dataKey="target"
            stroke="#10B981"
            fill="transparent"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-2 flex justify-center space-x-4 text-xs text-white/80">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-blue-500 inline-block" />
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-green-500 inline-block" />
          <span>Target</span>
        </div>
      </div>
    </motion.div>
  );
}
