# Evotrade — evotrade.io

Multipage marketing site for Evotrade, the software division of TaxAccountant.pk.
Nine products (2 live: DistriBooks, ElectricStore; 7 launching on subdomains), plus
pricing, about, contact, blog, FAQs, and legal pages — SEO-optimized with per-page
meta, JSON-LD schema, sitemap, and robots.txt.

## Stack & why

- **Node.js + Express**, server-rendered with **EJS** — content-driven marketing site,
  no client-side app state; server rendering gives full markup control for SEO
  (unique titles/meta/canonical/JSON-LD per page) with zero build step.
- **Hand-written CSS** with custom properties as the token system (`public/css/style.css`).
- **Vanilla JS** (`public/js/main.js`, loaded with `defer`) — IntersectionObserver reveals,
  hero parallax, ticking KPI, contact + waitlist forms. Respects `prefers-reduced-motion`.

## Running it

```bash
npm install
npm start        # production (PORT env respected, default 3000)
npm run dev      # nodemon, auto-restart on changes
```

## Project structure

```
server.js         Express entry point (PORT env respected)
data/
  products.js     All 9 products: copy, keywords, meta, screenshots, FAQs, status
  posts.js        Blog posts (HTML body rendered inside .prose)
  faqs.js         Site-wide FAQs (/faqs page + FAQPage schema)
  site.js         Contact identity, offices, social links, pricing constants
routes/
  index.js        Public routes + sitemap.xml + robots.txt + form handlers
  admin.js         /admin login, dashboard, subscription status updates
lib/
  mailer.js        SMTP email sending (contact/waitlist/subscribe notifications)
  db.js            SQLite subscriptions store (node:sqlite, no native deps)
  adminAuth.js     Admin password check + requireAdmin session middleware
views/            EJS templates (home, products, product, pricing, about,
                  contact, blog, post, faqs, legal, 404)
  partials/       head (SEO meta + JSON-LD), nav, footer, breadcrumbs, cta
  admin/          login, dashboard (standalone layout, noindex)
public/
  css/style.css   Design tokens + all styles
  js/main.js      Reveals, hero tilt, KPI tick, nav toggle, form submits
assets/           Product screenshots, served at /assets
data-store/       SQLite database file (gitignored — created automatically)
```

## Adding or editing a product

Everything lives in `data/products.js`. Add/edit an object there — slug, name,
status (`live` | `coming-soon`), `appUrl` (subdomain), copy fields, screenshots,
per-product FAQs. The product page, home/products-index cards, footer links,
sitemap, and JSON-LD schema all update automatically from that one file.

- **Going live:** change `status` to `'live'` — the waitlist form is replaced by the
  Subscribe form (plan selection + billing request), with a secondary "Already a
  customer? Log in" link to `appUrl`.
- **Screenshots:** drop files in `assets/screenshots/<product>/` and list them in the
  product's `screenshots` array with descriptive `alt` text (used for SEO + accessibility).

## SEO

- Per-page `<title>`, meta description, canonical, Open Graph/Twitter tags:
  `views/partials/head.ejs`, fed from route data in `routes/index.js`.
- JSON-LD schema: Organization + WebSite (home), SoftwareApplication + FAQPage +
  BreadcrumbList (product pages), Article (blog posts), FAQPage (/faqs),
  LocalBusiness ×2 (contact — both offices).
- `sitemap.xml` and `robots.txt` are generated routes — new products/posts appear
  automatically.
- Target keywords are recorded per product in the `keywords` array (reference for
  future content edits; titles/descriptions already use them).

## Email setup (contact & waitlist forms)

`POST /contact` and `POST /waitlist` always log submissions to the server console,
and will also send an email via SMTP (`lib/mailer.js`) once configured. Without
configuration, they silently fall back to console-only logging — forms still work,
you just won't get an email.

This is set up for **Hostinger email hosting** (`support@evotrade.io` on Hostinger),
using generic SMTP rather than a Gmail-specific integration.

**1. Find your mailbox's SMTP settings** in hPanel:
   - Go to hPanel → **Emails** → select `support@evotrade.io` → **Connect Devices**
     (or **Configure Email Client**) to see the exact SMTP host/port for your plan.
   - Usually: host `smtp.hostinger.com`, port `465` (SSL). Some plans use port `587`
     (STARTTLS) instead — hPanel will tell you which.
   - The password is the mailbox's real password (set/reset it in hPanel → Emails).

**2. Set environment variables** — copy `.env.example` to `.env` and fill in:
   ```
   EMAIL_USER=support@evotrade.io
   EMAIL_PASSWORD=<the mailbox password>
   EMAIL_HOST=smtp.hostinger.com
   EMAIL_PORT=465
   EMAIL_TO=support@evotrade.io
   ```
   `.env` is gitignored — never commit real credentials. Locally, `server.js` loads
   it automatically via `dotenv`. On Hostinger, set the same variables in the
   hosting panel's **Environment Variables** section (Node.js app settings) instead
   of using a `.env` file.

