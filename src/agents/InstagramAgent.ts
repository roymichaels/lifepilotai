import { disconnect, connect } from '../lib/waku'
import {
  ACCOUNT_TOPIC,
  IDEAS_TOPIC,
  sendMessage,
  subscribeToTopic,
} from '../lib/wakuTopics'

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
export class InstagramAgent {
  private accounts: Account[] = []
  private ideas: ContentIdea[] = []
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
    for (const sub of this.subs) {
      await sub.unsubscribe()
    }
    this.subs = []
    await disconnect()
  }
}
