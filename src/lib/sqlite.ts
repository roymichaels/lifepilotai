/**
 * Initialise a SQLite database using raw SQL statements.
 * The provided `sqlite3` instance must expose an `exec` function
 * compatible with the `wa-sqlite` API.
 */
export async function initSQLite(sqlite3: any, db: any) {
  const { schema } = await import('../sqlite/migrations')
  for (const [table, def] of Object.entries(schema.tables)) {
    const columns = (def as any).columns.join(', ')
    await sqlite3.exec(db, `CREATE TABLE IF NOT EXISTS ${table} (${columns});`)
  }
}
