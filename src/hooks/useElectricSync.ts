import { useEffect } from 'react'
import { ShapeStream, isChangeMessage } from '@electric-sql/client'
import { electric } from '@/lib/electric'
import type { Project } from '@/types/project'

/**
 * Hook that syncs local ElectricSQL tables with the backend when the browser
 * comes online using the official client utilities.
 */
export function useElectricSync() {
  useEffect(() => {
    let stream: ShapeStream<Project> | null = null

    const startSync = async () => {
      if (!navigator.onLine) return

      if (stream?.isConnected()) return

      try {
        stream = new ShapeStream<Project>({
          url: `${import.meta.env.VITE_ELECTRIC_URL}/v1/shape`,
          params: { table: 'projects', replica: 'full' },
          subscribe: true,
          onError: async err => {
            console.error('[electric] sync error', err)
            stream?.unsubscribeAll()
            stream = null
            if (navigator.onLine) setTimeout(startSync, 5000)
          }
        })

        stream.subscribe(async messages => {
          for (const msg of messages) {
            if (isChangeMessage<Project>(msg)) {
              const { operation } = msg.headers
              const row = msg.value as Project
              if (operation === 'insert' || operation === 'update') {
                await electric.projects.put(row)
              } else if (operation === 'delete') {
                await electric.projects.delete(row.id)
              }
            }
          }
        })
      } catch (err) {
        console.error('[electric] failed to start sync', err)
        if (navigator.onLine) setTimeout(startSync, 5000)
      }
    }

    window.addEventListener('online', startSync)
    startSync()
    return () => {
      window.removeEventListener('online', startSync)
      stream?.unsubscribeAll()
    }
  }, [])
}
