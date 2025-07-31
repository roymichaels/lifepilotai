import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { saveConfig, AppConfig } from '@/services/ConfigService'
import { useNavigate } from 'react-router-dom'

export function ConfigSetup() {
  const navigate = useNavigate()
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:3000')
  const [openaiApiKey, setOpenaiApiKey] = useState('')
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('')
  const [enableWaku, setEnableWaku] = useState(false)
  const [wakuRelayUrl, setWakuRelayUrl] = useState('')

  const handleSave = async () => {
    const cfg: AppConfig = {
      apiBaseUrl,
      openaiApiKey,
      elevenLabsApiKey: elevenLabsApiKey || undefined,
      enableWaku,
      wakuRelayUrl: wakuRelayUrl || undefined
    }
    await saveConfig(cfg)
    navigate('/')
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Initial Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Base URL</Label>
            <Input
              value={apiBaseUrl}
              onChange={e => setApiBaseUrl(e.target.value)}
              placeholder="http://localhost:3000"
            />
          </div>
          <div className="space-y-2">
            <Label>OpenAI API Key</Label>
            <Input
              type="password"
              value={openaiApiKey}
              onChange={e => setOpenaiApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className="space-y-2">
            <Label>ElevenLabs API Key</Label>
            <Input
              type="password"
              value={elevenLabsApiKey}
              onChange={e => setElevenLabsApiKey(e.target.value)}
              placeholder="optional"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={enableWaku} onCheckedChange={setEnableWaku} />
            <Label>Enable Waku Messaging</Label>
          </div>
          <div className="space-y-2">
            <Label>Waku Relay Multiaddress</Label>
            <Input
              value={wakuRelayUrl}
              onChange={e => setWakuRelayUrl(e.target.value)}
              placeholder="/dns4/node/..."
            />
          </div>
          <Button className="w-full" onClick={handleSave}>Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfigSetup
