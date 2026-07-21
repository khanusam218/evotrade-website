// Billing/subscriptions store — Hostinger-hosted MySQL, not a local file.
//
// A local SQLite file was tried first but does not survive redeploys on
// Hostinger (the app's non-git files get wiped on every deploy), which would
// silently lose real customer subscription records the next time any code
// change shipped. MySQL lives outside the deployed app entirely, so it
// persists independently of deployments.
//
// Requires env vars: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (DB_PORT optional,
// defaults to 3306). See README "The database" section for setup.

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

let schemaReady = null;

function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        company VARCHAR(255),
        product_slug VARCHAR(64) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        plan VARCHAR(32) NOT NULL DEFAULT 'monthly',
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
  return schemaReady;
}

async function createSubscription({ name, email, phone, company, productSlug, productName, plan }) {
  await ensureSchema();
  const [result] = await pool.query(
    `INSERT INTO subscriptions (name, email, phone, company, product_slug, product_name, plan)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone || null, company || null, productSlug, productName, plan]
  );
  return result.insertId;
}

async function listSubscriptions({ status } = {}) {
  await ensureSchema();
  const [rows] = status
    ? await pool.query('SELECT * FROM subscriptions WHERE status = ? ORDER BY created_at DESC', [status])
    : await pool.query('SELECT * FROM subscriptions ORDER BY created_at DESC');
  return rows;
}

async function getSubscription(id) {
  await ensureSchema();
  const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
  return rows[0];
}

async function updateStatus(id, status, notes) {
  await ensureSchema();
  await pool.query(
    `UPDATE subscriptions SET status = ?, notes = COALESCE(?, notes) WHERE id = ?`,
    [status, notes || null, id]
  );
}

async function countByStatus() {
  await ensureSchema();
  const [rows] = await pool.query('SELECT status, COUNT(*) as count FROM subscriptions GROUP BY status');
  const counts = { pending: 0, active: 0, cancelled: 0 };
  rows.forEach((r) => { counts[r.status] = r.count; });
  return counts;
}

module.exports = { createSubscription, listSubscriptions, getSubscription, updateStatus, countByStatus };
