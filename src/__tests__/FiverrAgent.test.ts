import { describe, it, expect, vi, beforeEach } from 'vitest'

const connect = vi.fn().mockResolvedValue({})
const disconnect = vi.fn()

const sendMessage = vi.fn()
const handlers: Record<string, any> = {}
const subscribeToTopic = vi.fn(async (topic: string, handler: any) => {
  handlers[topic] = handler
  return { unsubscribe: vi.fn() }
})

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
  for (const k in handlers) delete handlers[k]
})

describe('FiverrAgent', () => {
  it('connects and subscribes on create', async () => {
    await FiverrAgent.create()
    expect(connect).toHaveBeenCalled()
    expect(subscribeToTopic).toHaveBeenCalledWith(FIVERR_FREELANCERS_TOPIC, expect.any(Function))
    expect(subscribeToTopic).toHaveBeenCalledWith(FIVERR_GIGS_TOPIC, expect.any(Function))
  })

  it('publishes freelancer info and gig updates', async () => {
    const agent = await FiverrAgent.create()
    const [freelancer] = await agent.analyzeTopFreelancers('design')
    expect(sendMessage).toHaveBeenCalledWith(FIVERR_FREELANCERS_TOPIC, freelancer)
    expect(agent.freelancers[0]).toEqual(freelancer)

    const [gig] = await agent.updateGigs()
    expect(sendMessage).toHaveBeenCalledWith(FIVERR_GIGS_TOPIC, gig)
    expect(agent.gigs[0]).toEqual(gig)

    const fMsg = { id: 'x', name: 'n', rating: 5 }
    handlers[FIVERR_FREELANCERS_TOPIC](fMsg, {})
    expect(agent.freelancers).toContainEqual(fMsg)

    const gMsg = { id: 'y', title: 'Gig 1', updatedAt: 'now' }
    handlers[FIVERR_GIGS_TOPIC](gMsg, {})
    expect(agent.gigs).toContainEqual(gMsg)
  })

  it('cleans up subscriptions on close', async () => {
    subscribeToTopic.mockResolvedValueOnce({ unsubscribe: vi.fn() })
    subscribeToTopic.mockResolvedValueOnce({ unsubscribe: vi.fn() })
    const agent = await FiverrAgent.create()
    const unsub1 = (await subscribeToTopic.mock.results[0].value).unsubscribe
    const unsub2 = (await subscribeToTopic.mock.results[1].value).unsubscribe
    await agent.close()
    expect(unsub1).toHaveBeenCalled()
    expect(unsub2).toHaveBeenCalled()
    expect(disconnect).toHaveBeenCalled()
  })
})
