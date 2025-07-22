import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  Target,
  Heart,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useMobile } from '@/hooks/useMobile';

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

interface ProjectSidebarProps {
  onNewProject: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ProjectSidebar({ onNewProject, isCollapsed, onToggleCollapse }: ProjectSidebarProps) {
  const { projects, activeProject, switchProject } = useProjectStorage();
  const isMobile = useMobile();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleProjectSwitch = (projectId: string) => {
    switchProject(projectId);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Mobile overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile toggle button */}
        <Button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg shadow-lg"
          size="sm"
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
              />

              {/* Sidebar */}
              <motion.div
                className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 to-purple-900 border-r border-white/10 z-50 flex flex-col"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Projects</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileOpen(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* New Project Button */}
                <div className="p-4">
                  <Button
                    onClick={() => {
                      onNewProject();
                      setIsMobileOpen(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>

                {/* Projects List */}
                <div className="flex-1 overflow-y-auto px-4">
                  <div className="space-y-3 pb-4">
                    {projects.map((project) => {
                      const JobIcon = jobIcons[project.character.role as keyof typeof jobIcons] || Crown;
                      const xpProgress = (project.character.xp / project.character.xpToNext) * 100;

                      return (
                        <Card
                          key={project.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            project.id === activeProject?.id
                              ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30'
                              : 'bg-white/5 hover:bg-white/10 border-white/10'
                          }`}
                          onClick={() => handleProjectSwitch(project.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <JobIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate">{project.name}</h3>
                                <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 text-xs">
                                  {project.character.role}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-white/80">Level {project.character.level}</span>
                                <span className="text-white/60">{project.character.xp} XP</span>
                              </div>
                              <Progress value={xpProgress} className="h-2 bg-white/20" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                  <div className="text-xs text-white/60 text-center">
                    {projects.length} project{projects.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop sidebar
  return (
    <motion.div
      className="h-full bg-gradient-to-b from-slate-900 to-purple-900 border-r border-white/10 flex flex-col"
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 projects-header">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-white">Projects</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-white hover:bg-white/10"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* New Project Button */}
      <div className="p-4">
        <Button
          onClick={onNewProject}
          className={`${
            isCollapsed ? 'w-12 h-12 p-0' : 'w-full'
          } bg-purple-600 hover:bg-purple-700 text-white transition-all`}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">New Project</span>}
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-3 pb-4">
          <AnimatePresence>
            {projects.map((project, index) => {
              const JobIcon = jobIcons[project.character.role as keyof typeof jobIcons] || Crown;
              const xpProgress = (project.character.xp / project.character.xpToNext) * 100;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {isCollapsed ? (
                    <div
                      className={`w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center ${
                        project.id === activeProject?.id
                          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                      onClick={() => switchProject(project.id)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <JobIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        project.id === activeProject?.id
                          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                      onClick={() => switchProject(project.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <JobIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{project.name}</h3>
                            <Badge variant="secondary" className="bg-purple-600/50 text-purple-100 text-xs">
                              {project.character.role}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/80">Level {project.character.level}</span>
                            <span className="text-white/60">{project.character.xp} XP</span>
                          </div>
                          <Progress value={xpProgress} className="h-2 bg-white/20" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/60 text-center">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </motion.div>
  );
}