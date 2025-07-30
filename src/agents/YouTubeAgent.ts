import { connect, disconnect } from '../lib/waku'
import {
  YT_TITLES_TOPIC,
  YT_THUMBNAILS_TOPIC,
  YT_SCRIPTS_TOPIC,
  sendMessage,
  subscribeToTopic,
} from '../lib/wakuTopics'

export interface TitleMsg {
  id: string
  videoId: string
  title: string
  createdAt: string
}

export interface ThumbnailMsg {
  id: string
  videoId: string
  thumbnail: string
  createdAt: string
}

export interface ScriptMsg {
  id: string
  videoId: string
  script: string
  createdAt: string
}

export class YouTubeAgent {
  titles: TitleMsg[] = []
  thumbnails: ThumbnailMsg[] = []
  scripts: ScriptMsg[] = []
  private subs: { unsubscribe: () => Promise<void> }[] = []

  private constructor() {}

  static async create(): Promise<YouTubeAgent> {
    await connect()
    const agent = new YouTubeAgent()
    await agent.subscribe()
    return agent
  }

  private async publish(topic: string, data: object): Promise<void> {
    await sendMessage(topic, data)
  }

  private async subscribe() {
    const titleSub = await subscribeToTopic<TitleMsg>(YT_TITLES_TOPIC, data => {
      this.titles.push(data)
    })
    this.subs.push(titleSub)

    const thumbSub = await subscribeToTopic<ThumbnailMsg>(
      YT_THUMBNAILS_TOPIC,
      data => {
        this.thumbnails.push(data)
      }
    )
    this.subs.push(thumbSub)

    const scriptSub = await subscribeToTopic<ScriptMsg>(YT_SCRIPTS_TOPIC, data => {
      this.scripts.push(data)
    })
    this.subs.push(scriptSub)
  }

  async analyzeVideo(
    videoId: string,
    title: string,
    thumbnail: string,
    script: string
  ): Promise<void> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    await this.publish(YT_TITLES_TOPIC, { id, videoId, title, createdAt })
    await this.publish(YT_THUMBNAILS_TOPIC, { id, videoId, thumbnail, createdAt })
    await this.publish(YT_SCRIPTS_TOPIC, { id, videoId, script, createdAt })
  }

  async close() {
    for (const sub of this.subs) {
      await sub.unsubscribe()
    }
    this.subs = []
    await disconnect()
  }
}
