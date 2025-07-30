import { disconnect, connect } from '../lib/waku'
import {
  ACCOUNT_TOPIC,
  IDEAS_TOPIC,
  ENGAGEMENT_TOPIC,
  CAPTIONS_TOPIC,
  sendMessage,
  subscribeToTopic,
} from '../lib/wakuTopics'
import axios from 'axios'
import { loadConfig } from '@/services/ConfigService'
import { IpfsService } from '@/services/IpfsService'

export interface Account {
  id: string
  username: string
  followers: number
  niche: string
  discoveredAt: string
}

export interface ContentIdea {
  id: string
  accountId: string
  idea: string
  createdAt: string
  ipfsHash?: string
}

export interface Engagement {
  id: string
  accountId: string
  type: 'like' | 'comment'
  message?: string
  createdAt: string
}

/**
 * Basic autonomous Instagram agent.
 * Discovers accounts, analyses posts and stores daily content ideas.
 * Uses Waku peer-to-peer messaging with in-memory storage.
 */
export class InstagramAgent {
  private accounts: Account[] = []
  private ideas: ContentIdea[] = []
  private engagements: Engagement[] = []
  private subs: { unsubscribe: () => Promise<void> }[] = []

  private constructor() {}

  static async create(): Promise<InstagramAgent> {
    await connect()
    const agent = new InstagramAgent()
    await agent.subscribe()
    return agent
  }

  private async publish(topic: string, data: object): Promise<void> {
    await sendMessage(topic, data)
  }

  private async subscribe() {
    const accountSub = await subscribeToTopic<Account>(
      ACCOUNT_TOPIC,
      data => {
        this.accounts.push(data)
      }
    )
    this.subs.push(accountSub)

    const ideaSub = await subscribeToTopic<ContentIdea>(IDEAS_TOPIC, data => {
      this.ideas.push(data)
    })
    this.subs.push(ideaSub)

    const engagementSub = await subscribeToTopic<Engagement>(
      ENGAGEMENT_TOPIC,
      data => {
        this.engagements.push(data)
      }
    )
    this.subs.push(engagementSub)
  }

  async discoverAccounts(niche: string): Promise<Account[]> {
    const id = crypto.randomUUID()
    const username = `${niche}_example`
    const followers = Math.floor(Math.random() * 1000)
    const discoveredAt = new Date().toISOString()
    const account: Account = { id, username, followers, niche, discoveredAt }
    await this.publish(ACCOUNT_TOPIC, account)
    this.accounts.push(account)
    return [account]
  }

  async runDailyCycle(niche: string): Promise<void> {
    const count = Math.random() > 0.5 ? 2 : 1
    const discovered: Account[] = []
    for (let i = 0; i < count; i++) {
      const [account] = await this.discoverAccounts(niche)
      discovered.push(account)
    }
    for (const acc of discovered) {
      const captions = await this.fetchRecentCaptions(acc.username)
      await this.analyzeAccount(acc.id, captions)
    }
    // This can later be scheduled with setInterval or cron
  }

  private async fetchRecentCaptions(username: string): Promise<string[]> {
    try {
      const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`
      const res = await axios.get(url)
      const edges =
        res.data?.graphql?.user?.edge_owner_to_timeline_media?.edges ?? []
      const captions: string[] = []
      for (const edge of edges.slice(0, 5)) {
        const text =
          edge?.node?.edge_media_to_caption?.edges?.[0]?.node?.text?.trim()
        if (text) {
          captions.push(text)
          await this.publish(CAPTIONS_TOPIC, {
            accountId: username,
            text,
            scrapedAt: new Date().toISOString(),
          })
        }
      }
      return captions
    } catch (err) {
      console.error('[InstagramAgent] Failed to fetch captions', err)
      return []
    }
  }

  async analyzeAccount(accountId: string, captions: string[] = []): Promise<string> {
    const cfg = await loadConfig()
    const apiKey = cfg?.openaiApiKey
    if (captions.length === 0) {
      captions = await this.fetchRecentCaptions(accountId)
    }

    const prompt = captions.join('\n')
    let hook = `Hook for ${accountId}`

    if (apiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: `Analyze these captions and suggest a new content hook in one sentence:\n${prompt}`,
              },
            ],
            max_tokens: 60,
          }),
        })
        const data = await res.json()
        hook = data.choices?.[0]?.message?.content?.trim() || hook
      } catch (err) {
        console.error('[InstagramAgent] OpenAI analysis failed', err)
      }
    }

    const ideaId = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const idea: ContentIdea = { id: ideaId, accountId, idea: hook, createdAt }

    let ipfsHash: string | null = null
    try {
      ipfsHash = await IpfsService.uploadJson(idea)
    } catch (err) {
      console.error('[InstagramAgent] IPFS upload failed', err)
    }

    if (ipfsHash) {
      await this.publish(IDEAS_TOPIC, {
        id: ideaId,
        accountId,
        hash: ipfsHash,
        createdAt
      })
    }

    this.ideas.push({ ...idea, ...(ipfsHash ? { ipfsHash } : {}) })
    return hook
  }

  async suggestDailyContent(): Promise<ContentIdea[]> {
    return this.ideas.slice(-5).reverse()
  }

  async engage(accountId: string, message: string) {
    const engagement: Engagement = {
      id: crypto.randomUUID(),
      accountId,
      type: message ? 'comment' : 'like',
      message,
      createdAt: new Date().toISOString(),
    }
    await this.publish(ENGAGEMENT_TOPIC, engagement)
    this.engagements.push(engagement)
    console.log(`[InstagramAgent] engage ${accountId}: ${message}`)
  }

  async close() {
    for (const sub of this.subs) {
      await sub.unsubscribe()
    }
    this.subs = []
    await disconnect()
  }
}
