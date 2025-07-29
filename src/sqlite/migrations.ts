export interface TableDefinition {
  columns: string[]
}

export interface LocalDbSchema {
  version: number
  tables: Record<string, TableDefinition>
}

/**
 * Simple schema description for local SQLite initialisation.
 * Each table lists the column definitions used to create tables.
 */
export const schema: LocalDbSchema = {
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
    },
    ig_accounts: {
      columns: [
        'id text primary key',
        'username text not null',
        'followers integer not null',
        'niche text',
        'discoveredAt text not null'
      ]
    },
    ig_content: {
      columns: [
        'id text primary key',
        'accountId text not null',
        'idea text not null',
        'createdAt text not null'
      ]
    }
  }
}
