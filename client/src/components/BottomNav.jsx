import { Link, useLocation } from 'react-router-dom';
import { Home, Search, BookOpen, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const TABS = [
  { to: '/',       icon: Home,      label: 'হোম' },
  { to: '/browse', icon: Search,    label: 'খুঁজুন' },
  { to: '/blog',   icon: BookOpen,  label: 'ব্লগ' },
  { to: null,      icon: User,      label: 'প্রোফাইল', isProfile: true },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { user }     = useAuth();

  function profileHref() {
    if (!user) return '/login';
    if (user.role === 'admin')   return '/admin';
    if (user.role === 'worker')  return '/dashboard';
    return '/account';
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(15,23,42,0.08)]">
      <div className="flex items-stretch h-16">
        {TABS.map(({ to, icon: Icon, label, isCat, isProfile }) => {
          const href   = isProfile ? profileHref() : to;
          const active = pathname === href
            || (to === '/browse' && pathname.startsWith('/browse'))
            || (to === '/blog'   && pathname.startsWith('/blog'));
          return (
            <Link key={label} to={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors
                ${active ? 'text-trust-600' : 'text-slate-400 hover:text-slate-600'}`}>
              <div className={`relative p-1.5 rounded-xl transition-all ${active ? 'bg-trust-50' : ''}`}>
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-trust-500 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-trust-600' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
