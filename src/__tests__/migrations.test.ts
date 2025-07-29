import { describe, it, expect } from 'vitest'
import { schema } from '../sqlite/migrations'

describe('sqlite schema', () => {
  it('defines all required tables', () => {
    const tables = Object.keys(schema.tables).sort()
    expect(tables).toEqual([
      'brain_settings',
      'ig_accounts',
      'ig_content',
      'messages',
      'projects',
      'settings',
      'summaries',
      'tips'
    ])
  })
})
