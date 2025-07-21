import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Sparkles } from 'lucide-react';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { Project, ProjectTemplate } from '@/types/project';

interface OnboardingStep {
  id: string;
  question: string;
  type: 'text' | 'tags' | 'milestones';
  suggestions?: string[];
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  { name: 'Life Dashboard', icon: '🎯', category: 'Personal', suggestedRole: 'Life Strategist', defaultObjective: 'Build a balanced and fulfilling life' },
  { name: 'Business Growth', icon: '📈', category: 'Business', suggestedRole: 'Growth Hacker', defaultObjective: 'Scale revenue and market presence' },
  { name: 'Health Journey', icon: '💪', category: 'Health', suggestedRole: 'Wellness Coach', defaultObjective: 'Achieve optimal physical and mental health' },
  { name: 'Learning Path', icon: '🧠', category: 'Education', suggestedRole: 'Knowledge Seeker', defaultObjective: 'Master new skills and expand expertise' },
  { name: 'Creative Project', icon: '🎨', category: 'Creative', suggestedRole: 'Creative Director', defaultObjective: 'Bring creative vision to life' },
];

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'name',
    question: "What are we calling this project?",
    type: 'text',
  },
  {
    id: 'category',
    question: "Great! Let me suggest some categories for this project:",
    type: 'tags',
    suggestions: ['Growth', 'Research', 'Health', 'Business', 'Creative', 'Learning'],
  },
  {
    id: 'vision',
    question: "In one sentence, what does success look like for this project?",
    type: 'text',
  },
  {
    id: 'metrics',
    question: "How will we measure progress? Think about specific metrics like revenue, hours, habits, or skill levels.",
    type: 'text',
  },
  {
    id: 'milestones',
    question: "Let's break that vision into 3-5 key milestones. What would you like to achieve first?",
    type: 'milestones',
  },
];

interface ProjectOnboardingChatProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (project: Project) => void;
}

export function ProjectOnboardingChat({ isOpen, onClose, onComplete }: ProjectOnboardingChatProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState('');
  const [milestones, setMilestones] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createProject } = useProjectStorage();

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = async () => {
    if (!inputValue.trim() && step.type !== 'tags') return;

    const newResponses = { ...responses };

    if (step.type === 'milestones') {
      newResponses[step.id] = milestones;
    } else {
      newResponses[step.id] = inputValue.trim();
    }

    setResponses(newResponses);
    setInputValue('');

    if (isLastStep) {
      await handleComplete(newResponses);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleComplete = async (finalResponses: Record<string, any>) => {
    setIsProcessing(true);

    // Find matching template or create default
    const template = PROJECT_TEMPLATES.find(t =>
      t.category.toLowerCase() === finalResponses.category?.toLowerCase()
    ) || PROJECT_TEMPLATES[0];

    // Create project from responses
    const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      name: finalResponses.name,
      icon: template.icon,
      category: finalResponses.category || template.category,
      profile: {
        vision: finalResponses.vision,
        metrics: finalResponses.metrics.split(',').map((m: string) => m.trim()),
        objective: finalResponses.vision,
      },
      character: {
        role: template.suggestedRole,
        level: 1,
        xp: 0,
        xpToNext: 100,
        jobPerk: `+10% XP on ${finalResponses.category?.toLowerCase() || 'project'} tasks`,
      },
      milestones: finalResponses.milestones.map((title: string, index: number) => ({
        id: crypto.randomUUID(),
        title,
        description: `Milestone ${index + 1} for ${finalResponses.name}`,
        completed: false,
        xpReward: 50 + (index * 25),
        dependencies: [],
      })),
      widgets: [],
      chatHistory: [],
    };

    const project = createProject(newProject);

    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
      handleReset();
    }, 1500);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setResponses({});
    setInputValue('');
    setMilestones([]);
    setIsProcessing(false);
  };

  const handleTagSelect = (tag: string) => {
    setInputValue(tag);
  };

  const handleAddMilestone = () => {
    if (inputValue.trim()) {
      setMilestones(prev => [...prev, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step.type === 'milestones') {
        handleAddMilestone();
      } else {
        handleNext();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 1001 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
        style={{ 
          zIndex: 1002,
          maxHeight: 'calc(100vh - 8rem - 56px)', // Account for chat bar height
          marginBottom: '56px' // Push modal up above chat bar
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {isProcessing ? (
          <div className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Sparkles className="w-16 h-16 text-purple-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Creating Your Project...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Aura is setting up your personalized workspace
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    New Project Setup
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                  </p>
                </div>
                <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  ×
                </Button>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-900 dark:text-white font-medium">
                      {step.question}
                    </p>
                  </div>
                </div>

                {step.type === 'tags' && step.suggestions && (
                  <div className="flex flex-wrap gap-2">
                    {step.suggestions.map((tag) => (
                      <Button
                        key={tag}
                        variant={inputValue === tag ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleTagSelect(tag)}
                        className="transition-all"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                )}

                {step.type === 'milestones' && (
                  <div className="space-y-3">
                    {milestones.map((milestone, index) => (
                      <Card key={index}>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{index + 1}</Badge>
                            <span className="text-gray-900 dark:text-white">{milestone}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex space-x-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      step.type === 'milestones'
                        ? "Enter a milestone and press Enter to add..."
                        : "Type your response..."
                    }
                    className="flex-1"
                  />

                  {step.type === 'milestones' ? (
                    <Button onClick={handleAddMilestone} disabled={!inputValue.trim()}>
                      Add
                    </Button>
                  ) : (
                    <Button onClick={handleNext} disabled={!inputValue.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Footer - Sticky for milestones step */}
            {step.type === 'milestones' && milestones.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  disabled={milestones.length === 0}
                >
                  Continue with {milestones.length} milestone{milestones.length !== 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}