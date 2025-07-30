import { describe, it, expect, vi, beforeEach } from 'vitest'

const schedule = vi.fn(() => ({ stop: vi.fn() }))
vi.mock('node-cron', () => ({ default: { schedule } }))

const runDailyCycle = vi.fn()
const closeInstagram = vi.fn()
const InstagramAgent = { create: vi.fn(async () => ({ runDailyCycle, close: closeInstagram })) }

const updateGigs = vi.fn()
const closeFiverr = vi.fn()
const FiverrAgent = { create: vi.fn(async () => ({ updateGigs, close: closeFiverr })) }

const triggerInstagramCycle = vi.fn()
const closeGrowth = vi.fn()
const AuraGrowthAgent = { create: vi.fn(async () => ({ triggerInstagramCycle, close: closeGrowth })) }

vi.mock('../agents/InstagramAgent', () => ({ InstagramAgent }))
vi.mock('../agents/FiverrAgent', () => ({ FiverrAgent }))
vi.mock('../agents/AuraGrowthAgent', () => ({ AuraGrowthAgent }))

let AgentScheduler: any

beforeEach(async () => {
  const mod = await import('../agents/AgentScheduler')
  AgentScheduler = mod.AgentScheduler
  schedule.mockClear()
  runDailyCycle.mockClear()
  updateGigs.mockClear()
  triggerInstagramCycle.mockClear()
  closeInstagram.mockClear()
  closeFiverr.mockClear()
  closeGrowth.mockClear()
})

describe('AgentScheduler', () => {
  it('schedules tasks on start', async () => {
    const scheduler = new AgentScheduler()
    await scheduler.start()
    expect(InstagramAgent.create).toHaveBeenCalled()
    expect(FiverrAgent.create).toHaveBeenCalled()
    expect(AuraGrowthAgent.create).toHaveBeenCalled()
    expect(schedule).toHaveBeenCalledWith('0 9 * * *', expect.any(Function))
    expect(schedule).toHaveBeenCalledWith('0 */6 * * *', expect.any(Function))
    expect(schedule).toHaveBeenCalledWith('0 10 * * *', expect.any(Function))
  })

  it('stops jobs and closes agents', async () => {
    const job1 = { stop: vi.fn() }
    const job2 = { stop: vi.fn() }
    const job3 = { stop: vi.fn() }
    schedule.mockReturnValueOnce(job1)
    schedule.mockReturnValueOnce(job2)
    schedule.mockReturnValueOnce(job3)
    const scheduler = new AgentScheduler()
    await scheduler.start()
    await scheduler.stop()
    expect(job1.stop).toHaveBeenCalled()
    expect(job2.stop).toHaveBeenCalled()
    expect(job3.stop).toHaveBeenCalled()
    expect(closeInstagram).toHaveBeenCalled()
    expect(closeFiverr).toHaveBeenCalled()
    expect(closeGrowth).toHaveBeenCalled()
  })
})
