/**
 * Local SEO Landing Pages
 * Routes: /:city/:service  (e.g. /gazipur/electrician, /dhaka/plumber)
 *
 * Each page = unique content + workers filtered by city + service.
 * This is our LOCAL SEO architecture — targets "plumber gazipur",
 * "electrician dhaka" etc. at the URL/content level (not just meta).
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Star, Phone, CheckCircle2, ChevronRight, ArrowRight, Search, Shield } from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon.jsx';
import WorkerCard from '../components/WorkerCard.jsx';

/* ── City config ─────────────────────────────────────────────────── */
const CITIES = {
  gazipur: {
    name: 'Gazipur', nameBn: 'গাজীপুর',
    division: 'Dhaka Division',
    areas: ['Gazipur Sadar', 'Joydebpur', 'Tongi', 'Kaliakoir', 'Sreepur', 'Kapasia'],
    desc: 'গাজীপুর সিটি কর্পোরেশন ও গাজীপুর জেলার সব এলাকা কভার করে।',
    descEn: 'Covering all areas of Gazipur City Corporation and Gazipur district.',
  },
  dhaka: {
    name: 'Dhaka', nameBn: 'ঢাকা',
    division: 'Dhaka Division',
    areas: ['Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara', 'Mohammadpur', 'Badda', 'Rampura', 'Motijheel'],
    desc: 'ঢাকার সব থানা ও এলাকায় সার্ভিস পাওয়া যায়।',
    descEn: 'Serving all thanas and areas across Dhaka.',
  },
  chittagong: {
    name: 'Chittagong', nameBn: 'চট্টগ্রাম',
    division: 'Chittagong Division',
    areas: ['Agrabad', 'Halishahar', 'Nasirabad', 'Pahartali', 'Panchlaish'],
    desc: 'চট্টগ্রাম শহর ও আশেপাশের সব এলাকায় সার্ভিস।',
    descEn: 'Serving Chittagong city and surrounding areas.',
  },
  narayanganj: {
    name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ',
    division: 'Dhaka Division',
    areas: ['Narayanganj Sadar', 'Fatullah', 'Siddhirganj', 'Sonargaon'],
    desc: 'নারায়ণগঞ্জ শহর ও আশেপাশে যাচাইকৃত কারিগর।',
    descEn: 'Verified workers across Narayanganj.',
  },
};

