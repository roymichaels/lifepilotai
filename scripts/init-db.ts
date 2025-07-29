// Local SQLite database initialisation.
// Uses an in-memory database so no file is created.
import './wa-sqlite.d.ts'

async function run() {
  try {
    const SQLiteModule = await import('wa-sqlite/dist/wa-sqlite.mjs') as any
    const SQLiteFactory = SQLiteModule.default as (config?: object) => Promise<any>
    const SQLite = await import('wa-sqlite')
    const { initSQLite } = await import('../src/lib/sqlite')

    // Use an in-memory SQLite database for local development
    const module = await SQLiteFactory()
    const sqlite3 = SQLite.Factory(module)
    const db = await sqlite3.open_v2(':memory:')
    await initSQLite(sqlite3, db)
    await sqlite3.close(db)
    console.log('Database initialized')
  } catch (err) {
    console.error('Failed to initialise database', err)
  }
}

run()
