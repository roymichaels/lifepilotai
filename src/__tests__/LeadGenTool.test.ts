import { describe, it, expect, vi, beforeEach } from 'vitest'

const uploadJson = vi.fn(async () => 'QmHash')
vi.mock('../services/IpfsService', () => ({
  IpfsService: { uploadJson }
}))
const sendMessage = vi.fn()
vi.mock('../lib/wakuTopics', () => ({
  wakuTopics: { leadGenData: '/lead' },
  sendMessage
}))

let LeadGenTool: any

beforeEach(async () => {
  const mod = await import('../game/businesses/LeadGenTool')
  LeadGenTool = mod.LeadGenTool
  uploadJson.mockClear()
  sendMessage.mockClear()
})

describe('LeadGenTool', () => {
  it('saves leads to IPFS and Waku', async () => {
    const tool = new LeadGenTool()
    const lead = await tool.addLead('Jane', 'jane@example.com')
    expect(lead.email).toBe('jane@example.com')
    expect(uploadJson).toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalledWith('/lead', expect.any(Object))
  })
})
