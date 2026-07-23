const nodemailer = require('nodemailer');
const { sanitize } = require('./adminAuth');

// Generic SMTP — works with Hostinger email hosting (or any SMTP provider).
// Requires env vars:
//   EMAIL_USER      — the sending mailbox (e.g. support@evotrade.io)
//   EMAIL_PASSWORD  — that mailbox's real password (set in Hostinger's email panel)
//   EMAIL_HOST      — SMTP host (defaults to smtp.hostinger.com)
//   EMAIL_PORT      — SMTP port (defaults to 465)
//   EMAIL_TO        — where notifications should land (defaults to EMAIL_USER)
// See README.md "Email setup" for Hostinger's exact SMTP settings.
//
// Env values are sanitized (see lib/adminAuth.js) — hosting panel env var inputs
// have repeatedly been observed to silently introduce invisible Unicode
// characters that plain .trim() does not catch (confirmed with ADMIN_PASSWORD
// and the MySQL DB_* credentials); the same class of bug could otherwise cause
// a silent SMTP auth failure here.

const env = (key) => sanitize(process.env[key] || '');

let transporter = null;
let transporterKey = null;

function getTransporter() {
  const user = env('EMAIL_USER');
  const pass = env('EMAIL_PASSWORD');
  if (!user || !pass) return null;

  const port = Number(env('EMAIL_PORT')) || 465;
  const host = env('EMAIL_HOST') || 'smtp.hostinger.com';
  const key = `${host}:${port}:${user}`;

  // Rebuild if the underlying env vars changed since the last cached transporter
  // (e.g. a redeploy with a corrected password) instead of caching forever.
  if (transporter && transporterKey === key) return transporter;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: { user, pass },
  });
  transporterKey = key;
  return transporter;
}

async function sendMail({ subject, html, replyTo }) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mailer] EMAIL_USER / EMAIL_PASSWORD not set — skipping send, logging only.');
    return { sent: false };
  }

  const to = env('EMAIL_TO') || env('EMAIL_USER');
  const info = await t.sendMail({
    from: `"Evotrade Website" <${env('EMAIL_USER')}>`,
    to,
    replyTo,
    subject,
    html,
  });
  console.log('[mailer] sent:', info.messageId, 'to', to, 'accepted:', info.accepted, 'rejected:', info.rejected);
  return { sent: true, info };
}

module.exports = { sendMail };
