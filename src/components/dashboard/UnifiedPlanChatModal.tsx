import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Sparkles, Mic, MicOff } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { useProjectStorage } from '@/hooks/useProjectStorage';

function useOptionalChatContext() {
  try {
    return useChatContext();
  } catch {
    return null;
  }
}
import { Project, ProjectTemplate } from '@/types/project';

interface PlanStep {
  id: string;
  question: string;
  category: string;
  type?: 'text' | 'tags' | 'milestones';
  suggestions?: string[];
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  { name: 'Life Dashboard', icon: '🎯', category: 'Personal', suggestedRole: 'Life Strategist', defaultObjective: 'Build a balanced and fulfilling life' },
  { name: 'Business Growth', icon: '📈', category: 'Business', suggestedRole: 'Growth Hacker', defaultObjective: 'Scale revenue and market presence' },
  { name: 'Health Journey', icon: '💪', category: 'Health', suggestedRole: 'Wellness Coach', defaultObjective: 'Achieve optimal physical and mental health' },
  { name: 'Learning Path', icon: '🧠', category: 'Education', suggestedRole: 'Knowledge Seeker', defaultObjective: 'Master new skills and expand expertise' },
  { name: 'Creative Project', icon: '🎨', category: 'Creative', suggestedRole: 'Creative Director', defaultObjective: 'Bring creative vision to life' },
];

const LIFE_PLAN_STEPS: PlanStep[] = [
  {
    id: 'values',
    question: "Welcome! Let's craft your Life Plan. What's one core value that drives you?",
    category: 'Core Values'
  },
  {
    id: 'vision',
    question: "Great! Now, what does your ideal life look like in 5 years?",
    category: 'Vision'
  },
  {
    id: 'skills',
    question: "What skills do you want to develop or improve?",
    category: 'Skills'
  },
  {
    id: 'rituals',
    question: "What daily habits or rituals would support your growth?",
    category: 'Rituals'
  },
  {
    id: 'short_goals',
    question: "What are your top 3 goals for the next 6 months?",
    category: 'Short-term Goals'
  },
  {
    id: 'long_goals',
    question: "What's your biggest long-term aspiration?",
    category: 'Long-term Vision'
  }
];

const PROJECT_STEPS: PlanStep[] = [
  {
    id: 'name',
    question: "What are we calling this project?",
    type: 'text',
    category: 'Project Name'
  },
  {
    id: 'category',
    question: "Great! Let me suggest some categories for this project:",
    type: 'tags',
    category: 'Category',
    suggestions: ['Growth', 'Research', 'Health', 'Business', 'Creative', 'Learning'],
  },
  {
    id: 'vision',
    question: "In one sentence, what does success look like for this project?",
    type: 'text',
    category: 'Vision'
  },
  {
    id: 'metrics',
    question: "How will we measure progress? Think about specific metrics like revenue, hours, habits, or skill levels.",
    type: 'text',
    category: 'Metrics'
  },
  {
    id: 'milestones',
    question: "Let's break that vision into 3-5 key milestones. What would you like to achieve first?",
    type: 'milestones',
    category: 'Milestones'
  },
];

interface UnifiedPlanChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: any) => void;
  planType: 'life' | 'project';
}

