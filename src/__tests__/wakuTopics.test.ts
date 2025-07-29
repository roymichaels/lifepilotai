import { describe, it, expect, vi, beforeEach } from 'vitest'

const send = vi.fn()
const subscribe = vi.fn()

vi.mock('../lib/waku', () => ({
  connect: vi.fn().mockResolvedValue({
    lightPush: { send },
    filter: { subscribe }
  })
}))

vi.mock('@waku/sdk', () => ({
  createEncoder: vi.fn(({ contentTopic }) => ({ topic: contentTopic })),
  createDecoder: vi.fn(topic => topic)
}))

let sendMessage: any
let subscribeToTopic: any
let connect: any
let createEncoder: any
let createDecoder: any

beforeEach(async () => {
  const mod = await import('../lib/wakuTopics')
  sendMessage = mod.sendMessage
  subscribeToTopic = mod.subscribeToTopic
  const wakuMod: any = await import('../lib/waku')
  connect = wakuMod.connect
  const sdk: any = await import('@waku/sdk')
  createEncoder = sdk.createEncoder
  createDecoder = sdk.createDecoder
  send.mockReset()
  subscribe.mockReset()
  createEncoder.mockClear()
  createDecoder.mockClear()
})

describe('wakuTopics utility', () => {
  it('sends messages via light push', async () => {
    await sendMessage('topic', { a: 1 })
    expect(connect).toHaveBeenCalled()
    expect(createEncoder).toHaveBeenCalledWith({ contentTopic: 'topic' })
    const bytes = new TextEncoder().encode(JSON.stringify({ a: 1 }))
    expect(send).toHaveBeenCalledWith({ topic: 'topic' }, { payload: bytes })
  })

  it('subscribes to topics and decodes messages', async () => {
    let capturedCallback: any
    subscribe.mockImplementation((decoder: any, cb: any) => {
      capturedCallback = cb
      return Promise.resolve({ unsubscribe: vi.fn() })
    })
    const handler = vi.fn()
    const sub = await subscribeToTopic('topic', handler)
    expect(createDecoder).toHaveBeenCalledWith('topic')
    const payloadObj = { hello: 'world' }
    const payload = new TextEncoder().encode(JSON.stringify(payloadObj))
    capturedCallback({ payload })
    expect(handler).toHaveBeenCalledWith(payloadObj, { payload })
    expect(typeof sub.unsubscribe).toBe('function')
  })
})
