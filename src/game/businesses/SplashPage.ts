import { IpfsService } from '@/services/IpfsService'
import { sendMessage, wakuTopics } from '@/lib/wakuTopics'

export interface SplashContent {
  id: string
  title: string
  tagline: string
  createdAt: string
  ipfsHash?: string
}

/**
 * Client-side splash page template. Saves page copy to IPFS
 * and notifies peers via Waku.
 */
export class SplashPage {
  content: SplashContent | null = null

  async save(title: string, tagline: string): Promise<SplashContent> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const data: SplashContent = { id, title, tagline, createdAt }
    try {
      const hash = await IpfsService.uploadJson(data)
      data.ipfsHash = hash
      await sendMessage(wakuTopics.splashPageData, { id, hash, createdAt })
    } catch (err) {
      console.error('[SplashPage] failed to store content', err)
    }
    this.content = data
    return data
  }
}
