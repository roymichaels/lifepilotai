import { describe, it, expect } from 'vitest'

describe('wakuTopics', () => {
  it('generates user topics from pubkey', async () => {
    ;(globalThis as any).localStorage = { getItem: () => null }
    const { wakuTopics } = await import('../lib/wakuTopics')
    const key = 'abc'
    expect(wakuTopics.userProfile(key)).toBe(`/aura/users/${key}/profile`)
    expect(wakuTopics.userConfig(key)).toBe(`/aura/users/${key}/config`)
    expect(wakuTopics.userTraits(key)).toBe(`/aura/users/${key}/traits`)
    expect(wakuTopics.playerState).toBe('/aura/game/player-state/1/app')
  })
})
