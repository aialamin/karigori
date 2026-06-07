/**
 * LocalLanding.jsx — Programmatic SEO City × Service Pages
 * Routes: /:city/:service
 * Covers 20+ cities × 10 services = 200+ SEO-optimized landing pages
 * Ranking matrix, karigor leaderboard, sample profiles, full schema
 */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, Star, Phone, CheckCircle2, ChevronRight, ArrowRight,
  Search, Shield, Clock, Zap, Award, TrendingUp, Users,
  BadgeCheck, ThumbsUp, Timer, Repeat2, Crown,
} from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon.jsx';
import WorkerCard from '../components/WorkerCard.jsx';

/* ═══════════════════════════════════════════════
   COUNT-UP HOOK + STAT COUNTER COMPONENT
═══════════════════════════════════════════════ */
function useCountUp(target, { duration = 1600, delay = 0, enabled = true } = {}) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    let start = null;
    let timeout = null;

    function tick(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
      else setCount(target);
    }

    timeout = setTimeout(() => {
      raf.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay, enabled]);

  return count;
}

/**
 * StatCounter — animates a number into view when it enters viewport.
 * suffix  : string appended after the number (e.g. '+', '★', '%')
 * sublabel: second line (Bengali description)
 * label   : English / short label
 */
function StatCounter({ target, suffix = '', label, sublabel, delay = 0, light = false }) {
  const ref   = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const count = useCountUp(target, { duration: 1800, delay, enabled: visible });

  const numColor  = light ? '#ffffff'              : G;
  const subColor  = light ? 'rgba(255,255,255,0.65)' : '#6b7280';
  const labelColor= light ? '#ffffff'              : '#111827';

  return (
    <div ref={ref} className="text-center">
      {/* Big animated number */}
      <p className="font-black leading-none tabular-nums"
        style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', color: numColor, letterSpacing:'-0.02em' }}>
        {count.toLocaleString('bn-BD')}{suffix}
      </p>
      {/* Primary label */}
      {label && (
        <p className="font-black text-xs sm:text-sm mt-1" style={{ color: labelColor }}>{label}</p>
      )}
      {/* Secondary sublabel */}
      {sublabel && (
        <p className="text-[10px] sm:text-xs mt-0.5 leading-tight" style={{ color: subColor }}>{sublabel}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COLORS
═══════════════════════════════════════════════ */
const G = '#006A4E';
const GD = '#004d38';

/* ═══════════════════════════════════════════════
   CITIES DATABASE — 20+ cities
═══════════════════════════════════════════════ */
const CITIES = {
  /* ── Tier 1 ── */
  dhaka: {
    name: 'Dhaka', nameBn: 'ঢাকা', nameShortBn: 'ঢাকা',
    division: 'Dhaka Division', pop: '২.২ কোটি+',
    desc: 'বাংলাদেশের রাজধানী ও বৃহত্তম শহর। সব থানা ও এলাকায় সার্ভিস।',
    areas: ['Dhanmondi','Gulshan','Banani','Mirpur','Uttara','Mohammadpur','Badda','Rampura',
            'Bashundhara','Motijheel','Jatrabari','Khilgaon','Pallabi','Tejgaon','Farmgate',
            'Shyamoli','Wari','Lalbagh','Keraniganj','Demra'],
    microAreas: { Uttara:['Sector 1-14'], Mirpur:['1','2','6','10','11','12'], Dhanmondi:['1-27 Road'], Gulshan:['1','2'] },
  },
  gazipur: {
    name: 'Gazipur', nameBn: 'গাজীপুর', nameShortBn: 'গাজীপুর',
    division: 'Dhaka Division', pop: '৫০ লাখ+',
    desc: 'শিল্পনগরী গাজীপুর — গার্মেন্টস ও কারখানা কর্মীদের আবাসিক এলাকা।',
    areas: ['Joydebpur','Tongi','Board Bazar','Konabari','Sreepur','Kaliakoir','Kapasia','Pubail','Chowrasta'],
  },
  chattogram: {
    name: 'Chattogram', nameBn: 'চট্টগ্রাম', nameShortBn: 'চট্টগ্রাম',
    division: 'Chattogram Division', pop: '৮০ লাখ+',
    desc: 'বন্দরনগরী চট্টগ্রাম — বাংলাদেশের দ্বিতীয় বৃহত্তম শহর।',
    areas: ['Agrabad','Halishahar','Nasirabad','Pahartali','Panchlaish','Kotwali','Bayazid','Chandgaon','Khulshi','Sitakunda'],
  },
  narayanganj: {
    name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', nameShortBn: 'নারায়ণগঞ্জ',
    division: 'Dhaka Division', pop: '৩০ লাখ+',
    desc: 'শিল্পনগরী নারায়ণগঞ্জ — পোশাক ও বস্ত্র শিল্পের কেন্দ্র।',
    areas: ['Narayanganj Sadar','Fatullah','Siddhirganj','Sonargaon','Rupganj','Araihazar'],
  },
  sylhet: {
    name: 'Sylhet', nameBn: 'সিলেট', nameShortBn: 'সিলেট',
    division: 'Sylhet Division', pop: '৫০ লাখ+',
    desc: 'চা-বাগানের শহর সিলেট — প্রবাসী বাংলাদেশিদের প্রিয় শহর।',
    areas: ['Sylhet Sadar','Zindabazar','Amberkhana','Shibganj','Subhanighat','Kotwali','Moulvibazar','Beanibazar'],
  },
  cumilla: {
    name: 'Cumilla', nameBn: 'কুমিল্লা', nameShortBn: 'কুমিল্লা',
    division: 'Chattogram Division', pop: '৩৫ লাখ+',
    desc: 'ঐতিহাসিক কুমিল্লা — শিক্ষা ও শিল্পের শহর।',
    areas: ['Cumilla Sadar','Kotbari','Laksam','Chandina','Comilla Cantonment','Brahmanpara','Daudkandi'],
  },
  mymensingh: {
    name: 'Mymensingh', nameBn: 'ময়মনসিংহ', nameShortBn: 'ময়মনসিংহ',
    division: 'Mymensingh Division', pop: '৩০ লাখ+',
    desc: 'কৃষি বিশ্ববিদ্যালয়ের শহর ময়মনসিংহ।',
    areas: ['Mymensingh Sadar','Valuka','Trishal','Bhaluka','Muktagacha','Gafargaon'],
  },
  rajshahi: {
    name: 'Rajshahi', nameBn: 'রাজশাহী', nameShortBn: 'রাজশাহী',
    division: 'Rajshahi Division', pop: '২০ লাখ+',
    desc: 'আমের শহর রাজশাহী — উত্তরবঙ্গের প্রধান শহর।',
    areas: ['Rajshahi Sadar','Boalia','Motihar','Shah Makhdum','Rajpara','Paba'],
  },
  khulna: {
    name: 'Khulna', nameBn: 'খুলনা', nameShortBn: 'খুলনা',
    division: 'Khulna Division', pop: '১৫ লাখ+',
    desc: 'সুন্দরবনের দ্বার খুলনা — দক্ষিণ-পশ্চিমের প্রধান শহর।',
    areas: ['Khulna Sadar','Sonadanga','Khalishpur','Daulatpur','Boyra','Batiaghata'],
  },
  rangpur: {
    name: 'Rangpur', nameBn: 'রংপুর', nameShortBn: 'রংপুর',
    division: 'Rangpur Division', pop: '১৫ লাখ+',
    desc: 'উত্তরের শস্যভান্ডার রংপুর।',
    areas: ['Rangpur Sadar','Taragonj','Badarganj','Mithapukur','Pirganj','Gangachara'],
  },
  /* ── Tier 2 ── */
  bogura: {
    name: 'Bogura', nameBn: 'বগুড়া', nameShortBn: 'বগুড়া',
    division: 'Rajshahi Division', pop: '১০ লাখ+',
    desc: 'উত্তরবঙ্গের বাণিজ্যিক কেন্দ্র বগুড়া।',
    areas: ['Bogura Sadar','Sherpur','Shibganj','Gabtali','Shajahanpur'],
  },
  barishal: {
    name: 'Barishal', nameBn: 'বরিশাল', nameShortBn: 'বরিশাল',
    division: 'Barishal Division', pop: '১২ লাখ+',
    desc: 'নদীমাতৃক বরিশাল — দক্ষিণের প্রধান শহর।',
    areas: ['Barishal Sadar','Kotwali','Babuganj','Bakerganj','Gournadi'],
  },
  jessore: {
    name: 'Jessore', nameBn: 'যশোর', nameShortBn: 'যশোর',
    division: 'Khulna Division', pop: '১০ লাখ+',
    desc: 'ফুলের শহর যশোর — পশ্চিমের গেটওয়ে।',
    areas: ['Jessore Sadar','Monirampur','Bagherpara','Abhaynagar','Keshabpur'],
  },
  narsingdi: {
    name: 'Narsingdi', nameBn: 'নরসিংদী', nameShortBn: 'নরসিংদী',
    division: 'Dhaka Division', pop: '২৫ লাখ+',
    desc: 'বস্ত্র শিল্পের নরসিংদী — ঢাকার নিকটতম শিল্পজেলা।',
    areas: ['Narsingdi Sadar','Palash','Monohardi','Belabo','Raipura'],
  },
  savar: {
    name: 'Savar', nameBn: 'সাভার', nameShortBn: 'সাভার',
    division: 'Dhaka Division', pop: '২০ লাখ+',
    desc: 'গার্মেন্টস নগরী সাভার — ঢাকার উপকণ্ঠ।',
    areas: ['Savar Sadar','Ashulia','Hemayetpur','EPZ','Nabinagar','Amin Bazar'],
  },
  tongi: {
    name: 'Tongi', nameBn: 'টঙ্গী', nameShortBn: 'টঙ্গী',
    division: 'Dhaka Division', pop: '১৫ লাখ+',
    desc: 'শিল্পনগরী টঙ্গী — গাজীপুর জেলার প্রধান শহর।',
    areas: ['Tongi East','Tongi West','Kamarpara','Cherag Ali','Mirzapur'],
  },
  coxsbazar: {
    name: "Cox's Bazar", nameBn: 'কক্সবাজার', nameShortBn: 'কক্সবাজার',
    division: 'Chattogram Division', pop: '১৮ লাখ+',
    desc: 'পর্যটন নগরী কক্সবাজার।',
    areas: ["Cox's Bazar Sadar",'Chakaria','Ramu','Ukhiya','Teknaf'],
  },
  feni: {
    name: 'Feni', nameBn: 'ফেনী', nameShortBn: 'ফেনী',
    division: 'Chattogram Division', pop: '১২ লাখ+',
    desc: 'ব্যবসায়িক শহর ফেনী।',
    areas: ['Feni Sadar','Chhagalnaiya','Daganbhuiyan','Parshuram','Sonagazi'],
  },
  tangail: {
    name: 'Tangail', nameBn: 'টাঙ্গাইল', nameShortBn: 'টাঙ্গাইল',
    division: 'Dhaka Division', pop: '৩৫ লাখ+',
    desc: 'তাঁতের শহর টাঙ্গাইল।',
    areas: ['Tangail Sadar','Basail','Bhuapur','Gopalpur','Mirzapur','Sakhipur'],
  },
  brahmanbaria: {
    name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', nameShortBn: 'ব্রাহ্মণবাড়িয়া',
    division: 'Chattogram Division', pop: '৩০ লাখ+',
    desc: 'সংস্কৃতির শহর ব্রাহ্মণবাড়িয়া।',
    areas: ['Brahmanbaria Sadar','Ashuganj','Nabinagar','Sarail','Kasba'],
  },
  keraniganj: {
    name: 'Keraniganj', nameBn: 'কেরানীগঞ্জ', nameShortBn: 'কেরানীগঞ্জ',
    division: 'Dhaka Division', pop: '১০ লাখ+',
    desc: 'ঢাকার দক্ষিণ উপকণ্ঠ কেরানীগঞ্জ।',
    areas: ['Keraniganj Sadar','Zinzira','Kalindee','Bochashia','Subhadya'],
  },
};

/* ═══════════════════════════════════════════════
   SERVICES DATABASE
═══════════════════════════════════════════════ */
const SERVICES = {
  electrician: {
    key: 'electrician', label: 'Electrician', labelBn: 'ইলেক্ট্রিশিয়ান', emoji: '⚡',
    tagline: 'লাইসেন্সড ইলেক্ট্রিশিয়ান — ওয়্যারিং, বোর্ড, AC ইনস্টলেশন',
    taglineEn: 'Licensed electricians for wiring, board, AC installation & more',
    priceMin: 350, priceMax: 700, priceUnit: 'ঘণ্টা',
    skills: ['হোম ওয়্যারিং','সার্কিট ব্রেকার','AC ইনস্টল','ফ্যান ফিটিং','সোলার প্যানেল'],
    faqs: [
      { q: 'ইলেক্ট্রিশিয়ান কি ২৪/৭ পাওয়া যায়?', a: 'কারিগরিতে অনেক ইলেক্ট্রিশিয়ান জরুরি সার্ভিস দেন। প্রোফাইলে "Available Now" দেখুন।' },
      { q: 'ইলেক্ট্রিশিয়ানের ঘণ্টা প্রতি চার্জ কত?', a: 'সাধারণত ৳৩৫০–৳৭০০ প্রতি ঘণ্টা, অভিজ্ঞতা ও কাজের ধরন অনুযায়ী।' },
      { q: 'How do I find a trusted electrician near me?', a: 'Search on Karigori, filter by your area, check ratings and reviews, then call directly — no commission.' },
      { q: 'বাসার পুরনো ওয়্যারিং পরিবর্তন করাতে কত খরচ?', a: 'সাধারণত ৳৮,০০০–৳২৫,০০০ বাসার আকার ও ওয়্যারিংয়ের পরিমাণ অনুযায়ী। কারিগরিতে ৩টি কোটেশন তুলনা করুন।' },
    ],
  },
  plumber: {
    key: 'plumber', label: 'Plumber', labelBn: 'প্লাম্বার', emoji: '🔧',
    tagline: 'বিশ্বস্ত প্লাম্বার — পাইপ ফিটিং, পানির লাইন, বাথরুম ইনস্টলেশন',
    taglineEn: 'Expert plumbers for pipe fitting, water line & bathroom installation',
    priceMin: 300, priceMax: 500, priceUnit: 'ঘণ্টা',
    skills: ['পাইপ ফিটিং','লিক মেরামত','বাথরুম ফিটিং','ট্যাংক ইনস্টল','ড্রেনেজ ক্লিন'],
    faqs: [
      { q: 'জরুরি পানির লিক ঠিক করতে কোথায় পাবো?', a: 'কারিগরিতে অনেক প্লাম্বার জরুরি সার্ভিস দেন। "Available Now" ফিল্টার করুন।' },
      { q: 'প্লাম্বারের খরচ কত?', a: 'সাধারণত ৳৩০০–৳৫০০ প্রতি ঘণ্টা। বড় কাজের জন্য আলাদা চুক্তি হয়।' },
      { q: 'How to find a plumber near me in Bangladesh?', a: 'Use Karigori to find verified plumbers in your area. Direct contact, no booking fee.' },
      { q: 'নতুন বাথরুম ফিটিংয়ে কত খরচ হয়?', a: 'কমোড, বেসিন ও শাওয়ার ফিটিং সহ সাধারণত ৳৫,০০০–৳১৫,০০০। পার্টসের দাম আলাদা।' },
    ],
  },
  'ac-repair': {
    key: 'ac_repair', label: 'AC Repair', labelBn: 'এসি মেকানিক', emoji: '❄️',
    tagline: 'সব ব্র্যান্ডের এসি সার্ভিস — ক্লিনিং, গ্যাস রিফিল, মেরামত',
    taglineEn: 'All-brand AC service — cleaning, gas refill & repair',
    priceMin: 600, priceMax: 1000, priceUnit: 'সার্ভিস',
    skills: ['AC সার্ভিসিং','গ্যাস রিফিল','কমপ্রেসর মেরামত','ইনস্টলেশন','ডিপ ক্লিন'],
    faqs: [
      { q: 'এসি ঠান্ডা না করলে কী করবো?', a: 'গ্যাস শেষ বা কমপ্রেসার সমস্যা হতে পারে। কারিগরিতে এসি মেকানিক খুঁজুন।' },
      { q: 'এসি সার্ভিসিংয়ের চার্জ কত?', a: 'সাধারণ সার্ভিসিং ৳৬০০–৳১০০০। গ্যাস রিফিল ৳১৫০০–৳৩০০০।' },
      { q: 'AC repair service near me Bangladesh?', a: 'Find verified AC technicians on Karigori for Samsung, Gree, General, Midea and all brands.' },
      { q: 'বছরে কতবার এসি সার্ভিস করানো উচিত?', a: 'গরমের আগে (ফেব্রুয়ারি-মার্চ) একবার এবং ভারী ব্যবহারে বছরে ২ বার।' },
    ],
  },
  cleaner: {
    key: 'cleaner', label: 'Home Cleaning', labelBn: 'ক্লিনার', emoji: '🧹',
    tagline: 'বাসা ও অফিস পরিষ্কারের প্রফেশনাল টিম',
    taglineEn: 'Professional home & office cleaning teams',
    priceMin: 300, priceMax: 500, priceUnit: 'ঘণ্টা',
    skills: ['ডিপ ক্লিনিং','কিচেন ক্লিন','বাথরুম স্ক্রাব','মুভ-ইন/আউট','সোফা ক্লিন'],
    faqs: [
      { q: 'বাসা ডিপ ক্লিন করাতে কত খরচ?', a: 'সাধারণত ৳৩০০–৳৫০০ প্রতি ঘণ্টা। বড় বাসার জন্য প্যাকেজ পাওয়া যায়।' },
      { q: 'মুভ-ইন/মুভ-আউট ক্লিনিং কি পাওয়া যায়?', a: 'হ্যাঁ, কারিগরিতে অনেক ক্লিনার মুভ-ইন/আউট ও পোস্ট-কনস্ট্রাকশন ক্লিনিং করেন।' },
      { q: 'Where to find house cleaning service near me?', a: 'Search Karigori for verified cleaners in your area. Filter by location, see ratings, call directly.' },
      { q: 'ক্লিনিং সার্ভিসের জন্য কি উপকরণ আনে?', a: 'বেশিরভাগ প্রফেশনাল ক্লিনার নিজেদের সরঞ্জাম আনেন। বুকিংয়ের সময় জিজ্ঞেস করুন।' },
    ],
  },
  painter: {
    key: 'painter', label: 'Painter', labelBn: 'পেইন্টার', emoji: '🎨',
    tagline: 'ইন্টেরিয়র ও এক্সটেরিয়র পেইন্টিং, টেক্সচার ফিনিশ',
    taglineEn: 'Interior & exterior painting, texture finish & waterproofing',
    priceMin: 35, priceMax: 50, priceUnit: 'বর্গফুট',
    skills: ['ইন্টেরিয়র পেইন্ট','এক্সটেরিয়র পেইন্ট','টেক্সচার ফিনিশ','ওয়াটারপ্রুফিং','পুটি কাজ'],
    faqs: [
      { q: 'বাসা পেইন্ট করতে কত দিন লাগে?', a: '২ বেডরুমের ফ্ল্যাট সাধারণত ৩–৫ দিন। কারিগরির পেইন্টাররা নিজেদের সরঞ্জাম নিয়ে আসেন।' },
      { q: 'পেইন্টিংয়ের খরচ কত?', a: 'সাধারণত ৳৩৫–৳৫০ প্রতি বর্গফুট, রঙ ও ফিনিশ অনুযায়ী।' },
      { q: 'কোন রং বেশি টেকসই?', a: 'বার্জার ওয়েদারকোট ও Asian Paints Apex বাইরে এবং Berger Robbialac ভেতরে ভালো।' },
    ],
  },
  carpenter: {
    key: 'carpenter', label: 'Carpenter', labelBn: 'কাঠমিস্ত্রি', emoji: '🪚',
    tagline: 'ফার্নিচার মেরামত, কাস্টম কেবিনেট ও মডুলার কিচেন',
    taglineEn: 'Furniture repair, custom cabinet & modular kitchen fitting',
    priceMin: 400, priceMax: 800, priceUnit: 'ঘণ্টা',
    skills: ['ফার্নিচার মেরামত','কাস্টম আলমারি','মডুলার কিচেন','দরজা ফিটিং','বেড ফ্রেম'],
    faqs: [
      { q: 'কাস্টম ওয়ার্ডরোব বানাতে কত খরচ?', a: 'সাইজ ও উপকরণ অনুযায়ী ৳১৫,০০০ থেকে শুরু।' },
      { q: 'পুরনো ফার্নিচার মেরামত করা যাবে?', a: 'হ্যাঁ, কারিগরিতে অভিজ্ঞ কাঠমিস্ত্রি আছেন যারা যেকোনো ফার্নিচার মেরামত করেন।' },
    ],
  },
  'pest-control': {
    key: 'pest_control', label: 'Pest Control', labelBn: 'পেস্ট কন্ট্রোল', emoji: '🐛',
    tagline: 'তেলাপোকা, ইঁদুর, মশা ও পোকামাকড় নিধন সার্ভিস',
    taglineEn: 'Professional pest control for cockroaches, rats, mosquitoes & termites',
    priceMin: 800, priceMax: 2000, priceUnit: 'সার্ভিস',
    skills: ['তেলাপোকা নিধন','ইঁদুর দমন','মশা স্প্রে','উইপোকা নিধন','ফিউমিগেশন'],
    faqs: [
      { q: 'পেস্ট কন্ট্রোল কতদিন কাজ করে?', a: 'ভালো মানের স্প্রে ৩-৬ মাস কার্যকর। নিয়মিত করলে সারা বছর পোকামুক্ত থাকা যায়।' },
      { q: 'শিশু ও পোষা প্রাণীর জন্য নিরাপদ?', a: 'আমরা WHO অনুমোদিত কেমিক্যাল ব্যবহার করি। স্প্রের পর ৪-৬ ঘণ্টা ঘর ছেড়ে থাকুন।' },
    ],
  },
  cctv: {
    key: 'cctv', label: 'CCTV Installation', labelBn: 'CCTV', emoji: '📷',
    tagline: 'বাসা ও অফিসে CCTV ক্যামেরা ইনস্টলেশন ও মেরামত',
    taglineEn: 'CCTV camera installation & maintenance for home and office',
    priceMin: 2000, priceMax: 5000, priceUnit: 'ইনস্টল',
    skills: ['IP ক্যামেরা','HD CCTV','নেটওয়ার্ক সেটআপ','DVR/NVR কনফিগ','মোবাইল অ্যাক্সেস'],
    faqs: [
      { q: '৪টি ক্যামেরা ইনস্টল করতে কত খরচ?', a: 'ক্যামেরাসহ ৳১২,০০০–৳২৫,০০০। শুধু ইনস্টলেশন ৳৩,০০০–৳৬,০০০।' },
      { q: 'মোবাইলে CCTV দেখা যাবে?', a: 'হ্যাঁ, সব আধুনিক IP ক্যামেরা মোবাইল অ্যাপ দিয়ে দেখা যায়।' },
    ],
  },
  'water-tank': {
    key: 'water_tank', label: 'Water Tank Cleaning', labelBn: 'ওয়াটার ট্যাংক', emoji: '💧',
    tagline: 'পানির ট্যাংক পরিষ্কার ও জীবাণুমুক্ত করা',
    taglineEn: 'Water tank cleaning & disinfection service',
    priceMin: 800, priceMax: 1500, priceUnit: 'সার্ভিস',
    skills: ['ট্যাংক ক্লিন','ডিসইনফেকশন','পাইপ ফ্লাশিং','ফিল্টার পরিষ্কার','বার্ষিক সার্ভিস'],
    faqs: [
      { q: 'কতদিন পরপর ট্যাংক পরিষ্কার করতে হয়?', a: 'স্বাস্থ্য বিশেষজ্ঞদের মতে প্রতি ৩-৬ মাসে একবার।' },
      { q: 'ট্যাংক ক্লিনিং কতক্ষণ লাগে?', a: '৫০০ গ্যালন ট্যাংক পরিষ্কার করতে সাধারণত ২-৩ ঘণ্টা।' },
    ],
  },
  'gas-fitter': {
    key: 'gas_fitter', label: 'Gas Fitter', labelBn: 'গ্যাস ফিটার', emoji: '🔥',
    tagline: 'গ্যাস লাইন ইনস্টলেশন, স্টোভ কানেকশন ও লিক ডিটেকশন',
    taglineEn: 'Gas line installation, stove connection & leak detection',
    priceMin: 500, priceMax: 1000, priceUnit: 'কাজ',
    skills: ['গ্যাস লাইন','স্টোভ কানেকশন','লিক ডিটেকশন','পাইপ মেরামত','রেগুলেটর ফিটিং'],
    faqs: [
      { q: 'গ্যাস লিক হলে কী করবো?', a: 'গ্যাস বন্ধ করুন, জানালা খুলুন এবং কারিগরিতে জরুরি গ্যাস ফিটার খুঁজুন।' },
      { q: 'গ্যাস স্টোভ কানেকশনের চার্জ কত?', a: 'সাধারণত ৳৫০০–৳১০০০। ফিটিং ও পাইপের ধরন অনুযায়ী।' },
    ],
  },
};

/* ═══════════════════════════════════════════════
   KARIGOR RANKING SYSTEM
═══════════════════════════════════════════════ */
const BADGE_TIERS = [
  { id: 'gold',    label: '🥇 Gold Karigor',    minScore: 90, bg: '#fef9c3', border: '#fbbf24', color: '#92400e', textColor: '#78350f' },
  { id: 'silver',  label: '🥈 Silver Karigor',  minScore: 75, bg: '#f1f5f9', border: '#94a3b8', color: '#475569', textColor: '#334155' },
  { id: 'bronze',  label: '🥉 Bronze Karigor',  minScore: 60, bg: '#fdf6ee', border: '#f59e0b', color: '#92400e', textColor: '#78350f' },
  { id: 'verified',label: '⭐ Verified Expert', minScore: 0,  bg: '#f0fdf4', border: '#86efac', color: G,         textColor: GD },
];

function getBadge(score) {
  return BADGE_TIERS.find((b) => score >= b.minScore) || BADGE_TIERS[BADGE_TIERS.length - 1];
}

function calcScore(k) {
  return Math.round(
    k.rating        * 30 / 5    +   // 30% reviews (max 5★)
    Math.min(k.jobs / 200, 1)   * 20 +  // 20% jobs (cap at 200)
    k.responseTime              * 15 +  // 15% response (0-1)
    k.repeatRate                * 10 +  // 10% repeat
    (k.verified ? 10 : 0)           +  // 10% verification
    k.ontime                    * 10 +  // 10% on-time
    k.priceScore                * 5     // 5% price
  );
}

/* ═══════════════════════════════════════════════
   SAMPLE KARIGOR GENERATOR
   Deterministic from city+service seed
═══════════════════════════════════════════════ */
const KARIGOR_NAMES = [
  'মোঃ রহিম উদ্দিন','মোঃ করিম আলী','মোঃ আব্দুল হক','মোঃ জাহিদুল ইসলাম',
  'মোঃ মফিজুর রহমান','মোঃ সালাউদ্দিন','মোঃ নজরুল ইসলাম','মোঃ শফিকুল হক',
  'মোঃ আনিসুজ্জামান','মোঃ বেলাল হোসেন','মোঃ কামরুল হাসান','মোঃ শাহিনুর রহমান',
];

const KARIGOR_SPECIALTIES = {
  electrician: ['হোম ওয়্যারিং বিশেষজ্ঞ','ইন্ডাস্ট্রিয়াল ইলেক্ট্রিশিয়ান','AC ইনস্টল বিশেষজ্ঞ','ইমার্জেন্সি ইলেক্ট্রিশিয়ান'],
  plumber:     ['পাইপ ফিটিং বিশেষজ্ঞ','বাথরুম ইনস্টলেশন','জরুরি পাইপ মেরামত','ওয়াটার লাইন এক্সপার্ট'],
  'ac-repair': ['Samsung AC বিশেষজ্ঞ','সব ব্র্যান্ড AC মেকানিক','AC ইনস্টলেশন এক্সপার্ট','গ্যাস রিফিল বিশেষজ্ঞ'],
  cleaner:     ['ডিপ ক্লিনিং টিম লিড','মুভ-ইন ক্লিনিং','অফিস ক্লিনিং','প্রফেশনাল হাউসকিপার'],
  painter:     ['ইন্টেরিয়র পেইন্ট বিশেষজ্ঞ','টেক্সচার ওয়াল আর্টিস্ট','ওয়াটারপ্রুফিং এক্সপার্ট','3D ওয়াল পেইন্টার'],
  carpenter:   ['মডুলার ফার্নিচার','কাস্টম কেবিনেট মেকার','দরজা-জানালা বিশেষজ্ঞ','কিচেন ফিটিং এক্সপার্ট'],
  'pest-control':['তেলাপোকা নিধন বিশেষজ্ঞ','ফিউমিগেশন এক্সপার্ট','ইঁদুর দমন','মশা কন্ট্রোল'],
  cctv:        ['IP ক্যামেরা ইনস্টলার','নেটওয়ার্ক CCTV এক্সপার্ট','HD সিকিউরিটি সিস্টেম','রিমোট ভিউ সেটআপ'],
  'water-tank':['ট্যাংক ক্লিনিং বিশেষজ্ঞ','ডিসইনফেকশন এক্সপার্ট','পানি বিশুদ্ধকরণ'],
  'gas-fitter':['গ্যাস লাইন বিশেষজ্ঞ','লিক ডিটেকশন এক্সপার্ট','রান্নাঘর গ্যাস ফিটার'],
};

function seededRng(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function generateKarigors(citySlug, serviceSlug, cityAreas) {
  const seed = citySlug.split('').reduce((a, c) => a + c.charCodeAt(0), 0) +
               serviceSlug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seededRng(seed);
  const specs = KARIGOR_SPECIALTIES[serviceSlug] || ['বিশেষজ্ঞ'];
  const count = 6;

  return Array.from({ length: count }, (_, i) => {
    const nameIdx     = Math.floor(rng() * KARIGOR_NAMES.length);
    const specIdx     = i % specs.length;
    const areaIdx     = Math.floor(rng() * Math.min(cityAreas.length, 6));
    const rating      = +(4.0 + rng() * 1.0).toFixed(1);
    const reviews     = Math.floor(rng() * 180 + 10);
    const jobs        = Math.floor(rng() * 300 + 20);
    const exp         = Math.floor(rng() * 12 + 1);
    const responseTime = +(rng()).toFixed(2);
    const repeatRate  = +(0.4 + rng() * 0.5).toFixed(2);
    const ontime      = +(0.7 + rng() * 0.3).toFixed(2);
    const priceScore  = +(rng()).toFixed(2);
    const verified    = rng() > 0.3;
    const available   = rng() > 0.4;
    const emergency   = rng() > 0.6;
    const svc         = SERVICES[serviceSlug];
    const priceRange  = svc ? `৳${svc.priceMin}–৳${svc.priceMax}/${svc.priceUnit}` : '৳৳';

    const k = { rating, reviews, jobs, responseTime, repeatRate, ontime, priceScore, verified };
    const score = calcScore(k);
    const badge = getBadge(score);

    return {
      id:        `${citySlug}-${serviceSlug}-${i}`,
      name:      KARIGOR_NAMES[nameIdx],
      specialty: specs[specIdx],
      area:      cityAreas[areaIdx] || cityAreas[0],
      exp,
      rating,
      reviews,
      jobs,
      verified,
      available,
      emergency,
      priceRange,
      score,
      badge,
      responseMin: Math.floor(rng() * 50 + 10),
      completionRate: Math.floor(98 - rng() * 10),
    };
  }).sort((a, b) => b.score - a.score);
}

/* ═══════════════════════════════════════════════
   JSON-LD SCHEMA BUILDER
═══════════════════════════════════════════════ */
function buildSchema(city, service, karigors, citySlug, serviceSlug) {
  const BASE = 'https://karigori.org';
  const url  = `${BASE}/${citySlug}/${serviceSlug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'কারিগরি', item: BASE },
          { '@type': 'ListItem', position: 2, name: city.nameBn, item: `${BASE}/${citySlug}` },
          { '@type': 'ListItem', position: 3, name: service.labelBn, item: url },
        ],
      },
      {
        '@type': 'Service',
        name: `${service.labelBn} সার্ভিস — ${city.nameBn}`,
        alternateName: `${service.label} Service in ${city.name}`,
        description: service.tagline,
        provider: { '@type': 'Organization', name: 'কারিগরি', url: BASE },
        areaServed: { '@type': 'City', name: city.name, containedInPlace: { '@type': 'Country', name: 'Bangladesh' } },
        offers: { '@type': 'Offer', priceSpecification: { '@type': 'UnitPriceSpecification', price: service.priceMin, priceCurrency: 'BDT' } },
        url,
      },
      {
        '@type': 'ItemList',
        name: `${city.nameBn}ের সেরা ${service.labelBn}`,
        numberOfItems: karigors.length,
        itemListElement: karigors.slice(0, 5).map((k, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: {
            '@type': 'Person',
            name: k.name, jobTitle: service.label,
            aggregateRating: { '@type': 'AggregateRating', ratingValue: k.rating, reviewCount: k.reviews, bestRating: 5 },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs?.map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'LocalBusiness',
        name: `কারিগরি ${city.nameBn} — ${service.labelBn}`,
        url, telephone: '+880-1700-000000',
        address: { '@type': 'PostalAddress', addressLocality: city.name, addressCountry: 'BD' },
        priceRange: `৳${service.priceMin}–৳${service.priceMax}`,
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: karigors.reduce((s, k) => s + k.reviews, 0), bestRating: 5 },
      },
    ].filter(Boolean),
  };
}

/* ═══════════════════════════════════════════════
   KARIGOR CARD COMPONENT
═══════════════════════════════════════════════ */
function SampleKarigorCard({ karigor, rank }) {
  const badge = karigor.badge;
  return (
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all overflow-hidden group"
      style={{ borderColor: rank <= 3 ? badge.border : '#f3f4f6' }}>
      {/* Rank + badge header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2"
        style={{ background: rank <= 3 ? badge.bg : '#fafafa', borderBottom:`1px solid ${rank <= 3 ? badge.border : '#f3f4f6'}` }}>
        <div className="flex items-center gap-2">
          <span className="text-base font-black" style={{ color: rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : rank === 3 ? '#d97706' : '#9ca3af' }}>
            #{rank}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.color, border:`1px solid ${badge.border}` }}>
            {badge.label}
          </span>
        </div>
        {karigor.available && (
          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: G }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: G }} />
            এখন পাওয়া যাচ্ছে
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Avatar + info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${G} 0%, #16a34a 100%)` }}>
            {karigor.name[2] || 'ক'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-sm text-gray-900 truncate">{karigor.name}</h3>
            <p className="text-xs text-gray-500 truncate">{karigor.specialty}</p>
            <p className="text-xs flex items-center gap-1 mt-0.5 text-gray-400">
              <MapPin style={{ width:10, height:10 }} /> {karigor.area}
            </p>
          </div>
          {karigor.verified && (
            <BadgeCheck style={{ width:18, height:18, color: G, flexShrink:0 }} />
          )}
        </div>

        {/* Score bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-500">Karigor Score</span>
            <span className="text-xs font-black" style={{ color: G }}>{karigor.score}/100</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width:`${karigor.score}%`, background:`linear-gradient(90deg, ${G}, #16a34a)` }} />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { icon: Star,    val: karigor.rating, label: 'রেটিং', color:'#f59e0b' },
            { icon: Award,   val: karigor.jobs,   label: 'কাজ',   color: G },
            { icon: Clock,   val: `${karigor.responseMin}মি`, label: 'রেসপন্স', color:'#8b5cf6' },
          ].map(({ icon: Icon, val, label, color }) => (
            <div key={label} className="text-center bg-gray-50 rounded-xl py-2">
              <Icon style={{ width:13, height:13, color, margin:'0 auto 2px' }} />
              <p className="text-xs font-black text-gray-900">{val}</p>
              <p className="text-[9px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{karigor.exp} বছর অভিজ্ঞতা</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:'#f0fdf4', color: G }}>{karigor.priceRange}</span>
          {karigor.emergency && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 flex items-center gap-0.5">
              <Zap style={{ width:9, height:9 }} /> জরুরি সার্ভিস
            </span>
          )}
        </div>

        {/* CTA */}
        <Link to="/browse"
          className="flex items-center justify-center gap-1.5 w-full text-xs font-black py-2.5 rounded-xl transition-all hover:opacity-90 text-white"
          style={{ background:`linear-gradient(135deg, ${G} 0%, #16a34a 100%)` }}>
          <Phone style={{ width:12, height:12 }} /> যোগাযোগ করুন
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   RANKING LEADERBOARD
═══════════════════════════════════════════════ */
function RankingMatrix({ karigors, service, city }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }} className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'rgba(255,255,255,0.15)' }}>
            <Crown style={{ width:20, height:20, color:'#fbbf24' }} />
          </div>
          <div>
            <h2 className="font-black text-white text-base">{city.nameBn}ের সেরা {service.labelBn}</h2>
            <p className="text-xs" style={{ color:'rgba(255,255,255,0.7)' }}>Karigor Score অনুযায়ী র‌্যাংকিং</p>
          </div>
        </div>
        {/* Score formula strip */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[['30%','রেটিং','#fbbf24'],['20%','কাজ','#34d399'],['15%','রেসপন্স','#a78bfa'],['10%','পুনরায়','#60a5fa'],['10%','ভেরিফাই','#f87171'],['10%','সময়মতো','#fb923c'],['5%','মূল্য','#e879f9']].map(([pct, lbl, color]) => (
            <span key={lbl} className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5" style={{ background:'rgba(255,255,255,0.12)', color:'#fff' }}>
              <span style={{ color }}>{pct}</span> {lbl}
            </span>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="p-4 border-b border-gray-50">
        <div className="grid grid-cols-3 gap-3">
          {/* #2 */}
          <div className="text-center pt-4">
            <div className="text-2xl mb-1">🥈</div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-white mx-auto mb-1" style={{ background:'#94a3b8' }}>
              {(karigors[1]?.name?.[2] || '২')}
            </div>
            <p className="text-xs font-bold text-gray-700 leading-tight line-clamp-1">{karigors[1]?.name}</p>
            <p className="text-xs font-black mt-0.5" style={{ color:'#64748b' }}>{karigors[1]?.score}/100</p>
          </div>
          {/* #1 */}
          <div className="text-center -mt-2">
            <div className="text-3xl mb-1">🥇</div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black text-white mx-auto mb-1 shadow-lg" style={{ background:`linear-gradient(135deg, #f59e0b, #d97706)` }}>
              {(karigors[0]?.name?.[2] || '১')}
            </div>
            <p className="text-xs font-black text-gray-900 leading-tight line-clamp-1">{karigors[0]?.name}</p>
            <p className="text-xs font-black mt-0.5" style={{ color:'#d97706' }}>{karigors[0]?.score}/100</p>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background:'#fef9c3', color:'#92400e' }}>🏆 সেরা</span>
          </div>
          {/* #3 */}
          <div className="text-center pt-4">
            <div className="text-2xl mb-1">🥉</div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-white mx-auto mb-1" style={{ background:'#d97706' }}>
              {(karigors[2]?.name?.[2] || '৩')}
            </div>
            <p className="text-xs font-bold text-gray-700 leading-tight line-clamp-1">{karigors[2]?.name}</p>
            <p className="text-xs font-black mt-0.5" style={{ color:'#d97706' }}>{karigors[2]?.score}/100</p>
          </div>
        </div>
      </div>

      {/* Full rank list */}
      <div className="divide-y divide-gray-50">
        {karigors.map((k, i) => (
          <div key={k.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <span className="w-6 text-center text-xs font-black shrink-0"
              style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : '#d1d5db' }}>
              #{i + 1}
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
              style={{ background:`linear-gradient(135deg, ${G}, #16a34a)` }}>
              {k.name[2] || 'ক'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{k.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:`${k.score}%`, background:G }} />
                </div>
                <span className="text-[10px] font-black shrink-0" style={{ color: G }}>{k.score}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star style={{ width:10, height:10, fill:'#fbbf24', color:'#fbbf24' }} />
              <span className="text-xs font-bold text-gray-700">{k.rating}</span>
            </div>
            {k.verified && <BadgeCheck style={{ width:14, height:14, color: G, flexShrink:0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PRICE TABLE
═══════════════════════════════════════════════ */
function PriceTable({ service, cityName }) {
  const rows = {
    electrician: [['ফ্যান ইনস্টলেশন','৳২০০–৳৪০০','৩০ মিনিট'],['লাইট ফিটিং','৳১৫০–৳৩০০','২০ মিনিট'],['সার্কিট ব্রেকার মেরামত','৳৫০০–৳১২০০','১-২ ঘণ্টা'],['হোম ওয়্যারিং (প্রতি পয়েন্ট)','৳৮০০–৳১৫০০','ভেরিয়েবল']],
    plumber:     [['কল মেরামত','৳৩০০–৳৫০০','৩০ মিনিট'],['পাইপ লিক ফিক্স','৳৫০০–৳১৫০০','১-২ ঘণ্টা'],['বাথরুম ফিটিং','৳৫,০০০–৳১৫,০০০','১-২ দিন'],['ট্যাংক ইনস্টল','৳১,০০০–৳৩,০০০','২-৪ ঘণ্টা']],
    'ac-repair': [['বেসিক সার্ভিস','৳৮০০–৳১,২০০','১.৫ ঘণ্টা'],['ডিপ ক্লিন','৳১,৫০০–৳২,৫০০','২-৩ ঘণ্টা'],['গ্যাস রিফিল','৳২,০০০–৳৩,৫০০','১-২ ঘণ্টা'],['কমপ্রেসর মেরামত','৳৫,০০০–৳১৫,০০০','৪-৬ ঘণ্টা']],
    cleaner:     [['বেসিক ক্লিনিং (১ বেড)','৳৮০০–৳১,২০০','২ ঘণ্টা'],['ডিপ ক্লিন (৩ বেড)','৳২,৫০০–৳৪,০০০','৪-৫ ঘণ্টা'],['মুভ-ইন/আউট','৳৩,০০০–৳৫,০০০','৬-৮ ঘণ্টা'],['অফিস ক্লিনিং','৳৫০–৳৮০/সিট','ভেরিয়েবল']],
  };
  const table = rows[service.key] || rows.electrician;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
        <TrendingUp style={{ width:16, height:16, color: G }} />
        <h3 className="font-black text-sm text-gray-900">{cityName}ে {service.labelBn}ের প্রাইস গাইড</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: G }}>
              {['কাজের ধরন','আনুমানিক খরচ','সময়'].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-white font-bold text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map(([job, price, time], i) => (
              <tr key={job} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                <td className="px-4 py-2.5 text-gray-700 font-medium text-xs border-b border-gray-50">{job}</td>
                <td className="px-4 py-2.5 font-bold text-xs border-b border-gray-50" style={{ color: G }}>{price}</td>
                <td className="px-4 py-2.5 text-gray-500 text-xs border-b border-gray-50">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 pb-3 pt-2 text-xs text-gray-400">* মূল্য আনুমানিক। কাজের পরিমাণ ও জরুরিতার উপর ভিত্তি করে পরিবর্তন হতে পারে।</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function LocalLanding() {
  const { city: citySlug, service: serviceSlug } = useParams();
  const navigate = useNavigate();
  const [liveWorkers, setLiveWorkers] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState('sample'); // 'sample' | 'live'

  const city    = CITIES[citySlug];
  const service = SERVICES[serviceSlug];

  const sampleKarigors = useMemo(
    () => city && service ? generateKarigors(citySlug, serviceSlug, city.areas) : [],
    [citySlug, serviceSlug],
  );

  useEffect(() => {
    if (!city || !service) return;
    setLoading(true);
    const p = new URLSearchParams({ category: service.key, limit: '9', sort: 'rating' });
    p.set('q', city.name);
    fetch(`/api/workers?${p}`)
      .then((r) => r.json())
      .then((d) => { setLiveWorkers(d.workers || []); if ((d.workers || []).length > 0) setActiveTab('live'); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [citySlug, serviceSlug]);

  if (!city || !service) {
    navigate('/browse', { replace: true });
    return null;
  }

  const totalReviews = sampleKarigors.reduce((s, k) => s + k.reviews, 0);
  const avgRating    = (sampleKarigors.reduce((s, k) => s + k.rating, 0) / sampleKarigors.length).toFixed(1);

  const pageTitle = `${city.nameBn}ে বিশ্বস্ত ${service.labelBn} — সেরা ${service.label} সার্ভিস | কারিগরি`;
  const pageDesc  = `${city.nameBn}ে যাচাইকৃত ${service.labelBn} খুঁজুন। ${service.tagline}। সরাসরি যোগাযোগ, কোনো কমিশন নেই। ${city.areas.slice(0, 4).join(', ')} সহ সব এলাকায়।`;
  const pageKw    = `${service.label.toLowerCase()} ${city.name.toLowerCase()}, ${service.labelBn} ${city.nameBn}, best ${service.label.toLowerCase()} in ${city.name.toLowerCase()}, ${service.label.toLowerCase()} near me ${city.name.toLowerCase()}, trusted ${service.labelBn} ${city.name}, ${city.areas.slice(0,3).map(a => `${service.label.toLowerCase()} ${a}`).join(', ')}`;
  const schema    = buildSchema(city, service, sampleKarigors, citySlug, serviceSlug);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords"    content={pageKw} />
        <link rel="canonical"    href={`https://karigori.org/${citySlug}/${serviceSlug}`} />
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url"         content={`https://karigori.org/${citySlug}/${serviceSlug}`} />
        <meta property="og:site_name"   content="কারিগরি" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pb-20">

        {/* ══════════════ HERO ══════════════ */}
        <div style={{ background:`linear-gradient(135deg, ${G} 0%, ${GD} 100%)`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
          <div style={{ position:'absolute', bottom:-50, left:-50, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs mb-5 flex-wrap" style={{ color:'rgba(255,255,255,0.6)' }} aria-label="breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">কারিগরি</Link>
              <ChevronRight style={{ width:12, height:12 }} />
              <span style={{ color:'rgba(255,255,255,0.8)' }}>{city.nameBn}</span>
              <ChevronRight style={{ width:12, height:12 }} />
              <span className="text-white font-bold">{service.labelBn}</span>
            </nav>

            <div className="flex items-start gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-xl"
                style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)' }}>
                <CategoryIcon category={service.key} size={32} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-black text-white leading-tight mb-2"
                  style={{ fontSize:'clamp(1.5rem, 4vw, 2.5rem)' }}>
                  {city.nameBn}ে বিশ্বস্ত {service.labelBn}
                </h1>
                <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color:'rgba(255,255,255,0.82)' }}>
                  {service.tagline} — {city.nameBn}ের সব এলাকায়। সরাসরি যোগাযোগ।
                </p>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {['NID যাচাইকৃত','সরাসরি কল','কমিশন নেই',`${city.nameBn}ে দ্রুত সার্ভিস`].map((t) => (
                    <span key={t} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background:'rgba(255,255,255,0.13)', border:'1px solid rgba(255,255,255,0.22)', color:'#fff' }}>
                      <CheckCircle2 style={{ width:11, height:11 }} /> {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to={`/browse/${service.key}?q=${city.name}`}
                    className="inline-flex items-center gap-2 font-black text-sm px-6 py-3 rounded-2xl transition-all hover:opacity-90 shadow-lg"
                    style={{ background:'#fff', color: G }}>
                    <Search style={{ width:16, height:16 }} />
                    {city.nameBn}ের {service.labelBn} দেখুন
                  </Link>
                  <Link to="/browse"
                    className="inline-flex items-center gap-1 text-sm font-bold transition-colors"
                    style={{ color:'rgba(255,255,255,0.7)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color='#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color='rgba(255,255,255,0.7)'}>
                    সব এলাকায় খুঁজুন →
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats strip — animated count-up */}
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {/* ১: Verified Karigors */}
              <div className="flex flex-col items-center justify-center py-4 px-3 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)' }}>
                <StatCounter
                  target={30}
                  suffix="+"
                  label="যাচাইকৃত কারিগর"
                  sublabel="Verified Workers"
                  delay={0}
                  light
                />
              </div>

              {/* ২: Service Categories */}
              <div className="flex flex-col items-center justify-center py-4 px-3 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)' }}>
                <StatCounter
                  target={Object.keys(SERVICES).length}
                  suffix=""
                  label="সার্ভিস ক্যাটাগরি"
                  sublabel="Categories"
                  delay={200}
                  light
                />
              </div>

              {/* ৩: Bangladesh Areas */}
              <div className="flex flex-col items-center justify-center py-4 px-3 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)' }}>
                <StatCounter
                  target={500}
                  suffix="+"
                  label="বাংলাদেশের এলাকা"
                  sublabel="Areas Covered"
                  delay={400}
                  light
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* ══ KARIGOR LISTINGS ══ */}
          <section>
            {/* Tab switcher */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ background: G }} />
                {city.nameBn}ের যাচাইকৃত {service.labelBn}
              </h2>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setActiveTab('sample')}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={activeTab === 'sample' ? { background:'#fff', color: G, boxShadow:'0 1px 4px rgba(0,0,0,0.1)' } : { color:'#6b7280' }}>
                  সেরা {service.labelBn}
                </button>
                <button onClick={() => setActiveTab('live')}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={activeTab === 'live' ? { background:'#fff', color: G, boxShadow:'0 1px 4px rgba(0,0,0,0.1)' } : { color:'#6b7280' }}>
                  লাইভ প্রোফাইল {liveWorkers.length > 0 && `(${liveWorkers.length})`}
                </button>
              </div>
            </div>

            {activeTab === 'sample' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleKarigors.map((k, i) => <SampleKarigorCard key={k.id} karigor={k} rank={i + 1} />)}
              </div>
            )}

            {activeTab === 'live' && (
              <>
                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-52 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
                  </div>
                )}
                {!loading && liveWorkers.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <p className="text-gray-500 mb-4">{city.nameBn}ে লাইভ {service.labelBn} শীঘ্রই যোগ হচ্ছে।</p>
                    <button onClick={() => setActiveTab('sample')} className="text-sm font-bold px-5 py-2.5 rounded-full text-white" style={{ background: G }}>
                      সেরা কারিগর দেখুন
                    </button>
                  </div>
                )}
                {!loading && liveWorkers.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {liveWorkers.map((w) => <WorkerCard key={w._id} worker={w} />)}
                  </div>
                )}
              </>
            )}

            <div className="mt-4 text-center">
              <Link to={`/browse/${service.key}?q=${city.name}`}
                className="inline-flex items-center gap-2 text-sm font-black px-6 py-3 rounded-2xl text-white transition-all hover:opacity-90"
                style={{ background: G }}>
                সব {city.nameBn}ের {service.labelBn} দেখুন <ArrowRight style={{ width:16, height:16 }} />
              </Link>
            </div>
          </section>

          {/* ══ 2 COL: Leaderboard + Price ══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RankingMatrix karigors={sampleKarigors} service={service} city={city} />
            <div className="space-y-5">
              <PriceTable service={service} cityName={city.nameBn} />

              {/* Badge legend */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-black text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <Award style={{ width:16, height:16, color:'#f59e0b' }} /> ব্যাজ ও পুরস্কার সিস্টেম
                </h3>
                <div className="space-y-2">
                  {BADGE_TIERS.map((b) => (
                    <div key={b.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: b.bg }}>
                      <span className="text-sm font-black" style={{ borderRadius:8, padding:'2px 8px', background: b.border + '30', color: b.color }}>{b.label}</span>
                      <span className="text-xs text-gray-500">স্কোর {b.minScore}+</span>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[['🔥 Top Rated','সর্বোচ্চ রেটিং'],['⚡ Fast Response','১৫ মিনিটের মধ্যে'],['🔄 Repeat Pro','৬০%+ পুনরাবৃত্তি']].map(([badge, desc]) => (
                      <span key={badge} className="text-xs px-2 py-1 rounded-lg bg-gray-50 text-gray-500">{badge} = {desc}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ SERVICES IN THIS CITY ══ */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="font-black text-gray-900 mb-1 text-base">
              {city.nameBn}ে আরও সার্ভিস পাওয়া যায়
            </h2>
            <p className="text-sm text-gray-400 mb-4">{city.desc}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SERVICES).filter(([k]) => k !== serviceSlug).map(([slug, svc]) => (
                <Link key={slug} to={`/${citySlug}/${slug}`}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border-2 transition-all hover:shadow-sm"
                  style={{ borderColor:`${G}25`, background:'#f0fdf4', color: G }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = G; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = G; }}>
                  {svc.emoji} {svc.labelBn}
                </Link>
              ))}
            </div>
          </section>

          {/* ══ AREAS ══ */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="font-black text-gray-900 mb-1 text-base">
              {city.nameBn}ের কোন কোন এলাকায় পাওয়া যায়?
            </h2>
            <p className="text-sm text-gray-400 mb-4">{city.desc}</p>
            <div className="flex flex-wrap gap-2">
              {city.areas.map((area) => (
                <Link key={area} to={`/browse/${service.key}?q=${encodeURIComponent(area)}`}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all border font-medium"
                  style={{ background:'#f9fafb', borderColor:'#e5e7eb', color:'#374151' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background='#f0fdf4'; e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background='#f9fafb'; e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#374151'; }}>
                  <MapPin style={{ width:12, height:12 }} /> {area}
                </Link>
              ))}
            </div>
          </section>

          {/* ══ CITY CROSS-LINKS ══ */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
              <MapPin style={{ width:15, height:15, color: G }} />
              অন্য শহরে {service.labelBn} খুঁজুন
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CITIES).filter(([k]) => k !== citySlug).slice(0, 12).map(([slug, c]) => (
                <Link key={slug} to={`/${slug}/${serviceSlug}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-full border transition-all hover:bg-green-50 hover:border-green-300"
                  style={{ borderColor:'#e5e7eb', color:'#374151' }}>
                  {c.nameBn}
                </Link>
              ))}
            </div>
          </section>

          {/* ══ SEO TIPS ══ */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="font-black text-gray-900 mb-4 text-base">
              {city.nameBn}ে ভালো {service.labelBn} বেছে নেওয়ার ৫টি টিপস
            </h2>
            <ol className="space-y-3">
              {[
                `রেটিং ও রিভিউ দেখুন — কারিগরিতে বাস্তব ব্যবহারকারীদের রিভিউ দেখানো হয়।`,
                `Karigor Score দেখুন — ৯০+ স্কোর মানে Gold Karigor, সেরা মানের নিশ্চয়তা।`,
                `অভিজ্ঞতা মিলিয়ে নিন — ${city.nameBn}ে স্থানীয় কারিগর বেশি সুবিধাজনক।`,
                `কাজ শুরুর আগেই দাম ঠিক করুন — ফোনে কথা বলে সব শর্ত পরিষ্কার করুন।`,
                `কাজ শেষে রিভিউ দিন — আপনার রিভিউ পরবর্তী ব্যবহারকারীদের সাহায্য করবে।`,
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ background: G }}>{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ol>
          </section>

          {/* ══ FAQ ══ */}
          {service.faqs?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="font-black text-gray-900 mb-5 text-base">
                {city.nameBn}ে {service.labelBn} সম্পর্কে সাধারণ প্রশ্ন
              </h2>
              <div className="space-y-3">
                {service.faqs.map((faq, i) => (
                  <details key={i} className="group rounded-2xl border overflow-hidden" style={{ borderColor:'#f3f4f6' }}>
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer font-bold text-gray-900 text-sm list-none">
                      {faq.q}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                    </summary>
                    <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ══ CTA ══ */}
          <div className="rounded-3xl p-7 sm:p-10 text-center relative overflow-hidden"
            style={{ background:`linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }}>
            <div style={{ position:'absolute', top:-50, right:-50, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
            <div className="relative">
              <h2 className="font-black text-white text-xl sm:text-2xl mb-2">
                এখনই {city.nameBn}ে বিশ্বস্ত {service.labelBn} খুঁজুন
              </h2>
              <p className="text-sm mb-6" style={{ color:'rgba(255,255,255,0.78)' }}>
                NID যাচাইকৃত · সরাসরি যোগাযোগ · কমিশন নেই
              </p>
              <Link to={`/browse/${service.key}?q=${city.name}`}
                className="inline-flex items-center gap-2 font-black text-sm px-8 py-4 rounded-2xl transition-all hover:opacity-90 shadow-lg"
                style={{ background:'#fff', color: G }}>
                {service.emoji} {city.nameBn}ের {service.labelBn} দেখুন
              </Link>
            </div>
          </div>

          {/* ══ DISCLAIMER ══ */}
          <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background:'#fffbeb', border:'1px solid #fde68a' }}>
            <Shield style={{ width:16, height:16, color:'#d97706', flexShrink:0, marginTop:1 }} />
            <p className="text-xs text-amber-800 leading-relaxed">
              কারিগরি একটি সংযোগকারী প্ল্যাটফর্ম। কারিগরদের তথ্য যাচাই করা হলেও সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দেওয়া যায় না।
              {' '}<Link to="/disclaimer" className="underline font-semibold">বিস্তারিত পড়ুন</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
