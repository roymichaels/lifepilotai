import { InstagramAgent } from './InstagramAgent'

export interface InstagramMissionHooks {
  dailyContent: (niche: string) => Promise<void>
}

export class InstagramAgentWrapper {
  private constructor(private agent: InstagramAgent) {}

  static async create(): Promise<InstagramAgentWrapper> {
    const agent = await InstagramAgent.create()
    return new InstagramAgentWrapper(agent)
  }

  missionHooks: InstagramMissionHooks = {
    dailyContent: async (niche: string) => {
      await this.agent.runDailyCycle(niche)
    }
  }

  async close() {
    await this.agent.close()
  }
}
