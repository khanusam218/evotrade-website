const nodemailer = require('nodemailer');

// Generic SMTP — works with Hostinger email hosting (or any SMTP provider).
// Requires env vars:
//   EMAIL_USER      — the sending mailbox (e.g. support@evotrade.io)
//   EMAIL_PASSWORD  — that mailbox's real password (set in Hostinger's email panel)
//   EMAIL_HOST      — SMTP host (defaults to smtp.hostinger.com)
//   EMAIL_PORT      — SMTP port (defaults to 465)
//   EMAIL_TO        — where notifications should land (defaults to EMAIL_USER)
// See README.md "Email setup" for Hostinger's exact SMTP settings.

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return null;

  const port = Number(process.env.EMAIL_PORT) || 465;
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
    port,
    secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  return transporter;
}

async function sendMail({ subject, html, replyTo }) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mailer] EMAIL_USER / EMAIL_PASSWORD not set — skipping send, logging only.');
    return { sent: false };
  }

  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;
  await t.sendMail({
    from: `"Evotrade Website" <${process.env.EMAIL_USER}>`,
    to,
    replyTo,
    subject,
    html,
  });
  return { sent: true };
}

module.exports = { sendMail };
