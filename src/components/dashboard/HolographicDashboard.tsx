import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Target,
  CheckSquare,
  Flame,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Zap,
  Heart,
  Brain,
  Sparkles,
  Gift,
  Settings,
  LogOut,
  User
} from "lucide-react"
import { getUserProfile } from "@/api/user"
import { getGoals } from "@/api/goals"
import { getTasks } from "@/api/tasks"
import { getAchievements, getRewards } from "@/api/rewards"
import { motion } from "framer-motion"
import { LiveMetricsCard } from "@/components/ui/live-metrics-card"
import { AdvancedParticleEffects } from "@/components/ui/advanced-particle-effects"
import { HolographicSphere3D } from "@/components/ui/aura-sphere"
import { GoalsPage } from "@/pages/GoalsPage"
import { TasksPage } from "@/pages/TasksPage"
import { RewardsPage } from "@/pages/RewardsPage"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function HolographicDashboard() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showLevelUpEffect, setShowLevelUpEffect] = useState(false)
  const [activeModal, setActiveModal] = useState<'goals' | 'tasks' | 'rewards' | null>(null)

  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (import.meta.env.DEV)
          console.log('Synchronizing with Aura neural network...')
        const [profileResponse, goalsResponse, tasksResponse, achievementsResponse, rewardsResponse] = await Promise.all([
          getUserProfile(),
          getGoals(),
          getTasks(),
          getAchievements(),
          getRewards()
        ])

        setUserProfile((profileResponse as any).user)
        setGoals((goalsResponse as any).goals)
        setTasks((tasksResponse as any).tasks)
        setAchievements((achievementsResponse as any).achievements)
        setRewards((rewardsResponse as any).rewards)
      } catch (error) {
        console.error('Failed to sync with Aura neural network:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
        <HolographicSphere3D isActive={true} isPulsing={true} size={1.5} />
        <p className="text-gray-400">Synchronizing neural interface with Aura...</p>
        </div>
      </div>
    )
  }

  const todaysTasks = tasks.filter(task => !task.completed).slice(0, 3)
  const completedTasksToday = tasks.filter(task => task.completed).length
  const topGoals = goals.slice(0, 3)
  const recentAchievements = achievements.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      <AdvancedParticleEffects trigger={showLevelUpEffect} type="aurora" color="#8b5cf6" />

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-black/90 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              LifePilot
            </div>
            <div className="text-sm text-gray-400 hidden md:block">
              powered by Aura
            </div>
            {userProfile && (
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  Level {userProfile.level}
                </Badge>
                <Badge variant="outline" className="text-orange-400 border-orange-600/50 bg-orange-900/20">
                  {userProfile.xp} XP
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      {userProfile?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
                <DropdownMenuItem className="hover:bg-gray-800">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden hover:bg-gray-800">
                  <ThemeToggle />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-800">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 p-4 md:p-6 space-y-6 pb-32">
        {/* Enhanced Welcome Section with Aura */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16">
                <HolographicSphere3D isActive={true} isPulsing={false} size={0.8} />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {userProfile?.name || 'Commander'}!
                </h1>
                <p className="text-purple-100 text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Aura has detected a {userProfile?.streak || 0}-day neural enhancement streak!
                </p>
              </div>
            </div>
            <div className="text-right">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="text-3xl font-bold">Neural Level {userProfile?.level || 1}</div>
                <div className="text-purple-100">{userProfile?.xp || 0} Enhancement Points</div>
                <Badge className="mt-2 bg-yellow-400/20 text-yellow-100 border-yellow-300/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Aura Synchronized
                </Badge>
              </motion.div>
            </div>
          </div>

          {/* Animated background elements */}
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ x: [0, -80, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-4 left-4 w-24 h-24 bg-pink-300/20 rounded-full blur-lg"
          />
        </motion.div>

        {/* Enhanced Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <LiveMetricsCard
            title="Neural Streak"
            value={userProfile?.streak || 0}
            previousValue={(userProfile?.streak || 0) - 1}
            unit="days"
            icon={<Flame className="h-6 w-6 text-orange-500" />}
            color="orange"
            isLive={true}
          />

          <LiveMetricsCard
            title="Missions Completed"
            value={completedTasksToday}
            previousValue={completedTasksToday - 1}
            unit={`/${tasks.length}`}
            icon={<CheckSquare className="h-6 w-6 text-green-500" />}
            color="green"
            isLive={true}
          />

          <LiveMetricsCard
            title="Active Objectives"
            value={goals.filter(g => g.status === 'active').length}
            previousValue={goals.filter(g => g.status === 'active').length}
            icon={<Target className="h-6 w-6 text-blue-500" />}
            color="blue"
          />

          <LiveMetricsCard
            title="Enhancement Points"
            value={userProfile?.xp || 0}
            previousValue={(userProfile?.xp || 0) - 50}
            unit="XP"
            icon={<Zap className="h-6 w-6 text-purple-500" />}
            color="purple"
            isLive={true}
          />
        </div>

        {/* Enhanced Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Neural Focus Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white/10 to-gray-900/50 backdrop-blur-xl border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="h-5 w-5 text-purple-500" />
                  </motion.div>
                  Neural Focus Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysTasks.length > 0 ? (
                  todaysTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-700/50"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-purple-300 text-purple-300">
                            {task.category}
                          </Badge>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedTime}min
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <p className="text-gray-400">All neural pathways clear! Mission accomplished!</p>
                  </div>
                )}
                <Button
                  onClick={() => setActiveModal('tasks')}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Neural Command Center
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-white/10 to-gray-900/50 backdrop-blur-xl border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-blue-500" />
                  Mission Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topGoals.map((goal, index) => (
                  <motion.div
                    key={goal._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-white">{goal.title}</p>
                      <span className="text-sm text-gray-400">{goal.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={goal.progress} className="h-3 bg-gray-700" />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-blue-900/30 text-blue-300">
                      {goal.category}
                    </Badge>
                  </motion.div>
                ))}
                <Button
                  onClick={() => setActiveModal('goals')}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Mission Control
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievement Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-white/10 to-gray-900/50 backdrop-blur-xl border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Achievement Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, type: "spring" }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-700/50"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl"
                    >
                      {achievement.icon}
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white">{achievement.title}</p>
                      <p className="text-xs text-gray-400">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => setActiveModal('rewards')}
                  className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Hall of Fame
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Additional Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Neural Habit Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-white/10 to-gray-900/50 backdrop-blur-xl border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Neural Habit Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 7 }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * i, type: "spring" }}
                      className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-medium ${
                        i < 5
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {i < 5 ? '✓' : ''}
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Neural Enhancement</span>
                    <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                      5/7 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Knowledge Absorption</span>
                    <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">
                      7/7 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Mindfulness Protocol</span>
                    <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                      4/7 days
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Biometric Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="bg-gradient-to-br from-white/10 to-gray-900/50 backdrop-blur-xl border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Biometric Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-4 mb-6">
                  {['😢', '😕', '😐', '😊', '😄'].map((emoji, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-3xl p-3 rounded-full transition-all ${
                        index === 3
                          ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 scale-110 shadow-lg'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Neural state assessment
                  </p>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 border-purple-700">
                    Optimal Performance 😊
                  </Badge>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Weekly Trend</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-400">Ascending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modal Overlays */}
      <Dialog open={activeModal === 'goals'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Neural Objectives
            </DialogTitle>
          </DialogHeader>
          <GoalsPage />
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'tasks'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Mission Control
            </DialogTitle>
          </DialogHeader>
          <TasksPage />
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'rewards'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Achievement Matrix
            </DialogTitle>
          </DialogHeader>
          <RewardsPage />
        </DialogContent>
      </Dialog>
    </div>
  )
}
