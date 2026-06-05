import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Wrench, User, ShieldCheck, ArrowRight, Lock, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { FloatInput, Alert, Spinner } from '../components/ui.jsx';

const TABS = [
  { key: 'worker', label: 'কারিগর',  Icon: Wrench,     color: 'text-brand-600'  },
  { key: 'client', label: 'ক্লায়েন্ট', Icon: User,       color: 'text-blue-600'   },
  { key: 'admin',  label: 'অ্যাডমিন', Icon: ShieldCheck, color: 'text-purple-600' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || '/';

  const [tab,        setTab]  = useState('worker');
  const [identifier, setId]   = useState('');   // email OR phone
  const [password,   setPass] = useState('');
  const [showPass,   setShow] = useState(false);
  const [error,      setError]  = useState('');
  const [loading,    setLoading] = useState(false);

  // Detect whether the user is typing an email or phone
  const isEmail = identifier.includes('@');
  const label   = identifier && !isEmail ? 'ফোন নম্বর' : 'ইমেইল ঠিকানা';
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
      login(data);
      if (data.user.role === 'admin')   navigate('/admin');
      else if (data.user.role === 'worker') navigate('/dashboard');
      else navigate(from);
    } catch { setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-bn">স্বাগতম</h1>
          <p className="text-gray-400 text-sm mt-1 font-bn">আপনার কারিগরি অ্যাকাউন্টে সাইন ইন করুন</p>
        </div>

        {/* Role tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
          {TABS.map((t) => (
            <button key={t.key} type="button"
              onClick={() => { setTab(t.key); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-sm font-semibold transition-all duration-200 min-w-0
                ${tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <t.Icon className={`w-4 h-4 shrink-0 ${tab === t.key ? t.color : ''}`} />
              <span className="truncate font-bn">{t.label}</span>
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

          {/* Single identifier field — email or phone */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-bn">
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
            {/* Live hint */}
            {identifier && (
              <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${isEmail ? 'bg-blue-400' : 'bg-amber-400'}`} />
                {isEmail ? 'ইমেইল দিয়ে লগইন হবে' : 'ফোন নম্বর দিয়ে লগইন হবে'}
              </p>
            )}
          </div>

          {/* Password */}
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

          {error && <Alert type="error">{error}</Alert>}

          <button type="submit" disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60
              text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2
              transition-all shadow-sm mt-1">
            {loading
              ? <Spinner label="লগইন হচ্ছে…" />
              : <><span className="font-bn">সাইন ইন</span><ArrowRight className="w-4 h-4 shrink-0" /></>
            }
          </button>
        </form>

        {tab !== 'admin' && (
          <p className="text-center text-sm text-gray-500 mt-5 font-bn">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline font-bn">
              {tab === 'worker' ? 'কারিগর হিসেবে নিবন্ধন করুন' : 'ক্লায়েন্ট হিসেবে নিবন্ধন করুন'}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
