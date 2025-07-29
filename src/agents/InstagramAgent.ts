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

  async getRecentCaptions(username: string): Promise<string[]> {
    const samples = [
      'Exploring new adventures every day.',
      'Fitness is a lifestyle, not a hobby.',
      'Freedom is the best feeling.',
      'Consistency is the secret sauce to success.',
      'Pushing limits beyond comfort zones.'
    ]
    const count = 3 + Math.floor(Math.random() * 3)
    return samples.slice(0, count)
  }

  async analyzeAccount(accountId: string): Promise<string[]> {
    const account = this.accounts.find(a => a.id === accountId)
    const captions = await this.getRecentCaptions(account?.username || '')

    const prompt = `Given these Instagram captions:\n${captions
      .map(c => `- ${c}`)
      .join('\n')}\n\nGenerate five short hook ideas for future posts.`

    const res = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You craft engaging social media hooks.',
        },
        { role: 'user', content: prompt },
      ],
    })

    const text = res.choices[0]?.message?.content || ''
    const ideas = text
      .split('\n')
      .map(l => l.replace(/^[-\d.\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 5)

    for (const ideaText of ideas) {
      const idea: ContentIdea = {
        id: crypto.randomUUID(),
        accountId,
        idea: ideaText,
        createdAt: new Date().toISOString(),
      }
      await this.publish(IDEAS_TOPIC, idea)
      this.ideas.push(idea)
    }

    return ideas
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
