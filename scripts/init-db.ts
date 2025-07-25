// Database initialization using ElectricSQL migrations.
// This script now uses an in-memory database so no file is created.

async function run() {
  try {
    const { Database } = await import('wa-sqlite')
    const { initSQLite } = await import('../src/lib/sqlite')

    // Use an in-memory SQLite database for local development
    const db = new Database(':memory:')
    await initSQLite(db)
    await db.close()
    console.log('Database initialized')
  } catch (err) {
    console.error('Failed to initialise database', err)
  }
}

run()
