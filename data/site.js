// Shared site-wide constants: contact identity, social links, offices.
const SITE_URL = 'https://evotrade.io';

module.exports = {
  SITE_URL,
  siteName: 'Evotrade',
  email: 'support@evotrade.io',
  phone: '+92 339 505 0983',
  phoneHref: '+923395050983',
  whatsapp: 'https://wa.me/923395050983',
  parentCompany: {
    name: 'TaxAccountant.pk',
    url: 'https://taxaccountant.pk',
    teamUrl: 'https://taxaccountant.pk/our-team/',
  },
  offices: [
    {
      city: 'Rawalpindi',
      label: 'Head Office',
      address: 'Office 1, First Floor, United Plaza, Main Service Road, Khanna Pul, Rawalpindi',
      phone: '+92 327 514 6237',
      phoneHref: '+923275146237',
      hours: 'Mon – Sat, 9:00 AM – 6:00 PM',
      mapEmbedUrl: 'https://maps.google.com/maps?q=' + encodeURIComponent('Office 1, First Floor, United Plaza, Main Service Road, Khanna Pul, Rawalpindi') + '&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    {
      city: 'Gujranwala',
      label: 'Branch Office',
      address: 'Allied Plaza, Old Session Court Road, Opp. Excise & Taxation Office, Gujranwala',
      phone: '+92 300 075 7533',
      phoneHref: '+923000757533',
      hours: 'Mon – Sat, 10:00 AM – 8:00 PM',
      mapEmbedUrl: 'https://maps.google.com/maps?q=' + encodeURIComponent('Allied Plaza, Old Session Court Road, Gujranwala') + '&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
  ],
  social: {
    facebook: 'https://facebook.com/taxaccountant.pk',
    instagram: 'https://instagram.com/taxaccountant.pk',
    linkedin: 'https://pk.linkedin.com/company/taxaccountant-pk',
    tiktok: 'https://tiktok.com/@taxaccountant.pk',
  },
  pricing: {
    monthly: 1000,
    yearlyDiscount: 0.2,
    yearlyTotal: 9600, // 1000 * 12 * 0.8
  },
};
