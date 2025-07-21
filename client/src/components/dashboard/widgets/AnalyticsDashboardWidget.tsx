import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Award,
  Maximize2,
  Activity,
  Users,
  Zap
} from 'lucide-react';
import { useGoalMetrics } from '@/hooks/useGoalMetrics';
import { useMobile } from '@/hooks/useMobile';

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#06B6D4'];

interface AnalyticsDashboardWidgetProps {
  minimal?: boolean;
  onWidgetClick?: (widget: any) => void;
  className?: string;
}

export function AnalyticsDashboardWidget({
  minimal = false,
  onWidgetClick,
  className = ''
}: AnalyticsDashboardWidgetProps) {
  const [showModal, setShowModal] = useState(false);
  const { metrics, isLoading } = useGoalMetrics();
  const isMobile = useMobile();

  const handleWidgetClick = () => {
    if (minimal && onWidgetClick) {
      onWidgetClick({
        id: 'analytics-dashboard',
        type: 'analytics',
        title: 'Analytics Dashboard',
        data: metrics
      });
    } else {
      setShowModal(true);
    }
  };

  // Minimal card view for grid
  if (minimal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-square p-4 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-500/30 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-purple-500/25 hover:shadow-lg"
        onClick={handleWidgetClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <BarChart3 className="w-8 h-8 text-white mb-2" />
        </motion.div>
        <div className="text-sm font-medium text-white text-center leading-tight mb-2">
          Analytics Dashboard
        </div>
        <div className="flex space-x-2 text-xs">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {metrics.totalGoals} goals
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-200">
            {metrics.overallCompletion}%
          </Badge>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span className="text-white">Analytics Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-32 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-white">Analytics Dashboard</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModal(true)}
              className="hover:bg-white/10"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{metrics.overallCompletion}%</div>
              <div className="text-xs text-white/60">Overall Progress</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{metrics.completedGoals}</div>
              <div className="text-xs text-white/60">Goals Completed</div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-24 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.weeklyMomentum}>
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            View Full Analytics
          </Button>
        </CardContent>
      </Card>

      {/* Full Analytics Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              <span>Analytics Dashboard</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{metrics.totalGoals}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Goals</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{metrics.completedGoals}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{metrics.overallCompletion}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold">+{metrics.growthTrend}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Growth</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Momentum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={metrics.weeklyMomentum}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#8B5CF6"
                          fill="#8B5CF6"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={metrics.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {metrics.categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {metrics.categoryBreakdown.map((category, index) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {category.value} goals
                          </span>
                        </div>
                        <Progress value={(category.value / metrics.totalGoals) * 100} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-green-500 mb-2">
                        {metrics.overallCompletion}%
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {metrics.completedGoals} of {metrics.totalGoals} goals completed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>This week: +{metrics.completedGoals - metrics.previousCompleted}</span>
                        <span className="text-green-500">↗ {metrics.growthTrend}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.growthOverTime}>
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="progress" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={metrics.weeklyMomentum}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="completed"
                          stroke="#3B82F6"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Daily Tasks</span>
                      <span className="font-bold">
                        {(metrics.weeklyMomentum.reduce((sum, day) => sum + day.completed, 0) / 7).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Best Day</span>
                      <span className="font-bold text-green-500">
                        {metrics.weeklyMomentum.reduce((max, day) =>
                          day.completed > max.completed ? day : max
                        ).day}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Growth Rate</span>
                      <span className="font-bold text-purple-500">+{metrics.growthTrend}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold">Positive Trend</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your goal completion rate has increased by {metrics.growthTrend}% this month.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">Top Category</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {metrics.categoryBreakdown[0]?.name} is your most active category with {metrics.categoryBreakdown[0]?.value} goals.
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold">Weekly Pattern</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You're most productive on {metrics.weeklyMomentum.reduce((max, day) =>
                          day.completed > max.completed ? day : max
                        ).day}s with an average of {Math.max(...metrics.weeklyMomentum.map(d => d.completed))} tasks completed.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold">Focus Area</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consider setting more goals in your least active categories to maintain balance.
                      </p>
                    </div>

                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <span className="font-semibold">Timing</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your productivity peaks mid-week. Schedule important tasks for Tuesday-Thursday.
                      </p>
                    </div>

                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="w-5 h-5 text-pink-500" />
                        <span className="font-semibold">Achievement</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You're on track to exceed your monthly goal completion target by {metrics.growthTrend}%.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}