export function UnifiedPlanChatModal({ isOpen, onClose, onComplete, planType }: UnifiedPlanChatModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState('');
  const [milestones, setMilestones] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{id: string, sender: 'user' | 'aura', content: string}>>([]);

  const chatContext = useOptionalChatContext();

  const { createProject } = useProjectStorage();

  const steps = planType === 'life' ? LIFE_PLAN_STEPS : PROJECT_STEPS;
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  // Only log when component state actually changes, not on every render
  useEffect(() => {
    console.log("UnifiedPlanChatModal - State changed:", {
      isOpen,
      currentStep,
      responses: Object.keys(responses),
      milestones: milestones.length
    });
  }, [isOpen, currentStep, Object.keys(responses).length, milestones.length]);

  // Initialize with first question
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      setChatHistory([{
        id: '1',
        sender: 'aura',
        content: currentStepData.question
      }]);
      // Only use setAuraState if chatContext is available
      if (chatContext?.setAuraState) {
        chatContext.setAuraState('speaking');
        setTimeout(() => chatContext.setAuraState('idle'), 2000);
      }
    }
  }, [isOpen, chatHistory.length, currentStepData.question, chatContext]);

  const handleSendMessage = async () => {
    // For milestone step, use the milestones array instead of inputValue
    let responseValue;
    if (currentStepData.type === 'milestones') {
      if (milestones.length === 0) return;
      responseValue = milestones;
    } else {
      if (!inputValue.trim()) return;
      responseValue = inputValue.trim();
    }

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: currentStepData.type === 'milestones' 
        ? `Added ${milestones.length} milestones: ${milestones.join(', ')}`
        : inputValue.trim()
    };

    setChatHistory(prev => [...prev, userMessage]);

    const newResponses = { ...responses, [currentStepData.id]: responseValue };
    setResponses(newResponses);

    setInputValue('');
    if (chatContext?.setAuraState) {
      chatContext.setAuraState('thinking');
    }

    setTimeout(() => {
      if (isLastStep) {
        handleComplete(newResponses);
      } else {
        const nextStep = currentStep + 1;
        const nextQuestion = steps[nextStep];

        const auraResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'aura' as const,
          content: nextQuestion.question
        };

        setChatHistory(prev => [...prev, auraResponse]);
        setCurrentStep(nextStep);
        if (chatContext?.setAuraState) {
          chatContext.setAuraState('speaking');
          setTimeout(() => chatContext.setAuraState('idle'), 2000);
        }
      }
    }, 1500);
  };

  const handleComplete = async (finalResponses: Record<string, any>) => {
    setIsProcessing(true);

    const completionMessage = planType === 'life'
      ? "Perfect! Your Life Plan is complete. I'm now using AI to create your personalized dashboard with everything you need to achieve your goals. Welcome to your journey!"
      : "Excellent! Your project is ready. I'm using AI to enhance your project plan and set up your workspace with all the tools you need to succeed.";

    const auraResponse = {
      id: (Date.now() + 1).toString(),
      sender: 'aura' as const,
      content: completionMessage
    };

    setChatHistory(prev => [...prev, auraResponse]);
    if (chatContext?.setAuraState) {
      chatContext.setAuraState('speaking');
    }

    try {
      // Process with AI first
      console.log('UnifiedPlanChatModal: Processing with AI');
      const { processOnboardingWithAI } = await import('@/api/ai');
      const aiResult = await processOnboardingWithAI(finalResponses, planType);
      
      if (aiResult.success) {
        console.log('UnifiedPlanChatModal: AI processing successful');
        if (planType === 'life') {
          createAIEnhancedLifePlan(aiResult.plan);
        } else {
          createAIEnhancedProjectPlan(aiResult.plan);
        }
        
        if (aiResult.usedFallback) {
          // Show toast that AI was temporarily unavailable
          setTimeout(() => {
            if (window.dispatchEvent) {
              const event = new CustomEvent('showToast', {
                detail: {
                  title: 'AI Processing Unavailable',
                  description: 'Created your plan with standard templates. AI features will be available when service is restored.',
                  variant: 'default'
                }
              });
              window.dispatchEvent(event);
            }
          }, 2000);
        }
      } else {
        throw new Error('AI processing failed');
      }
    } catch (error) {
      console.error('UnifiedPlanChatModal: AI processing failed, using fallback:', error);
      // Fallback to original creation method
      if (planType === 'life') {
        createLifePlan(finalResponses);
      } else {
        createProjectPlan(finalResponses);
      }
      
      // Show toast about fallback
      setTimeout(() => {
        if (window.dispatchEvent) {
          const event = new CustomEvent('showToast', {
            detail: {
              title: 'AI Processing Unavailable',
              description: 'Created your plan with standard templates. AI features will be available when service is restored.',
              variant: 'default'
            }
          });
          window.dispatchEvent(event);
        }
      }, 2000);
    }
  };

  const createAIEnhancedLifePlan = (aiPlan: any) => {
    const lifePlan = {
      name: aiPlan.name || 'My AI-Enhanced Life Plan',
      icon: '🎯',
      category: 'Personal Growth',
      profile: {
        vision: aiPlan.description || 'AI-enhanced life plan',
        metrics: aiPlan.metrics || ['Goals Completed', 'Habits Maintained', 'Skills Developed'],
        objective: aiPlan.insights || 'Live a fulfilling and purposeful life',
      },
      character: {
        role: aiPlan.character?.role || 'Life Strategist',
        level: 1,
        xp: 0,
        xpToNext: 100,
        jobPerk: aiPlan.character?.jobPerk || '+10% XP on personal development tasks',
      },
      milestones: (aiPlan.milestones || []).map((milestone: any, index: number) => ({
        id: crypto.randomUUID(),
        title: milestone.title,
        description: milestone.description,
        completed: false,
        xpReward: milestone.xpReward || (50 + index * 25),
        dependencies: [],
      })),
      widgets: [
        {
          id: 'goals-progress',
          type: 'progress',
          title: 'Goal Progress',
          icon: 'target',
          data: []
        },
        {
          id: 'daily-focus',
          type: 'list',
          title: 'Daily Focus',
          icon: 'star',
          data: aiPlan.dailyHabits ? aiPlan.dailyHabits.map((habit: string) => ({ title: habit, completed: false })) : []
        }
      ],
      chatHistory: [],
      aiInsights: aiPlan.insights,
      dailyHabits: aiPlan.dailyHabits || [],
      weeklyGoals: aiPlan.weeklyGoals || []
    };

    const project = createProject(lifePlan);
    finishCreation(project);
  };

  const createAIEnhancedProjectPlan = (aiPlan: any) => {
    const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      name: aiPlan.name,
      icon: '🚀',
      category: responses.category || 'AI Enhanced',
      profile: {
        vision: aiPlan.description || responses.vision,
        metrics: aiPlan.suggestedMetrics || (responses.metrics ? responses.metrics.split(',').map((m: string) => m.trim()) : []),
        objective: aiPlan.description || responses.vision,
      },
      character: {
        role: aiPlan.character?.role || 'Project Manager',
        level: 1,
        xp: 0,
        xpToNext: 100,
        jobPerk: aiPlan.character?.jobPerk || '+10% XP on project tasks',
      },
      milestones: (aiPlan.enhancedMilestones || []).map((milestone: any) => ({
        id: crypto.randomUUID(),
        title: milestone.title,
        description: milestone.description,
        completed: false,
        xpReward: milestone.xpReward || 75,
        dependencies: milestone.dependencies || [],
      })),
      widgets: [],
      chatHistory: [],
      aiInsights: aiPlan.insights,
      riskFactors: aiPlan.riskFactors || [],
      successTips: aiPlan.successTips || [],
      recommendedTools: aiPlan.recommendedTools || [],
      timeline: aiPlan.timeline
    };

    const project = createProject(newProject);
    finishCreation(project);
  };

  const createLifePlan = (responses: Record<string, any>) => {
    const lifePlan = {
      name: 'My Life Plan',
      icon: '🎯',
      category: 'Personal Growth',
      profile: {
        vision: responses.vision || '',
        metrics: ['Goals Completed', 'Habits Maintained', 'Skills Developed'],
        objective: responses.long_goals || 'Live a fulfilling and purposeful life',
      },
      character: {
        role: 'Life Strategist',
        level: 1,
        xp: 0,
        xpToNext: 100,
        jobPerk: '+10% XP on personal development tasks',
      },
      milestones: [
        {
          id: crypto.randomUUID(),
          title: 'Define Core Values',
          description: 'Establish your fundamental principles',
          completed: true,
          xpReward: 50,
          dependencies: [],
        },
        {
          id: crypto.randomUUID(),
          title: 'Set Short-term Goals',
          description: 'Create actionable 6-month objectives',
          completed: false,
          xpReward: 75,
          dependencies: [],
        },
        {
          id: crypto.randomUUID(),
          title: 'Develop Daily Rituals',
          description: 'Establish supportive daily habits',
          completed: false,
          xpReward: 100,
          dependencies: [],
        }
      ],
      widgets: [
        {
          id: 'goals-progress',
          type: 'progress',
          title: 'Goal Progress',
          icon: 'target',
          data: []
        },
        {
          id: 'daily-focus',
          type: 'list',
          title: 'Daily Focus',
          icon: 'star',
          data: []
        }
      ],
      chatHistory: [],
    };

    const project = createProject(lifePlan);
    finishCreation(project);
  };

  const createProjectPlan = (responses: Record<string, any>) => {
    const template = PROJECT_TEMPLATES.find(t =>
      t.category.toLowerCase() === responses.category?.toLowerCase()
    ) || PROJECT_TEMPLATES[0];

    const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      name: responses.name,
      icon: template.icon,
      category: responses.category || template.category,
      profile: {
        vision: responses.vision,
        metrics: responses.metrics.split(',').map((m: string) => m.trim()),
        objective: responses.vision,
      },
      character: {
        role: template.suggestedRole,
        level: 1,
        xp: 0,
        xpToNext: 100,
        jobPerk: `+10% XP on ${responses.category?.toLowerCase() || 'project'} tasks`,
      },
      milestones: responses.milestones.map((title: string, index: number) => ({
        id: crypto.randomUUID(),
        title,
        description: `Milestone ${index + 1} for ${responses.name}`,
        completed: false,
        xpReward: 50 + (index * 25),
        dependencies: [],
      })),
      widgets: [],
      chatHistory: [],
    };

    const project = createProject(newProject);
    finishCreation(project);
  };

  const finishCreation = (project: Project) => {
    setTimeout(() => {
      setIsProcessing(false);
      onComplete(project);
      handleReset();
    }, 1500);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setResponses({});
    setInputValue('');
    setMilestones([]);
    setIsProcessing(false);
    setChatHistory([]);
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
      if (currentStepData.type === 'milestones') {
        handleAddMilestone();
      } else {
        handleSendMessage();
      }
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (chatContext?.setAuraState) {
      chatContext.setAuraState(isListening ? 'idle' : 'listening');
    }
  };

  const handleContinue = () => {
    console.log("UnifiedPlanChatModal - handleContinue called, currentStep:", currentStep);
    console.log("UnifiedPlanChatModal - milestones:", milestones);
    
    if (currentStep === 4 && milestones.length > 0) {
      console.log("UnifiedPlanChatModal - Creating project with milestones:", milestones);
      // existing code...
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
          maxHeight: 'calc(100vh - 8rem - 56px)',
          marginBottom: '56px'
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
              {planType === 'life' ? 'Creating Your Life Plan...' : 'Creating Your Project...'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Aura is setting up your personalized workspace
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {planType === 'life' ? 'Life Plan Creation' : 'New Project Setup'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Step {currentStep + 1} of {steps.length} • {currentStepData.category}
                  </p>
                </div>
                <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  ×
                </Button>
              </div>

              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

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
                      {currentStepData.question}
                    </p>
                  </div>
                </div>

                {currentStepData.type === 'tags' && currentStepData.suggestions && (
                  <div className="flex flex-wrap gap-2">
                    {currentStepData.suggestions.map((tag) => (
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

                {currentStepData.type === 'milestones' && (
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
                      currentStepData.type === 'milestones'
                        ? "Enter a milestone and press Enter to add..."
                        : "Type your response..."
                    }
                    className="flex-1"
                  />

                  <Button
                    onClick={toggleVoiceInput}
                    variant="outline"
                    size="icon"
                    className={`${isListening ? 'bg-orange-100 border-orange-300 text-orange-600' : ''}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  {currentStepData.type === 'milestones' ? (
                    <Button onClick={handleAddMilestone} disabled={!inputValue.trim()}>
                      Add
                    </Button>
                  ) : (
                    <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            {currentStepData.type === 'milestones' && milestones.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                <Button
                  onClick={handleSendMessage}
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