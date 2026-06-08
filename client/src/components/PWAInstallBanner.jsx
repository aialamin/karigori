/**
 * PWAInstallBanner.jsx
 * Shows a native-looking bottom-sheet install prompt on Android/mobile Chrome.
 * - Listens for `beforeinstallprompt` (Chrome/Edge Android)
 * - Shows only on mobile, only once per 7 days if dismissed
 * - Hides if already running as installed PWA (standalone mode)
 */
import { useState, useEffect } from 'react';
import { X, Download, Star, Shield, Zap } from 'lucide-react';

const DISMISS_KEY = 'kg_pwa_dismiss_until';
const SNOOZE_DAYS = 7;

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isMobile() {
  return window.innerWidth < 768 ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible]               = useState(false);
  const [installing, setInstalling]         = useState(false);

  useEffect(() => {
    // Don't show if already installed or on desktop
    if (isStandalone() || !isMobile()) return;

    // Don't show if snoozed
    const until = localStorage.getItem(DISMISS_KEY);
    if (until && Date.now() < Number(until)) return;

    const handler = (e) => {
      e.preventDefault();           // stop Chrome's mini-bar
      setDeferredPrompt(e);
      // Small delay so it doesn't flash immediately on page load
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
    if (outcome === 'dismissed') {
      // Snooze for 7 days
      localStorage.setItem(DISMISS_KEY, Date.now() + SNOOZE_DAYS * 86400000);
    }
    setInstalling(false);
  }

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now() + SNOOZE_DAYS * 86400000);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[998] sm:hidden"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[999] sm:hidden"
        style={{ animation: 'slideUpSheet 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
        role="dialog"
        aria-modal="true"
        aria-label="অ্যাপ ইনস্টল করুন"
      >
        <div className="bg-white rounded-t-3xl shadow-2xl px-5 pt-5 pb-8 border-t border-gray-100">

          {/* Drag handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>

          {/* App identity */}
          <div className="flex items-center gap-4 mb-5">
            <img
              src="/icon-192.png"
              alt="কারিগরি অ্যাপ"
              width="64" height="64"
              className="rounded-2xl shadow-md shrink-0"
            />
            <div>
              <p className="text-lg font-black text-gray-900 leading-tight">কারিগরি</p>
              <p className="text-xs text-gray-500 mt-0.5">karigori.org</p>
              <div className="flex items-center gap-0.5 mt-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[10px] text-gray-400 ml-1">যাচাইকৃত কারিগর</span>
              </div>
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex gap-2 mb-5 flex-wrap">
            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
              <Shield className="w-3 h-3" /> NID যাচাইকৃত
            </span>
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
              <Zap className="w-3 h-3" /> সরাসরি যোগাযোগ
            </span>
            <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-200">
              <Download className="w-3 h-3" /> অফলাইনে কাজ করে
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            হোম স্ক্রিনে যোগ করুন — দ্রুত লোড হয়, কোনো অ্যাপ স্টোর লাগে না।
          </p>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              পরে
            </button>
            <button
              onClick={handleInstall}
              disabled={installing}
              className="flex-[2] py-3 rounded-2xl text-white text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg,#006A4E 0%,#004d38 100%)' }}
            >
              <Download className="w-4 h-4" />
              {installing ? 'ইনস্টল হচ্ছে…' : 'হোম স্ক্রিনে যোগ করুন'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
