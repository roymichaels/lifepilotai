import Dexie, { Table } from 'dexie'
import type { Project } from '@/types/project'
import type { ChatMessage } from '@/types/chat'

/**
 * Minimal client using Dexie/IndexedDB for local storage.
 * Acts as the local database that can optionally sync when online.
 */
class ElectricDatabase extends Dexie {
  projects!: Table<Project, string>
  summaries!: Table<{ id: string; summary: string; createdAt: string }, string>
  messages!: Table<ChatMessage & { projectId: string }, number>
  settings!: Table<{ key: string; value: string }, string>
  brain_settings!: Table<{ key: string; value: string }, string>
  tips!: Table<{ id: string; projectId: string; tip: string; createdAt: string }, string>

  constructor() {
    super('lifepilot-electric')
    this.version(4).stores({
      projects: 'id',
      summaries: 'id, createdAt',
      settings: 'key',
      brain_settings: 'key',
      messages: '++id, projectId, timestamp',
      tips: 'id, projectId, createdAt'
    })
  }
}

export const electric = new ElectricDatabase()
