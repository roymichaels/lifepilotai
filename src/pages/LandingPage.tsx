import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Users,
  Rocket,
  Trophy,
  Brain,
  Gamepad2,
  Mic,
  BarChart3,
  CheckCircle,
  Search,
  Target,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  ArrowRight
} from 'lucide-react';
import { UnifiedPlanChatModal } from '@/components/dashboard/UnifiedPlanChatModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: Brain,
    title: 'AI-Driven Insights',
    description: 'We analyze your patterns and suggest your next move—instantly.',
    color: 'from-purple-500 to-blue-500'
  },
  {
    icon: Gamepad2,
    title: 'Game-ified Missions',
    description: 'Earn XP, level up, unlock perks as you hit your milestones.',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: Mic,
    title: 'Voice-First Chat',
    description: 'Talk, type or whisper—Aura listens and adapts in real time.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: BarChart3,
    title: 'Visual Dashboards',
    description: 'Interactive wheels, radars, calendars—no more static lists.',
    color: 'from-pink-500 to-purple-500'
  }
];

const checklistItems = [
  {
    icon: Search,
    title: 'Set Your Core Values',
    description: 'Discover what truly matters to you',
    completed: false
  },
  {
    icon: Target,
    title: 'Define Your Top 3 Goals',
    description: 'Create clear objectives for success',
    completed: false
  },
  {
    icon: Wrench,
    title: 'Kick Off Your First Habit',
    description: 'Start building positive routines',
    completed: false
  }
];

const testimonials = [
  {
    quote: "LifePilot turned my morning routine into an adventure—now I actually look forward to my habits.",
    author: "Jordan P.",
    role: "Entrepreneur"
  },
  {
    quote: "The AI insights helped me identify patterns I never noticed. My productivity has doubled.",
    author: "Sarah M.",
    role: "Designer"
  },
  {
    quote: "Finally, a tool that makes personal growth feel like a game. I'm addicted to earning XP!",
    author: "Alex K.",
    role: "Developer"
  }
];

export function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showLifePlanModal, setShowLifePlanModal] = useState(false);
  const [animatedMetrics, setAnimatedMetrics] = useState({
    users: 0,
    missions: 0,
    xp: 0
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  // Animate metrics on mount
  React.useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targetMetrics = {
      users: 12345,
      missions: 3210,
      xp: 1200000
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedMetrics({
        users: Math.floor(targetMetrics.users * easeOut),
        missions: Math.floor(targetMetrics.missions * easeOut),
        xp: Math.floor(targetMetrics.xp * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const handleStartNow = () => {
    if (user) {
      setShowLifePlanModal(true);
    } else {
      navigate('/register');
    }
  };

  const handleLifePlanComplete = () => {
    setShowLifePlanModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-auto">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <motion.h1
          className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          LifePilot
        </motion.h1>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Button
              onClick={handleStartNow}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Now
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                onClick={handleStartNow}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Now
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-24 space-y-16">
        {/* Hero Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
                  Welcome to LifePilot
                </h1>
                <p className="text-xl text-white/80 mb-2">
                  Your AI-Powered Growth Engine
                </p>
                <p className="text-lg text-white/60">
                  Join {formatNumber(animatedMetrics.users)}+ Commanders boosting their habits, skills & goals daily
                </p>
              </motion.div>

              {/* Metrics Counter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-blue-400 mr-2" />
                    <span className="text-2xl font-bold text-white">
                      {formatNumber(animatedMetrics.users)}
                    </span>
                  </div>
                  <p className="text-white/60">Active Users</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Rocket className="w-6 h-6 text-green-400 mr-2" />
                    <span className="text-2xl font-bold text-white">
                      {formatNumber(animatedMetrics.missions)}+
                    </span>
                  </div>
                  <p className="text-white/60">Missions Completed Today</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                    <span className="text-2xl font-bold text-white">
                      {formatNumber(animatedMetrics.xp)}+
                    </span>
                  </div>
                  <p className="text-white/60">XP Earned</p>
                </motion.div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleStartNow}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Your LifePlan
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl"
                  onClick={() => navigate('/dashboard')}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Explore Demo Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Teasers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-white mb-4">
                Why LifePilot?
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop View */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-center p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <FeatureIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-white/70">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Carousel */}
              <div className="md:hidden">
                <div className="relative">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10"
                  >
                    {(() => {
                      const CurrentFeatureIcon = features[currentFeature].icon;
                      return (
                        <>
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${features[currentFeature].color} flex items-center justify-center`}>
                            <CurrentFeatureIcon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {features[currentFeature].title}
                          </h3>
                          <p className="text-white/70">
                            {features[currentFeature].description}
                          </p>
                        </>
                      );
                    })()}
                  </motion.div>

                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentFeature((prev) => (prev - 1 + features.length) % features.length)}
                      className="text-white hover:bg-white/10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex space-x-2">
                      {features.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentFeature ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentFeature((prev) => (prev + 1) % features.length)}
                      className="text-white hover:bg-white/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Getting Started Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-white mb-4">
                Getting Started
              </CardTitle>
              <p className="text-center text-white/70">
                Complete these steps to unlock your full potential
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklistItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Button
                      onClick={handleStartNow}
                      variant="ghost"
                      className="w-full p-6 h-auto justify-start text-left hover:bg-white/10 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.completed
                            ? 'bg-green-500'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500'
                        }`}>
                          {item.completed ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <item.icon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            {index + 1}. {item.title}
                          </h3>
                          <p className="text-sm text-white/70">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-white/40">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Progress value={0} className="mb-4" />
                <p className="text-sm text-white/60">
                  0 of 3 steps completed
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Trusted by Growth-Minded Individuals
                </h3>
              </div>

              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl mx-auto"
              >
                <Quote className="w-8 h-8 text-white/40 mx-auto mb-4" />
                <blockquote className="text-lg text-white/90 mb-4 italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonials[currentTestimonial].author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {testimonials[currentTestimonial].author}
                    </p>
                    <p className="text-white/60 text-sm">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={handleStartNow}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Start Your Journey Now
          </Button>
        </motion.div>
      </div>

      {/* Life Plan Creation Modal */}
      <UnifiedPlanChatModal
        isOpen={showLifePlanModal}
        onClose={() => setShowLifePlanModal(false)}
        onComplete={handleLifePlanComplete}
        planType="life"
      />
    </div>
  );
}
