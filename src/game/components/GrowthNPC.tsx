import { useEffect, useState } from 'react'
import { subscribeToTopic, PROGRESS_TOPIC } from '@/lib/wakuTopics'
import type { ProgressReport } from '@/agents/AuraGrowthAgent'

export function GrowthNPC() {
  const [events, setEvents] = useState<ProgressReport[]>([])
  useEffect(() => {
    let sub: { unsubscribe: () => Promise<void> } | null = null
    async function start() {
      sub = await subscribeToTopic<ProgressReport>(PROGRESS_TOPIC, data =>
        setEvents(prev => [...prev.slice(-4), data])
      )
    }
    start()
    return () => {
      if (sub) sub.unsubscribe()
    }
  }, [])

  return (
    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
      <div className="font-bold">Growth NPC</div>
      {events.map((e, idx) => (
        <div key={idx}>
          {new Date(e.timestamp).toLocaleTimeString()}: {e.accounts} accounts, {e.ideas} ideas
        </div>
      ))}
    </div>
  )
}

export default GrowthNPC
