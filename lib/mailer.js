const nodemailer = require('nodemailer');

// Gmail/Google Workspace SMTP. Requires env vars:
//   EMAIL_USER          — the sending mailbox (e.g. support@evotrade.io on Google Workspace)
//   EMAIL_APP_PASSWORD  — a 16-character Google App Password (not the account password)
//   EMAIL_TO            — where notifications should land (defaults to EMAIL_USER)
// See README.md "Email setup" for how to generate an App Password.

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) return null;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  return transporter;
}

async function sendMail({ subject, html, replyTo }) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mailer] EMAIL_USER / EMAIL_APP_PASSWORD not set — skipping send, logging only.');
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
