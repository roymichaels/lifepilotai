import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { saveConfig, loadConfig, type AppConfig } from '@/services/ConfigService'
import { useNavigate } from 'react-router-dom'
import { setBaseURL } from '@/api/api'

export function ConfigSetup() {
  const [apiBaseUrl, setApiBaseUrl] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [elevenKey, setElevenKey] = useState('')
  const [enableWaku, setEnableWaku] = useState(false)
  const [wakuRelay, setWakuRelay] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadConfig().then(cfg => {
      if (!cfg) return
      setApiBaseUrl(cfg.apiBaseUrl)
      setOpenaiKey(cfg.openaiApiKey)
      setElevenKey(cfg.elevenLabsApiKey ?? '')
      setEnableWaku(cfg.enableWaku ?? false)
      setWakuRelay(cfg.wakuRelayUrl ?? '')
    })
  }, [])

  const onSave = async () => {
    const cfg: AppConfig = {
      apiBaseUrl,
      openaiApiKey: openaiKey,
      elevenLabsApiKey: elevenKey || undefined,
      enableWaku,
      wakuRelayUrl: wakuRelay || undefined
    }
    await saveConfig(cfg)
    setBaseURL(apiBaseUrl)
    navigate('/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl space-y-4">
        <CardHeader>
          <CardTitle>App Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Base URL</Label>
            <Input value={apiBaseUrl} onChange={e => setApiBaseUrl(e.target.value)} placeholder="http://localhost:3000" />
          </div>
          <div className="space-y-2">
            <Label>OpenAI API Key</Label>
            <Input type="password" value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} placeholder="sk-..." />
          </div>
          <div className="space-y-2">
            <Label>ElevenLabs API Key</Label>
            <Input type="password" value={elevenKey} onChange={e => setElevenKey(e.target.value)} placeholder="optional" />
          </div>
          <div className="flex items-center justify-between space-y-2">
            <Label>Enable Waku Messaging</Label>
            <Switch checked={enableWaku} onCheckedChange={setEnableWaku} />
          </div>
          <div className="space-y-2">
            <Label>Waku Relay URL</Label>
            <Input value={wakuRelay} onChange={e => setWakuRelay(e.target.value)} placeholder="multiaddress" />
          </div>
          <Button className="w-full" onClick={onSave}>Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfigSetup
