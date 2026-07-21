const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const db = require('../lib/db');
const site = require('../data/site');
const { checkPassword, requireAdmin } = require('../lib/adminAuth');

// Brute-force protection on the shared admin password: at most 8 attempts per
// IP per 15 minutes. Keyed by IP rather than session, since an attacker has
// no session yet. Requires app.set('trust proxy', ...) in server.js so this
// sees the real client IP behind Hostinger's reverse proxy, not the proxy's own.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please wait 15 minutes and try again.',
  handler: (req, res) => {
    res.status(429).render('admin/login', {
      error: 'Too many login attempts. Please wait 15 minutes and try again.',
      site,
    });
  },
});

router.get('/login', (req, res) => {
  if (req.session && req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { error: null, site });
});

router.post('/login', loginLimiter, (req, res) => {
  const { password } = req.body;
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
  req.session = null; // cookie-session: clearing the session has no .destroy() method
  res.redirect('/admin/login');
});

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const status = ['pending', 'active', 'cancelled'].includes(req.query.status) ? req.query.status : null;
    const subscriptions = await db.listSubscriptions(status ? { status } : {});
    const counts = await db.countByStatus();
    res.render('admin/dashboard', { subscriptions, counts, activeFilter: status, site });
  } catch (err) {
    next(err);
  }
});

router.post('/subscriptions/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    if (!['pending', 'active', 'cancelled'].includes(status)) {
      return res.status(400).send('Invalid status');
    }
    await db.updateStatus(Number(req.params.id), status, notes);
    res.redirect(req.get('Referer') || '/admin');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