/* ── Service config ───────────────────────────────────────────────── */
const SERVICES = {
  electrician: {
    key: 'electrician', label: 'Electrician', labelBn: 'ইলেক্ট্রিশিয়ান',
    emoji: '⚡',
    tagline: 'লাইসেন্সড ইলেক্ট্রিশিয়ান — ওয়্যারিং, বোর্ড, এসি ইনস্টলেশন',
    taglineEn: 'Licensed electricians for wiring, board, AC installation & more',
    faqs: [
      { q: 'ইলেক্ট্রিশিয়ান কি ২৪/৭ পাওয়া যায়?', a: 'কারিগরিতে অনেক ইলেক্ট্রিশিয়ান জরুরি সার্ভিস দেন। প্রোফাইলে "Available Now" দেখুন।' },
      { q: 'ইলেক্ট্রিশিয়ানের ঘণ্টা প্রতি চার্জ কত?', a: 'সাধারণত ৳৩৫০–৳৭০০ প্রতি ঘণ্টা, অভিজ্ঞতা ও কাজের ধরন অনুযায়ী।' },
      { q: 'How do I find a trusted electrician near me?', a: 'Search on Karigori, filter by your area, check ratings and reviews, then call directly — no commission.' },
    ],
  },
  plumber: {
    key: 'plumber', label: 'Plumber', labelBn: 'প্লাম্বার',
    emoji: '🔧',
    tagline: 'বিশ্বস্ত প্লাম্বার — পাইপ ফিটিং, পানির লাইন, বাথরুম ইনস্টলেশন',
    taglineEn: 'Expert plumbers for pipe fitting, water line & bathroom installation',
    faqs: [
      { q: 'জরুরি পানির লিক ঠিক করতে কোথায় পাবো?', a: 'কারিগরিতে অনেক প্লাম্বার জরুরি সার্ভিস দেন। "Available Now" ফিল্টার করুন।' },
      { q: 'প্লাম্বারের খরচ কত?', a: 'সাধারণত ৳৩০০–৳৫০০ প্রতি ঘণ্টা। বড় কাজের জন্য আলাদা চুক্তি হয়।' },
      { q: 'How to find a plumber near me in Bangladesh?', a: 'Use Karigori to find verified plumbers in your area. Direct contact, no booking fee.' },
    ],
  },
  'ac-repair': {
    key: 'ac_repair', label: 'AC Repair', labelBn: 'এসি মেকানিক',
    emoji: '❄️',
    tagline: 'সব ব্র্যান্ডের এসি সার্ভিস — ক্লিনিং, গ্যাস রিফিল, মেরামত',
    taglineEn: 'All-brand AC service — cleaning, gas refill & repair',
    faqs: [
      { q: 'এসি ঠান্ডা না করলে কী করবো?', a: 'গ্যাস শেষ বা কমপ্রেসার সমস্যা হতে পারে। কারিগরিতে এসি মেকানিক খুঁজুন।' },
      { q: 'এসি সার্ভিসিংয়ের চার্জ কত?', a: 'সাধারণ সার্ভিসিং ৳৬০০–৳১০০০। গ্যাস রিফিল ৳১৫০০–৳৩০০০।' },
      { q: 'AC repair service near me Bangladesh?', a: 'Find verified AC technicians on Karigori for Samsung, Gree, General, Midea and all brands.' },
    ],
  },
  cleaner: {
    key: 'cleaner', label: 'Cleaner', labelBn: 'ক্লিনার',
    emoji: '🧹',
    tagline: 'বাসা ও অফিস পরিষ্কারের প্রফেশনাল টিম',
    taglineEn: 'Professional home & office cleaning teams',
    faqs: [
      { q: 'বাসা ডিপ ক্লিন করাতে কত খরচ?', a: 'সাধারণত ৳৩০০–৳৫০০ প্রতি ঘণ্টা। বড় বাসার জন্য প্যাকেজ পাওয়া যায়।' },
      { q: 'মুভ-ইন/মুভ-আউট ক্লিনিং কি পাওয়া যায়?', a: 'হ্যাঁ, কারিগরিতে অনেক ক্লিনার মুভ-ইন/আউট ও পোস্ট-কনস্ট্রাকশন ক্লিনিং করেন।' },
      { q: 'Where to find house cleaning service near me?', a: 'Search Karigori for verified cleaners in your area. Filter by location, see ratings, call directly.' },
    ],
  },
  carpenter: {
    key: 'carpenter', label: 'Carpenter', labelBn: 'কাঠমিস্ত্রি',
    emoji: '🪚',
    tagline: 'ফার্নিচার মেরামত, কাস্টম কেবিনেট ও মডুলার কিচেন',
    taglineEn: 'Furniture repair, custom cabinet & modular kitchen fitting',
    faqs: [
      { q: 'কাস্টম ওয়ার্ডরোব বানাতে কত খরচ?', a: 'সাইজ ও উপকরণ অনুযায়ী ৳১৫,০০০ থেকে শুরু। কারিগরির কাঠমিস্ত্রিরা বাড়িতে এসে মাপ দেন।' },
      { q: 'পুরনো ফার্নিচার মেরামত করা যাবে?', a: 'হ্যাঁ, কারিগরিতে অভিজ্ঞ কাঠমিস্ত্রি আছেন যারা যেকোনো ফার্নিচার মেরামত করেন।' },
    ],
  },
  painter: {
    key: 'painter', label: 'Painter', labelBn: 'পেইন্টার',
    emoji: '🎨',
    tagline: 'ইন্টেরিয়র ও এক্সটেরিয়র পেইন্টিং, টেক্সচার ফিনিশ, ওয়াটারপ্রুফিং',
    taglineEn: 'Interior & exterior painting, texture finish & waterproofing',
    faqs: [
      { q: 'বাসা পেইন্ট করতে কত দিন লাগে?', a: '২ বেডরুমের ফ্ল্যাট সাধারণত ৩–৫ দিন। কারিগরির পেইন্টাররা নিজেদের সরঞ্জাম নিয়ে আসেন।' },
      { q: 'পেইন্টিংয়ের খরচ কত?', a: 'সাধারণত ৳৩৫–৳৫০ প্রতি বর্গফুট, রঙ ও ফিনিশ অনুযায়ী।' },
    ],
  },
  'gas-fitter': {
    key: 'gas_fitter', label: 'Gas Fitter', labelBn: 'গ্যাস ফিটার',
    emoji: '🔥',
    tagline: 'গ্যাস লাইন ইনস্টলেশন, স্টোভ কানেকশন ও লিক ডিটেকশন',
    taglineEn: 'Gas line installation, stove connection & leak detection',
    faqs: [
      { q: 'গ্যাস লিক হলে কী করবো?', a: 'গ্যাস বন্ধ করুন, জানালা খুলুন এবং কারিগরিতে জরুরি গ্যাস ফিটার খুঁজুন। আগুন জ্বালাবেন না।' },
      { q: 'গ্যাস স্টোভ কানেকশনের চার্জ কত?', a: 'সাধারণত ৳৫০০–৳১০০০। ফিটিং ও পাইপের ধরন অনুযায়ী।' },
    ],
  },
  'home-help': {
    key: 'bua', label: 'Home Help', labelBn: 'গৃহকর্মী / বুয়া',
    emoji: '🏠',
    tagline: 'রান্না, পরিষ্কার, শিশু ও বৃদ্ধ সেবায় অভিজ্ঞ গৃহকর্মী',
    taglineEn: 'Experienced domestic helpers for cooking, cleaning, childcare',
    faqs: [
      { q: 'পার্ট-টাইম বুয়া কোথায় পাবো?', a: 'কারিগরিতে পার্ট-টাইম ও ফুল-টাইম গৃহকর্মী পাওয়া যায়। এলাকা অনুযায়ী ফিল্টার করুন।' },
      { q: 'গৃহকর্মীর মাসিক বেতন কত?', a: 'পার্ট-টাইম ৳৩,০০০–৳৬,০০০। ফুল-টাইম ৳৬,০০০–৳১২,০০০ কাজের ধরন অনুযায়ী।' },
    ],
  },
};

