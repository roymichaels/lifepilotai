import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useValuesData } from '@/api/dashboard';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export function CoreValuesWheel(props: any) {
  const { data: valuesData, isLoading } = useValuesData();

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
      <h3 className="text-lg font-semibold text-white mb-4">Core Values</h3>

      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={valuesData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {valuesData?.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 grid grid-cols-3 gap-1 text-xs text-white/80">
        {valuesData?.map((v: any, idx: number) => (
          <div key={v.name} className="flex items-center space-x-1">
            <span
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span>{v.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
