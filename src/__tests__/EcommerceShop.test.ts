import { describe, it, expect, vi, beforeEach } from 'vitest'

const uploadJson = vi.fn(async () => 'QmHash')
vi.mock('../services/IpfsService', () => ({
  IpfsService: { uploadJson }
}))
const sendMessage = vi.fn()
vi.mock('../lib/wakuTopics', () => ({
  wakuTopics: { ecommerceData: '/ecom' },
  sendMessage
}))

let EcommerceShop: any

beforeEach(async () => {
  const mod = await import('../game/businesses/EcommerceShop')
  EcommerceShop = mod.EcommerceShop
  uploadJson.mockClear()
  sendMessage.mockClear()
})

describe('EcommerceShop', () => {
  it('stores products on IPFS and Waku', async () => {
    const shop = new EcommerceShop()
    const product = await shop.addProduct('Test', 9)
    expect(product.name).toBe('Test')
    expect(uploadJson).toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalledWith('/ecom', expect.any(Object))
  })
})
