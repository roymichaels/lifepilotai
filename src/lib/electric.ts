import Dexie, { Table } from 'dexie'
import type { Project } from '@/types/project'
import type { ChatMessage } from '@/types/chat'

/**
 * Minimal ElectricSQL client using Dexie/IndexedDB for local storage.
 * This acts as the local replica that can be synced to Postgres when online.
 */
class ElectricDatabase extends Dexie {
  projects!: Table<Project, string>
  summaries!: Table<{ id: string; summary: string; createdAt: string }, string>
  messages!: Table<ChatMessage & { projectId: string }, number>
  settings!: Table<{ key: string; value: string }, string>

  constructor() {
    super('lifepilot-electric')
    this.version(2).stores({
      projects: 'id',
      summaries: 'id, createdAt',
      settings: 'key',
      messages: '++id, projectId, timestamp'
    })
  }
}

export const electric = new ElectricDatabase()
