import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardHeader } from './DashboardHeader';
import { DashboardDrawer } from './DashboardDrawer';
import { LiveDashboard } from './LiveDashboard';
import { FloatingAuraSphere } from './FloatingAuraSphere';
import { BottomChatSection } from './BottomChatSection';
import { EmptyDashboardState } from './EmptyDashboardState';
import { UnifiedPlanChatModal } from './UnifiedPlanChatModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GoalsModal } from './modals/GoalsModal';
import { TasksModal } from './modals/TasksModal';
import { RewardsModal } from './modals/RewardsModal';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { CharacterSheet } from '@/components/rpg/CharacterSheet';
import { RoadmapTimeline } from '@/components/rpg/RoadmapTimeline';
import { QuestLog } from '@/components/rpg/QuestLog';
import { FloatingActionButtons } from '@/components/rpg/FloatingActionButtons';
import { ProjectSidebar } from '@/components/projects/ProjectSidebar';
import { useMobile } from '@/hooks/useMobile';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Target, Heart, Sparkles, Plus } from 'lucide-react';
import { useCharacter } from '@/hooks/useCharacter';
import { SkillTree } from '@/components/rpg/SkillTree';
import { useNavigate } from 'react-router-dom';
import { AuraMemoryService } from '@/services/AuraMemoryService';
import { useElectricSync } from '@/hooks/useElectricSync';

const jobIcons = {
  'Strategist': Crown,
  'Zen Master': Heart,
  'Explorer': Target,
  'Life Strategist': Crown,
  'Growth Hacker': Zap,
  'Wellness Coach': Heart,
  'Knowledge Seeker': Target,
  'Creative Director': Sparkles
};

