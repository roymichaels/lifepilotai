import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(__dirname, '..', 'lifepilot.db');
const schemaPath = path.join(__dirname, 'schema.sql');

export const initialize = (): Database.Database => {
  const firstRun = !fs.existsSync(dbPath);
  const db = new Database(dbPath);
  if (firstRun) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
  }
  return db;
};

const db = initialize();
export default db;
