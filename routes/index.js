const express = require('express');
const router = express.Router();

const { products } = require('../data/products');
const { posts } = require('../data/posts');
const { faqs } = require('../data/faqs');
const { softwareTeam, taxLegalTeam } = require('../data/team');
const site = require('../data/site');

// Everything templates need on every page.
const base = (overrides) =>
  Object.assign(
    {
      site,
      products,
      canonical: null,
      ogImage: `${site.SITE_URL}/assets/screenshots/accounting/dashboard-1.jpeg`,
      schema: [],
      breadcrumbs: null,
    },
    overrides
  );

const breadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${site.SITE_URL}${c.href}`,
  })),
});

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Evotrade',
  url: site.SITE_URL,
  email: site.email,
  telephone: site.phone,
  logo: `${site.SITE_URL}/img/logo.svg`,
  parentOrganization: {
    '@type': 'Organization',
    name: site.parentCompany.name,
    url: site.parentCompany.url,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.offices[0].address,
    addressLocality: 'Rawalpindi',
    addressCountry: 'PK',
  },
  sameAs: Object.values(site.social),
};

/* ---------- Home ---------- */
router.get('/', (req, res) => {
  res.render('home', base({
    title: 'Evotrade — Business Software for Pakistan | POS, Accounting & ERP from Rs. 1,000/month',
    metaDescription:
      'Evotrade builds POS, accounting, ERP, payroll, and FBR digital invoicing software for Pakistani businesses. Free for TaxAccountant.pk clients, Rs. 1,000/month standalone with 20% off yearly.',
    canonical: `${site.SITE_URL}/`,
    schema: [orgSchema, {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Evotrade',
      url: site.SITE_URL,
    }],
  }));
});

/* ---------- Products index ---------- */
router.get('/products', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }];
  res.render('products', base({
    title: 'Business Software Products for Pakistan — POS, ERP, Payroll & More | Evotrade',
    metaDescription:
      'Explore all Evotrade software: DistriBooks distribution ERP, ElectricStore POS, FBR Digital Invoicing, Restaurant POS, Mobile Shop POS, Accounting, Payroll, Retail POS, and Stock Management. Rs. 1,000/month each, free for TaxAccountant.pk clients.',
    canonical: `${site.SITE_URL}/products`,
    breadcrumbs: crumbs,
    schema: [breadcrumbSchema(crumbs)],
  }));
});

/* ---------- Product detail ---------- */
router.get('/products/:slug', (req, res, next) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) return next();

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: product.name, href: `/products/${product.slug}` },
  ];

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Evotrade ${product.name}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${site.SITE_URL}/products/${product.slug}`,
    description: product.metaDescription,
    offers: {
      '@type': 'Offer',
      price: String(site.pricing.monthly),
      priceCurrency: 'PKR',
      description: 'Per month. 20% off on yearly billing. Free for TaxAccountant.pk clients.',
    },
    provider: { '@type': 'Organization', name: 'Evotrade', url: site.SITE_URL },
  };

  const productFaqSchema = product.faqs && product.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: product.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  res.render('product', base({
    title: product.title,
    metaDescription: product.metaDescription,
    canonical: `${site.SITE_URL}/products/${product.slug}`,
    ogImage: product.heroImage ? `${site.SITE_URL}${product.heroImage}` : `${site.SITE_URL}/assets/screenshots/accounting/dashboard-1.jpeg`,
    product,
    breadcrumbs: crumbs,
    schema: [appSchema, breadcrumbSchema(crumbs)].concat(productFaqSchema ? [productFaqSchema] : []),
  }));
});

/* ---------- Pricing ---------- */
router.get('/pricing', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Pricing', href: '/pricing' }];
  res.render('pricing', base({
    title: 'Pricing — Rs. 1,000/month per Product, Free for TaxAccountant.pk Clients | Evotrade',
    metaDescription:
      'Simple pricing for every Evotrade product: Rs. 1,000/month, 20% off yearly (Rs. 9,600/year), no setup fees. Free for active TaxAccountant.pk clients. Compare with typical POS pricing in Pakistan.',
    canonical: `${site.SITE_URL}/pricing`,
    breadcrumbs: crumbs,
    schema: [breadcrumbSchema(crumbs)],
  }));
});

