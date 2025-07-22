const db = require('../db');

function map(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    name: row.name,
    level: row.level,
    xp: row.xp,
    unlockedSkills: row.unlocked_skills ? JSON.parse(row.unlocked_skills) : [],
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
    isActive: row.is_active === 1,
    refreshToken: row.refresh_token
  };
}

function listUsers() {
  const rows = db.prepare('SELECT * FROM users').all();
  return rows.map(map);
}

function getUserById(id) {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  return map(row);
}

function getUserByEmail(email) {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  return map(row);
}

function createUser({ email, password, name = '' }) {
  const stmt = db.prepare('INSERT INTO users (email, password, name, created_at, last_login_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
  const info = stmt.run(email, password, name);
  return getUserById(info.lastInsertRowid);
}

function updateUser(id, data) {
  const fields = [];
  const values = [];
  if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
  if (data.password !== undefined) { fields.push('password = ?'); values.push(data.password); }
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.refreshToken !== undefined) { fields.push('refresh_token = ?'); values.push(data.refreshToken); }
  if (data.lastLoginAt !== undefined) { fields.push('last_login_at = ?'); values.push(data.lastLoginAt); }
  if (fields.length === 0) return getUserById(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);
  db.prepare(query).run(...values);
  return getUserById(id);
}

function deleteUser(id) {
  const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = {
  listUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};
