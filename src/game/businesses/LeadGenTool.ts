import { IpfsService } from '@/services/IpfsService'
import { sendMessage, wakuTopics } from '@/lib/wakuTopics'

export interface Lead {
  id: string
  name: string
  email: string
  createdAt: string
  ipfsHash?: string
}

/**
 * Client-side lead generation form. Leads are pinned to IPFS
 * and broadcast on Waku so agents can follow up.
 */
export class LeadGenTool {
  leads: Lead[] = []

  async addLead(name: string, email: string): Promise<Lead> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const lead: Lead = { id, name, email, createdAt }
    try {
      const hash = await IpfsService.uploadJson(lead)
      lead.ipfsHash = hash
      await sendMessage(wakuTopics.leadGenData, { id, hash, createdAt })
    } catch (err) {
      console.error('[LeadGenTool] failed to store lead', err)
    }
    this.leads.push(lead)
    return lead
  }
}
