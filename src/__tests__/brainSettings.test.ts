import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { electric } from '../lib/electric'

import brain from '../brain/Brain'

beforeEach(async () => {
  await electric.brain_settings.clear()
})

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
