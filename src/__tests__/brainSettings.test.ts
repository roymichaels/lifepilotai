import { describe, it, expect, vi, beforeEach } from 'vitest'

let store: Record<string, string> = {}
vi.mock('../lib/electric', () => ({
  electric: {
    brain_settings: {
      get: vi.fn((key: string) => Promise.resolve(store[key] ? { key, value: store[key] } : undefined)),
      put: vi.fn(({ key, value }: { key: string; value: string }) => { store[key] = value; return Promise.resolve() })
    }
  }
}))

import brain from '../brain/Brain'

beforeEach(() => { store = {} })

describe('BrainSettingsService', () => {
  it('exports and imports settings', async () => {
    const service = await import('../services/BrainSettingsService')
    const data = {
      cognition: { systemPrompt: 's', contextPrompt: '' },
      behavior: { style: '' },
      filters: ['trim', 'lowercase'],
      skills: []
    }
    await service.saveBrainSettings(data)
    const exported = await service.exportBrainSettings()
    expect(JSON.parse(exported).filters).toEqual(['trim', 'lowercase'])

    brain.filters = []
    await service.importBrainSettings(exported)
    const result = brain.filters.reduce((msg, fn) => fn(msg), ' HI ')
    expect(result).toBe('hi')
  })
})
