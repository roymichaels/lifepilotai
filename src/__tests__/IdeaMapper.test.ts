import { describe, it, expect, vi, beforeEach } from 'vitest'

const connect = vi.fn().mockResolvedValue({})
const disconnect = vi.fn()
const handlers: Record<string, any> = {}
const sendMessage = vi.fn()
const subscribeToTopic = vi.fn(async (topic: string, handler: any) => {
  handlers[topic] = handler
  return { unsubscribe: vi.fn() }
})
const uploadJson = vi.fn(async () => 'QmHash')

vi.mock('../lib/waku', () => ({ connect, disconnect }))
vi.mock('../lib/wakuTopics', () => ({
  IDEAS_TOPIC: '/ideas',
  IDEA_MAPPINGS_TOPIC: '/mappings',
  subscribeToTopic,
  sendMessage
}))
vi.mock('../services/IpfsService', () => ({
  IpfsService: { uploadJson }
}))

let IdeaMapper: any
let IDEAS_TOPIC: string
let IDEA_MAPPINGS_TOPIC: string

beforeEach(async () => {
  const mod = await import('../services/IdeaMapper')
  IdeaMapper = mod.IdeaMapper
  ;({ IDEAS_TOPIC, IDEA_MAPPINGS_TOPIC } = await import('../lib/wakuTopics'))
  connect.mockClear()
  disconnect.mockClear()
  sendMessage.mockClear()
  subscribeToTopic.mockClear()
  uploadJson.mockClear()
  for (const k in handlers) delete handlers[k]
})

describe('IdeaMapper', () => {
  it('connects and subscribes on create', async () => {
    await IdeaMapper.create()
    expect(connect).toHaveBeenCalled()
    expect(subscribeToTopic).toHaveBeenCalledWith(IDEAS_TOPIC, expect.any(Function))
  })

  it('generates and publishes mappings', async () => {
    const mapper = await IdeaMapper.create()
    await handlers[IDEAS_TOPIC]({ id: 'inst1' })
    await Promise.resolve()
    expect(uploadJson).toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalledWith(
      IDEA_MAPPINGS_TOPIC,
      expect.objectContaining({ instagramIdeaId: 'inst1', hash: 'QmHash' })
    )
    expect(mapper.mappings[0].instagramIdeaId).toBe('inst1')
    expect(mapper.mappings[0].ipfsHash).toBe('QmHash')
  })

  it('cleans up on close', async () => {
    subscribeToTopic.mockResolvedValueOnce({ unsubscribe: vi.fn() })
    const mapper = await IdeaMapper.create()
    const unsub = (await subscribeToTopic.mock.results[0].value).unsubscribe
    await mapper.close()
    expect(unsub).toHaveBeenCalled()
    expect(disconnect).toHaveBeenCalled()
  })
})