function AuraLayoutContent() {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<'goals' | 'tasks' | 'rewards' | null>(null);
  const [activeWidget, setActiveWidget] = useState<any>(null);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showFullCharacterSheet, setShowFullCharacterSheet] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planType, setPlanType] = useState<'life' | 'project'>('project');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const { handleWidgetAction } = useChatContext();
  const { character, isLoading, xpAnimation, levelUpAnimation } = useCharacter();
  const { projects, activeProject, isLoading: projectsLoading } = useProjectStorage();
  const isMobile = useMobile();
  const navigate = useNavigate();
  useElectricSync();

  // Auto-open plan modal if no active project - wait for loading to complete
  useEffect(() => {
    console.log("AuraLayout - useEffect triggered:", {
      projectsLoading,
      projectsCount: projects.length,
      activeProject: activeProject?.name,
      isCreatingProject,
      showPlanModal
    });

    // Only make decisions after loading is complete
    if (!projectsLoading) {
      if (projects.length === 0 && !isCreatingProject && !showPlanModal) {
        console.log("AuraLayout - No projects found, showing creation modal");
        setShowPlanModal(true);
      } else if (projects.length > 0 && !activeProject && !isCreatingProject && !showPlanModal) {
        console.log("AuraLayout - Projects exist but no active project, using first project");
        // If we have projects but no active project, we should set the first one as active
        // This will be handled by the useProjectStorage hook
      } else if (activeProject) {
        console.log("AuraLayout - Active project found:", activeProject.name);
        setIsCreatingProject(false);
        setShowPlanModal(false);
      }
    }
  }, [projectsLoading, projects.length, activeProject, isCreatingProject, showPlanModal]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Override widget action handler to open modals
  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'view-goals':
        setActiveModal('goals');
        break;
      case 'view-tasks':
        setActiveModal('tasks');
        break;
      case 'view-rewards':
        setActiveModal('rewards');
        break;
      default:
        handleWidgetAction(action, data);
    }
  };

  const openWidgetModal = (widget: any) => {
    setActiveWidget(widget);
  };

  const closeWidgetModal = () => {
    setActiveWidget(null);
  };

  const handleNewProject = () => {
    console.log("AuraLayout - handleNewProject called");
    setPlanType('project');
    setShowPlanModal(true);
    setIsCreatingProject(true);
  };

  const handlePlanComplete = (result: any) => {
    console.log("AuraLayout - handlePlanComplete called with result:", result);
    setShowPlanModal(false);
    setIsCreatingProject(false);
  };

  if (isLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading your workspace...</div>
      </div>
    );
  }

  // Show empty dashboard state only if no projects exist at all
  if (!projectsLoading && projects.length === 0 && !isCreatingProject && !showPlanModal) {
    console.log("AuraLayout - Showing EmptyDashboardState");
    return (
      <EmptyDashboardState onCreateProject={handleNewProject} />
    );
  }

  const JobIcon = activeProject ? jobIcons[activeProject.character.role as keyof typeof jobIcons] || Crown : Crown;
  const xpProgress = activeProject ? (activeProject.character.xp / activeProject.character.xpToNext) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex">
      {/* Unified Plan Chat Modal */}
      <UnifiedPlanChatModal
        isOpen={showPlanModal}
        onClose={() => {
          setShowPlanModal(false);
          setIsCreatingProject(false);
        }}
        onComplete={handlePlanComplete}
        planType={planType}
      />

      {/* Project Sidebar - Now visible on all screen sizes */}
      <ProjectSidebar
        onNewProject={handleNewProject}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        {/* Mobile Drawer */}
        <DashboardDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />

        {/* Character Banner - only show if we have an active project */}
        {activeProject && (
          <div className="px-4 py-2" style={{ paddingTop: '64px' }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-sm border border-purple-500/30 cursor-pointer hover:bg-gradient-to-r hover:from-purple-900/90 hover:to-indigo-900/90 transition-all duration-300 rounded-xl shadow-lg"
                onClick={() => setShowFullCharacterSheet(true)}
                style={{ background: '#2E0854', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
              >
                <CardContent className="p-3">
                  <div className={`flex items-center ${isMobile && window.innerWidth < 400 ? 'flex-col space-y-2' : 'justify-between'}`}>
                    {/* Left side - Character info */}
                    <div className={`flex items-center ${isMobile && window.innerWidth < 400 ? 'flex-col text-center space-y-2' : 'space-x-3'}`}>
                      <div className="relative">
                        <motion.div
                          className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                          animate={levelUpAnimation ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <JobIcon className="w-5 h-5 text-white" />
                        </motion.div>
                        {levelUpAnimation && (
                          <motion.div
                            className="absolute inset-0 bg-yellow-400 rounded-full"
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 1 }}
                          />
                        )}
                      </div>

                      <div className={isMobile && window.innerWidth < 400 ? 'text-center' : ''}>
                        <div className="flex items-center space-x-2 mb-1">
                          <h2 className="text-lg font-bold text-white">{activeProject.name}</h2>
                          <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 text-xs">
                            {activeProject.character.role}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Crown className="w-3 h-3 text-yellow-400" />
                            <span className="text-white font-medium text-sm">Level {activeProject.character.level}</span>
                          </div>
                          <Badge variant="outline" className="bg-purple-100/10 text-purple-200 border-purple-300/30 text-xs">
                            <Sparkles className="w-2 h-2 mr-1" />
                            {activeProject.character.jobPerk}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Right side - XP Progress */}
                    <div className={`${isMobile && window.innerWidth < 400 ? 'w-full' : 'flex-1 max-w-sm ml-4'}`}>
                      <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="text-white/80">{activeProject.character.xp} XP</span>
                        <span className="text-white/60">{Math.round(xpProgress)}%</span>
                      </div>
                      <Progress
                        value={xpProgress}
                        className="h-2 bg-white/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Widget Grid - Full Width - only show if we have an active project */}
        {activeProject && (
          <main className="px-4 py-4" style={{ paddingBottom: '72px' }}>
            <div className="grid gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-7xl mx-auto">
              <LiveDashboard onWidgetClick={openWidgetModal} />
            </div>

            <FloatingAuraSphere
              onActivate={() => setIsChatExpanded(true)}
            />
          </main>
        )}

        {/* Chat Section - only show if we have an active project */}
        {activeProject && (
          <BottomChatSection
            isExpanded={isChatExpanded}
            onToggle={setIsChatExpanded}
          />
        )}

        {/* Mobile FABs */}
        {isMobile && activeProject && (
          <FloatingActionButtons
            onOpenRoadmap={() => setShowRoadmapModal(true)}
            onOpenQuestLog={() => setShowQuestLog(true)}
          />
        )}

        {/* Desktop FABs */}
        {!isMobile && activeProject && (
          <FloatingActionButtons
            onOpenRoadmap={() => setShowRoadmapModal(true)}
            onOpenQuestLog={() => setShowQuestLog(true)}
          />
        )}

        {/* XP Animation */}
        <AnimatePresence>
          {xpAnimation && (
            <motion.div
              className="fixed left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
              style={{ top: '88px' }}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -50, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.8 }}
              transition={{ duration: 2 }}
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                +{xpAnimation.amount} XP
                <div className="text-xs opacity-80">{xpAnimation.source}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Widget Detail Modal */}
        <AnimatePresence>
          {activeWidget && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeWidgetModal}
              />
              <motion.div
                className="fixed inset-4 md:inset-x-[20%] md:inset-y-[10%] lg:inset-x-[30%] lg:inset-y-[15%] bg-white dark:bg-gray-900 rounded-lg z-50 overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeWidget.title}</h2>
                    <button
                      onClick={closeWidgetModal}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
                    <div className="text-gray-900 dark:text-white space-y-4">
                      {activeWidget.type === 'progress' && activeWidget.data?.map((item: any, index: number) => (
                        <div key={item.id || index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">{item.title || item.name}</span>
                            <span className="text-blue-600 dark:text-blue-400">{item.progress || item.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                              style={{ width: `${item.progress || item.value}%` }}
                            />
                          </div>
                          {item.trend && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.trend}</div>
                          )}
                        </div>
                      ))}
                      {activeWidget.type === 'list' && activeWidget.data?.map((item: any, index: number) => (
                        <div key={item.id || index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
                          {item.completed !== undefined && (
                            <div className={`w-5 h-5 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'} flex items-center justify-center`}>
                              {item.completed && <span className="text-white text-xs">✓</span>}
                            </div>
                          )}
                          <span className={item.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}>
                            {item.title || item.name}
                          </span>
                        </div>
                      ))}
                      {activeWidget.type === 'metric' && activeWidget.data?.[0] && (
                        <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {activeWidget.data[0].value}
                            {activeWidget.data[0].unit && <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">{activeWidget.data[0].unit}</span>}
                          </div>
                          {activeWidget.data[0].description && (
                            <p className="text-gray-600 dark:text-gray-400">{activeWidget.data[0].description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Quest Log */}
        <QuestLog isOpen={showQuestLog} onClose={() => setShowQuestLog(false)} />

        {/* Mobile Roadmap Modal */}
        <Dialog open={showRoadmapModal} onOpenChange={setShowRoadmapModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LifeQuest Roadmap
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Track your progress through the LifePilot journey
              </DialogDescription>
            </DialogHeader>
            <RoadmapTimeline />
          </DialogContent>
        </Dialog>

        {/* Full Character Sheet Modal */}
        <Dialog open={showFullCharacterSheet} onOpenChange={setShowFullCharacterSheet}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Character Sheet
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                View your character details, skills, and progression
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Character Info */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <JobIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeProject?.character.role}</h3>
                      <p className="text-gray-600 dark:text-gray-400">Level {activeProject?.character.level}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeProject?.character.xp} XP</div>
                      <Progress value={xpProgress} className="mt-2" />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activeProject ? activeProject.character.xpToNext - activeProject.character.xp : 0} XP to next level
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Job Perk</div>
                      <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {activeProject?.character.jobPerk}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Tree */}
              <SkillTree />
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Overlays */}
        <Dialog open={activeModal === 'goals'} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Neural Objectives
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Track and manage your life goals
              </DialogDescription>
            </DialogHeader>
            <GoalsModal />
          </DialogContent>
        </Dialog>

        <Dialog open={activeModal === 'tasks'} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Mission Control
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Manage your daily tasks and activities
              </DialogDescription>
            </DialogHeader>
            <TasksModal />
          </DialogContent>
        </Dialog>

        <Dialog open={activeModal === 'rewards'} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Achievement Matrix
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                View your achievements and rewards
              </DialogDescription>
            </DialogHeader>
            <RewardsModal />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function AuraLayout() {
  return (
    <ChatProvider>
      <AuraLayoutContent />
    </ChatProvider>
  );
}