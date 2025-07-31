import { YouTubeAgent } from './YouTubeAgent'

export interface YouTubeMissionHooks {
  analyzeVideo: (
    id: string,
    title: string,
    thumbnail: string,
    script: string
  ) => Promise<void>
}

export class YouTubeAgentWrapper {
  private constructor(private agent: YouTubeAgent) {}

  static async create(): Promise<YouTubeAgentWrapper> {
    const agent = await YouTubeAgent.create()
    return new YouTubeAgentWrapper(agent)
  }

  missionHooks: YouTubeMissionHooks = {
    analyzeVideo: async (id, title, thumbnail, script) => {
      await this.agent.analyzeVideo(id, title, thumbnail, script)
    }
  }

  async close() {
    await this.agent.close()
  }
}
