import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const defaultDbPath = path.resolve(__dirname, "../../data/app.db");
const dbPath = process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : defaultDbPath;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    deviceId TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

export default db;
