import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import { MISSION_SEEDS } from "./missions-data";

// Singleton SQLite connection. Stored in ./data/app.db (created on first run).
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

declare global {
  // eslint-disable-next-line no-var
  var __mirae_db__: Database.Database | undefined;
}

function init(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'intern',
      status        TEXT NOT NULL DEFAULT 'pending',
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS missions (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      slug              TEXT NOT NULL UNIQUE,
      title             TEXT NOT NULL,
      short_description TEXT NOT NULL,
      instructions      TEXT NOT NULL,
      deliverable_type  TEXT NOT NULL,
      sort_order        INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mission_id    INTEGER NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
      status        TEXT NOT NULL DEFAULT 'submitted',
      memo          TEXT,
      admin_comment TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
      reviewed_at   TEXT,
      UNIQUE(user_id, mission_id)
    );

    CREATE TABLE IF NOT EXISTS submission_files (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      path          TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type     TEXT NOT NULL,
      kind          TEXT NOT NULL DEFAULT 'other'
    );
  `);

  seed(db);
  return db;
}

function seed(db: Database.Database) {
  // Seed missions (idempotent, keyed by slug).
  const missionCount = db.prepare("SELECT COUNT(*) AS c FROM missions").get() as { c: number };
  if (missionCount.c === 0) {
    const insert = db.prepare(
      `INSERT INTO missions (slug, title, short_description, instructions, deliverable_type, sort_order)
       VALUES (@slug, @title, @short_description, @instructions, @deliverable_type, @sort_order)`,
    );
    MISSION_SEEDS.forEach((m, i) => insert.run({ ...m, sort_order: i }));
  }

  // Seed a default admin so the site is usable out of the box.
  const adminEmail = "admin@miraeasset.com";
  const adminExists = db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail);
  if (!adminExists) {
    db.prepare(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES (?, ?, ?, 'admin', 'approved')`,
    ).run("Mirae Admin", adminEmail, bcrypt.hashSync("admin1234", 10));
  }

  // Seed a couple of demo interns (one approved, one pending) for a populated demo.
  const demoEmail = "loc@miraeasset.com";
  const demoExists = db.prepare("SELECT id FROM users WHERE email = ?").get(demoEmail);
  if (!demoExists) {
    db.prepare(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES (?, ?, ?, 'intern', 'approved')`,
    ).run("Loc Tran", demoEmail, bcrypt.hashSync("intern1234", 10));

    db.prepare(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES (?, ?, ?, 'intern', 'pending')`,
    ).run("Cookie Run", "ckrun91@gmail.com", bcrypt.hashSync("intern1234", 10));
  }
}

export function getDb(): Database.Database {
  if (!global.__mirae_db__) global.__mirae_db__ = init();
  return global.__mirae_db__;
}