function buildSchema(city, service, workers) {
  const BASE = 'https://karigori.org';
  const url = `${BASE}/${city?.slug}/${service?.urlKey || service?.key}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'কারিগরি', item: BASE },
          { '@type': 'ListItem', position: 2, name: city?.nameBn, item: `${BASE}/${city?.slug}` },
          { '@type': 'ListItem', position: 3, name: service?.labelBn, item: url },
        ],
      },
      {
        '@type': 'Service',
        name: `${service?.labelBn} সার্ভিস — ${city?.nameBn}`,
        alternateName: `${service?.label} Service in ${city?.name}`,
        description: service?.tagline,
        provider: { '@type': 'Organization', name: 'কারিগরি', url: BASE },
        areaServed: { '@type': 'City', name: city?.name, containedInPlace: { '@type': 'Country', name: 'Bangladesh' } },
        url,
      },
      workers?.length > 0 && {
        '@type': 'ItemList',
        name: `${city?.nameBn}ের ${service?.labelBn} তালিকা`,
        numberOfItems: workers.length,
        itemListElement: workers.slice(0, 5).map((w, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Person',
            name: w.name,
            jobTitle: service?.label,
            aggregateRating: w.reviewCount > 0 ? { '@type': 'AggregateRating', ratingValue: w.rating, reviewCount: w.reviewCount, bestRating: 5 } : undefined,
          },
        })),
      },
      service?.faqs?.length > 0 && {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ].filter(Boolean),
  };
}

export default function LocalLanding() {
  const { city: citySlug, service: serviceSlug } = useParams();
  const navigate = useNavigate();

  const city    = CITIES[citySlug];
  const service = SERVICES[serviceSlug];

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city || !service) return;
    setLoading(true);
    const params = new URLSearchParams({ category: service.key, limit: '12', sort: 'rating' });
    // Also filter by city name as area search
    params.set('q', city.name);
    fetch(`/api/workers?${params}`)
      .then((r) => r.json())
      .then((d) => setWorkers(d.workers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [citySlug, serviceSlug]);

  /* Unknown city/service — redirect to browse */
  if (!city || !service) {
    navigate('/browse', { replace: true });
    return null;
  }

  const schema = buildSchema({ ...city, slug: citySlug }, { ...service, urlKey: serviceSlug }, workers);
  const pageTitle = `${city.nameBn}ে ${service.labelBn} — যাচাইকৃত ${service.label} সার্ভিস | কারিগরি`;
  const pageDesc  = `${city.nameBn}ে বিশ্বস্ত ${service.labelBn} খুঁজুন। ${service.tagline}। সরাসরি যোগাযোগ, কোনো কমিশন নেই।`;
  const pageKw    = `${service.label.toLowerCase()} ${city.name.toLowerCase()}, ${service.labelBn} ${city.nameBn}, ${service.label.toLowerCase()} near me ${city.name.toLowerCase()}, trusted ${service.label.toLowerCase()} ${city.name.toLowerCase()} bangladesh, ${service.labelBn} বাংলাদেশ`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKw} />
        <link rel="canonical" href={`https://karigori.org/${citySlug}/${serviceSlug}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`https://karigori.org/${citySlug}/${serviceSlug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pb-16">

        {/* ── Hero / H1 ── */}
        <div className="bg-gradient-to-br from-brand-700 to-emerald-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-6 font-bn" aria-label="breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">কারিগরি</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/80">{city.nameBn}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{service.labelBn}</span>
            </nav>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                <CategoryIcon category={service.key} size={30} />
              </div>
              <div>
                {/* H1 — main ranking target */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 font-bn">
                  {city.nameBn}ে বিশ্বস্ত {service.labelBn}
                </h1>
                <p className="text-white/80 text-sm sm:text-base font-bn leading-relaxed max-w-2xl">
                  {service.tagline} — {city.nameBn}ের সব এলাকায়।
                  সরাসরি যোগাযোগ, কোনো মধ্যস্থতাকারী নেই।
                </p>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    'যাচাইকৃত কারিগর',
                    'সরাসরি যোগাযোগ',
                    'কোনো কমিশন নেই',
                    `${city.nameBn}ে দ্রুত সার্ভিস`,
                  ].map((t) => (
                    <span key={t} className="flex items-center gap-1 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1 rounded-full font-bn">
                      <CheckCircle2 className="w-3 h-3 shrink-0" /> {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick search within this city */}
            <div className="mt-8 flex items-center gap-2">
              <Link to={`/browse/${service.key}?q=${city.name}`}
                className="flex items-center gap-2 bg-white text-brand-700 font-bold px-6 py-3 rounded-full hover:bg-gray-50 active:scale-95 transition-all shadow-lg text-sm font-bn">
                <Search className="w-4 h-4 shrink-0" />
                {city.nameBn}ের {service.labelBn} দেখুন
              </Link>
              <Link to="/browse"
                className="text-white/70 hover:text-white text-sm font-bn transition-colors underline">
                সব এলাকায় খুঁজুন →
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* ── Workers ── */}
          <section aria-label={`${city.nameBn}ের ${service.labelBn} তালিকা`}>
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 font-bn">
              {city.nameBn}ের যাচাইকৃত {service.labelBn}
              {!loading && workers.length > 0 && <span className="text-gray-400 font-normal text-sm ml-2">({workers.length} জন পাওয়া গেছে)</span>}
            </h2>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="h-52 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
              </div>
            )}

            {!loading && workers.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <p className="text-gray-500 font-bn mb-4">{city.nameBn}ে {service.labelBn} শীঘ্রই যোগ হচ্ছে।</p>
                <Link to={`/browse/${service.key}`}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-brand-700 transition-colors font-bn">
                  সারা বাংলাদেশে {service.labelBn} খুঁজুন <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {!loading && workers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map((w) => <WorkerCard key={w._id} worker={w} />)}
              </div>
            )}
          </section>

          {/* ── Service areas in this city ── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-extrabold text-gray-900 mb-1 font-bn">
              {city.nameBn}ের কোন কোন এলাকায় পাওয়া যায়?
            </h2>
            <p className="text-sm text-gray-500 mb-4 font-bn">{city.desc}</p>
            <div className="flex flex-wrap gap-2">
              {city.areas.map((area) => (
                <Link key={area}
                  to={`/browse/${service.key}?q=${encodeURIComponent(area)}`}
                  className="flex items-center gap-1.5 text-sm bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 text-gray-700 hover:text-brand-700 px-3 py-1.5 rounded-full transition-all font-medium">
                  <MapPin className="w-3 h-3 shrink-0" /> {area}
                </Link>
              ))}
            </div>
          </section>

          {/* ── What to check (E-E-A-T content) ── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-extrabold text-gray-900 mb-4 font-bn">
              {city.nameBn}ে ভালো {service.labelBn} বেছে নেওয়ার ৫টি টিপস
            </h2>
            <ol className="space-y-3">
              {[
                `রেটিং ও রিভিউ দেখুন — কারিগরিতে বাস্তব ব্যবহারকারীদের রিভিউ দেখানো হয়।`,
                `যাচাইকরণ স্তর দেখুন — "ID Verified" বা "Phone Verified" ব্যাজ মানে তথ্য যাচাই হয়েছে।`,
                `অভিজ্ঞতা ও সার্ভিস এলাকা মিলিয়ে নিন — ${city.nameBn}ের জন্য স্থানীয় কারিগর বেশি সুবিধাজনক।`,
                `ফোনে কথা বলে দাম ঠিক করুন — কাজ শুরুর আগেই সব শর্ত পরিষ্কার করুন।`,
                `কাজ শেষে পেমেন্ট করুন এবং রিভিউ দিন — এতে পরবর্তী ব্যবহারকারীরা উপকৃত হবেন।`,
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700 font-bn leading-relaxed">
                  <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ol>
          </section>

          {/* ── FAQ ── */}
          {service.faqs?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-extrabold text-gray-900 mb-5 font-bn">
                {city.nameBn}ে {service.labelBn} সম্পর্কে সাধারণ প্রশ্ন
              </h2>
              <div className="space-y-4">
                {service.faqs.map((faq, i) => (
                  <details key={i} className="group border border-gray-100 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer font-semibold text-gray-900 text-sm font-bn list-none">
                      {faq.q}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                    </summary>
                    <p className="px-4 pb-4 text-sm text-gray-600 font-bn leading-relaxed border-t border-gray-50 pt-3">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ── Disclaimer ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-bn">
              কারিগরি একটি সংযোগকারী প্ল্যাটফর্ম। কারিগরদের তথ্য যাচাই করা হলেও সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দেওয়া যায় না।
              সার্ভিস গ্রহণের আগে নিজে যাচাই করুন।{' '}
              <Link to="/disclaimer" className="underline font-semibold">বিস্তারিত পড়ুন</Link>
            </p>
          </div>

          {/* ── Internal links ── */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 font-bn">অন্যান্য সার্ভিস — {city.nameBn}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SERVICES).filter(([k]) => k !== serviceSlug).map(([slug, svc]) => (
                <Link key={slug} to={`/${citySlug}/${slug}`}
                  className="text-xs font-semibold bg-white border border-gray-200 hover:border-brand-400 text-gray-600 hover:text-brand-700 px-3 py-1.5 rounded-full transition-all font-bn">
                  {svc.labelBn}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
