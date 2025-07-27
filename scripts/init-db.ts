// Database initialization using ElectricSQL migrations.
// This script now uses an in-memory database so no file is created.
import './wa-sqlite.d.ts'

async function run() {
  try {
    const { getConnection } = await import('../src/lib/db')
    const { sqlite3, db } = await getConnection()
    await sqlite3.close(db)
    console.log('Database initialized')
  } catch (err) {
    console.error('Failed to initialise database', err)
  }
}

run()
