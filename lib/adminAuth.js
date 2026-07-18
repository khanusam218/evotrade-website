const crypto = require('crypto');

// Strips ordinary whitespace plus invisible Unicode characters (zero-width
// space/joiners, BOM/zero-width no-break space, non-breaking space) that JS's
// built-in trim() does not remove. These can get silently inserted by hosting
// panel input fields, clipboard managers, or keyboard apps, and would otherwise
// cause an exact-match comparison to fail with no visible difference between
// the two strings.
const INVISIBLE_CHARS = /[​‌‍﻿ ]/g;

function sanitize(value) {
  return String(value).replace(INVISIBLE_CHARS, '').trim();
}

// Constant-time comparison against the ADMIN_PASSWORD env var, so a single shared
// password isn't vulnerable to timing attacks. See README "Admin dashboard" section.
function checkPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !candidate) return false;

  const a = Buffer.from(sanitize(candidate));
  const b = Buffer.from(sanitize(expected));
  if (a.length !== b.length) return false; // still constant-time for equal-length real attempts
  return crypto.timingSafeEqual(a, b);
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect('/admin/login');
}

module.exports = { checkPassword, requireAdmin, sanitize };
