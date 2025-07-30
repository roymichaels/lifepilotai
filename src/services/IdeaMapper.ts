import { connect, disconnect } from '../lib/waku'
import {
  IDEAS_TOPIC,
  IDEA_MAPPINGS_TOPIC,
  subscribeToTopic,
  sendMessage
} from '../lib/wakuTopics'
import { IpfsService } from './IpfsService'

export interface IdeaMapping {
  id: string
  instagramIdeaId: string
  fiverrIdea: string
  youtubeIdea: string
  createdAt: string
  ipfsHash?: string
}

export class IdeaMapper {
  mappings: IdeaMapping[] = []
  private subs: { unsubscribe: () => Promise<void> }[] = []

  private constructor() {}

  static async create(): Promise<IdeaMapper> {
    await connect()
    const mapper = new IdeaMapper()
    await mapper.subscribe()
    return mapper
  }

  private async subscribe() {
    const sub = await subscribeToTopic(IDEAS_TOPIC, data => {
      void this.handleInstagramIdea(data)
    })
    this.subs.push(sub)
  }

  private async handleInstagramIdea(idea: any) {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const mapping: IdeaMapping = {
      id,
      instagramIdeaId: idea.id,
      fiverrIdea: `Gig inspired by ${idea.id}`,
      youtubeIdea: `Video idea inspired by ${idea.id}`,
      createdAt
    }

    try {
      const hash = await IpfsService.uploadJson(mapping)
      mapping.ipfsHash = hash
      await sendMessage(IDEA_MAPPINGS_TOPIC, {
        id,
        instagramIdeaId: idea.id,
        hash,
        createdAt
      })
    } catch (err) {
      console.error('[IdeaMapper] failed to store mapping', err)
    }

    this.mappings.push(mapping)
  }

  async close() {
    for (const sub of this.subs) {
      await sub.unsubscribe()
    }
    this.subs = []
    await disconnect()
  }
}
