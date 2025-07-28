import '../../scripts/wa-sqlite.d.ts'

let sqlite3: any | undefined
let db: any | undefined

async function openDb() {
  if (!db) {
    const SQLiteModule = await import('wa-sqlite/dist/wa-sqlite.mjs') as any
    const SQLiteFactory = SQLiteModule.default as (config?: object) => Promise<any>
    const SQLite = await import('wa-sqlite')
    const module = await SQLiteFactory()
    sqlite3 = SQLite.Factory(module)
    db = await sqlite3.open_v2(':memory:')
  }
  return { sqlite3, db }
}

export interface TraitRecord {
  name: string
  value: string
  timestamp: string
}

export async function addTrait(name: string, value: string): Promise<void> {
  const { sqlite3, db } = await openDb()
  const ts = new Date().toISOString()
  const escapedName = name.replace(/'/g, "''")
  const escapedValue = value.replace(/'/g, "''")
  await sqlite3.exec(db, `INSERT INTO traits(name, value, timestamp) VALUES ('${escapedName}', '${escapedValue}', '${ts}')`)
}

export async function getTraits(): Promise<string[]> {
  const { sqlite3, db } = await openDb()
  const traits: string[] = []
  await sqlite3.exec(db, 'SELECT DISTINCT name FROM traits ORDER BY name', (row: any[]) => {
    traits.push(row[0])
  })
  return traits
}

export async function getHistory(name: string): Promise<TraitRecord[]> {
  const { sqlite3, db } = await openDb()
  const escaped = name.replace(/'/g, "''")
  const records: TraitRecord[] = []
  await sqlite3.exec(db, `SELECT name, value, timestamp FROM traits WHERE name='${escaped}' ORDER BY timestamp DESC`, (row: any[]) => {
    records.push({ name: row[0], value: row[1], timestamp: row[2] })
  })
  return records
}

export const TraitService = {
  addTrait,
  getTraits,
  getHistory
}

export default TraitService
