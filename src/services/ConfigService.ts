export interface AppConfig {
  apiBaseUrl: string
  openaiApiKey: string
  elevenLabsApiKey?: string
  enableWaku?: boolean
  wakuRelayUrl?: string
}

import { electric } from '@/lib/electric'
import { WakuIdentityService } from './WakuIdentityService'
import { connect, sendOnTopic } from '@/lib/waku'

const STORAGE_KEY = 'app-config'

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(secret), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

async function encrypt(text: string, secret: string): Promise<string> {
  const key = await getKey(secret)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(text)
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  const payload = new Uint8Array(iv.length + cipher.byteLength)
  payload.set(iv, 0)
  payload.set(new Uint8Array(cipher), iv.length)
  return btoa(String.fromCharCode(...payload))
}

async function decrypt(data: string, secret: string): Promise<string> {
  const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0))
  const iv = bytes.slice(0, 12)
  const cipher = bytes.slice(12)
  const key = await getKey(secret)
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
  return new TextDecoder().decode(plain)
}

export async function loadConfig(): Promise<AppConfig | null> {
  const identity = WakuIdentityService.getIdentity()
  if (!identity) return null
  const row = await electric.settings.get(STORAGE_KEY)
  if (!row?.value) return null
  try {
    const json = await decrypt(row.value, identity.id)
    return JSON.parse(json) as AppConfig
  } catch {
    return null
  }
}

export async function saveConfig(config: AppConfig): Promise<void> {
  const identity = WakuIdentityService.getIdentity()
  if (!identity) throw new Error('Missing identity')
  const json = JSON.stringify(config)
  const encrypted = await encrypt(json, identity.id)
  await electric.settings.put({ key: STORAGE_KEY, value: encrypted })
  try {
    await connect()
    await sendOnTopic(`/aura/users/${identity.id}/config`, { data: encrypted })
  } catch (err) {
    console.warn('[Config] Failed to publish config to Waku', err)
  }
}

export async function exportConfig(): Promise<string> {
  const config = await loadConfig()
  return JSON.stringify(config ?? {})
}

export async function importConfig(json: string): Promise<void> {
  const data = JSON.parse(json) as AppConfig
  await saveConfig(data)
}

export async function ensureConfig(): Promise<AppConfig> {
  const cfg = await loadConfig()
  if (!cfg) {
    if (!window.location.pathname.startsWith('/config')) {
      window.location.assign('/config')
    }
    throw new Error('Missing configuration')
  }
  return cfg
}
