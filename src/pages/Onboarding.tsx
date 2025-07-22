import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { useNavigate } from 'react-router-dom';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [valueInput, setValueInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const { createProject } = useProjectStorage();
  const navigate = useNavigate();

  const addValue = () => {
    if (valueInput.trim()) {
      setValues(prev => [...prev, valueInput.trim()]);
      setValueInput('');
    }
  };

  const addGoal = () => {
    if (goalInput.trim()) {
      setGoals(prev => [...prev, goalInput.trim()]);
      setGoalInput('');
    }
  };

  const finish = () => {
    createProject({
      name: 'My LifePlan',
      icon: '🌟',
      category: 'personal',
      profile: {
        vision: '',
        metrics: values,
        objective: goals.join(', '),
      },
      character: {
        role: 'Novice',
        level: 1,
        xp: 0,
        xpToNext: 100,
        jobPerk: '',
      },
      milestones: [],
      widgets: [],
      chatHistory: [],
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to LifePilot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-2">
              <p className="font-medium">What values are most important to you?</p>
              <div className="flex gap-2">
                <Input
                  value={valueInput}
                  onChange={e => setValueInput(e.target.value)}
                  placeholder="Add a value"
                />
                <Button onClick={addValue}>Add</Button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {values.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
              <div className="text-right">
                <Button onClick={() => setStep(2)} disabled={values.length === 0}>
                  Next
                </Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              <p className="font-medium">List a few top goals you want to achieve.</p>
              <div className="flex gap-2">
                <Input
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  placeholder="Add a goal"
                />
                <Button onClick={addGoal}>Add</Button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {goals.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={finish} disabled={goals.length === 0}>
                  Finish
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Onboarding;
