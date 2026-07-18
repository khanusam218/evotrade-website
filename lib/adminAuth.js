const crypto = require('crypto');

// Constant-time comparison against the ADMIN_PASSWORD env var, so a single shared
// password isn't vulnerable to timing attacks. See README "Admin dashboard" section.
function checkPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !candidate) return false;

  // Trim whitespace on both sides: hosting panel env-var inputs and browser
  // password fields can silently pick up a trailing space/newline, which would
  // otherwise fail an exact-length comparison for no visible reason.
  const a = Buffer.from(String(candidate).trim());
  const b = Buffer.from(String(expected).trim());
  if (a.length !== b.length) return false; // still constant-time for equal-length real attempts
  return crypto.timingSafeEqual(a, b);
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect('/admin/login');
}

module.exports = { checkPassword, requireAdmin };
