export async function initSQLite(db: any) {
  const { electrify } = await import('electric-sql/node')
  const { schema } = await import('../sqlite/migrations')
  await electrify(db, schema as any)
}
