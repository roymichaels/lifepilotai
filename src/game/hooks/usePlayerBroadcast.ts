import { useEffect, useRef } from 'react'
import { connect, sendOnTopic } from '@/lib/waku'
import { wakuTopics } from '@/lib/wakuTopics'

export interface PlayerState {
  id: string
  position: { x: number; y: number }
}

export function usePlayerBroadcast(state: PlayerState | null) {
  const prev = useRef<PlayerState | null>(null)

  useEffect(() => {
    if (!state) return
    if (
      prev.current &&
      prev.current.position.x === state.position.x &&
      prev.current.position.y === state.position.y
    ) {
      return
    }
    prev.current = state
    async function publish() {
      try {
        await connect()
        await sendOnTopic(wakuTopics.playerState, state)
      } catch (err) {
        console.warn('[waku] failed to broadcast player state', err)
      }
    }
    publish()
  }, [state])
}
