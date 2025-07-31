import { connect, disconnect } from '@/lib/waku'
import { sendMessage, subscribeToTopic, wakuTopics } from '@/lib/wakuTopics'
import { IpfsService } from '@/services/IpfsService'

export interface PlayerState {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  timestamp: string
  ipfsHash?: string
}

export class Networking {
  private subs: { unsubscribe: () => Promise<void> }[] = []

  private constructor(private readonly playerId: string) {}

  static async create(playerId: string): Promise<Networking> {
    await connect()
    return new Networking(playerId)
  }

  async subscribeToPlayer(
    id: string,
    handler: (state: PlayerState) => void
  ) {
    const sub = await subscribeToTopic<PlayerState>(
      wakuTopics.gamePlayerState(id),
      data => handler(data)
    )
    this.subs.push(sub)
    return sub
  }

  async broadcastState(
    position: [number, number, number],
    rotation: [number, number, number],
    snapshot = false
  ) {
    const state: PlayerState = {
      id: this.playerId,
      position,
      rotation,
      timestamp: new Date().toISOString()
    }

    if (snapshot) {
      try {
        const hash = await IpfsService.uploadJson(state)
        state.ipfsHash = hash
      } catch (err) {
        console.error('[Networking] failed to upload snapshot', err)
      }
    }

    await sendMessage(wakuTopics.gamePlayerState(this.playerId), state)
  }

  async close() {
    for (const sub of this.subs) {
      await sub.unsubscribe()
    }
    this.subs = []
    await disconnect()
  }
}
