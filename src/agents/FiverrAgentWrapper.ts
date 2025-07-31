import { FiverrAgent } from './FiverrAgent'

export interface FiverrMissionHooks {
  analyzeFreelancers: (category: string) => Promise<void>
  updateGigs: () => Promise<void>
}

export class FiverrAgentWrapper {
  private constructor(private agent: FiverrAgent) {}

  static async create(): Promise<FiverrAgentWrapper> {
    const agent = await FiverrAgent.create()
    return new FiverrAgentWrapper(agent)
  }

  missionHooks: FiverrMissionHooks = {
    analyzeFreelancers: async (category: string) => {
      await this.agent.analyzeTopFreelancers(category)
    },
    updateGigs: async () => {
      await this.agent.updateGigs()
    }
  }

  async close() {
    await this.agent.close()
  }
}
