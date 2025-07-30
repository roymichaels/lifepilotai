import { connect, disconnect } from '../lib/waku'
import {
  FIVERR_FREELANCERS_TOPIC,
  FIVERR_GIGS_TOPIC,
  sendMessage,
  subscribeToTopic
} from '../lib/wakuTopics'

export interface FreelancerInfo {
  id: string
  name: string
  rating: number
}

export interface GigUpdate {
  id: string
  title: string
  updatedAt: string
}

/**
 * Basic Fiverr agent skeleton.
 * Subscribes to freelancer and gig update topics and publishes placeholder data.
 */
export class FiverrAgent {
  private freelancers: FreelancerInfo[] = []
  private gigs: GigUpdate[] = []
  private subs: { unsubscribe: () => Promise<void> }[] = []

  private constructor() {}

  static async create(): Promise<FiverrAgent> {
    await connect()
    const agent = new FiverrAgent()
    await agent.subscribe()
    return agent
  }

  private async publish(topic: string, data: object): Promise<void> {
    await sendMessage(topic, data)
  }

  private async subscribe() {
    const freelancerSub = await subscribeToTopic<FreelancerInfo>(
      FIVERR_FREELANCERS_TOPIC,
      data => {
        this.freelancers.push(data)
      }
    )
    this.subs.push(freelancerSub)

    const gigsSub = await subscribeToTopic<GigUpdate>(FIVERR_GIGS_TOPIC, data => {
      this.gigs.push(data)
    })
    this.subs.push(gigsSub)
  }

  async analyzeTopFreelancers(category: string): Promise<FreelancerInfo[]> {
    const id = crypto.randomUUID()
    const name = `${category}_freelancer`
    const rating = 5
    const info: FreelancerInfo = { id, name, rating }
    await this.publish(FIVERR_FREELANCERS_TOPIC, info)
    this.freelancers.push(info)
    return [info]
  }

  async updateGigs(): Promise<GigUpdate[]> {
    const id = crypto.randomUUID()
    const title = `Gig ${this.gigs.length + 1}`
    const updatedAt = new Date().toISOString()
    const update: GigUpdate = { id, title, updatedAt }
    await this.publish(FIVERR_GIGS_TOPIC, update)
    this.gigs.push(update)
    return [update]
  }

  async close() {
    for (const sub of this.subs) {
      await sub.unsubscribe()
    }
    this.subs = []
    await disconnect()
  }
}
