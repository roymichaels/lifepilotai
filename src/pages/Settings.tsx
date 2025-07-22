import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function SettingsPage() {
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [apiKey, setApiKey] = useState('');
  const [syncStatus, setSyncStatus] = useState('disconnected');

  useEffect(() => {
    const storedKey = localStorage.getItem('lifepilot_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('lifepilot_api_key', apiKey);
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
          <Button onClick={saveSettings}>Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
