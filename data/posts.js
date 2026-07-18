// Blog posts. `body` is HTML rendered inside the .prose container.
// Keep headings h2/h3 only (h1 is the post title).

const posts = [
  {
    slug: 'fbr-digital-invoicing-guide-pakistan',
    title: 'FBR Digital Invoicing in Pakistan: What Every Sales-Tax-Registered Business Must Do in 2026',
    metaDescription:
      'FBR e-invoicing is mandatory for sales-tax-registered businesses in Pakistan. Learn the requirements, IRN and QR code rules, PRAL integration routes, penalties up to Rs. 3,000,000, and how to become compliant.',
    excerpt:
      'E-invoicing is no longer optional for sales-tax-registered businesses in Pakistan. Here is what the law requires, what the penalties are, and the two realistic routes to compliance.',
    date: '2026-07-10',
    dateDisplay: 'July 10, 2026',
    author: 'Evotrade Team',
    authorNote: 'Software division of TaxAccountant.pk — FBR-registered tax practitioners and software engineers.',
    readTime: '7 min read',
    tags: ['FBR', 'E-Invoicing', 'Compliance'],
    body: `
<p>If your business is registered for sales tax in Pakistan, electronic invoicing is no longer a modernization project you can schedule for later — it is a legal requirement. Every sales tax invoice must now be generated electronically and transmitted to the Federal Board of Revenue (FBR) in real time, <strong>before</strong> it is issued to the buyer.</p>

<h2>What the rules actually require</h2>
<p>Under FBR's digital invoicing regime, a compliant invoice must:</p>
<ul>
<li>Be transmitted to FBR's computerized system in real time, through the official API, before the buyer receives it.</li>
<li>Carry an <strong>Invoice Reference Number (IRN)</strong> issued by FBR's system.</li>
<li>Display a <strong>verifiable QR code</strong> that any buyer — or inspector — can scan to confirm the invoice exists in FBR's records.</li>
<li>Calculate taxes correctly by rule: standard sales tax, further tax for unregistered buyers, and applicable withholding.</li>
</ul>
<p>The system also expects your products to be classified with correct <strong>HS codes</strong>, and buyer registration status to be verified against FBR records.</p>

<h2>The penalties are not symbolic</h2>
<p>Failing to integrate carries a penalty of <strong>Rs. 500,000 for a first default</strong>, escalating to Rs. 1,000,000, then Rs. 2,000,000, and up to <strong>Rs. 3,000,000</strong> for subsequent defaults. For most SMEs, a single penalty exceeds several years of software cost — which is why "we'll sort it out at audit time" is the most expensive compliance strategy available.</p>

<h2>Two routes to integration</h2>
<h3>1. Direct PRAL integration</h3>
<p>You can integrate directly with FBR through PRAL (Pakistan Revenue Automation Limited). Integration itself is free — but it requires real technical work: implementing the API protocol, handling IRN retrieval, generating compliant QR codes, and building an offline queue so a dropped connection doesn't stop your billing.</p>
<h3>2. A licensed integrator / compliant software</h3>
<p>The practical route for most businesses: use software that already implements the FBR protocol — validation, submission, IRN, QR, tax rules, and offline sync — so your team just creates invoices the way they always have.</p>

<h2>What to check before you choose software</h2>
<ul>
<li><strong>Real-time validation before submission</strong> — errors should be caught before FBR sees them, not after rejection.</li>
<li><strong>Automatic IRN and QR handling</strong> — no copy-pasting between systems.</li>
<li><strong>Correct tax rules</strong> — further tax for unregistered buyers is where manual invoicing most often goes wrong.</li>
<li><strong>Offline queue</strong> — internet outages are a fact of business life in Pakistan; billing must not stop, and queued invoices must sync automatically.</li>
<li><strong>HS code lookup built in</strong> — classification should happen once, in the product catalog.</li>
</ul>

<h2>Where Evotrade fits</h2>
<p>Evotrade is the software division of <a href="https://taxaccountant.pk" rel="noopener">TaxAccountant.pk</a>. Our FBR Digital Invoicing software handles the full chain — prepare, validate, submit, print — with PRAL integration built in. Because we are part of a tax practice, it is <strong>free for TaxAccountant.pk sales-tax-registered clients</strong> as part of their engagement; for everyone else it is Rs. 1,000/month.</p>
<p>If you are unsure whether your business falls under the mandate, or you are staring down an integration deadline, <a href="/contact">talk to us</a> — the consultation costs nothing, and the penalty for guessing wrong starts at half a million rupees.</p>
`,
  },
  {
    slug: 'how-to-choose-pos-accounting-software-pakistan',
    title: 'How to Choose POS and Accounting Software for Your Business in Pakistan (2026 Buyer’s Guide)',
    metaDescription:
      'A practical guide to choosing POS and accounting software in Pakistan: realistic pricing (Rs. 1,000–10,000/month), features that matter by business type, FBR compliance, offline support, and the questions to ask before you pay.',
    excerpt:
      'POS software in Pakistan ranges from Rs. 1,000 to Rs. 10,000 a month, and most of the price difference buys features you will never use. Here is how to choose by business type.',
    date: '2026-07-14',
    dateDisplay: 'July 14, 2026',
    author: 'Evotrade Team',
    authorNote: 'Software division of TaxAccountant.pk — builders of DistriBooks, ElectricStore, and the Evotrade business suite.',
    readTime: '8 min read',
    tags: ['POS', 'Accounting', 'Buying Guide'],
    body: `
<p>Every week we meet business owners paying for software that fights them — a retail POS forced onto a restaurant, an "international" accounting package that has never heard of further tax, or a Rs. 8,000/month subscription used only as a calculator with a printer. This guide is the checklist we wish they'd had.</p>

<h2>Start with your business type, not the feature list</h2>
<p>The single biggest mistake is buying generic software and hoping it adapts. The real question is whether the software models <em>your</em> operation:</p>
<ul>
<li><strong>General retail</strong> needs barcode speed, stock counts that stay true, and a one-page daily close-out.</li>
<li><strong>Restaurants</strong> need table state, kitchen tickets, and menu modifiers — barcode scanning is irrelevant.</li>
<li><strong>Mobile shops</strong> need IMEI-level inventory: every handset is a unique item with its own cost and warranty clock.</li>
<li><strong>Electrical & hardware</strong> shops sell the same SKU by coil, meter, foot, or kg — unit conversion must be native, not a workaround.</li>
<li><strong>Distributors & wholesalers</strong> live on credit accounts, salesman-attributed orders, and delivery gate passes — a walk-in-customer POS cannot represent their business at all.</li>
</ul>
<p>If a vendor's demo can't show your exact workflow, the price doesn't matter.</p>

<h2>What software actually costs in Pakistan</h2>
<p>Cloud POS and accounting software in Pakistan typically runs <strong>Rs. 2,500–10,000 per month</strong>, with restaurant systems at the higher end and some vendors adding one-time setup fees of Rs. 40,000–50,000 per branch. On-premise systems trade the subscription for a large upfront license plus annual maintenance.</p>
<p>Two pricing questions to ask every vendor:</p>
<ul>
<li>Is there a setup fee, and does it repeat per branch?</li>
<li>What happens to your data if you stop paying?</li>
</ul>
<p>(For transparency: every Evotrade product is <strong>Rs. 1,000/month flat</strong> — 20% off paid yearly — and free for TaxAccountant.pk clients. We can price this way because software is our parent firm's client-retention engine, not our only revenue line.)</p>

<h2>The non-negotiables, whatever you buy</h2>
<h3>1. FBR compliance path</h3>
<p>If you are — or will become — sales-tax-registered, e-invoicing integration is mandatory, with penalties from Rs. 500,000. Ask directly: "How does your software submit invoices to FBR?" A vague answer today is your penalty tomorrow.</p>
<h3>2. Offline capability</h3>
<p>Power and internet interruptions are routine. The till must keep billing through an outage and sync when the connection returns. Ask the vendor to demo this by pulling the network cable.</p>
<h3>3. Local payment reality</h3>
<p>Cash, multiple bank accounts, Jazzcash, Easypaisa — payments should land in the correct ledger automatically, or your accountant inherits the mess.</p>
<h3>4. PKR-native accounting</h3>
<p>Aging reports, further tax, withholding — software built for other markets handles these as afterthoughts, if at all.</p>
<h3>5. An exit door</h3>
<p>Your sales history, customer ledgers, and stock records are yours. Confirm you can export them before you enter the first invoice.</p>

<h2>Red flags that predict regret</h2>
<ul>
<li>Pricing only available "after a call" — usually means pricing depends on how you dress.</li>
<li>No trial or demo with your own data.</li>
<li>Every feature you ask about is "in the next update."</li>
<li>Support is a Facebook page.</li>
</ul>

<h2>A sensible buying sequence</h2>
<ol>
<li>Write down your five most frequent daily operations (not features — operations).</li>
<li>Shortlist software built for your business type specifically.</li>
<li>Demo with your real products and a real day's transactions.</li>
<li>Confirm FBR path, offline mode, and data export in writing.</li>
<li>Start monthly; move to yearly once the software has survived a month-end.</li>
</ol>
<p>If you'd like a walkthrough of how any Evotrade product fits your operation — <a href="/products">DistriBooks</a> for distribution, <a href="/products/electricstore">ElectricStore</a> for electrical retail, or the wider suite — <a href="/contact">book a free demo</a>. Bring your hardest workflow; that's the fun part.</p>
`,
  },
];

module.exports = { posts };
