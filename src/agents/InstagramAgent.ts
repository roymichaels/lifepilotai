import { disconnect, connect } from '../lib/waku'
import {
  ACCOUNT_TOPIC,
  IDEAS_TOPIC,
  sendMessage,
  subscribeToTopic,
} from '../lib/wakuTopics'
import OpenAI from 'openai'

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
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

  async runDailyCycle(niche: string): Promise<void> {
    const count = Math.random() > 0.5 ? 2 : 1
    const discovered: Account[] = []
    for (let i = 0; i < count; i++) {
      const [account] = await this.discoverAccounts(niche)
      discovered.push(account)
    }
    for (const acc of discovered) {
      const captions = await this.fetchMockCaptions(acc.username)
      await this.analyzeAccount(acc.id, captions)
    }
    // This can later be scheduled with setInterval or cron
  }

  private async fetchMockCaptions(username: string): Promise<string[]> {
    return [
      `${username} just dropped a new tip!`,
      `Learning about ${username} every day.`,
      `Follow for more ${username} content.`,
    ]
  }

  async analyzeAccount(accountId: string, captions: string[]): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
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
