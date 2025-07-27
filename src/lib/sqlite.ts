import { getConnection } from './db'

export async function initSQLite() {
  await getConnection()
}
