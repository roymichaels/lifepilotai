import { describe, it, expect, vi, beforeEach } from 'vitest'

const connect = vi.fn().mockResolvedValue({})
const disconnect = vi.fn()
const sendMessage = vi.fn()
const handlers: Record<string, any> = {}
const subscribeToTopic = vi.fn(async (topic: string, handler: any) => {
  handlers[topic] = handler
  return { unsubscribe: vi.fn() }
})

const runDailyCycle = vi.fn(async () => {})
const closeInstagram = vi.fn()
const InstagramAgent = { create: vi.fn(async () => ({ runDailyCycle, close: closeInstagram })) }

vi.mock('../lib/waku', () => ({ connect, disconnect }))
vi.mock('../lib/wakuTopics', () => ({
  ACCOUNT_TOPIC: '/account',
  IDEAS_TOPIC: '/ideas',
  PROGRESS_TOPIC: '/progress',
  sendMessage,
  subscribeToTopic
}))
vi.mock('../agents/InstagramAgent', () => ({ InstagramAgent }))

let AuraGrowthAgent: any
let PROGRESS_TOPIC: string
let ACCOUNT_TOPIC: string
let IDEAS_TOPIC: string

beforeEach(async () => {
  const mod = await import('../agents/AuraGrowthAgent')
  AuraGrowthAgent = mod.AuraGrowthAgent
  ;({ PROGRESS_TOPIC, ACCOUNT_TOPIC, IDEAS_TOPIC } = await import('../lib/wakuTopics'))
  connect.mockClear()
  disconnect.mockClear()
  sendMessage.mockClear()
  subscribeToTopic.mockClear()
  InstagramAgent.create.mockClear()
  runDailyCycle.mockClear()
  closeInstagram.mockClear()
  for (const k in handlers) delete handlers[k]
})

describe('AuraGrowthAgent', () => {
  it('connects and subscribes on create', async () => {
    await AuraGrowthAgent.create()
    expect(connect).toHaveBeenCalled()
    expect(subscribeToTopic).toHaveBeenCalledWith(ACCOUNT_TOPIC, expect.any(Function))
    expect(subscribeToTopic).toHaveBeenCalledWith(IDEAS_TOPIC, expect.any(Function))
  })

  it('triggers Instagram agent and publishes progress', async () => {
    const agent = await AuraGrowthAgent.create()
    handlers[ACCOUNT_TOPIC]({ id: '1' })
    handlers[IDEAS_TOPIC]({ id: 'a' })
    await agent.triggerInstagramCycle('fitness')
    expect(InstagramAgent.create).toHaveBeenCalled()
    expect(runDailyCycle).toHaveBeenCalledWith('fitness')
    expect(sendMessage).toHaveBeenCalledWith(
      PROGRESS_TOPIC,
      expect.objectContaining({ accounts: 1, ideas: 1 })
    )
  })

  it('cleans up on close', async () => {
    const agent = await AuraGrowthAgent.create()
    const unsub1 = (await subscribeToTopic.mock.results[0].value).unsubscribe
    const unsub2 = (await subscribeToTopic.mock.results[1].value).unsubscribe
    await agent.close()
    expect(unsub1).toHaveBeenCalled()
    expect(unsub2).toHaveBeenCalled()
    expect(closeInstagram).not.toHaveBeenCalled() // instagram not created yet
    expect(disconnect).toHaveBeenCalled()
  })
})
