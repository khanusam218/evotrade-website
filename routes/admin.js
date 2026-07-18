const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const db = require('../lib/db');
const site = require('../data/site');
const { checkPassword, requireAdmin, sanitize } = require('../lib/adminAuth');

// TEMPORARY DIAGNOSTIC — logs only a hash prefix + length, never the real value.
// Remove once the admin login mismatch is resolved.
function debugEnvVar(submittedPassword) {
  const val = process.env.ADMIN_PASSWORD;
  if (!val) {
    console.log('[admin-debug] ADMIN_PASSWORD is undefined/empty in process.env');
  } else {
    const clean = sanitize(val);
    console.log('[admin-debug] env ADMIN_PASSWORD. raw length:', val.length, 'sanitized length:', clean.length,
      'hash prefix:', crypto.createHash('sha256').update(clean).digest('hex').slice(0, 10));
  }
  if (submittedPassword) {
    const cleanSubmitted = sanitize(submittedPassword);
    console.log('[admin-debug] submitted login attempt. raw length:', submittedPassword.length,
      'sanitized length:', cleanSubmitted.length,
      'hash prefix:', crypto.createHash('sha256').update(cleanSubmitted).digest('hex').slice(0, 10));
  }
}

router.get('/login', (req, res) => {
  if (req.session && req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { error: null, site });
});

router.post('/login', (req, res) => {
  const { password } = req.body;
  debugEnvVar(password);
  if (!process.env.ADMIN_PASSWORD) {
    return res.render('admin/login', { error: 'ADMIN_PASSWORD is not set on the server yet — see README.', site });
  }
  if (!checkPassword(password)) {
    return res.render('admin/login', { error: 'Incorrect password.', site });
  }
  req.session.isAdmin = true;
  res.redirect('/admin');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/', requireAdmin, (req, res) => {
  const status = ['pending', 'active', 'cancelled'].includes(req.query.status) ? req.query.status : null;
  const subscriptions = db.listSubscriptions(status ? { status } : {});
  const counts = db.countByStatus();
  res.render('admin/dashboard', { subscriptions, counts, activeFilter: status, site });
});

router.post('/subscriptions/:id/status', requireAdmin, (req, res) => {
  const { status, notes } = req.body;
  if (!['pending', 'active', 'cancelled'].includes(status)) {
    return res.status(400).send('Invalid status');
  }
  db.updateStatus(Number(req.params.id), status, notes);
  res.redirect(req.get('Referer') || '/admin');
});

module.exports = router;
