// Database initialization using ElectricSQL migrations.
// This script now uses an in-memory database so no file is created.

async function run() {
  try {
    const SQLiteFactory = (await import('wa-sqlite/dist/wa-sqlite.mjs')).default
    const SQLite = await import('wa-sqlite')
    const { initSQLite } = await import('../src/lib/sqlite')

    // Use an in-memory SQLite database for local development
    const module = await SQLiteFactory()
    const sqlite3 = SQLite.Factory(module)
    const db = await sqlite3.open_v2(':memory:')
    await initSQLite(db)
    await sqlite3.close(db)
    console.log('Database initialized')
  } catch (err) {
    console.error('Failed to initialise database', err)
  }
}

run()
