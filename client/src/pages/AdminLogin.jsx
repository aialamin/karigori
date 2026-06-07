import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Lock, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { FloatInput, Alert, Spinner } from '../components/ui.jsx';

const GA = '#4f46e5'; // indigo/admin color
const GB = '#3730a3';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [identifier, setId]      = useState('');
  const [password,   setPass]    = useState('');
  const [showPass,   setShow]    = useState(false);
  const [error,      setError]   = useState('');
  const [loading,    setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true });
  }, [user, navigate]);

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
      if (data.user.role !== 'admin') {
        setError('এই পেজটি শুধুমাত্র অ্যাডমিনদের জন্য। আপনার অ্যাকাউন্ট অ্যাডমিন নয়।');
        return;
      }
      login(data);
    } catch { setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}>
      {/* Decorative circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a5b4fc, transparent)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-black text-white text-2xl">অ্যাডমিন প্যানেল</h1>
            <p className="text-indigo-300 text-sm mt-1">কারিগরি — Admin Access Only</p>
          </div>

          {/* Warning banner */}
          <div className="mb-5 px-4 py-3 rounded-2xl border"
            style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(165,180,252,0.25)' }}>
            <p className="text-xs text-indigo-200 text-center">
              🔒 এই পেজটি শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য।
              অননুমোদিত প্রবেশ নিষিদ্ধ।
            </p>
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit}
            className="rounded-3xl p-6 space-y-4 shadow-2xl border"
            style={{ background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(16px)', borderColor: 'rgba(165,180,252,0.2)' }}>

            <div>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">
                অ্যাডমিন ইমেইল / ফোন
              </p>
              <div className="admin-input-wrap">
                <FloatInput id="adm_id" label="ইমেইল বা ফোন নম্বর"
                  type="email" value={identifier}
                  onChange={(e) => { setId(e.target.value); setError(''); }}
                  icon={AtSign} required />
              </div>
            </div>

            <FloatInput id="adm_pass" label="পাসওয়ার্ড"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPass(e.target.value); setError(''); }}
              icon={Lock} required
              right={
                <button type="button" onClick={() => setShow(!showPass)}
                  className="text-indigo-300 hover:text-white transition-colors p-1">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {error && (
              <div className="px-3 py-2.5 rounded-xl text-xs font-medium"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {loading
                ? <Spinner label="যাচাই হচ্ছে…" />
                : <><ShieldCheck className="w-4 h-4" /><span>অ্যাডমিন লগইন</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <Link to="/login"
              className="text-sm text-indigo-300 hover:text-white transition-colors flex items-center justify-center gap-1">
              ← সাধারণ লগইনে ফিরুন
            </Link>
            <p className="text-xs text-indigo-400">
              সমস্যা? সিস্টেম অ্যাডমিনের সাথে যোগাযোগ করুন
            </p>
          </div>
        </div>
      </div>

      {/* Bottom credit */}
      <p className="text-center text-xs text-indigo-500 pb-4 relative z-10">
        কারিগরি অ্যাডমিন পোর্টাল · v1.0
      </p>
    </div>
  );
}
