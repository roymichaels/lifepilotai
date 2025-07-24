import path from 'path'

// Database initialization using ElectricSQL migrations

async function run() {
  try {
    const { Database } = await import('wa-sqlite')
    const { initSQLite } = await import('../src/lib/sqlite')

    const dbPath = path.resolve(__dirname, '../blue-ocean.db')
    const db = new Database(dbPath)
    await initSQLite(db)
    await db.close()
    console.log('Database initialized')
  } catch (err) {
    console.error('Failed to initialise database', err)
  }
}

run()
