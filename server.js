require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Hostinger (and most hosts) terminate HTTPS at a reverse proxy and forward
// plain HTTP to this app internally. Without trusting that proxy, Express sees
// every request as insecure, which makes secure cookies (below) silently fail
// to be set at all -- even though the real browser connection is HTTPS.
app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Stateless, signed-cookie session — the whole session lives in the cookie itself,
// so it works correctly even if Hostinger runs multiple app processes/instances
// (a server-side memory store would only be visible to whichever process set it).
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'dev-only-insecure-secret-change-in-production'],
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
}));

app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/index'));

app.use((req, res) => {
  const site = require('./data/site');
  const { products } = require('./data/products');
  res.status(404).render('404', {
    title: 'Page not found — Evotrade',
    metaDescription: 'The page you were looking for does not exist.',
    canonical: null,
    ogImage: `${site.SITE_URL}/assets/screenshots/accounting/dashboard-1.jpeg`,
    schema: [],
    breadcrumbs: null,
    site,
    products,
  });
});

app.listen(PORT, () => {
  console.log(`Evotrade site running at http://localhost:${PORT}`);
});
