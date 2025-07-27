/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Mic, MicOff } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface LifePlanStep {
  id: string;
  question: string;
  category: string;
}

const LIFE_PLAN_STEPS: LifePlanStep[] = [
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

interface LifePlanChatModalProps {
  isOpen: boolean;
  onComplete: (profile: any) => void;
}

export function LifePlanChatModal({ isOpen, onComplete }: LifePlanChatModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, sender: 'user' | 'aura', content: string}>>([]);
  const { startRecording, stopRecording, transcript, setTranscript, isRecording } = useVoiceInput();
  const { setAuraState } = useChatContext();
  const { createProject } = useProjectStorage();

  const currentStepData = LIFE_PLAN_STEPS[currentStep];
  const progress = ((currentStep + 1) / LIFE_PLAN_STEPS.length) * 100;
  const isLastStep = currentStep === LIFE_PLAN_STEPS.length - 1;

  // Initialize with first question
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      setChatHistory([{
        id: '1',
        sender: 'aura',
        content: currentStepData.question
      }]);
      setAuraState('speaking');
      setTimeout(() => setAuraState('idle'), 2000);
    }
  }, [isOpen, chatHistory.length, currentStepData.question, setAuraState]);

  const handleSendMessage = async (text?: string) => {
    const message = (text ?? inputValue).trim();
    if (!message) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: message
    };

    // Add user message
    setChatHistory(prev => [...prev, userMessage]);
    
    // Store response
    const newResponses = { ...responses, [currentStepData.id]: message };
    setResponses(newResponses);
    
    setInputValue('');
    setAuraState('thinking');

    // Simulate AI processing
    setTimeout(() => {
      if (isLastStep) {
        // Complete the life plan
        const auraResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'aura' as const,
          content: "Perfect! Your Life Plan is complete. I'm now setting up your personalized dashboard with everything you need to achieve your goals. Welcome to your journey!"
        };
        
        setChatHistory(prev => [...prev, auraResponse]);
        setAuraState('speaking');
        
        // Create the life plan project
        setTimeout(() => {
          const lifePlan = {
            name: 'My Life Plan',
            icon: '🎯',
            category: 'Personal Growth',
            profile: {
              vision: newResponses.vision || '',
              metrics: ['Goals Completed', 'Habits Maintained', 'Skills Developed'],
              objective: newResponses.long_goals || 'Live a fulfilling and purposeful life',
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

          createProject(lifePlan);
          onComplete(newResponses);
          setAuraState('idle');
        }, 2000);
      } else {
        // Move to next step
        const nextStep = currentStep + 1;
        const nextQuestion = LIFE_PLAN_STEPS[nextStep];
        
        const auraResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'aura' as const,
          content: nextQuestion.question
        };
        
        setChatHistory(prev => [...prev, auraResponse]);
        setCurrentStep(nextStep);
        setAuraState('speaking');
        setTimeout(() => setAuraState('idle'), 2000);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
      setAuraState('idle');
    } else {
      setTranscript('');
      startRecording();
      setAuraState('listening');
    }
  };

  useEffect(() => {
    if (!isRecording && transcript) {
      handleSendMessage(transcript);
      setTranscript('');
    }
  }, [isRecording, transcript]);

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
          maxHeight: 'calc(100vh - 8rem)',
          marginBottom: '56px'
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <span>Life Plan Creation</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Step {currentStep + 1} of {LIFE_PLAN_STEPS.length} • {currentStepData.category}
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              {Math.round(progress)}%
            </Badge>
          </div>

          {/* Progress bar */}
          <Progress value={progress} className="h-2" />
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 space-y-4 max-h-96">
          <AnimatePresence>
            {chatHistory.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts..."
              className="flex-1"
            />
            
            <Button
              onClick={toggleVoiceInput}
              variant="outline"
              size="icon"
              className={`${isRecording ? 'bg-orange-100 border-orange-300 text-orange-600' : ''}`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
