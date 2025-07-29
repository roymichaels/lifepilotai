import {
  LightNode,
  createDecoder,
  createEncoder,
} from '@waku/sdk'
import { connect } from '../lib/waku'

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
}

/**
 * Basic autonomous Instagram agent.
 * Discovers accounts, analyses posts and stores daily content ideas.
 * Uses Waku peer-to-peer messaging with in-memory storage.
 */
const ACCOUNTS_TOPIC = '/aura/instagram-agent/accounts/1/app'
const IDEAS_TOPIC = '/aura/instagram-agent/ideas/1/app'

export class InstagramAgent {
  private accounts: Account[] = []
  private ideas: ContentIdea[] = []

  private constructor(private node: LightNode) {}

  static async create(): Promise<InstagramAgent> {
    const node = await connect()
    const agent = new InstagramAgent(node)
    await agent.subscribe()
    return agent
  }

  private async publish(topic: string, data: object): Promise<void> {
    const encoder = createEncoder({ contentTopic: topic })
    const payload = new TextEncoder().encode(JSON.stringify(data))
    await this.node.lightPush.send(encoder, { payload })
  }

  private async subscribe() {
    const accountDecoder = createDecoder(ACCOUNTS_TOPIC)
    await this.node.filter.subscribe(accountDecoder, msg => {
      if (!msg.payload) return
      try {
        const text = new TextDecoder().decode(msg.payload)
        const data = JSON.parse(text) as Account
        this.accounts.push(data)
      } catch (err) {
        console.error('[InstagramAgent] failed to decode account', err)
      }
    })

    const ideaDecoder = createDecoder(IDEAS_TOPIC)
    await this.node.filter.subscribe(ideaDecoder, msg => {
      if (!msg.payload) return
      try {
        const text = new TextDecoder().decode(msg.payload)
        const data = JSON.parse(text) as ContentIdea
        this.ideas.push(data)
      } catch (err) {
        console.error('[InstagramAgent] failed to decode idea', err)
      }
    })
  }

  async discoverAccounts(niche: string): Promise<Account[]> {
    const id = crypto.randomUUID()
    const username = `${niche}_example`
    const followers = Math.floor(Math.random() * 1000)
    const discoveredAt = new Date().toISOString()
    const account: Account = { id, username, followers, niche, discoveredAt }
    await this.publish(ACCOUNTS_TOPIC, account)
    this.accounts.push(account)
    return [account]
  }

  async analyzeAccount(accountId: string): Promise<string> {
    // Placeholder analysis implementation
    const hook = `Hook for ${accountId}`
    const ideaId = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const idea: ContentIdea = { id: ideaId, accountId, idea: hook, createdAt }
    await this.publish(IDEAS_TOPIC, idea)
    this.ideas.push(idea)
    return hook
  }

  async suggestDailyContent(): Promise<ContentIdea[]> {
    return this.ideas.slice(-5).reverse()
  }

  async engage(accountId: string, message: string) {
    // Placeholder for future engagement features
    console.log(`[InstagramAgent] engage ${accountId}: ${message}`)
  }

  async close() {
    await this.node.stop()
  }
}
