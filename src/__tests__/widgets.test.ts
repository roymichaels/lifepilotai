import { describe, it, expect, vi } from 'vitest'

// Mock API client used by widget helpers
const mockWidgets = [
  { id: 'goals-progress', data: [{ id: 1, progress: 60 }] }
]

vi.mock('../api/api', () => ({
  default: {
    post: vi.fn((url: string, body: any) => {
      if (url === '/widgets/generate') {
        const active: string[] = body?.activeWidgets ?? []
        const filtered = mockWidgets.filter(w => !active.includes(w.id))
        return Promise.resolve({ data: { widgets: filtered } })
      }
      if (url === '/widgets/update') {
        const current = body?.widgets?.[0]?.data?.[0]?.progress ?? 50
        return Promise.resolve({ data: { widgets: [{ id: 'goals-progress', data: [{ id: 1, progress: current + 25 }] }] } })
      }
      return Promise.resolve({ data: {} })
    }),
    interceptors: { request: { use: () => {} }, response: { use: () => {} } }
  }
}))

import { generateWidgets, updateWidgets } from '../api/widgets'

// Basic localStorage mock for API module used in tests
(global as any).localStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined
}

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
