import { describe, it, expect, vi, beforeEach } from 'vitest'

const connect = vi.fn().mockResolvedValue({})
const disconnect = vi.fn()

const handlers: Record<string, any> = {}
const sendMessage = vi.fn()
const subscribeToTopic = vi.fn(async (topic: string, handler: any) => {
  handlers[topic] = handler
  return { unsubscribe: vi.fn() }
})

vi.mock('../lib/waku', () => ({ connect, disconnect }))
vi.mock('../lib/wakuTopics', () => ({
  ACCOUNT_TOPIC: '/account',
  IDEAS_TOPIC: '/ideas',
  sendMessage,
  subscribeToTopic
}))

let InstagramAgent: any
let ACCOUNT_TOPIC: string
let IDEAS_TOPIC: string

beforeEach(async () => {
  const mod = await import('../agents/InstagramAgent')
  InstagramAgent = mod.InstagramAgent
  ;({ ACCOUNT_TOPIC, IDEAS_TOPIC } = await import('../lib/wakuTopics'))
  connect.mockClear()
  disconnect.mockClear()
  sendMessage.mockClear()
  subscribeToTopic.mockClear()
  for (const k in handlers) delete handlers[k]
})

describe('InstagramAgent', () => {
  it('connects and subscribes on create', async () => {
    await InstagramAgent.create()
    expect(connect).toHaveBeenCalled()
    expect(subscribeToTopic).toHaveBeenCalledWith(ACCOUNT_TOPIC, expect.any(Function))
    expect(subscribeToTopic).toHaveBeenCalledWith(IDEAS_TOPIC, expect.any(Function))
  })

  it('discovers accounts and publishes them', async () => {
    const agent = await InstagramAgent.create()
    const [acc] = await agent.discoverAccounts('fitness')
    expect(acc.username).toContain('fitness')
    expect(sendMessage).toHaveBeenCalledWith(ACCOUNT_TOPIC, acc)
  })

  it('analyzes account and suggests ideas', async () => {
    const agent = await InstagramAgent.create()
    const [acc] = await agent.discoverAccounts('art')
    const hook = await agent.analyzeAccount(acc.id)
    expect(hook).toContain(acc.id)
    expect(sendMessage).toHaveBeenCalledWith(IDEAS_TOPIC, expect.objectContaining({ accountId: acc.id }))
    const ideas = await agent.suggestDailyContent()
    expect(ideas.length).toBe(1)
    expect(ideas[0].accountId).toBe(acc.id)
  })

  it('cleans up subscriptions on close', async () => {
    subscribeToTopic.mockResolvedValueOnce({ unsubscribe: vi.fn() })
    subscribeToTopic.mockResolvedValueOnce({ unsubscribe: vi.fn() })
    const agent = await InstagramAgent.create()
    const unsub1 = (await subscribeToTopic.mock.results[0].value).unsubscribe
    const unsub2 = (await subscribeToTopic.mock.results[1].value).unsubscribe
    await agent.close()
    expect(unsub1).toHaveBeenCalled()
    expect(unsub2).toHaveBeenCalled()
    expect(disconnect).toHaveBeenCalled()
  })
})
