import { describe, it, expect, vi, beforeEach } from 'vitest'

const uploadJson = vi.fn(async () => 'QmHash')
vi.mock('../services/IpfsService', () => ({
  IpfsService: { uploadJson }
}))
const sendMessage = vi.fn()
vi.mock('../lib/wakuTopics', () => ({
  wakuTopics: { splashPageData: '/splash' },
  sendMessage
}))

let SplashPage: any

beforeEach(async () => {
  const mod = await import('../game/businesses/SplashPage')
  SplashPage = mod.SplashPage
  uploadJson.mockClear()
  sendMessage.mockClear()
})

describe('SplashPage', () => {
  it('saves content to IPFS and Waku', async () => {
    const page = new SplashPage()
    const data = await page.save('Hello', 'World')
    expect(data.title).toBe('Hello')
    expect(uploadJson).toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalledWith('/splash', expect.any(Object))
  })
})
