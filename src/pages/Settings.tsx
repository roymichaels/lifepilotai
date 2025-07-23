import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  exportBrainSettings,
  importBrainSettings,
  saveBrainSettings,
  BrainSettingsData,
} from '@/services/BrainSettingsService';

export function SettingsPage() {
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [apiKey, setApiKey] = useState('');
  const [syncStatus, setSyncStatus] = useState('disconnected');

  const [systemPrompt, setSystemPrompt] = useState('');
  const [contextPrompt, setContextPrompt] = useState('');
  const [behaviorStyle, setBehaviorStyle] = useState('');
  const [filtersText, setFiltersText] = useState('[]');
  const [skillsText, setSkillsText] = useState('[]');

  useEffect(() => {
    const storedKey = localStorage.getItem('lifepilot_api_key');
    if (storedKey) setApiKey(storedKey);
    const load = async () => {
      const json = await exportBrainSettings();
      try {
        const data: BrainSettingsData = JSON.parse(json);
        setSystemPrompt(data.cognition.systemPrompt || '');
        setContextPrompt(data.cognition.contextPrompt || '');
        setBehaviorStyle(data.behavior.style || '');
        setFiltersText(JSON.stringify(data.filters, null, 2));
        setSkillsText(JSON.stringify(data.skills, null, 2));
      } catch (err) {
        console.error('Failed to load brain settings', err);
      }
    };
    load();
  }, []);

  const saveSettings = () => {
    localStorage.setItem('lifepilot_api_key', apiKey);
    const data: BrainSettingsData = {
      cognition: { systemPrompt, contextPrompt },
      behavior: { style: behaviorStyle },
      filters: JSON.parse(filtersText || '[]'),
      skills: JSON.parse(skillsText || '[]'),
    };
    saveBrainSettings(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-4">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Enable Voice</Label>
            <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
          </div>
          <div className="space-y-2">
            <Label>Voice Language</Label>
            <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="es-ES">Spanish</SelectItem>
                <SelectItem value="fr-FR">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>OpenAI API Key</Label>
            <Input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className="space-y-2">
            <Label>ElectricSQL Sync Status</Label>
            <p className="text-sm text-muted-foreground">{syncStatus}</p>
          </div>
          <div className="space-y-2">
            <Label>System Prompt</Label>
            <Textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Context Prompt</Label>
            <Textarea value={contextPrompt} onChange={e => setContextPrompt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Behavior Style</Label>
            <Input value={behaviorStyle} onChange={e => setBehaviorStyle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Filters (array of filter names)</Label>
            <Textarea value={filtersText} onChange={e => setFiltersText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Skills (JSON array)</Label>
            <Textarea value={skillsText} onChange={e => setSkillsText(e.target.value)} />
          </div>
          <div className="flex space-x-2">
            <Button type="button" onClick={async () => {
              const json = await exportBrainSettings();
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'brain_settings.json';
              a.click();
              URL.revokeObjectURL(url);
            }}>Export</Button>
            <Input type="file" accept="application/json" onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              await importBrainSettings(text);
              const data: BrainSettingsData = JSON.parse(text);
              setSystemPrompt(data.cognition.systemPrompt || '');
              setContextPrompt(data.cognition.contextPrompt || '');
              setBehaviorStyle(data.behavior.style || '');
              setFiltersText(JSON.stringify(data.filters, null, 2));
              setSkillsText(JSON.stringify(data.skills, null, 2));
            }} />
          </div>
          <Button onClick={saveSettings}>Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
