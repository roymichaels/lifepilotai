import { AuraGrowthAgent } from './AuraGrowthAgent'

export interface AuraGrowthMissionHooks {
  growthCycle: (niche: string) => Promise<void>
}

export class AuraGrowthAgentWrapper {
  private constructor(private agent: AuraGrowthAgent) {}

  static async create(): Promise<AuraGrowthAgentWrapper> {
    const agent = await AuraGrowthAgent.create()
    return new AuraGrowthAgentWrapper(agent)
  }

  missionHooks: AuraGrowthMissionHooks = {
    growthCycle: async (niche: string) => {
      await this.agent.triggerInstagramCycle(niche)
    }
  }

  async close() {
    await this.agent.close()
  }
}