/* ---------- About ---------- */
router.get('/about', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }];
  res.render('about', base({
    title: 'About Evotrade — The Software Division of TaxAccountant.pk',
    metaDescription:
      'Evotrade is the software division of TaxAccountant.pk, building POS, ERP, and compliance software for Pakistani businesses from offices in Rawalpindi and Gujranwala. Meet the team behind DistriBooks and ElectricStore.',
    canonical: `${site.SITE_URL}/about`,
    breadcrumbs: crumbs,
    schema: [orgSchema, breadcrumbSchema(crumbs)],
  }));
});

/* ---------- Team ---------- */
router.get('/team', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Team', href: '/team' }];
  const allPeople = softwareTeam.concat(taxLegalTeam);
  const peopleSchema = allPeople.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    jobTitle: p.role,
    worksFor: { '@type': 'Organization', name: site.parentCompany.name, url: site.parentCompany.url },
  }));
  res.render('team', base({
    title: 'Our Team — The People Behind Evotrade & TaxAccountant.pk',
    metaDescription:
      'Meet the Evotrade software team and the TaxAccountant.pk tax & legal practitioners behind our products — full-stack engineers, FBR-registered consultants, and chartered accountants working from Rawalpindi and Gujranwala.',
    canonical: `${site.SITE_URL}/team`,
    softwareTeam,
    taxLegalTeam,
    breadcrumbs: crumbs,
    schema: [breadcrumbSchema(crumbs)].concat(peopleSchema),
  }));
});

