/**
 * AI-style natural language search parser
 *
 * Understands queries like:
 *  "I'm looking for a plumber in Gazipur"
 *  "need AC repair near Gulshan urgently"
 *  "গাজীপুরে ইলেক্ট্রিশিয়ান দরকার"
 *  "cheapest electrician mirpur"
 *  "available carpenter now"
 *
 * Returns: { category, area, modifiers, confidence, suggestion }
 */

import { ALL_LOCATIONS, expandLocation } from '../data/bangladesh.js';

/* ── Service keyword maps ── */
const SERVICE_MAP = [
  { key: 'electrician', terms: ['electrician','electric','wiring','light','switch','plug','socket','ইলেক্ট্রিশিয়ান','বিদ্যুৎ','লাইটিং','ওয়্যারিং'] },
  { key: 'plumber',     terms: ['plumber','plumbing','pipe','water leak','tap','bathroom','toilet','প্লাম্বার','পাইপ','পানি','বাথরুম','কল'] },
  { key: 'ac_repair',   terms: ['ac','air condition','ac repair','cooling','air cooler','hvac','এসি','এয়ার কন্ডিশন','ঠান্ডা','কুলিং'] },
  { key: 'cleaner',     terms: ['cleaner','cleaning','clean','sweep','mop','dust','ক্লিনার','পরিষ্কার','ঝাড়ু','মপ'] },
  { key: 'carpenter',   terms: ['carpenter','wood','furniture','cabinet','door','wardrobe','কাঠমিস্ত্রি','কাঠ','ফার্নিচার','ক্যাবিনেট','দরজা'] },
  { key: 'painter',     terms: ['painter','paint','colour','color','wall paint','পেইন্টার','রঙ','রং','দেয়াল'] },
  { key: 'gas_fitter',  terms: ['gas','gas pipe','gas leak','stove','burner','গ্যাস','গ্যাস পাইপ','গ্যাস লিক','চুলা'] },
  { key: 'bua',         terms: ['bua','maid','domestic','helper','cook','cooking','housemaid','গৃহকর্মী','বুয়া','রাঁধুনি','কাজের মেয়ে'] },
];

/* ── Modifier keywords ── */
const MODIFIERS = {
  urgent:    ['urgent','emergency','now','immediately','quick','fast','জরুরি','এখনই','তাড়াতাড়ি'],
  cheap:     ['cheap','affordable','low cost','budget','সস্তা','কম দামে','বাজেট'],
  verified:  ['verified','trusted','certified','reliable','যাচাইকৃত','বিশ্বস্ত'],
  available: ['available','online','active','এখন পাওয়া যাবে'],
};

/* ── Prepositions / intent words to strip ── */
const STRIP = [
  'i need','i want','i am looking for','i\'m looking for','looking for',
  'find me','can you find','please find','help me find','i require',
  'need a','need an','need','want a','want an','want',
  'get me','show me','give me',
  'দরকার','খুঁজছি','লাগবে','চাই','দিন','পাঠান','আনুন',
  'a ','an ','the ','some ',
  'in ','at ','near ','around ','from ','for ',
];

function normalize(str) {
  return str.toLowerCase().trim().replace(/[.,!?।]/g, '').replace(/\s+/g, ' ');
}

/** Detect service category from text */
function detectService(text) {
  const t = normalize(text);
  for (const svc of SERVICE_MAP) {
    if (svc.terms.some((term) => t.includes(term.toLowerCase()))) return svc.key;
  }
  return null;
}

/** Detect location from text */
function detectLocation(text) {
  const t = normalize(text);
  // Try longest-match first for accuracy
  const sorted = [...ALL_LOCATIONS].sort((a, b) => b.length - a.length);
  for (const loc of sorted) {
    if (t.includes(loc.toLowerCase())) return loc;
  }
  return null;
}

/** Detect modifiers */
function detectModifiers(text) {
  const t = normalize(text);
  const found = [];
  for (const [mod, terms] of Object.entries(MODIFIERS)) {
    if (terms.some((term) => t.includes(term.toLowerCase()))) found.push(mod);
  }
  return found;
}

/** Strip intent/preposition words from text to find remaining tokens */
function stripIntent(text) {
  let t = normalize(text);
  STRIP.forEach((s) => { t = t.replace(new RegExp(`\\b${s}\\b`, 'gi'), ' '); });
  return t.trim().replace(/\s+/g, ' ');
}

const SERVICE_LABELS = {
  electrician: 'Electrician', plumber: 'Plumber', ac_repair: 'AC Repair',
  cleaner: 'Cleaner', carpenter: 'Carpenter', painter: 'Painter',
  gas_fitter: 'Gas Fitter', bua: 'Domestic Help',
};

/**
 * Main parse function
 * @param {string} query
 * @returns {{ category, area, modifiers, confidence, suggestion, areas }}
 */
export function parseNaturalQuery(query) {
  if (!query?.trim()) return null;

  const category  = detectService(query);
  const area      = detectLocation(query);
  const modifiers = detectModifiers(query);
  const areas     = area ? expandLocation(area) : [];

  // Confidence score 0-100
  let confidence = 0;
  if (category) confidence += 50;
  if (area)     confidence += 40;
  if (modifiers.length) confidence += 10;

  // Human-readable suggestion
  const parts = [];
  if (category) parts.push(SERVICE_LABELS[category] || category);
  if (area)     parts.push(`in ${area}`);
  if (modifiers.includes('urgent'))   parts.push('(urgent)');
  if (modifiers.includes('verified')) parts.push('(verified only)');

  const suggestion = parts.length > 0
    ? `Looking for: ${parts.join(' ')}`
    : null;

  return { category, area, areas, modifiers, confidence, suggestion, original: query };
}

/** Generate helpful autocomplete hints based on partial input */
export function getAIHints(partial) {
  if (!partial || partial.length < 3) return [];
  const q = partial.toLowerCase();
  const hints = [];

  // Service hints
  for (const svc of SERVICE_MAP) {
    if (svc.terms.some((t) => t.includes(q) || q.includes(t.slice(0, 4)))) {
      hints.push(`Find ${SERVICE_LABELS[svc.key]} near me`);
      hints.push(`${SERVICE_LABELS[svc.key]} in Dhaka`);
      hints.push(`${SERVICE_LABELS[svc.key]} in Gazipur`);
      break;
    }
  }

  // Location hints
  const locMatches = ALL_LOCATIONS.filter((l) => l.toLowerCase().includes(q)).slice(0, 3);
  locMatches.forEach((l) => {
    if (hints.length < 5) hints.push(`Find workers in ${l}`);
  });

  return hints.slice(0, 4);
}
