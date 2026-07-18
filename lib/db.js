// Lightweight billing/subscriptions store using Node's built-in SQLite (node:sqlite, Node 22.5+).
// The database file lives outside the repo (data-store/, gitignored) so customer PII never
// gets committed to git.

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '..', 'data-store');
const DB_PATH = path.join(DB_DIR, 'evotrade.sqlite');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    product_slug TEXT NOT NULL,
    product_name TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'monthly',
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

function createSubscription({ name, email, phone, company, productSlug, productName, plan }) {
  const stmt = db.prepare(`
    INSERT INTO subscriptions (name, email, phone, company, product_slug, product_name, plan)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(name, email, phone || null, company || null, productSlug, productName, plan);
  return Number(info.lastInsertRowid);
}

function listSubscriptions({ status } = {}) {
  const sql = status
    ? 'SELECT * FROM subscriptions WHERE status = ? ORDER BY created_at DESC'
    : 'SELECT * FROM subscriptions ORDER BY created_at DESC';
  const stmt = db.prepare(sql);
  return status ? stmt.all(status) : stmt.all();
}

function getSubscription(id) {
  return db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id);
}

function updateStatus(id, status, notes) {
  db.prepare(`
    UPDATE subscriptions SET status = ?, notes = COALESCE(?, notes), updated_at = datetime('now')
    WHERE id = ?
  `).run(status, notes || null, id);
}

function countByStatus() {
  const rows = db.prepare('SELECT status, COUNT(*) as count FROM subscriptions GROUP BY status').all();
  const counts = { pending: 0, active: 0, cancelled: 0 };
  rows.forEach((r) => { counts[r.status] = r.count; });
  return counts;
}

module.exports = { createSubscription, listSubscriptions, getSubscription, updateStatus, countByStatus };
