/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '375px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px',
    },
    extend: {
      colors: {
        /* ── Primary: deep modern navy ── */
        navy: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c0d2fe',
          300: '#93a8fc',
          400: '#6176f8',
          500: '#3b4cf1',
          600: '#1e2fe8',
          700: '#1a24c8',
          800: '#1a21a3',
          900: '#0F172A',
          950: '#080d1a',
        },
        /* ── Accent: trust green ── */
        trust: {
          50:  '#f0fdf5',
          100: '#dcfce9',
          200: '#bbf7d1',
          300: '#86efad',
          400: '#4ade80',
          500: '#22C55E',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        /* ── Background surface ── */
        surface: '#F8FAFC',
        /* ── Legacy brand (keep for backward compat) ── */
        brand: {
          50:  '#f0fdf5',
          100: '#dcfce9',
          200: '#bbf7d1',
          300: '#86efad',
          400: '#4ade80',
          500: '#22C55E',
          600: '#22C55E',
          700: '#16a34a',
          800: '#15803d',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
        bn:   ['"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1-mobile': ['28px', { lineHeight: '1.3', fontWeight: '800' }],
        'h1-desk':   ['44px', { lineHeight: '1.2', fontWeight: '800' }],
        'h2-mobile': ['22px', { lineHeight: '1.4', fontWeight: '700' }],
        'h2-desk':   ['28px', { lineHeight: '1.3', fontWeight: '700' }],
      },
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 24px rgba(15,23,42,0.12), 0 2px 6px rgba(15,23,42,0.06)',
        trust:   '0 4px 16px rgba(34,197,94,0.2)',
        navy:    '0 4px 16px rgba(15,23,42,0.25)',
      },
      borderRadius: {
        card: '16px',
        btn:  '999px',
        chip: '999px',
      },
    },
  },
  plugins: [],
};
