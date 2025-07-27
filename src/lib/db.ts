export interface SqliteConnection {
  sqlite3: any
  db: number
}

let connection: Promise<SqliteConnection> | null = null
let SQLite: any

async function openDatabase(): Promise<SqliteConnection> {
  const SQLiteModule = await import('wa-sqlite/dist/wa-sqlite.mjs') as any
  const SQLiteFactory = SQLiteModule.default as (config?: object) => Promise<any>
  SQLite = await import('wa-sqlite')

  const module = await SQLiteFactory()
  const sqlite3 = SQLite.Factory(module)

  let vfs: any
  if (typeof navigator !== 'undefined' && (navigator as any).storage?.getDirectory) {
    const { OriginPrivateFileSystemVFS } = await import('wa-sqlite/src/examples/OriginPrivateFileSystemVFS.js')
    vfs = new OriginPrivateFileSystemVFS()
  } else {
    const { IDBBatchAtomicVFS } = await import('wa-sqlite/src/examples/IDBBatchAtomicVFS.js')
    vfs = new IDBBatchAtomicVFS('lifepilot')
  }
  sqlite3.vfs_register(vfs, true)

  const flags = SQLite.SQLITE_OPEN_CREATE | SQLite.SQLITE_OPEN_READWRITE
  const db = await sqlite3.open_v2('lifepilot.db', flags, vfs.name)

  await initializeSchema(sqlite3, db)
  return { sqlite3, db }
}

async function initializeSchema(sqlite3: any, db: number) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS projects (
      id text primary key,
      name text not null,
      icon text not null,
      category text not null,
      createdAt text not null,
      updatedAt text not null,
      profile text,
      character text,
      milestones text,
      widgets text,
      chatHistory text
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id integer primary key autoincrement,
      projectId text not null,
      sender text not null,
      text text,
      timestamp text not null
    )`,
    `CREATE TABLE IF NOT EXISTS summaries (
      id text primary key,
      summary text not null,
      createdAt text not null
    )`,
    `CREATE TABLE IF NOT EXISTS tips (
      id text primary key,
      projectId text not null,
      tip text not null,
      createdAt text not null
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key text primary key,
      value text not null
    )`,
    `CREATE TABLE IF NOT EXISTS brain_settings (
      key text primary key,
      value text not null
    )`
  ]

  for (const sql of statements) {
    await sqlite3.exec(db, sql)
  }
}

export async function getConnection(): Promise<SqliteConnection> {
  if (!connection) connection = openDatabase()
  return connection
}

export async function run(sql: string, params: any[] = []): Promise<void> {
  const { sqlite3, db } = await getConnection()
  const prepared = await sqlite3.prepare_v2(db, sql)
  try {
    sqlite3.bind_collection(prepared.stmt, params)
    await sqlite3.step(prepared.stmt)
  } finally {
    await sqlite3.finalize(prepared.stmt)
  }
}

export async function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const { sqlite3, db } = await getConnection()
  const prepared = await sqlite3.prepare_v2(db, sql)
  const results: T[] = []
  try {
    sqlite3.bind_collection(prepared.stmt, params)
    const columns = sqlite3.column_names(prepared.stmt)
    while (await sqlite3.step(prepared.stmt) === SQLite.SQLITE_ROW) {
      const row = sqlite3.row(prepared.stmt)
      const obj: any = {}
      columns.forEach((c: string, i: number) => {
        obj[c] = row[i]
      })
      results.push(obj)
    }
  } finally {
    await sqlite3.finalize(prepared.stmt)
  }
  return results
}

export async function get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const rows = await all<T>(sql, params)
  return rows[0]
}
