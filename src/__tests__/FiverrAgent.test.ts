import { describe, it, expect, vi, beforeEach } from 'vitest'

const connect = vi.fn().mockResolvedValue({})
const disconnect = vi.fn()

const sendMessage = vi.fn()
const subscribeToTopic = vi.fn(async () => ({ unsubscribe: vi.fn() }))

vi.mock('../lib/waku', () => ({ connect, disconnect }))
vi.mock('../lib/wakuTopics', () => ({
  FIVERR_FREELANCERS_TOPIC: '/freelancers',
  FIVERR_GIGS_TOPIC: '/gigs',
  sendMessage,
  subscribeToTopic
}))

let FiverrAgent: any
let FIVERR_FREELANCERS_TOPIC: string
let FIVERR_GIGS_TOPIC: string

beforeEach(async () => {
  const mod = await import('../agents/FiverrAgent')
  FiverrAgent = mod.FiverrAgent
  ;({ FIVERR_FREELANCERS_TOPIC, FIVERR_GIGS_TOPIC } = await import('../lib/wakuTopics'))
  connect.mockClear()
  disconnect.mockClear()
  sendMessage.mockClear()
  subscribeToTopic.mockClear()
})

describe('FiverrAgent', () => {
  it('connects and subscribes on create', async () => {
    await FiverrAgent.create()
    expect(connect).toHaveBeenCalled()
    expect(subscribeToTopic).toHaveBeenCalledWith(FIVERR_FREELANCERS_TOPIC, expect.any(Function))
    expect(subscribeToTopic).toHaveBeenCalledWith(FIVERR_GIGS_TOPIC, expect.any(Function))
  })
})
