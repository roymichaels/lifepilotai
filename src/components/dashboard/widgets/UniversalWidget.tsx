import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import {
  Target, CheckCircle2, Circle, Star, Flame, Calendar, CheckCircle,
  Heart, Smile, Meh, Frown, TrendingUp, Clock, Brain, Trophy,
  Activity, Zap, Users, BookOpen, Coffee, Dumbbell, Kanban
} from 'lucide-react';
import { BoardWidget } from './BoardWidget';
import { ProjectManagerWidget } from './ProjectManagerWidget';
import { ChecklistItem } from '@/components/ui/checklist';

interface WidgetData {
  id: string;
  type: 'chart' | 'progress' | 'list' | 'metric' | 'calendar' | 'board' | 'project';
  chartType?: 'pie' | 'line' | 'radar' | 'bar';
  boardType?: 'project' | 'habit' | 'skill' | 'mood' | 'vision' | 'reading' | 'focus';
  title: string;
  icon?: string;
  data: any[];
  config?: {
    colors?: string[];
    showProgress?: boolean;
    interactive?: boolean;
    height?: number;
    actions?: Array<{
      label: string;
      action: string;
    }>;
  };
}

interface UniversalWidgetProps extends WidgetData {
  onAction?: (action: string, data?: any) => void;
  onWidgetClick?: (widget: any) => void;
  isLoading?: boolean;
  minimal?: boolean;
  className?: string;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#06B6D4'];

const iconMap: { [key: string]: any } = {
  target: Target,
  heart: Heart,
  star: Star,
  flame: Flame,
  calendar: Calendar,
  brain: Brain,
  trophy: Trophy,
  activity: Activity,
  zap: Zap,
  users: Users,
  book: BookOpen,
  coffee: Coffee,
  dumbbell: Dumbbell,
  kanban: Kanban
};

const moodIcons = {
  1: Frown,
  2: Meh,
  3: Meh,
  4: Smile,
  5: Smile
};

export function UniversalWidget({
  id,
  type,
  chartType,
  boardType,
  title,
  icon,
  data,
  config = {},
  onAction,
  onWidgetClick,
  isLoading = false,
  minimal = false,
  className = ''
}: UniversalWidgetProps) {
  const IconComponent = icon ? iconMap[icon] : Target;
  const colors = config.colors || COLORS;
  const height = config.height || 200;

  const handleClick = () => {
    if (minimal && onWidgetClick) {
      // For goal progress widgets, don't open modal by default
      if (id === 'goals-progress') {
        // Just focus on the metrics row instead of opening modal
        return;
      }

      onWidgetClick({
        id,
        type,
        chartType,
        boardType,
        title,
        icon,
        data,
        config
      });
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`aspect-square p-4 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-500/30 rounded-xl shadow-lg animate-pulse ${className}`}
      >
        <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-white/20 rounded"></div>
      </motion.div>
    );
  }

  // Handle project manager type
  if (type === 'project') {
    const cards: ChecklistItem[] = data.map((item: any) => ({
      id: item.id || item._id || Math.random().toString(),
      title: item.title || item.name,
      completed: item.completed || false,
      priority: item.priority,
      description: item.description,
      tags: item.tags
    }));

    return (
      <ProjectManagerWidget
        cards={cards}
        doneCount={data.filter((item: any) => item.completed).length}
        totalCount={data.length}
        onToggle={(id) => onAction?.('toggle', { id })}
        onAddCard={() => onAction?.('add-card')}
        minimal={minimal}
        onWidgetClick={onWidgetClick}
        className={className}
      />
    );
  }

  // Handle board type
  if (type === 'board') {
    return (
      <BoardWidget
        boardType={boardType}
        title={title}
        minimal={minimal}
        onWidgetClick={onWidgetClick}
        className={className}
      />
    );
  }

  // Minimal card view for grid
  if (minimal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-square p-4 bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-500/30 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-purple-500/25 hover:shadow-lg"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {IconComponent && (
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <IconComponent className="w-8 h-8 text-white mb-2" />
          </motion.div>
        )}
        <div className="text-sm font-medium text-white text-center leading-tight">
          {title}
        </div>
      </motion.div>
    );
  }

  const renderChart = () => {
    if (type !== 'chart' || !data.length) return null;

    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height - 50}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height - 50}>
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                tick={{ fill: 'white', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis
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
                dataKey="value"
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height - 50}>
            <RadarChart data={data}>
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
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              {data[0]?.target && (
                <Radar
                  name="Target Level"
                  dataKey="target"
                  stroke={colors[1]}
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height - 50}>
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                tick={{ fill: 'white', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis
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
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const renderProgress = () => {
    if (type !== 'progress' || !data.length) return null;

    return (
      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: height - 50 }}>
        {data.map((item: any, index: number) => (
          <div key={item.id || index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">{item.title || item.name}</span>
              <span className="text-blue-400 text-sm">{item.progress || item.value}%</span>
            </div>
            <Progress value={item.progress || item.value} className="h-2" />
            {item.trend && (
              <div className="flex items-center space-x-1 text-xs text-white/60">
                <TrendingUp className="w-3 h-3" />
                <span>{item.trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderList = () => {
    if (type !== 'list' || !data.length) return null;

    return (
      <div className="space-y-3 overflow-y-auto" style={{ maxHeight: height - 50 }}>
        {data.map((item: any, index: number) => (
          <motion.div
            key={item.id || index}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            whileHover={{ x: 4 }}
          >
            {item.completed !== undefined && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction?.('toggle', item)}
                className="p-0 h-auto hover:bg-transparent"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/40" />
                )}
              </Button>
            )}

            <span className={`text-sm flex-1 ${
              item.completed ? 'text-white/60 line-through' : 'text-white'
            }`}>
              {item.title || item.name}
            </span>

            {item.priority === 'high' && (
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            )}

            {item.category && (
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
            )}

            {item.estimatedTime && (
              <span className="text-xs text-white/60 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.estimatedTime}min
              </span>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderMetric = () => {
    if (type !== 'metric' || !data.length) return null;

    const metric = data[0];
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-white">
          {metric.value}
          {metric.unit && <span className="text-lg text-white/60 ml-1">{metric.unit}</span>}
        </div>
        {metric.description && (
          <p className="text-white/60 text-sm">{metric.description}</p>
        )}
        {metric.trend && (
          <div className="flex items-center justify-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">{metric.trend}</span>
          </div>
        )}
      </div>
    );
  };

  const renderCalendar = () => {
    if (type !== 'calendar' || !data.length) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-400">
              {day}
            </div>
          ))}
          {data.map((day: any, index: number) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * index, type: "spring" }}
              className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-medium ${
                day.completed
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {day.completed ? '✓' : ''}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'chart':
        return renderChart();
      case 'progress':
        return renderProgress();
      case 'list':
        return renderList();
      case 'metric':
        return renderMetric();
      case 'calendar':
        return renderCalendar();
      default:
        return <div className="text-white/60 text-center">No content available</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`widget-card ${className}`}
      style={{ minHeight: `${height + 100}px` }}
    >
      <div className="flex items-center space-x-2 mb-4">
        {IconComponent && (
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <IconComponent className="w-5 h-5 text-blue-400" />
          </motion.div>
        )}
        <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {title}
        </h3>
      </div>

      {renderContent()}

      {config.actions && config.actions.length > 0 && (
        <div className="mt-4 space-y-2">
          {config.actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => onAction?.(action.action)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white hover:scale-105 transition-transform"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
