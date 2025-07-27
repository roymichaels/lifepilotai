import { useEffect } from 'react'
import { ShapeStream, isChangeMessage } from '@electric-sql/client'
import { run } from '@/lib/db'
import type { Project } from '@/types/project'
import type { ChatMessage } from '@/types/chat'

interface MessageRow extends ChatMessage {
  id: number
  projectId: string
}

interface SummaryRow {
  id: string
  summary: string
  createdAt: string
}

interface TipRow {
  id: string
  projectId: string
  tip: string
  createdAt: string
}

interface BrainSettingsRow {
  key: string
  value: string
}

/**
 * Hook that syncs local ElectricSQL tables with the backend when the browser
 * comes online using the official client utilities.
 */
export function useElectricSync() {
  useEffect(() => {
    if (!import.meta.env.VITE_ELECTRIC_URL) {
      console.warn('[electric] VITE_ELECTRIC_URL not defined; skipping sync')
      return
    }
    let projectStream: ShapeStream<Project> | null = null
    let messageStream: ShapeStream<MessageRow> | null = null
  let summaryStream: ShapeStream<SummaryRow> | null = null
  let tipStream: ShapeStream<TipRow> | null = null
  let brainStream: ShapeStream<BrainSettingsRow> | null = null

    const startProjects = async () => {
      if (!navigator.onLine) return
      if (projectStream?.isConnected()) return

      try {
        projectStream = new ShapeStream<Project>({
          url: `${import.meta.env.VITE_ELECTRIC_URL}/v1/shape`,
          params: { table: 'projects', replica: 'full' },
          subscribe: true,
          onError: async err => {
            console.error('[electric] project sync error', err)
            projectStream?.unsubscribeAll()
            projectStream = null
            if (navigator.onLine) setTimeout(startProjects, 5000)
          }
        })

        projectStream.subscribe(async messages => {
          for (const msg of messages) {
            if (isChangeMessage<Project>(msg)) {
              const { operation } = msg.headers
              const row = msg.value as Project
              if (operation === 'insert' || operation === 'update') {
                await run(
                  'INSERT OR REPLACE INTO projects (id,name,icon,category,createdAt,updatedAt,profile,character,milestones,widgets,chatHistory) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                  [
                    row.id,
                    row.name,
                    row.icon,
                    row.category,
                    String(row.createdAt),
                    String(row.updatedAt),
                    JSON.stringify(row.profile),
                    JSON.stringify(row.character),
                    JSON.stringify(row.milestones),
                    JSON.stringify(row.widgets),
                    JSON.stringify(row.chatHistory)
                  ]
                )
              } else if (operation === 'delete') {
                await run('DELETE FROM projects WHERE id = ?', [row.id])
              }
            }
          }
        })
      } catch (err) {
        console.error('[electric] failed to start project sync', err)
        if (navigator.onLine) setTimeout(startProjects, 5000)
      }
    }

    const startMessages = async () => {
      if (!navigator.onLine) return
      if (messageStream?.isConnected()) return

      try {
        messageStream = new ShapeStream<MessageRow>({
          url: `${import.meta.env.VITE_ELECTRIC_URL}/v1/shape`,
          params: { table: 'messages', replica: 'full' },
          subscribe: true,
          onError: async err => {
            console.error('[electric] message sync error', err)
            messageStream?.unsubscribeAll()
            messageStream = null
            if (navigator.onLine) setTimeout(startMessages, 5000)
          }
        })

        messageStream.subscribe(async messages => {
          for (const msg of messages) {
            if (isChangeMessage<MessageRow>(msg)) {
              const { operation } = msg.headers
              const row = msg.value as MessageRow
              if (operation === 'insert' || operation === 'update') {
                await run(
                  'INSERT OR REPLACE INTO messages (id, projectId, sender, text, timestamp) VALUES (?,?,?,?,?)',
                  [row.id, row.projectId, row.sender, row.text, row.timestamp]
                )
              } else if (operation === 'delete') {
                await run('DELETE FROM messages WHERE id = ?', [row.id])
              }
            }
          }
        })
      } catch (err) {
        console.error('[electric] failed to start message sync', err)
        if (navigator.onLine) setTimeout(startMessages, 5000)
      }
    }

    const startSummaries = async () => {
      if (!navigator.onLine) return
      if (summaryStream?.isConnected()) return

      try {
        summaryStream = new ShapeStream<SummaryRow>({
          url: `${import.meta.env.VITE_ELECTRIC_URL}/v1/shape`,
          params: { table: 'summaries', replica: 'full' },
          subscribe: true,
          onError: async err => {
            console.error('[electric] summary sync error', err)
            summaryStream?.unsubscribeAll()
            summaryStream = null
            if (navigator.onLine) setTimeout(startSummaries, 5000)
          }
        })

        summaryStream.subscribe(async messages => {
          for (const msg of messages) {
            if (isChangeMessage<SummaryRow>(msg)) {
              const { operation } = msg.headers
              const row = msg.value as SummaryRow
              if (operation === 'insert' || operation === 'update') {
                await run(
                  'INSERT OR REPLACE INTO summaries (id, summary, createdAt) VALUES (?,?,?)',
                  [row.id, row.summary, row.createdAt]
                )
              } else if (operation === 'delete') {
                await run('DELETE FROM summaries WHERE id = ?', [row.id])
              }
            }
          }
        })
      } catch (err) {
        console.error('[electric] failed to start summary sync', err)
        if (navigator.onLine) setTimeout(startSummaries, 5000)
      }
    }

  const startTips = async () => {
    if (!navigator.onLine) return
    if (tipStream?.isConnected()) return

    try {
      tipStream = new ShapeStream<TipRow>({
        url: `${import.meta.env.VITE_ELECTRIC_URL}/v1/shape`,
        params: { table: 'tips', replica: 'full' },
        subscribe: true,
        onError: async err => {
          console.error('[electric] tip sync error', err)
          tipStream?.unsubscribeAll()
          tipStream = null
          if (navigator.onLine) setTimeout(startTips, 5000)
        }
      })

      tipStream.subscribe(async messages => {
        for (const msg of messages) {
          if (isChangeMessage<TipRow>(msg)) {
            const { operation } = msg.headers
            const row = msg.value as TipRow
            if (operation === 'insert' || operation === 'update') {
              await run(
                'INSERT OR REPLACE INTO tips (id, projectId, tip, createdAt) VALUES (?,?,?,?)',
                [row.id, row.projectId, row.tip, row.createdAt]
              )
            } else if (operation === 'delete') {
              await run('DELETE FROM tips WHERE id = ?', [row.id])
            }
          }
        }
      })
    } catch (err) {
      console.error('[electric] failed to start tip sync', err)
      if (navigator.onLine) setTimeout(startTips, 5000)
    }
  }

    const startBrainSettings = async () => {
      if (!navigator.onLine) return
      if (brainStream?.isConnected()) return

      try {
        brainStream = new ShapeStream<BrainSettingsRow>({
          url: `${import.meta.env.VITE_ELECTRIC_URL}/v1/shape`,
          params: { table: 'brain_settings', replica: 'full' },
          subscribe: true,
          onError: async err => {
            console.error('[electric] brain settings sync error', err)
            brainStream?.unsubscribeAll()
            brainStream = null
            if (navigator.onLine) setTimeout(startBrainSettings, 5000)
          }
        })

        brainStream.subscribe(async messages => {
          for (const msg of messages) {
            if (isChangeMessage<BrainSettingsRow>(msg)) {
              const { operation } = msg.headers
              const row = msg.value as BrainSettingsRow
              if (operation === 'insert' || operation === 'update') {
                await run(
                  'INSERT OR REPLACE INTO brain_settings (key, value) VALUES (?,?)',
                  [row.key, row.value]
                )
              } else if (operation === 'delete') {
                await run('DELETE FROM brain_settings WHERE key = ?', [row.key])
              }
            }
          }
        })
      } catch (err) {
        console.error('[electric] failed to start brain settings sync', err)
        if (navigator.onLine) setTimeout(startBrainSettings, 5000)
      }
    }

    const startAll = () => {
      startProjects()
      startMessages()
      startSummaries()
      startTips()
      // startBrainSettings()
    }

    window.addEventListener('online', startAll)
    startAll()

    return () => {
      window.removeEventListener('online', startAll)
      projectStream?.unsubscribeAll()
      messageStream?.unsubscribeAll()
      summaryStream?.unsubscribeAll()
      tipStream?.unsubscribeAll()
      brainStream?.unsubscribeAll()
    }
  }, [])
}
