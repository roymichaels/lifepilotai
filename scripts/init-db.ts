import { resolve } from 'node:path'

// Database initialization using ElectricSQL migrations
async function run() {
  try {
    const { ElectricDatabase, electrify } = await import('electric-sql/wa-sqlite')
    const { schema } = await import('../src/sqlite/migrations')

    const dbName = resolve(__dirname, '../blue-ocean.db')
    const db = await ElectricDatabase.init(dbName)
    await electrify(db, schema)
    console.log('Database initialized')
  } catch (err) {
    console.error('Failed to initialise database', err)
  }
}

run()
