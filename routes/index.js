const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Evotrade — Software built for how your business actually runs' });
});

// Contact form is stubbed: no email service is wired up.
// Submissions are logged server-side only. See README for how to connect
// a real provider (Nodemailer, SendGrid, etc).
router.post('/contact', (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email, and message are required.' });
  }

  console.log('--- New contact form submission ---');
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Company: ${company || '—'}`);
  console.log(`Message: ${message}`);
  console.log('------------------------------------');

  res.json({ ok: true });
});

module.exports = router;
