const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'lifepilot.db');
const schemaPath = path.join(__dirname, '../db/schema.sql');

const initialize = () => {
  const firstRun = !fs.existsSync(dbPath);
  const db = new Database(dbPath);
  if (firstRun) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
  }
  return db;
};

module.exports = initialize();
