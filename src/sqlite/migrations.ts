export interface TableDefinition {
  columns: string[]
}

/**
 * ElectricSQL schema description used for local database initialisation.
 * Only the table structure is required here so the app can create the
 * IndexedDB/SQLite replica and sync it with the backend.
 */
export const schema: { version: number; tables: Record<string, TableDefinition> } = {
  version: 1,
  tables: {
    projects: {
      columns: [
        'id text primary key',
        'name text not null',
        'icon text not null',
        'category text not null',
        'createdAt text not null',
        'updatedAt text not null',
        'profile text',
        'character text',
        'milestones text',
        'widgets text',
        'chatHistory text'
      ]
    },
    messages: {
      columns: [
        'id integer primary key autoincrement',
        'projectId text not null',
        'sender text not null',
        'text text',
        'timestamp text not null'
      ]
    },
    summaries: {
      columns: [
        'id text primary key',
        'summary text not null',
        'createdAt text not null'
      ]
    },
    settings: {
      columns: [
        'key text primary key',
        'value text not null'
      ]
    },
    brain_settings: {
      columns: [
        'key text primary key',
        'value text not null'
      ]
    },
    tips: {
      columns: [
        'id text primary key',
        'projectId text not null',
        'tip text not null',
        'createdAt text not null'
      ]
    }
  }
}
