import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://karigori.org';
const DEFAULT_IMG = `${BASE_URL}/og-image.png`;

const CATEGORY_SEO = {
  plumber:     { bn: 'প্লাম্বার',       en: 'Plumber',          desc_bn: 'ঢাকা ও সারা বাংলাদেশে যাচাইকৃত প্লাম্বার খুঁজুন। পাইপ ফিটিং, পানির লাইন, বাথরুম ইনস্টলেশন।' },
  electrician: { bn: 'ইলেক্ট্রিশিয়ান', en: 'Electrician',      desc_bn: 'বাংলাদেশে বিশ্বস্ত ইলেক্ট্রিশিয়ান খুঁজুন। ওয়্যারিং, বোর্ড ইনস্টলেশন, এসি ইনস্টলেশন।' },
  cleaner:     { bn: 'ক্লিনার',         en: 'Cleaner',          desc_bn: 'বাড়ি ও অফিস পরিষ্কারের জন্য প্রফেশনাল ক্লিনার খুঁজুন।' },
  bua:         { bn: 'বুয়া / হেল্প',    en: 'Domestic Helper',  desc_bn: 'রান্না, শিশু ও বৃদ্ধ সেবায় অভিজ্ঞ গৃহকর্মী খুঁজুন।' },
  painter:     { bn: 'পেইন্টার',        en: 'Painter',          desc_bn: 'বাসা ও অফিস পেইন্টিং, টেক্সচার ফিনিশ ও ওয়াটারপ্রুফিং।' },
  ac_repair:   { bn: 'এসি মেকানিক',    en: 'AC Repair',        desc_bn: 'সব ব্র্যান্ডের এসি সার্ভিস, গ্যাস রিফিল, ক্লিনিং ও মেরামত।' },
  carpenter:   { bn: 'কাঠমিস্ত্রি',     en: 'Carpenter',        desc_bn: 'ফার্নিচার মেরামত, কাস্টম কেবিনেট ও দরজা-জানালা ফিটিং।' },
  gas_fitter:  { bn: 'গ্যাস ফিটার',    en: 'Gas Fitter',       desc_bn: 'গ্যাস লাইন ফিটিং, স্টোভ কানেকশন ও লিক ডিটেকশন।' },
};

export default function SEOHead({ title, description, keywords, canonical, image, schema, noindex }) {
  const fullTitle = title
    ? `${title} | কারিগরি — বাংলাদেশ লোকাল সার্ভিস`
    : 'কারিগরি | ঢাকা, গাজীপুর ও সারা বাংলাদেশে বিশ্বস্ত প্লাম্বার, ইলেক্ট্রিশিয়ান, ক্লিনার সার্ভিস';

  const desc = description ||
    'কারিগরি — বাংলাদেশের #১ লোকাল সার্ভিস প্ল্যাটফর্ম। যাচাইকৃত প্লাম্বার, ইলেক্ট্রিশিয়ান, এসি মেকানিক, ক্লিনার খুঁজুন। সরাসরি যোগাযোগ, কোনো কমিশন নেই।';

  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      {/* OG */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image || DEFAULT_IMG} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image || DEFAULT_IMG} />

      {/* Page-specific schema */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

/* Helper: generate per-category SEO props */
export function getCategorySEO(categoryKey, area = '') {
  const c = CATEGORY_SEO[categoryKey];
  if (!c) return {};
  const loc = area ? `${area}, বাংলাদেশ` : 'বাংলাদেশ';
  return {
    title: `${loc}ে ${c.bn} — যাচাইকৃত ${c.en} সার্ভিস`,
    description: `${loc}ে বিশ্বস্ত ${c.bn} খুঁজুন। ${c.desc_bn} সরাসরি যোগাযোগ, কোনো কমিশন নেই।`,
    keywords: `${c.en.toLowerCase()} ${area || 'dhaka'}, ${c.bn} ${area || 'ঢাকা'}, ${c.en.toLowerCase()} bangladesh, ${c.bn} বাংলাদেশ, verified ${c.en.toLowerCase()}, যাচাইকৃত ${c.bn}`,
    canonical: `/browse/${categoryKey}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${c.en} Service in ${area || 'Bangladesh'}`,
      alternateName: `${area || 'বাংলাদেশে'} ${c.bn}`,
      provider: { '@type': 'Organization', name: 'কারিগরি', url: BASE_URL },
      areaServed: { '@type': area ? 'City' : 'Country', name: area || 'Bangladesh' },
      description: c.desc_bn,
    },
  };
}
