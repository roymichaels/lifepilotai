import { describe, it, expect } from 'vitest'
import { wakuTopics } from '../lib/wakuTopics'

describe('wakuTopics', () => {
  it('generates user topics from pubkey', () => {
    const key = 'abc'
    expect(wakuTopics.userProfile(key)).toBe(`/aura/users/${key}/profile`)
    expect(wakuTopics.userConfig(key)).toBe(`/aura/users/${key}/config`)
    expect(wakuTopics.userTraits(key)).toBe(`/aura/users/${key}/traits`)
  })
})
