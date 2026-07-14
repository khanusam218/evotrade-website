# Evotrade — Software House Portfolio Site

An awards-style portfolio site for Evotrade, showcasing four flagship products:
Accounting Software, ElectricStore (POS & ERP), DistriBooks (distribution ERP), and Evotrade POS.

## Stack & why

- **Node.js + Express**, server-rendered with **EJS**.
- Chosen over a Node API + static frontend because this is a single-page, content-driven
  marketing site with no client-side app state — server rendering keeps the project simple
  (one template, one route file) while still giving full control over markup for the
  animation/reveal hooks (`data-reveal` attributes, semantic sections) that the animation
  layer depends on. A static frontend would have meant either hand-duplicating the templating
  logic or pulling in a build step for no real benefit at this scale.
- **Hand-written CSS** with custom properties as the token system (`public/css/style.css`) —
  no framework. Tailwind's default utility classes fight against a custom, awards-style
  aesthetic more than they help at this project's size.
- **Vanilla JS** (`public/js/main.js`) for scroll reveals (IntersectionObserver), the hero's
  parallax tilt, the ticking KPI number, and the contact form — no animation library needed
  for this scope. Everything respects `prefers-reduced-motion`.

## Running it

```bash
npm install
npm start        # production
npm run dev       # nodemon, auto-restart on changes
```

Visit `http://localhost:3000`.

## Project structure

```
server.js              Express app entry point
routes/index.js         Routes: GET / , POST /contact (stubbed)
views/                  EJS templates
  index.ejs              The whole one-page site
  404.ejs
  partials/head.ejs       <head>, fonts, meta
public/
  css/style.css          Design tokens + all styles
  js/main.js             Scroll reveals, hero tilt, KPI tick, contact form submit
assets/screenshots/      Real product screenshots, one folder per product
```

## Adding / swapping product screenshots

Screenshots live in `assets/screenshots/<product>/` and are referenced directly by filename
in `views/index.ejs` (search for `/assets/screenshots/`). To swap an image:

1. Drop the new file into the matching folder (`accounting/`, `electric-shop/`, `distribook/`,
   or `pos/`).
2. Update the `src` in `views/index.ejs` to the new filename (or keep the same filename to
   avoid touching the template at all).
3. Each screenshot sits inside a `.frame` (browser-chrome styled) or `.cluster`/`.stack` layout
   block — the CSS crops to a fixed aspect ratio via `object-fit: cover`, so images don't need
   to be pre-cropped.

**POS product**: currently rendered with a `.placeholder-frame` block (dashed border, "Screenshot
coming soon" label) instead of real images. When real POS screenshots are available:

1. Add them to `assets/screenshots/pos/`.
2. In `views/index.ejs`, find the `<!-- POS (placeholder) -->` article and replace the
   `<div class="placeholder-frame">...</div>` block with a `.frame` or `.cluster` block matching
   the pattern used in the other three product sections.

## Customizing the color tokens

All colors are CSS custom properties defined at the top of `public/css/style.css`:

```css
:root {
  --ink: #0B0A08;        /* near-black */
  --paper: #F7F3EC;      /* off-white */
  --signal: #FF5A1F;     /* primary orange accent */
  --signal-deep: #C43E0A;/* orange hover/pressed state */
  --charcoal: #1C1815;   /* secondary dark surface */
  --stone: #8A8177;      /* muted text / borders */

  --acc-accounting: #FF5A1F;  /* per-product accent colors */
  --acc-electric: #FFB020;
  --acc-distribook: #6C5CE7;
  --acc-pos: #8A8177;
}
```

Change any value and it cascades through the whole site — buttons, underlines, product tags,
focus states, etc. all reference these tokens rather than hardcoded hex values.

## Fonts

[Fraunces](https://fonts.google.com/specimen/Fraunces) (display/headlines) and
[Inter](https://fonts.google.com/specimen/Inter) (body/UI), loaded via Google Fonts in
`views/partials/head.ejs`.

## Contact form

The form posts to `POST /contact` (see `routes/index.js`). **No email service is configured** —
submissions are validated and logged to the server console only. To wire up real delivery,
swap the `console.log` block in `routes/index.js` for a call to Nodemailer, SendGrid, Postmark,
or similar, using the already-validated `{ name, email, company, message }` payload.
