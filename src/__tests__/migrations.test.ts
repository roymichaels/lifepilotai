import { describe, it, expect } from 'vitest'
import { schema } from '../sqlite/migrations'

describe('sqlite schema', () => {
  it('defines all required tables', () => {
    const tables = Object.keys(schema.tables).sort()
    const expectedTables = [
      'brain_settings',
      'messages',
      'projects',
      'settings',
      'summaries',
      'tips'
    ]
    expect(tables).toEqual(expectedTables)
  })
})
