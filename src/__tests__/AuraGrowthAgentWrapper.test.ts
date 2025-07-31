import { describe, it, expect, vi, beforeEach } from 'vitest'

const triggerInstagramCycle = vi.fn()
const close = vi.fn()
const create = vi.fn(async () => ({ triggerInstagramCycle, close }))

vi.mock('../agents/AuraGrowthAgent', () => ({ AuraGrowthAgent: { create } }))

let AuraGrowthAgentWrapper: any

beforeEach(async () => {
  const mod = await import('../agents/AuraGrowthAgentWrapper')
  AuraGrowthAgentWrapper = mod.AuraGrowthAgentWrapper
  create.mockClear()
  triggerInstagramCycle.mockClear()
  close.mockClear()
})

describe('AuraGrowthAgentWrapper', () => {
  it('exposes growth mission hook', async () => {
    const wrapper = await AuraGrowthAgentWrapper.create()
    await wrapper.missionHooks.growthCycle('fitness')
    expect(create).toHaveBeenCalled()
    expect(triggerInstagramCycle).toHaveBeenCalledWith('fitness')
  })
})
