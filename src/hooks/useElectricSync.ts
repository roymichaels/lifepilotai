import { useEffect } from 'react'
import axios from 'axios'
import { electric } from '@/lib/electric'

/**
 * Hook that syncs local ElectricSQL tables with the backend when the
 * browser comes online. This is a very small placeholder implementation
 * that posts the current project table to `/api/sync/projects`.
 */
export function useElectricSync() {
  useEffect(() => {
    const sync = async () => {
      if (!navigator.onLine) return
      try {
        const projects = await electric.projects.toArray()
        await axios.post('/api/sync/projects', { projects })
        console.debug('[electric] synced projects to server')
      } catch (err) {
        console.error('[electric] sync failed', err)
      }
    }

    window.addEventListener('online', sync)
    sync()
    return () => window.removeEventListener('online', sync)
  }, [])
}
