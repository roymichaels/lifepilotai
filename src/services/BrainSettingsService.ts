import brain from '@/brain/Brain'
import type { CognitionConfig } from '@/brain/cognition'
import type { BehaviorConfig } from '@/brain/behavior'
import type { Skill } from '@/brain/skills'
import { electric } from '@/lib/electric'

export interface BrainSettingsData {
  cognition: CognitionConfig
  behavior: BehaviorConfig
  filters: string[]
  skills: Skill[]
}

const STORAGE_KEY = 'config'

function applyConfig(data: BrainSettingsData) {
  brain.cognition.systemPrompt = data.cognition.systemPrompt
  brain.cognition.contextPrompt = data.cognition.contextPrompt
  brain.behavior.style = data.behavior.style
  brain.filters = data.filters.map(code => {
    try {
      // eslint-disable-next-line no-new-func
      return eval(`(${code})`) as (text: string) => string
    } catch {
      return (t: string) => t
    }
  })
  brain.skills = data.skills
}

export async function loadBrainSettings() {
  const row = await electric.brain_settings.get(STORAGE_KEY)
  if (row?.value) {
    try {
      const data: BrainSettingsData = JSON.parse(row.value)
      applyConfig(data)
    } catch (err) {
      console.error('Failed to parse brain settings', err)
    }
  }
}

export async function saveBrainSettings(data: BrainSettingsData) {
  await electric.brain_settings.put({ key: STORAGE_KEY, value: JSON.stringify(data) })
  applyConfig(data)
}

export async function exportBrainSettings(): Promise<string> {
  const row = await electric.brain_settings.get(STORAGE_KEY)
  if (row?.value) return row.value
  const defaults: BrainSettingsData = {
    cognition: brain.cognition,
    behavior: brain.behavior,
    filters: brain.filters.map(fn => fn.toString()),
    skills: brain.skills
  }
  return JSON.stringify(defaults)
}

export async function importBrainSettings(json: string) {
  const data: BrainSettingsData = JSON.parse(json)
  await saveBrainSettings(data)
}
