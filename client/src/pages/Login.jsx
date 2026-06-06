import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Wrench, User, ShieldCheck, ArrowRight, Lock, AtSign, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { FloatInput, Alert, Spinner } from '../components/ui.jsx';

const TABS = [
  { key: 'worker', label: 'কারিগর',   Icon: Wrench,     color: 'text-green-700'  },
  { key: 'client', label: 'ক্লায়েন্ট', Icon: User,       color: 'text-blue-600'   },
  { key: 'admin',  label: 'অ্যাডমিন',  Icon: ShieldCheck, color: 'text-purple-600' },
];

const REMEMBER_KEY = 'kg_remember';

function loadRemembered() {
  try { return JSON.parse(localStorage.getItem(REMEMBER_KEY)) || null; } catch { return null; }
}
function saveRemembered(data) {
  try { localStorage.setItem(REMEMBER_KEY, JSON.stringify(data)); } catch {}
}
function clearRemembered() {
  try { localStorage.removeItem(REMEMBER_KEY); } catch {}
}

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, user } = useAuth();
  const from = location.state?.from || '/';

  const [tab,        setTab]     = useState('worker');
  const [identifier, setId]      = useState('');
  const [password,   setPass]    = useState('');
  const [showPass,   setShow]    = useState(false);
  const [remember,   setRemember]= useState(false);
  const [error,      setError]   = useState('');
  const [loading,    setLoading] = useState(false);
  const [autoLogging,setAutoLog] = useState(false);
  const [savedLabel, setSavedLabel] = useState('');

  /* ── Load remembered credentials on mount ── */
  useEffect(() => {
    const saved = loadRemembered();
    if (saved) {
      setId(saved.identifier);
      setPass(saved.password);
      setTab(saved.tab || 'worker');
      setRemember(true);
      setSavedLabel(saved.identifier);
    }
  }, []);

  /* ── Auto-login if already remembered + token still valid ── */
  useEffect(() => {
    if (user) {
      if (user.role === 'admin')        navigate('/admin',     { replace: true });
      else if (user.role === 'worker')  navigate('/dashboard', { replace: true });
      else                              navigate(from,          { replace: true });
    }
  }, [user]);

  const isEmail   = identifier.includes('@');
  const inputType = identifier && !isEmail ? 'tel' : 'email';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !password) { setError('সব তথ্য পূরণ করুন।'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'লগইন ব্যর্থ হয়েছে'); return; }
      if (data.user.role !== tab) {
        setError(`এই অ্যাকাউন্টটি "${data.user.role}" হিসেবে নিবন্ধিত। সঠিক ট্যাব বেছে নিন।`);
        return;
      }

      /* Save or clear remembered credentials */
      if (remember) {
        saveRemembered({ identifier: identifier.trim(), password, tab });
      } else {
        clearRemembered();
      }

      login(data);
      if (data.user.role === 'admin')        navigate('/admin');
      else if (data.user.role === 'worker')  navigate('/dashboard');
      else navigate(from);
    } catch { setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #006A4E 0%, #004d38 100%)' }}>
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">স্বাগতম</h1>
          <p className="text-gray-400 text-sm mt-1">আপনার কারিগরি অ্যাকাউন্টে সাইন ইন করুন</p>
        </div>

        {/* Remembered user banner */}
        {savedLabel && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl border"
            style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: '#006A4E' }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-green-800">পরিচিত অ্যাকাউন্ট</p>
              <p className="text-xs text-green-700 truncate">{savedLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => { clearRemembered(); setId(''); setPass(''); setRemember(false); setSavedLabel(''); }}
              className="text-xs text-green-600 hover:text-green-900 font-semibold shrink-0">
              মুছুন
            </button>
          </div>
        )}

        {/* Role tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
          {TABS.map((t) => (
            <button key={t.key} type="button"
              onClick={() => { setTab(t.key); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-sm font-semibold transition-all duration-200 min-w-0
                ${tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <t.Icon className={`w-4 h-4 shrink-0 ${tab === t.key ? t.color : ''}`} />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'admin' && (
          <div className="mb-4">
            <Alert type="info">
              Demo: <strong>admin@karigori.com</strong> / <strong>admin123</strong>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              ইমেইল অথবা ফোন নম্বর
            </p>
            <FloatInput
              id="login_id"
              label="ইমেইল বা ফোন নম্বর দিন"
              type={inputType}
              value={identifier}
              onChange={(e) => { setId(e.target.value); setError(''); }}
              icon={AtSign}
              required
            />
            {identifier && (
              <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${isEmail ? 'bg-blue-400' : 'bg-amber-400'}`} />
                {isEmail ? 'ইমেইল দিয়ে লগইন হবে' : 'ফোন নম্বর দিয়ে লগইন হবে'}
              </p>
            )}
          </div>

          <FloatInput
            id="login_pass"
            label="পাসওয়ার্ড"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPass(e.target.value); setError(''); }}
            icon={Lock}
            required
            right={
              <button type="button" onClick={() => setShow(!showPass)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Remember me row */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
                  ${remember ? 'border-green-700' : 'border-gray-300 group-hover:border-green-400'}`}
                style={remember ? { background: '#006A4E' } : {}}>
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                আমাকে মনে রাখুন
              </span>
            </label>
            <span className="text-xs text-gray-400">পরের বার স্বয়ংক্রিয়ভাবে পূরণ হবে</span>
          </div>

          {error && <Alert type="error">{error}</Alert>}

          <button type="submit" disabled={loading}
            className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm mt-1 active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #006A4E 0%, #16a34a 100%)' }}>
            {loading
              ? <Spinner label="লগইন হচ্ছে…" />
              : <><span>সাইন ইন</span><ArrowRight className="w-4 h-4 shrink-0" /></>
            }
          </button>
        </form>

        {tab !== 'admin' && (
          <p className="text-center text-sm text-gray-500 mt-5">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#006A4E' }}>
              {tab === 'worker' ? 'কারিগর হিসেবে নিবন্ধন করুন' : 'ক্লায়েন্ট হিসেবে নিবন্ধন করুন'}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
