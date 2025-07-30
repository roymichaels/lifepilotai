import cron from 'node-cron'
import { InstagramAgent } from './InstagramAgent'
import { FiverrAgent } from './FiverrAgent'
import { AuraGrowthAgent } from './AuraGrowthAgent'

export interface ScheduledJob {
  stop: () => void
}

/**
 * AgentScheduler starts agents and runs their periodic tasks using cron
 * expressions. All results continue to be pushed to Waku topics by the
 * agents themselves.
 */
export class AgentScheduler {
  private jobs: ScheduledJob[] = []
  private instagram: InstagramAgent | null = null
  private fiverr: FiverrAgent | null = null
  private growth: AuraGrowthAgent | null = null

  /** Start the scheduler and register default tasks */
  async start(): Promise<void> {
    this.instagram = await InstagramAgent.create()
    this.fiverr = await FiverrAgent.create()
    this.growth = await AuraGrowthAgent.create()

    // Instagram content discovery once a day at 9am
    this.jobs.push(
      cron.schedule('0 9 * * *', async () => {
        if (this.instagram) await this.instagram.runDailyCycle('fitness')
      })
    )

    // Fiverr gig updates every 6 hours
    this.jobs.push(
      cron.schedule('0 */6 * * *', async () => {
        if (this.fiverr) await this.fiverr.updateGigs()
      })
    )

    // Aggregated progress after Instagram cycle at 10am
    this.jobs.push(
      cron.schedule('0 10 * * *', async () => {
        if (this.growth) await this.growth.triggerInstagramCycle('fitness')
      })
    )
  }

  /** Stop all cron jobs and close agents */
  async stop(): Promise<void> {
    for (const job of this.jobs) job.stop()
    this.jobs = []
    if (this.instagram) await this.instagram.close()
    if (this.fiverr) await this.fiverr.close()
    if (this.growth) await this.growth.close()
    this.instagram = null
    this.fiverr = null
    this.growth = null
  }
}
