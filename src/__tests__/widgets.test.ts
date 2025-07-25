/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import { generateWidgets, updateWidgets } from '../api/widgets'

// ensure no API key so fallback logic runs
process.env.VITE_OPENAI_API_KEY = ''

describe('generateWidgets', () => {
  it('returns goal widget when context mentions goals', async () => {
    const res = await generateWidgets('I want to track my goals')
    const ids = res.widgets.map(w => w.id)
    expect(ids).toContain('goals-progress')
  })

  it('filters out active widgets', async () => {
    const res = await generateWidgets('I want goals', ['goals-progress'])
    const ids = res.widgets.map(w => w.id)
    expect(ids).not.toContain('goals-progress')
  })
})

describe('updateWidgets', () => {
  it('updates goal progress when context mentions goal', async () => {
    const widgets = [{ id: 'goals-progress', data: [{ id: 1, progress: 50 }] }]
    const res = await updateWidgets('goal', widgets as any)
    expect(res.widgets[0].data[0].progress).toBeGreaterThan(50)
  })
})
