import Dexie, { Table } from 'dexie'
import type { Project } from '@/types/project'

/**
 * Minimal ElectricSQL client using Dexie/IndexedDB for local storage.
 * This acts as the local replica that can be synced to Postgres when online.
 */
class ElectricDatabase extends Dexie {
  projects!: Table<Project, string>
  summaries!: Table<{ id: string; summary: string; createdAt: string }, string>
  settings!: Table<{ key: string; value: string }, string>

  constructor() {
    super('lifepilot-electric')
    this.version(1).stores({
      projects: 'id',
      summaries: 'id, createdAt',
      settings: 'key'
    })
  }
}

export const electric = new ElectricDatabase()
