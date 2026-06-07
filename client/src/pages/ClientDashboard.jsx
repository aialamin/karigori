import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Search, Save, ArrowRight, Heart, Copy,
  CheckCircle2, Smartphone, BookOpen, ChevronRight,
  User, Wrench, Gift,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { DHAKA_AREAS } from '../constants.js';
import { FloatInput, Alert, Spinner } from '../components/ui.jsx';

const G  = '#006A4E';
const GD = '#004d38';

/* ───────────────────────────── Donation ───────────────────────────── */
const DONATION_AMOUNTS = [50, 100, 200, 500];
const DONATE_INFO = {
  bkash:  { label: 'bKash',  number: '01700-000000', color: '#E2136E', bg: '#fdf2f8', emoji: '💗' },
  nagad:  { label: 'Nagad',  number: '01700-000001', color: '#F7941D', bg: '#fff7ed', emoji: '🟠' },
  rocket: { label: 'Rocket', number: '01700-000002', color: '#8B1A8B', bg: '#faf5ff', emoji: '💜' },
};

function DonationSection() {
  const [amount,  setAmount]  = useState(100);
  const [custom,  setCustom]  = useState('');
  const [method,  setMethod]  = useState('bkash');
  const [copied,  setCopied]  = useState(false);
  const [thanks,  setThanks]  = useState(false);

  const finalAmount = custom ? parseInt(custom) || 0 : amount;
  const info = DONATE_INFO[method];

  function copyNumber() {
    navigator.clipboard?.writeText(info.number.replace(/-/g, ''));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }
  function markDone() { setThanks(true); setTimeout(() => setThanks(false), 4000); }

  return (
    <div className="space-y-4">
      {/* Impact header card */}
      <div className="rounded-2xl p-5 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }}>
        <div style={{ position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.07)' }} />
        <div style={{ position:'absolute',bottom:-20,left:-20,width:90,height:90,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }} />
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Heart className="w-7 h-7 text-red-300 fill-red-300" />
          </div>
          <h2 className="font-black text-white text-lg mb-1">অ্যাপটি চালু রাখতে সাহায্য করুন</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            কারিগরি সম্পূর্ণ বিনামূল্যে চলে।<br />আপনার ছোট সাহায্যেই হাজারো কারিগর কাজ পায়।
          </p>
          {/* Impact stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[['৩০+','কারিগর'],['৮','সার্ভিস'],['৫০০+','এলাকা']].map(([n, l]) => (
              <div key={l} className="rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <p className="font-black text-white text-sm">{n}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amount selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">পরিমাণ বেছে নিন</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {DONATION_AMOUNTS.map((a) => (
            <button key={a} onClick={() => { setAmount(a); setCustom(''); }}
              className="py-2.5 rounded-xl text-sm font-black border-2 transition-all"
              style={(!custom && amount === a)
                ? { background: G, color: '#fff', borderColor: G }
                : { background: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }}>
              ৳{a}
            </button>
          ))}
        </div>
        <input type="number" placeholder="অথবা নিজে লিখুন (৳)"
          value={custom} onChange={(e) => setCustom(e.target.value)}
          className="w-full text-sm border-2 border-gray-200 focus:border-green-400 rounded-xl px-4 py-3 outline-none transition-colors"
        />
      </div>

      {/* Method selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">পেমেন্ট মাধ্যম</p>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DONATE_INFO).map(([key, m]) => (
            <button key={key} onClick={() => setMethod(key)}
              className="py-3 rounded-xl text-xs font-black border-2 transition-all"
              style={method === key
                ? { background: m.bg, borderColor: m.color, color: m.color }
                : { background: '#f9fafb', borderColor: '#e5e7eb', color: '#6b7280' }}>
              {m.emoji}<br />{m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment instructions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: info.color }}>
          {info.emoji} {info.label}-এ পাঠানোর নিয়ম
        </p>
        {/* Number row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-3 border-2"
            style={{ background: info.bg, borderColor: info.color + '40' }}>
            <Smartphone style={{ width: 14, height: 14, color: info.color, flexShrink: 0 }} />
            <span className="text-sm font-black tracking-widest" style={{ color: info.color }}>
              {info.number}
            </span>
          </div>
          <button onClick={copyNumber}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-3 rounded-xl transition-all whitespace-nowrap"
            style={{ background: copied ? '#dcfce7' : info.color + '15', color: copied ? '#16a34a' : info.color }}>
            {copied ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
            {copied ? 'কপি হয়েছে!' : 'নম্বর কপি'}
          </button>
        </div>
        {/* Steps */}
        <ol className="space-y-2.5">
          {[
            `${info.label} অ্যাপ খুলুন → "Send Money" বা "পাঠাও" চাপুন`,
            `নম্বর দিন: ${info.number}`,
            `পরিমাণ লিখুন: ৳${finalAmount || '—'}`,
            'Reference: Karigori Support',
            'পাঠানো হলে নিচে কনফার্ম করুন',
          ].map((s, i) => (
            <li key={i} className="flex gap-3 text-xs text-gray-600 leading-relaxed">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                style={{ background: info.color, color: '#fff' }}>{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>

        {/* Confirm button */}
        <button onClick={markDone}
          className="mt-4 w-full py-3 rounded-xl text-sm font-black transition-all"
          style={thanks
            ? { background: '#dcfce7', color: '#16a34a' }
            : { background: G, color: '#fff' }}>
          {thanks ? '🎉 ধন্যবাদ! আপনার সাহায্য আমাদের অনুপ্রেরণা!' : `৳${finalAmount || '?'} পাঠিয়েছি ✓`}
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          💚 আপনার সাহায্যে কারিগরি বিনামূল্যে চলতে থাকবে
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────── Main page ───────────────────────────── */
export default function ClientDashboard() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name,   setName]   = useState(user?.name  || '');
  const [phone,  setPhone]  = useState(user?.phone || '');
  const [area,   setArea]   = useState(user?.area  || '');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');
  const [tab,    setTab]    = useState('profile');

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) { setError('নাম দেওয়া আবশ্যক'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/profile/client', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ name, phone, area }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Save failed'); return; }
      updateUser(data);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  }

  const TABS = [
    { key: 'profile', label: 'প্রোফাইল',    icon: User },
    { key: 'browse',  label: 'কারিগর',       icon: Wrench },
    { key: 'donate',  label: 'সাহায্য',      icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── Green header ── */}
      <div style={{ background: `linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }} className="relative overflow-hidden">
        <div style={{ position:'absolute',top:-40,right:-40,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.06)' }} />
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg shrink-0"
              style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              {(user?.name || 'C')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-black text-white text-base sm:text-lg leading-tight truncate">{user?.name || 'আপনার অ্যাকাউন্ট'}</p>
              <p className="text-xs sm:text-sm truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar — flush below header, no overlap ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all"
                style={tab === key
                  ? { borderColor: G, color: G }
                  : { borderColor: 'transparent', color: '#9ca3af' }}>
                <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-sm sm:text-base">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#dcfce7' }}>
                <Save style={{ width: 14, height: 14, color: G }} />
              </div>
              প্রোফাইল আপডেট
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <FloatInput id="cl_name"  label="পুরো নাম"   value={name}  onChange={(e) => setName(e.target.value)}  required />
              <FloatInput id="cl_phone" label="ফোন নম্বর"  value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">আপনার এলাকা</p>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select value={area} onChange={(e) => setArea(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none appearance-none cursor-pointer transition-colors"
                    onFocus={(e) => e.target.style.borderColor = G}
                    onBlur={(e)  => e.target.style.borderColor = '#e5e7eb'}>
                    <option value="">যেকোনো এলাকা (ঐচ্ছিক)</option>
                    {DHAKA_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                {area && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: G }}>
                    <MapPin className="w-3 h-3 shrink-0" /> {area}-এ কারিগর খোঁজা হবে
                  </p>
                )}
              </div>

              {error && <Alert type="error">{error}</Alert>}
              {saved && <Alert type="success">প্রোফাইল সেভ হয়েছে ✓</Alert>}

              <button type="submit" disabled={saving}
                className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${G} 0%, #16a34a 100%)` }}>
                {saving ? <Spinner label="সেভ হচ্ছে…" /> : <><Save className="w-4 h-4 shrink-0" /><span>প্রোফাইল সেভ করুন</span></>}
              </button>
            </form>
          </div>
        )}

        {/* Browse tab */}
        {tab === 'browse' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#dcfce7' }}>
                  <Search style={{ width: 14, height: 14, color: G }} />
                </div>
                কাছের কারিগর খুঁজুন
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select value={area} onChange={(e) => setArea(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none appearance-none cursor-pointer">
                    <option value="">ঢাকার যেকোনো এলাকা</option>
                    {DHAKA_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <button onClick={() => navigate(area ? `/browse?q=${encodeURIComponent(area)}` : '/browse')}
                  className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${G} 0%, #16a34a 100%)` }}>
                  <Search className="w-4 h-4 shrink-0" />
                  {area ? `${area}-এ কারিগর খুঁজুন` : 'সব কারিগর দেখুন'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">সার্ভিস বেছে নিন</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['প্লাম্বার',      '/browse/plumbing',   '#0369a1', '#e0f2fe'],
                  ['ইলেকট্রিশিয়ান', '/browse/electrical',  '#d97706', '#fef3c7'],
                  ['AC মেকানিক',    '/browse/ac',          '#0891b2', '#cffafe'],
                  ['ক্লিনার',       '/browse/cleaning',    '#7c3aed', '#ede9fe'],
                  ['পেস্ট কন্ট্রোল','/browse/pest',        '#b45309', '#fef9c3'],
                  ['পেইন্টার',      '/browse/painting',    '#db2777', '#fce7f3'],
                ].map(([label, path, color, bg]) => (
                  <Link key={label} to={path}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-sm"
                    style={{ borderColor: color + '30', background: bg }}>
                    <ChevronRight style={{ width: 13, height: 13, color }} />
                    <span className="text-sm font-bold" style={{ color }}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <BookOpen style={{ width: 15, height: 15, color: G }} /> দরকারি গাইড
              </h3>
              <div className="space-y-2">
                {[
                  ['ভালো প্লাম্বার চেনার উপায়',    '/blog/dhaka-plumber-kivabe-khujben'],
                  ['AC সার্ভিস কখন করানো উচিত',    '/blog/ac-service-kokhon-koraben'],
                  ['বাসা পরিষ্কার রাখার টিপস',      '/blog/basa-poriskar-rakhbar-tips'],
                ].map(([title, path]) => (
                  <Link key={title} to={path}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group">
                    <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 transition-colors">{title}</span>
                    <ArrowRight style={{ width: 12, height: 12, color: '#9ca3af' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Donate tab */}
        {tab === 'donate' && <DonationSection />}

      </div>
    </div>
  );
}