**3. Restart/redeploy the app** after setting the variables. Test by submitting the
contact form — check the inbox at `EMAIL_TO`.

To switch providers (SendGrid, Postmark, Gmail, etc.), edit `lib/mailer.js` —
`sendMail()` is the only function the routes call, so swapping the transport
underneath doesn't require touching `routes/index.js`.

## Billing & subscriptions (manual, admin-tracked)

Live products show a **Subscribe** form (name, email, phone, company, plan) instead
of a direct login link. This is intentionally a **manual billing flow**, not an
automated payment gateway:

1. Customer submits the Subscribe form on a live product's page → creates a
   `pending` row in the SQLite database and emails you a notification (via the
   same mailer as contact/waitlist).
2. You send them a payment request (bank transfer / JazzCash / Easypaisa) outside
   the website, or confirm they're already a TaxAccountant.pk client (free).
3. Once paid, go to `/admin`, find their request, and click **Mark active**.
4. **You still create their login in DistriBooks/ElectricStore yourself** — the
   website tracks who's paid, it does not provision accounts in those separate
   applications. If those apps ever expose an API for account creation, this is
   the place to wire that up (`routes/admin.js`, on status change to `active`).

### Admin dashboard setup

1. Set an `ADMIN_PASSWORD` environment variable (a strong, unique password — this
   is a single shared password, not per-user accounts). Also set `SESSION_SECRET`
   to a long random string (used to sign the login session cookie).
   ```
   ADMIN_PASSWORD=<a strong password>
   SESSION_SECRET=<a long random string>
   ```
   Add both locally in `.env` and in Hostinger's Environment Variables panel,
   same as the email variables.
2. Visit `/admin/login` and log in with that password.
3. The dashboard (`/admin`) lists every subscribe request with filters for
   Pending / Active / Cancelled, and buttons to change status. `/admin` is
   excluded from `robots.txt` and marked `noindex` so it won't appear in search.
4. `/admin/login` is rate-limited to 8 attempts per IP per 15 minutes
   (`routes/admin.js`) to slow down brute-force guessing of the shared password.
   This relies on `app.set('trust proxy', 1)` in `server.js` to see the real
   client IP through Hostinger's reverse proxy — without it, every request
   would appear to come from the proxy's IP and share one global limit.

### The database

Subscription requests are stored in a **MySQL database hosted by Hostinger**
(`lib/db.js`, via `mysql2`) — not a local file. A local SQLite file was tried
first, but confirmed (by testing) to get wiped on every Hostinger redeploy,
which would silently lose real customer records the next time any code shipped.
MySQL lives outside the app's deployed code, so it survives deployments.
Confirmed live: a test subscription survived a full redeploy after this setup.

**Setup:**
1. hPanel → **Databases** → **Management** → create a new MySQL database and user.
2. hPanel → **Databases** → **Remote MySQL** → check **"Any Host"**, select the
   database, and save — this lets the Node app connect (it may run on different
   infrastructure than the database itself). If you ever reset the database
   password, delete and re-add this rule too — it can retain the password from
   whenever it was first created rather than picking up a later change.
3. Set these environment variables (locally in `.env`, and in Hostinger's
   Environment Variables panel — same pattern as the email/admin variables):
   ```
   DB_HOST=<the hostname shown on the Remote MySQL page, e.g. srv1948.hstgr.io>
   DB_PORT=3306
   DB_USER=<the MySQL username, e.g. u879338214_evotrade_admin>
   DB_PASSWORD=<the MySQL password you set>
   DB_NAME=<the MySQL database name, e.g. u879338214_evotradebiling>
   ```
4. The `subscriptions` table is created automatically on first use — no manual
   migration needed.

If a real customer's data is ever at stake, don't rely on assumption — verify
persistence any time the underlying hosting setup changes.

## Customizing the color tokens

All colors are CSS custom properties at the top of `public/css/style.css`:

```css
:root {
  --ink: #0B0A08;         /* near-black */
  --paper: #F7F3EC;       /* off-white */
  --signal: #FF5A1F;      /* primary orange accent */
  --signal-deep: #C43E0A; /* hover/pressed + AA text-on-light */
  --charcoal: #1C1815;    /* secondary dark surface */
  --stone: #8A8177;       /* muted text / borders */

  --acc-accounting / --acc-electric / --acc-distribook / --acc-pos / --acc-signal
                          /* per-product accents (decorative) */
  --acc-*-text            /* darkened AA-contrast variants for text on paper */
}
```

## Fonts

[Fraunces](https://fonts.google.com/specimen/Fraunces) (display) and
[Inter](https://fonts.google.com/specimen/Inter) (body), loaded in
`views/partials/head.ejs` with `display=swap`.
