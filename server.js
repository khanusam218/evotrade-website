require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
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
