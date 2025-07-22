import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Target, TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { useGoalMetrics } from '@/hooks/useGoalMetrics';
import { useMobile } from '@/hooks/useMobile';

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

interface GoalMetricsRowProps {
  onViewMore?: () => void;
}

export function GoalMetricsRow({ onViewMore }: GoalMetricsRowProps) {
  const { metrics, isLoading } = useGoalMetrics();
  const isMobile = useMobile();

  if (isLoading) {
    return (
      <div className="analytics-grid grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="analytics-card aspect-square w-full rounded-xl bg-gradient-to-br from-black/20 to-white/10 animate-pulse">
            <CardContent className="p-4 h-full flex flex-col justify-center items-center">
              <div className="h-3 bg-white/20 rounded w-1/2 mb-4"></div>
              <div className="h-12 w-12 bg-white/20 rounded-full mb-4"></div>
              <div className="h-2 bg-white/20 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="analytics-grid grid grid-cols-4 gap-3 px-4">
      {/* Overall Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="analytics-card aspect-square w-full rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-purple-500/30 shadow-lg hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-2 sm:p-4 h-full flex flex-col items-center justify-between">
            <h3 className="text-sm sm:text-lg font-semibold text-white">Overall</h3>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16">
                  <PieChart width={isMobile ? 48 : 64} height={isMobile ? 48 : 64}>
                    <Pie
                      data={[
                        { value: metrics.overallCompletion },
                        { value: 100 - metrics.overallCompletion }
                      ]}
                      cx="50%"
                      cy="50%"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={isMobile ? 15 : 20}
                      outerRadius={isMobile ? 22 : 30}
                      dataKey="value"
                    >
                      <Cell fill="#8B5CF6" />
                      <Cell fill="rgba(255,255,255,0.1)" />
                    </Pie>
                  </PieChart>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {metrics.overallCompletion}%
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-300 text-center">
              {metrics.completedGoals} of {metrics.totalGoals} goals
              <br />
              <span className="text-xs text-purple-400">
                +{metrics.completedGoals - metrics.previousCompleted} this week
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Momentum */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="analytics-card aspect-square w-full rounded-xl bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm border border-blue-500/30 shadow-lg hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-2 sm:p-4 h-full flex flex-col items-center justify-between">
            <h3 className="text-sm sm:text-lg font-semibold text-white">Weekly</h3>

            <div className="flex-1 flex items-center justify-center w-full">
              <div className="w-2/3 h-2/3">
                <LineChart
                  width={isMobile ? 60 : 80}
                  height={isMobile ? 45 : 60}
                  data={metrics.weeklyMomentum}
                >
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 2, fill: '#3B82F6' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '10px'
                    }}
                    labelFormatter={(label) => `Day ${label}`}
                    formatter={(value) => [`${value}`, 'Tasks']}
                  />
                </LineChart>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-300 text-center">
              Momentum Trend
              <br />
              <span className="text-xs text-blue-400">
                {metrics.weeklyMomentum.reduce((sum, day) => sum + day.completed, 0)} tasks this week
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="analytics-card aspect-square w-full rounded-xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-green-500/30 shadow-lg hover:shadow-green-500/25 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-2 sm:p-4 h-full flex flex-col items-center justify-between">
            <h3 className="text-sm sm:text-lg font-semibold text-white">Categories</h3>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16">
                <PieChart width={isMobile ? 48 : 64} height={isMobile ? 48 : 64}>
                  <Pie
                    data={metrics.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 12 : 15}
                    outerRadius={isMobile ? 22 : 30}
                    dataKey="value"
                  >
                    {metrics.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '10px'
                    }}
                  />
                </PieChart>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-300 text-center">
              {metrics.categoryBreakdown.length} categories
              <br />
              <span className="text-xs text-green-400">
                Top: {metrics.categoryBreakdown[0]?.name}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Growth Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="analytics-card aspect-square w-full rounded-xl bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm border border-orange-500/30 shadow-lg hover:shadow-orange-500/25 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-2 sm:p-4 h-full flex flex-col items-center justify-between">
            <h3 className="text-sm sm:text-lg font-semibold text-white">Growth</h3>

            <div className="flex-1 flex items-center justify-center w-full">
              <div className="w-2/3 h-2/3">
                <BarChart
                  width={isMobile ? 60 : 80}
                  height={isMobile ? 45 : 60}
                  data={metrics.growthOverTime}
                >
                  <XAxis
                    dataKey="period"
                    tick={{ fill: 'white', fontSize: isMobile ? 6 : 8 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Bar dataKey="progress" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '10px'
                    }}
                    formatter={(value) => [`${value}%`, 'Progress']}
                  />
                </BarChart>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-300 text-center">
              Progress Trend
              <br />
              <span className={`text-xs ${
                metrics.growthTrend > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {metrics.growthTrend > 0 ? '+' : ''}{metrics.growthTrend}% growth
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}