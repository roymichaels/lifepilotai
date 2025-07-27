import { describe, it, expect } from 'vitest'
import Database from 'better-sqlite3'

describe('SQLite client', () => {
  it('writes and reads values', () => {
    const db = new Database(':memory:')
    db.exec("CREATE TABLE brain_settings(key text primary key, value text not null)")
    db.prepare('INSERT INTO brain_settings(key, value) VALUES(?, ?)').run('k', 'v')
    const row = db.prepare('SELECT value FROM brain_settings WHERE key=?').get('k')
    expect(row.value).toBe('v')
    db.close()
  })
})
