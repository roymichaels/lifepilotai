export interface RuntimeConfig {
  apiBaseUrl: string
  openaiApiKey?: string
  elevenlabsApiKey?: string
  wakuRelayUrl?: string
  enableWaku?: boolean
  firebase: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
  }
}

let config: RuntimeConfig | null = null

export function getRuntimeConfig(): RuntimeConfig {
  if (config) return config

  if (typeof window === 'undefined' || typeof window.prompt === 'undefined') {
    config = {
      apiBaseUrl: '',
      openaiApiKey: '',
      elevenlabsApiKey: '',
      enableWaku: false,
      firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
      }
    }
    return config
  }

  try {
    window.prompt('');
  } catch {
    config = {
      apiBaseUrl: '',
      openaiApiKey: '',
      elevenlabsApiKey: '',
      enableWaku: false,
      firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
      }
    };
    return config;
  }

  const saved = localStorage.getItem('lifepilot-config')
  if (saved) {
    config = JSON.parse(saved) as RuntimeConfig
    return config
  }

  const apiBaseUrl = window.prompt('API base URL (e.g. http://localhost:3000)') || 'http://localhost:3000'
  const openaiApiKey = window.prompt('OpenAI API key (optional)') || undefined
  const elevenlabsApiKey = window.prompt('ElevenLabs API key (optional)') || undefined
  const enableWaku = window.confirm('Enable Waku messaging?')
  const wakuRelayUrl = enableWaku ? window.prompt('Waku relay URL (optional)') || undefined : undefined

  const firebase = {
    apiKey: window.prompt('Firebase API key') || '',
    authDomain: window.prompt('Firebase Auth domain') || '',
    projectId: window.prompt('Firebase Project ID') || '',
    storageBucket: window.prompt('Firebase Storage bucket') || '',
    messagingSenderId: window.prompt('Firebase Messaging Sender ID') || '',
    appId: window.prompt('Firebase App ID') || ''
  }

  config = {
    apiBaseUrl,
    openaiApiKey,
    elevenlabsApiKey,
    wakuRelayUrl,
    enableWaku,
    firebase
  }

  localStorage.setItem('lifepilot-config', JSON.stringify(config))
  return config
}
