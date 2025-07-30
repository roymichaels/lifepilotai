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
  YT_TITLES_TOPIC: '/titles',
  YT_THUMBNAILS_TOPIC: '/thumbs',
  YT_SCRIPTS_TOPIC: '/scripts',
  sendMessage,
  subscribeToTopic
}))

let YouTubeAgent: any
let YT_TITLES_TOPIC: string
let YT_THUMBNAILS_TOPIC: string
let YT_SCRIPTS_TOPIC: string

beforeEach(async () => {
  const mod = await import('../agents/YouTubeAgent')
  YouTubeAgent = mod.YouTubeAgent
  ;({ YT_TITLES_TOPIC, YT_THUMBNAILS_TOPIC, YT_SCRIPTS_TOPIC } = await import('../lib/wakuTopics'))
  connect.mockClear()
  disconnect.mockClear()
  sendMessage.mockClear()
  subscribeToTopic.mockClear()
  for (const k in handlers) delete handlers[k]
})

describe('YouTubeAgent', () => {
  it('connects and subscribes on create', async () => {
    await YouTubeAgent.create()
    expect(connect).toHaveBeenCalled()
    expect(subscribeToTopic).toHaveBeenCalledWith(YT_TITLES_TOPIC, expect.any(Function))
    expect(subscribeToTopic).toHaveBeenCalledWith(YT_THUMBNAILS_TOPIC, expect.any(Function))
    expect(subscribeToTopic).toHaveBeenCalledWith(YT_SCRIPTS_TOPIC, expect.any(Function))
  })

  it('publishes and receives messages', async () => {
    const agent = await YouTubeAgent.create()
    await agent.analyzeVideo('v1', 'title', 'thumb', 'script')
    expect(sendMessage).toHaveBeenCalledWith(YT_TITLES_TOPIC, expect.any(Object))
    expect(sendMessage).toHaveBeenCalledWith(YT_THUMBNAILS_TOPIC, expect.any(Object))
    expect(sendMessage).toHaveBeenCalledWith(YT_SCRIPTS_TOPIC, expect.any(Object))

    const titleMsg = { id: '1', videoId: 'v1', title: 't', createdAt: 'now' }
    handlers[YT_TITLES_TOPIC](titleMsg, {})
    expect(agent.titles[0]).toEqual(titleMsg)

    const thumbMsg = { id: '1', videoId: 'v1', thumbnail: 'th', createdAt: 'now' }
    handlers[YT_THUMBNAILS_TOPIC](thumbMsg, {})
    expect(agent.thumbnails[0]).toEqual(thumbMsg)

    const scriptMsg = { id: '1', videoId: 'v1', script: 's', createdAt: 'now' }
    handlers[YT_SCRIPTS_TOPIC](scriptMsg, {})
    expect(agent.scripts[0]).toEqual(scriptMsg)
  })
})
