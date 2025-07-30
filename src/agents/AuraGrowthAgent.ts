import { InstagramAgent } from './InstagramAgent'
import { connect, disconnect } from '../lib/waku'
import {
  ACCOUNT_TOPIC,
  IDEAS_TOPIC,
  PROGRESS_TOPIC,
  sendMessage,
  subscribeToTopic
} from '../lib/wakuTopics'

export interface ProgressReport {
  accounts: number
  ideas: number
  timestamp: string
}

/**
 * AuraGrowthAgent coordinates other platform agents such as InstagramAgent
 * and publishes aggregated progress updates on a dedicated Waku topic.
 */
export class AuraGrowthAgent {
  private instagram: InstagramAgent | null = null
  private subs: { unsubscribe: () => Promise<void> }[] = []
  private accounts: any[] = []
  private ideas: any[] = []

  private constructor() {}

  static async create(): Promise<AuraGrowthAgent> {
    await connect()
    const agent = new AuraGrowthAgent()
    await agent.subscribe()
    return agent
  }

  private async subscribe() {
    const accSub = await subscribeToTopic(ACCOUNT_TOPIC, data => {
      this.accounts.push(data)
    })
    const ideaSub = await subscribeToTopic(IDEAS_TOPIC, data => {
      this.ideas.push(data)
    })
    this.subs.push(accSub, ideaSub)
  }

  /** Spawn or reuse the Instagram agent and run its daily cycle */
  async triggerInstagramCycle(niche: string): Promise<void> {
    if (!this.instagram) {
      this.instagram = await InstagramAgent.create()
    }
    await this.instagram.runDailyCycle(niche)
    await this.publishProgress()
  }

  private async publishProgress() {
    const report: ProgressReport = {
      accounts: this.accounts.length,
      ideas: this.ideas.length,
      timestamp: new Date().toISOString()
    }
    await sendMessage(PROGRESS_TOPIC, report)
  }

  async close() {
    if (this.instagram) await this.instagram.close()
    for (const sub of this.subs) await sub.unsubscribe()
    this.subs = []
    await disconnect()
  }
}