/* ---------- Contact ---------- */
router.get('/contact', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }];
  const localBusiness = site.offices.map((o) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Evotrade / TaxAccountant.pk — ${o.city}`,
    address: { '@type': 'PostalAddress', streetAddress: o.address, addressLocality: o.city, addressCountry: 'PK' },
    telephone: o.phone,
    email: site.email,
    openingHours: 'Mo-Sa 09:00-18:00',
    url: `${site.SITE_URL}/contact`,
  }));
  res.render('contact', base({
    title: 'Contact Evotrade — Book a Free Demo | Rawalpindi & Gujranwala',
    metaDescription:
      'Contact Evotrade for a free software demo: WhatsApp +92 339 505 0983, support@evotrade.io, or visit our Rawalpindi and Gujranwala offices. Same-day response on most queries.',
    canonical: `${site.SITE_URL}/contact`,
    breadcrumbs: crumbs,
    schema: [breadcrumbSchema(crumbs)].concat(localBusiness),
  }));
});

/* ---------- Blog ---------- */
router.get('/blog', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }];
  res.render('blog', base({
    title: 'Evotrade Blog — FBR Compliance, POS & Business Software Guides for Pakistan',
    metaDescription:
      'Practical guides on FBR digital invoicing, choosing POS and accounting software, and running a compliant business in Pakistan — from the team behind DistriBooks and ElectricStore.',
    canonical: `${site.SITE_URL}/blog`,
    posts,
    breadcrumbs: crumbs,
    schema: [breadcrumbSchema(crumbs)],
  }));
});

router.get('/blog/:slug', (req, res, next) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) return next();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ];
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author, url: site.SITE_URL },
    publisher: { '@type': 'Organization', name: 'Evotrade', url: site.SITE_URL },
    mainEntityOfPage: `${site.SITE_URL}/blog/${post.slug}`,
  };
  res.render('post', base({
    title: `${post.title} | Evotrade Blog`,
    metaDescription: post.metaDescription,
    canonical: `${site.SITE_URL}/blog/${post.slug}`,
    post,
    breadcrumbs: crumbs,
    schema: [articleSchema, breadcrumbSchema(crumbs)],
  }));
});

/* ---------- FAQs ---------- */
router.get('/faqs', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'FAQs', href: '/faqs' }];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  res.render('faqs', base({
    title: 'Frequently Asked Questions — Pricing, Products & Support | Evotrade',
    metaDescription:
      'Answers to common questions about Evotrade software: pricing (Rs. 1,000/month), the free tier for TaxAccountant.pk clients, product availability, offline support, data export, and FBR compliance.',
    canonical: `${site.SITE_URL}/faqs`,
    faqs,
    breadcrumbs: crumbs,
    schema: [faqSchema, breadcrumbSchema(crumbs)],
  }));
});

/* ---------- Legal ---------- */
router.get('/terms-of-usage', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Terms of Usage', href: '/terms-of-usage' }];
  res.render('legal', base({
    title: 'Terms of Usage | Evotrade',
    metaDescription: 'Terms of usage for Evotrade software products and the evotrade.io website.',
    canonical: `${site.SITE_URL}/terms-of-usage`,
    legalPage: 'terms',
    breadcrumbs: crumbs,
    schema: [breadcrumbSchema(crumbs)],
  }));
});

router.get('/privacy-policy', (req, res) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Privacy Policy', href: '/privacy-policy' }];
  res.render('legal', base({
    title: 'Privacy Policy | Evotrade',
    metaDescription: 'How Evotrade collects, uses, and protects your data across our website and software products.',
    canonical: `${site.SITE_URL}/privacy-policy`,
    legalPage: 'privacy',
    breadcrumbs: crumbs,
    schema: [breadcrumbSchema(crumbs)],
  }));
});

/* ---------- Forms (logged server-side + emailed via lib/mailer.js) ---------- */
const { sendMail } = require('../lib/mailer');
const db = require('../lib/db');

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

router.post('/contact', async (req, res) => {
  const { name, email, company, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email, and message are required.' });
  }
  console.log('--- Contact form submission ---');
  console.log({ name, email, company: company || '—', message });

  try {
    await sendMail({
      subject: `New contact form submission — ${name}`,
      replyTo: email,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || '—')}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });
  } catch (err) {
    console.error('[mailer] contact form send failed:', err.message);
  }

  res.json({ ok: true });
});

router.post('/waitlist', async (req, res) => {
  const { name, email, phone, product } = req.body;
  if (!name || !email || !product) {
    return res.status(400).json({ ok: false, error: 'Name, email, and product are required.' });
  }
  console.log('--- Waitlist signup ---');
  console.log({ name, email, phone: phone || '—', product });

  try {
    await sendMail({
      subject: `Waitlist signup — ${product}`,
      replyTo: email,
      html: `
        <h2>New waitlist signup</h2>
        <p><strong>Product:</strong> ${escapeHtml(product)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || '—')}</p>
      `,
    });
  } catch (err) {
    console.error('[mailer] waitlist signup send failed:', err.message);
  }

  res.json({ ok: true });
});

router.post('/subscribe', async (req, res) => {
  const { name, email, phone, company, productSlug, productName, plan } = req.body;
  if (!name || !email || !productSlug || !productName) {
    return res.status(400).json({ ok: false, error: 'Name, email, and product are required.' });
  }
  const product = products.find((p) => p.slug === productSlug);
  if (!product || product.status !== 'live') {
    return res.status(400).json({ ok: false, error: 'That product is not available to subscribe to yet.' });
  }
  const safePlan = ['monthly', 'yearly', 'taxaccountant-client'].includes(plan) ? plan : 'monthly';

  let id;
  try {
    id = await db.createSubscription({
      name, email, phone, company,
      productSlug, productName,
      plan: safePlan,
    });
  } catch (err) {
    console.error('[db] createSubscription failed:', err.message);
    return res.status(500).json({ ok: false, error: 'Something went wrong saving your request. Please try again or contact us directly.' });
  }

  console.log('--- Subscribe request ---');
  console.log({ id, name, email, phone: phone || '—', company: company || '—', productName, plan: safePlan });

  try {
    await sendMail({
      subject: `New subscribe request — ${productName} (${safePlan})`,
      replyTo: email,
      html: `
        <h2>New subscribe request</h2>
        <p><strong>Product:</strong> ${escapeHtml(productName)}</p>
        <p><strong>Plan:</strong> ${escapeHtml(safePlan)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || '—')}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || '—')}</p>
        <p>Go to <a href="${site.SITE_URL}/admin">the admin dashboard</a> to confirm payment and activate.</p>
      `,
    });
  } catch (err) {
    console.error('[mailer] subscribe request send failed:', err.message);
  }

  res.json({ ok: true });
});

/* ---------- SEO plumbing ---------- */
router.get('/sitemap.xml', (req, res) => {
  const staticUrls = ['/', '/products', '/pricing', '/about', '/team', '/contact', '/blog', '/faqs', '/terms-of-usage', '/privacy-policy'];
  const urls = staticUrls
    .concat(products.map((p) => `/products/${p.slug}`))
    .concat(posts.map((p) => `/blog/${p.slug}`));
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${site.SITE_URL}${u}</loc></url>`).join('\n') +
    '\n</urlset>';
  res.type('application/xml').send(xml);
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site.SITE_URL}/sitemap.xml\n`);
});

module.exports = router;
