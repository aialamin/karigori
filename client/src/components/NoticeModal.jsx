import { useState, useEffect, useRef } from 'react';
import { X, Info, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

const TYPES = {
  info:    { icon: Info,          iconBg: '#2563eb', bar: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', titleColor: '#1e3a8a', subColor: '#1d4ed8',  textColor: '#1e40af', glow: '59,130,246' },
  warning: { icon: AlertTriangle, iconBg: '#d97706', bar: '#f59e0b', bg: '#fffbeb', border: '#fde68a', titleColor: '#78350f', subColor: '#92400e',  textColor: '#b45309', glow: '245,158,11' },
  success: { icon: CheckCircle2,  iconBg: '#004d38', bar: '#16a34a', bg: '#f0fdf4', border: '#86efac', titleColor: '#14532d', subColor: '#166534',  textColor: '#15803d', glow: '22,163,74' },
  urgent:  { icon: Zap,           iconBg: '#be123c', bar: '#e11d48', bg: '#fff1f2', border: '#fecdd3', titleColor: '#881337', subColor: '#9f1239',  textColor: '#be123c', glow: '225,29,72' },
};

const AUTO_CLOSE = 15;

/* Inject keyframes once */
const STYLE_ID = 'notice-modal-styles';
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes nm-backdrop { from { opacity:0 } to { opacity:1 } }
    @keyframes nm-slide {
      0%   { opacity:0; transform: translateY(60px) scale(0.85); }
      60%  { opacity:1; transform: translateY(-10px) scale(1.02); }
      80%  { transform: translateY(4px) scale(0.99); }
      100% { transform: translateY(0) scale(1); }
    }
    @keyframes nm-banner-in  { from { opacity:0; transform:translateY(-100%); } to { opacity:1; transform:translateY(0); } }
    @keyframes nm-banner-out { from { opacity:1; transform:translateY(0); }    to { opacity:0; transform:translateY(-100%); } }
    @keyframes nm-sheet-in   { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
    @keyframes nm-sheet-out  { from { opacity:1; transform:translateY(0); }    to { opacity:0; transform:translateY(100%); } }
    @keyframes nm-toast-in   { from { opacity:0; transform:translateX(120%) scale(0.85); } to { opacity:1; transform:translateX(0) scale(1); } }
    @keyframes nm-toast-out  { from { opacity:1; transform:translateX(0) scale(1); }      to { opacity:0; transform:translateX(120%) scale(0.85); } }
    @keyframes nm-icon-pop {
      0%   { transform: scale(0) rotate(-30deg); opacity:0; }
      60%  { transform: scale(1.25) rotate(8deg); opacity:1; }
      80%  { transform: scale(0.92) rotate(-4deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes nm-icon-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(var(--glow),0.5); }
      50%       { box-shadow: 0 0 0 14px rgba(var(--glow),0); }
    }
    @keyframes nm-title {
      from { opacity:0; transform: translateX(-18px); }
      to   { opacity:1; transform: translateX(0); }
    }
    @keyframes nm-sub {
      from { opacity:0; transform: translateX(-12px); }
      to   { opacity:1; transform: translateX(0); }
    }
    @keyframes nm-text {
      from { opacity:0; transform: translateY(10px); }
      to   { opacity:1; transform: translateY(0); }
    }
    @keyframes nm-bar-enter {
      from { transform: scaleX(0); transform-origin: left; }
      to   { transform: scaleX(1); transform-origin: left; }
    }
    @keyframes nm-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes nm-btn-pulse {
      0%, 100% { box-shadow: 0 4px 14px rgba(var(--glow),0.35); }
      50%       { box-shadow: 0 4px 28px rgba(var(--glow),0.65); }
    }
    @keyframes nm-particles {
      0%   { transform: translateY(0) scale(1); opacity:0.8; }
      100% { transform: translateY(-60px) scale(0); opacity:0; }
    }
    @keyframes nm-ring {
      0%   { transform: scale(0.7); opacity:0.6; }
      100% { transform: scale(2); opacity:0; }
    }
  `;
  document.head.appendChild(el);
}

/* Particle dots floating up from the icon */
function Particles({ color }) {
  const dots = [
    { x: 10, delay: 0,    size: 5, dur: 1.2 },
    { x: -8, delay: 0.2,  size: 4, dur: 1.0 },
    { x: 20, delay: 0.35, size: 3, dur: 1.4 },
    { x: -18,delay: 0.5,  size: 6, dur: 1.1 },
    { x: 5,  delay: 0.7,  size: 4, dur: 1.3 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: '50%', left: `calc(50% + ${d.x}px)`,
          width: d.size, height: d.size, borderRadius: '50%',
          background: color, opacity: 0,
          animation: `nm-particles ${d.dur}s ease-out ${d.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}

export default function NoticeModal({ notice, onClose }) {
  const [remaining, setRemaining] = useState(AUTO_CLOSE);
  const [closing, setClosing]     = useState(false);
  const rafRef   = useRef(null);
  const startRef = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    // Short delay so entrance animation plays first
    const tid = setTimeout(() => {
      startRef.current = performance.now();
      const tick = (now) => {
        const elapsed = (now - startRef.current) / 1000;
        const left = Math.max(0, AUTO_CLOSE - elapsed);
        setRemaining(left);
        if (left <= 0) { handleClose(); return; }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 400);
    return () => { clearTimeout(tid); cancelAnimationFrame(rafRef.current); };
  }, []);

  function handleClose() {
    cancelAnimationFrame(rafRef.current);
    setClosing(true);
    setTimeout(onClose, 320);
  }

  const t      = TYPES[notice.type] || TYPES.info;
  const Icon   = t.icon;
  const pct    = Math.min(100, ((AUTO_CLOSE - remaining) / AUTO_CLOSE) * 100);
  const layout = notice.layout || 'modal';

  const glowStyle = { '--glow': t.glow };

  /* ── Layout-specific wrapper + card styles ── */
  const WRAPPER = {
    modal: {
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
      animation: closing ? 'nm-backdrop 0.3s ease reverse forwards' : 'nm-backdrop 0.3s ease forwards',
    },
    banner: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      animation: closing ? 'nm-banner-out 0.35s ease forwards' : 'nm-banner-in 0.4s cubic-bezier(.34,1.3,.64,1) forwards',
    },
    'bottom-sheet': {
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300,
      animation: closing ? 'nm-sheet-out 0.35s ease forwards' : 'nm-sheet-in 0.45s cubic-bezier(.34,1.3,.64,1) forwards',
    },
    toast: {
      position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 300,
      animation: closing ? 'nm-toast-out 0.3s ease forwards' : 'nm-toast-in 0.45s cubic-bezier(.34,1.56,.64,1) forwards',
    },
  }[layout];

  const CARD = {
    modal:          { width:'100%', maxWidth:420, borderRadius:28, boxShadow:`0 32px 80px rgba(0,0,0,0.28)` },
    banner:         { width:'100%', borderRadius:0, borderBottom:`3px solid ${t.border}`, boxShadow:`0 4px 24px rgba(0,0,0,0.18)` },
    'bottom-sheet': { width:'100%', borderRadius:'24px 24px 0 0', boxShadow:`0 -8px 40px rgba(0,0,0,0.22)` },
    toast:          { width:340, maxWidth:'calc(100vw - 2.5rem)', borderRadius:20, boxShadow:`0 16px 50px rgba(0,0,0,0.25)` },
  }[layout];

  const isBanner  = layout === 'banner';
  const isToast   = layout === 'toast';
  const isSheet   = layout === 'bottom-sheet';
  const isCompact = isBanner || isToast;

  const CardContent = (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        overflow: 'hidden',
        background: t.bg,
        border: `2px solid ${t.border}`,
        ...CARD,
        ...glowStyle,
      }}>

        {/* Progress bar — hidden for toast */}
        {!isToast && (
          <div style={{ height: 4, background: 'rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(90deg, ${t.bar}, ${t.bar}cc, ${t.bar})`,
              backgroundSize: '200% 100%',
              transformOrigin: 'left',
              transform: `scaleX(${pct / 100})`,
              transition: 'transform 0.1s linear',
              animation: 'nm-shimmer 1.5s linear infinite',
            }} />
          </div>
        )}

        {/* Bottom-sheet drag pill */}
        {isSheet && (
          <div style={{ display:'flex', justifyContent:'center', paddingTop:10, paddingBottom:2 }}>
            <div style={{ width:40, height:4, borderRadius:999, background:'rgba(0,0,0,0.15)' }} />
          </div>
        )}

        <div style={{ padding: isCompact ? '12px 16px' : isSheet ? '18px 24px 24px' : '24px 24px 22px' }}>

          {/* ── COMPACT layout (banner / toast) ── */}
          {isCompact ? (
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {/* Icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                background: t.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 12px rgba(${t.glow},0.4)`,
                animation: 'nm-icon-pop 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both',
              }}>
                <Icon style={{ width: 18, height: 18, color: '#fff' }} />
              </div>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin:0, fontWeight:900, fontSize:13, color:t.titleColor, lineHeight:1.2 }}>
                  {notice.title || 'বিজ্ঞপ্তি'}
                </p>
                {notice.message && (
                  <p style={{ margin:'2px 0 0', fontSize:11, color:t.textColor, lineHeight:1.4,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {notice.message}
                  </p>
                )}
              </div>
              {/* Timer + close */}
              <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                <span style={{ fontSize:10, fontWeight:600, color:t.textColor, opacity:0.55 }}>{Math.ceil(remaining)}s</span>
                <button onClick={handleClose}
                  style={{ width:24, height:24, borderRadius:'50%', border:'none', cursor:'pointer',
                    background:'rgba(0,0,0,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X style={{ width:12, height:12, color:t.titleColor }} />
                </button>
              </div>
            </div>
          ) : (
            /* ── FULL layout (modal / bottom-sheet) ── */
            <>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:18 }}>
                {/* Icon with rings + particles */}
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{
                    position:'absolute', inset:-4, borderRadius:'50%',
                    border:`3px solid ${t.bar}`,
                    animation:'nm-ring 1s ease-out 0.4s forwards', opacity:0,
                  }} />
                  <div style={{
                    width:56, height:56, borderRadius:18,
                    background:t.iconBg,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    animation:`nm-icon-pop 0.6s cubic-bezier(.34,1.56,.64,1) 0.15s both, nm-icon-glow 2s ease-in-out 0.8s infinite`,
                    '--glow': t.glow,
                    boxShadow:`0 8px 24px rgba(${t.glow},0.4)`,
                    position:'relative',
                  }}>
                    <Icon style={{ width:26, height:26, color:'#fff' }} />
                  </div>
                  <Particles color={t.bar} />
                </div>
                {/* Title */}
                <div style={{ flex:1, minWidth:0, paddingTop:2 }}>
                  <h2 style={{ margin:0, fontWeight:900, fontSize:20, lineHeight:1.25, color:t.titleColor, animation:'nm-title 0.45s ease 0.3s both' }}>
                    {notice.title || 'বিজ্ঞপ্তি'}
                  </h2>
                  {notice.subtitle && (
                    <p style={{ margin:'5px 0 0', fontSize:13, fontWeight:700, color:t.subColor, animation:'nm-sub 0.45s ease 0.42s both' }}>
                      {notice.subtitle}
                    </p>
                  )}
                </div>
                {/* Close */}
                <button onClick={handleClose}
                  style={{ width:30, height:30, borderRadius:'50%', border:'none', cursor:'pointer',
                    background:'rgba(0,0,0,0.08)', display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink:0, transition:'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background='rgba(0,0,0,0.16)'}
                  onMouseLeave={(e) => e.currentTarget.style.background='rgba(0,0,0,0.08)'}>
                  <X style={{ width:14, height:14, color:t.titleColor }} />
                </button>
              </div>

              {/* Divider */}
              <div style={{ height:1, background:t.border, marginBottom:16, borderRadius:1, animation:'nm-text 0.4s ease 0.5s both' }} />

              {/* Message */}
              <p style={{ margin:'0 0 20px', fontSize:14, lineHeight:1.65, color:t.textColor, animation:'nm-text 0.45s ease 0.55s both' }}>
                {notice.message}
              </p>

              {/* Footer */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, animation:'nm-text 0.4s ease 0.65s both' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform:'rotate(-90deg)' }}>
                    <circle cx="14" cy="14" r="11" fill="none" stroke={t.border} strokeWidth="2.5" />
                    <circle cx="14" cy="14" r="11" fill="none"
                      stroke={t.bar} strokeWidth="2.5"
                      strokeDasharray={`${2 * Math.PI * 11}`}
                      strokeDashoffset={`${2 * Math.PI * 11 * (remaining / AUTO_CLOSE)}`}
                      strokeLinecap="round"
                      style={{ transition:'stroke-dashoffset 0.1s linear' }}
                    />
                  </svg>
                  <span style={{ fontSize:12, fontWeight:600, color:t.textColor, opacity:0.6 }}>{Math.ceil(remaining)}s</span>
                </div>
                <button onClick={handleClose}
                  style={{ fontSize:13, fontWeight:800, padding:'10px 26px', borderRadius:50,
                    border:'none', cursor:'pointer', color:'#fff', background:t.iconBg,
                    animation:`nm-btn-pulse 1.8s ease-in-out 1s infinite`, '--glow':t.glow,
                    transition:'transform 0.15s', letterSpacing:'0.3px' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform='scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform='scale(1)'}>
                  বুঝেছি ✓
                </button>
              </div>
            </>
          )}
        </div>
      </div>
  );

  /* Wrap in backdrop only for modal; others are self-positioned */
  if (layout === 'modal') {
    return (
      <div onClick={handleClose} style={WRAPPER}>
        {CardContent}
      </div>
    );
  }

  return <div style={WRAPPER}>{CardContent}</div>;
}
