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
routes/index.js   All routes + sitemap.xml + robots.txt + form stubs
views/            EJS templates (home, products, product, pricing, about,
                  contact, blog, post, faqs, legal, 404)
  partials/       head (SEO meta + JSON-LD), nav, footer, breadcrumbs, cta
public/
  css/style.css   Design tokens + all styles
  js/main.js      Reveals, hero tilt, KPI tick, nav toggle, form submits
assets/           Product screenshots, served at /assets
```

## Adding or editing a product

Everything lives in `data/products.js`. Add/edit an object there — slug, name,
status (`live` | `coming-soon`), `appUrl` (subdomain), copy fields, screenshots,
per-product FAQs. The product page, home/products-index cards, footer links,
sitemap, and JSON-LD schema all update automatically from that one file.

- **Going live:** change `status` to `'live'` — the waitlist form is replaced by a
  login CTA pointing at `appUrl` automatically.
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
and will also send an email via Gmail/Google Workspace SMTP (`lib/mailer.js`) once
configured. Without configuration, they silently fall back to console-only logging
— forms still work, you just won't get an email.

**1. Generate a Google App Password** (not your regular account password):
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
     (requires 2-Step Verification enabled on the account).
   - Create an app password for "Mail", copy the 16-character code.

**2. Set environment variables** — copy `.env.example` to `.env` and fill in:
   ```
   EMAIL_USER=support@evotrade.io
   EMAIL_APP_PASSWORD=<the 16-character app password>
   EMAIL_TO=support@evotrade.io
   ```
   `.env` is gitignored — never commit real credentials. Locally, `server.js` loads
   it automatically via `dotenv`. On Hostinger, set the same three variables in the
   hosting panel's **Environment Variables** section (Node.js app settings) instead
   of using a `.env` file.

**3. Restart the app** after setting the variables. Test by submitting the contact
form — check the inbox at `EMAIL_TO`.

To switch providers (SendGrid, Postmark, etc.) instead of Gmail, edit
`lib/mailer.js` — `sendMail()` is the only function the routes call, so swapping
the transport underneath doesn't require touching `routes/index.js`.

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
