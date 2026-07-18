const express = require('express');
const router = express.Router();

const db = require('../lib/db');
const site = require('../data/site');
const { checkPassword, requireAdmin } = require('../lib/adminAuth');

router.get('/login', (req, res) => {
  if (req.session && req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { error: null, site });
});

router.post('/login', (req, res) => {
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
