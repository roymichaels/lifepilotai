import { describe, it, expect, vi, beforeEach } from 'vitest'

const uploadJson = vi.fn(async () => 'QmHash')
vi.mock('../services/IpfsService', () => ({
  IpfsService: { uploadJson }
}))
const sendMessage = vi.fn()
vi.mock('../lib/wakuTopics', () => ({
  wakuTopics: { businessMarketing: '/marketing' },
  sendMessage
}))

let publishMarketingTask: any

beforeEach(async () => {
  const mod = await import('../game/businesses/automation')
  publishMarketingTask = mod.publishMarketingTask
  uploadJson.mockClear()
  sendMessage.mockClear()
})

describe('publishMarketingTask', () => {
  it('uploads task and notifies via Waku', async () => {
    const hash = await publishMarketingTask('biz1', { text: 'test' })
    expect(hash).toBe('QmHash')
    expect(uploadJson).toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalledWith('/marketing', expect.any(Object))
  })
})
