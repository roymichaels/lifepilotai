export interface RuntimeConfig {
  apiBaseUrl: string
  openaiApiKey?: string
  elevenLabsApiKey?: string
  enableWaku?: boolean
  wakuRelayUrl?: string
  usePythagora?: boolean
}

const CONFIG_KEY = 'runtime-config'
let config: RuntimeConfig | null = null

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  if (config) return config

  // prefer config injected globally (e.g. during tests or via Waku)
  if (typeof globalThis !== 'undefined' && (globalThis as any).__APP_CONFIG__) {
    config = (globalThis as any).__APP_CONFIG__ as RuntimeConfig
    return config
  }

  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(CONFIG_KEY)
    if (stored) {
      config = JSON.parse(stored)
      return config
    }
    const apiBaseUrl = prompt('API base URL?', 'http://localhost:3000') ?? ''
    const openaiApiKey = prompt('OpenAI API key?') ?? ''
    const elevenLabsApiKey = prompt('ElevenLabs API key?') ?? ''
    const enableWaku = confirm('Enable Waku peer chat?')
    const wakuRelayUrl = prompt('Waku relay multiaddress? (optional)') ?? ''
    const usePythagora = confirm('Enable Pythagora logging?')
    config = { apiBaseUrl, openaiApiKey, elevenLabsApiKey, enableWaku, wakuRelayUrl, usePythagora }
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    return config
  }

  config = { apiBaseUrl: '' }
  return config
}

export function getRuntimeConfig(): RuntimeConfig {
  if (!config) {
    if (typeof globalThis !== 'undefined' && (globalThis as any).__APP_CONFIG__) {
      config = (globalThis as any).__APP_CONFIG__ as RuntimeConfig
    } else {
      throw new Error('Runtime config not loaded')
    }
  }
  return config
}
