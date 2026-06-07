# কারিগরি — Karigori

**Bangladesh's #1 local service marketplace** — Find verified plumbers, electricians, cleaners, masons, ISP technicians, contractors, and more across Bangladesh. Fully bilingual (বাংলা + English), mobile-first PWA installable on Android & iOS.

🌐 **Live:** [karigori.org](https://karigori.org) &nbsp;|&nbsp; **Repo:** [github.com/aialamin/karigori.org](https://github.com/aialamin/karigori.org)

---

## Features

### For Customers
- **Browse & Search** — Filter workers by category, area, availability, verification level, rating, price
- **11+ Service Categories** — Built-in 11 categories + admin can add unlimited extras; all counts are dynamic (not hardcoded)
- **Search Fallback** — If a keyword search (e.g. "Pipe repair") returns 0 results, the server automatically falls back to all workers in that category with an orange warning banner
- **City Pages** — `/dhaka`, `/gazipur`, `/chattogram`, `/sylhet`, `/cumilla`, `/barishal`, `/jashore` and more — auto-shows workers in that city; if a category has no local workers a clear banner shows "কোনো সঠিক ফলাফল পাওয়া যায়নি" and falls back to nationwide workers in that trade
- **Worker Profiles** — Phone-number-based URLs (`/worker/01XXXXXXXXX`), ratings, reviews, verified badge, contact button, report option
- **Price Guide** — Estimated price ranges per service category
- **Blog** — Service tips and guides (admin-managed)
- **PWA** — Installable on Android/iOS, works offline, app shortcuts, maskable icons

### For Service Providers (Workers)
- **Registration** — Select up to **3 trade categories** (primary + secondary)
- **Division → Zila → Upazila area picker** — Hierarchical checkbox tree with bulk select, search, and popular city quick-pills
- **Profile Dashboard** — Update bio, rates, availability, areas, upload photo
- **Document Upload** — NID front/back, selfie with NID (Level 2 verification)
- **Phone OTP Verification** — Level 1 badge after phone verify
- **Password Reset** — OTP-based forgot password flow

### Admin Panel (`/admin`)
- Worker approval / rejection with notes and audit trail
- **Bulk select + approve** across Pending / Approved / Rejected tabs
  - Pending → L1 approve, L2 approve, or reject (bulk)
  - Approved → move to Pending or Reject (bulk)
  - Rejected → re-approve or move to Pending (bulk)
- Flag / unflag workers
- All-users management (search, edit role, delete)
- Blog post editor (create, edit drafts, publish/unpublish)
- Bulk CSV/Excel upload with Bengali encoding support (UTF-8)
- Dynamic site config — add extra categories, extra areas, site notice (modal / banner / bottom-sheet / toast)
- Live analytics dashboard (page views, phone clicks, searches, donations)

### Platform
- **Dynamic Stats** — Live worker count, category count (from DB), areas, jobs — 60s server cache
- **Security Headers** — X-Frame-Options, HSTS, CSP, Referrer-Policy, Permissions-Policy
- **SEO** — Structured data (JSON-LD), city-specific meta, sitemap, canonical URLs, Helmet tags
- **JWT Auth** — 30-day tokens, role-based (worker / client / admin)
- **Image optimization** — Auto-converts uploads to WebP via Sharp

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, Vite 5, Tailwind CSS 3 |
| PWA | VitePWA + custom Workbox SW (`injectManifest`) |
| Backend | Node.js 20, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (jsonwebtoken), bcrypt |
| File Uploads | Multer + Sharp (→ WebP) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
karigori/
├── client/                   React + Vite PWA frontend
│   ├── src/
│   │   ├── sw.js             Custom Workbox service worker (injectManifest)
│   │   ├── pages/
│   │   │   ├── Home.jsx           Homepage with live stats + category chips
│   │   │   ├── Browse.jsx         Search/filter all workers + fallback banner
│   │   │   ├── CityPage.jsx       City-scoped worker pages
│   │   │   ├── WorkerProfile.jsx  Worker detail (phone-number URL)
│   │   │   ├── LocalLanding.jsx   /city/service SEO landing pages
│   │   │   ├── About.jsx          About page (dynamic category count)
│   │   │   ├── Register.jsx       Worker/client registration
│   │   │   ├── WorkerDashboard.jsx  Worker profile editor
│   │   │   ├── ClientDashboard.jsx  Client account
│   │   │   ├── AdminDashboard.jsx   Admin panel (bulk actions, analytics)
│   │   │   ├── AllPages.jsx       Static info pages
│   │   │   ├── PriceGuide.jsx     Service pricing page
│   │   │   └── Blog.jsx / BlogPost.jsx
│   │   ├── components/
│   │   │   ├── WorkerCard.jsx         Worker card (phone URL, stable avatar)
│   │   │   ├── ServiceAreaPicker.jsx  Division→Zila→Upazila picker
│   │   │   ├── CategoryIcon.jsx       Dynamic category icon mapping
│   │   │   ├── AdminBlogManager.jsx   Blog CRUD (draft + publish)
│   │   │   └── VerificationBadge.jsx
│   │   ├── context/
│   │   │   └── ConfigContext.jsx  allCategories (built-in + admin extras)
│   │   ├── data/
│   │   │   ├── bangladesh.js      8 divisions, 64 districts, ~490 upazilas
│   │   │   ├── siteData.js        City & service data
│   │   │   └── categories.js      Category → subcategory tree
│   │   └── constants.js           CATEGORIES array
│   └── public/
│       ├── site.webmanifest       PWA manifest (2025 spec)
│       ├── icon-96.png            Android notification badge icon
│       ├── icon-192.png           Home screen icon
│       ├── icon-512.png           Splash screen icon
│       └── icon-512-maskable.png  Adaptive icon (Android)
├── server/                   Express + Mongoose API
│   ├── models/
│   │   ├── Worker.js         Worker schema (categories[], areas[], verification)
│   │   ├── User.js           User schema (worker / client / admin)
│   │   ├── Review.js         Review schema
│   │   ├── Blog.js           Blog post schema
│   │   └── Config.js         Dynamic site config (extra categories, areas, notice)
│   ├── routes/
│   │   ├── auth.js           Register, login, OTP, password reset
│   │   ├── workers.js        Public worker listing + phone/ID lookup + reviews
│   │   ├── profile.js        Worker/client profile update + file uploads
│   │   ├── admin.js          Admin moderation + bulk approve/status endpoints
│   │   ├── adminBlog.js      Admin blog CRUD (get draft by ID, publish)
│   │   ├── stats.js          Live platform stats (dynamic category count)
│   │   ├── config.js         Dynamic site config (categories, areas, notice)
│   │   ├── bulkupload.js     CSV/Excel bulk worker import (UTF-8 Bengali)
│   │   └── analytics.js      Usage analytics
│   ├── middleware/auth.js    JWT verify + role guard
│   └── index.js              Security headers, HSTS, Permissions-Policy
├── render.yaml               Render backend deployment config
├── vercel.json               Vercel frontend build + SPA rewrite config
└── package.json              Root dev scripts
```

---

## Local Setup

### 1. Install dependencies

```bash
# Root (concurrent dev runner)
npm install

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Create `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/karigori
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Create `client/.env`

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run dev servers

```bash
npm run dev
```

- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5000/api/health`

---

## Seed Data

```bash
cd server

# Core demo workers (all 11 categories)
npm run seed

# New service workers (ISP, Rajmistri, Contractor)
node seed-new-services.js
```

**Admin login after seed:**
```
Email:    admin@karigori.com
Password: admin123
```

> ⚠️ Seed scripts clear existing workers/reviews. Use only on test/demo databases.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| GET | `/api/stats` | — | Live platform stats (dynamic category count, 60s cache) |
| GET | `/api/workers` | — | List workers (filter: category, area, q, available, sort, page) + search fallback |
| GET | `/api/workers/:identifier` | — | Worker profile — accepts phone number OR MongoDB ObjectId |
| GET | `/api/workers/:id/reviews` | — | Worker reviews (paginated) |
| POST | `/api/workers/:id/reviews` | — | Submit review |
| POST | `/api/workers/:id/report` | — | Report a worker |
| POST | `/api/auth/register` | — | Register (worker or client) |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | JWT | Current user |
| POST | `/api/auth/send-otp` | JWT | Send phone OTP |
| POST | `/api/auth/verify-otp` | JWT | Verify phone OTP (grants Level 1) |
| POST | `/api/auth/forgot-password` | — | Send reset OTP |
| POST | `/api/auth/reset-password` | — | Reset password |
| GET | `/api/profile/worker` | JWT worker | Get own worker profile |
| PUT | `/api/profile/worker` | JWT worker | Update profile |
| POST | `/api/profile/worker/photo` | JWT worker | Upload profile photo |
| POST | `/api/profile/worker/documents` | JWT worker | Upload NID + certificates |
| GET | `/api/admin/stats` | JWT admin | Admin dashboard stats |
| GET | `/api/admin/workers` | JWT admin | Worker moderation list |
| PUT | `/api/admin/workers/bulk-approve` | JWT admin | Bulk approve workers to L1/L2 |
| PUT | `/api/admin/workers/bulk-status` | JWT admin | Bulk set status (pending/rejected) |
| PUT | `/api/admin/workers/:id/approve` | JWT admin | Approve single worker |
| PUT | `/api/admin/workers/:id/reject` | JWT admin | Reject single worker |
| PUT | `/api/admin/workers/:id/flag` | JWT admin | Flag/unflag worker |
| GET | `/api/admin/users` | JWT admin | All users (searchable) |
| PUT | `/api/admin/users/:id` | JWT admin | Edit user (name, email, role) |
| DELETE | `/api/admin/users/:id` | JWT admin | Delete user |
| GET | `/api/admin/blogs/:id` | JWT admin | Get blog by ID (including drafts) |
| GET | `/api/config` | — | Dynamic site config |
| POST | `/api/config/categories` | JWT admin | Add extra category |
| DELETE | `/api/config/categories/:key` | JWT admin | Delete extra category |
| POST | `/api/config/areas` | JWT admin | Add extra area |
| PUT | `/api/config/notice` | JWT admin | Update site notice |
| POST | `/api/bulk/workers` | JWT admin | Bulk CSV/Excel import |
| GET | `/api/bulk/template` | JWT admin | Download import template |

---

## Service Categories (11 built-in + admin extras)

| Key | English | বাংলা |
|---|---|---|
| `plumber` | Plumber | প্লাম্বার |
| `electrician` | Electrician | ইলেক্ট্রিশিয়ান |
| `cleaner` | Cleaner | ক্লিনার |
| `bua` | Bua / House Help | বুয়া |
| `painter` | Painter | পেইন্টার |
| `ac_repair` | AC Mechanic | এসি মেকানিক |
| `carpenter` | Carpenter | কাঠমিস্ত্রি |
| `gas_fitter` | Gas Fitter | গ্যাস ফিটার |
| `isp` | ISP / Internet | ইন্টারনেট সেবা |
| `rajmistri` | Mason | রাজমিস্ত্রি |
| `contractor` | Contractor | কন্ট্রাক্টর |

Admin can add unlimited extra categories from the Settings tab. All category counts across every page update automatically.

---

## Worker Verification Levels

| Level | Label | Requirement |
|---|---|---|
| 0 | Unverified | Registered, awaiting review |
| 1 | Phone Verified | Phone OTP confirmed + admin approved |
| 2 | ID Verified | NID selfie uploaded + admin approved |
| 3 | Skilled Verified | Certificates + trade approved |
| 4 | Trusted Pro | 20+ jobs, 4.5+ rating |

---

## PWA / Android App

The app is a fully installable Progressive Web App meeting the 2025 Android Chrome install criteria:

| Feature | Value |
|---|---|
| Manifest | `site.webmanifest` (injected by VitePWA at build) |
| Icons | 96×96, 192×192, 512×512 (any + maskable) |
| `launch_handler` | `navigate-existing` — no duplicate tabs on re-open |
| `handle_links` | `preferred` — Android opens karigori.org links in the app |
| Shortcuts | Plumber, Electrician, AC Repair, Register (long-press icon) |
| Service Worker | Custom Workbox SW (`injectManifest`) |
| Offline | Core UI + last-visited pages cached |
| Quota safe | Precache limited to CSS/HTML/PNG (<1 MB total); JS chunks are **not** precached |
| Cache cleanup | On every SW activate, stale/old caches are deleted automatically |

---

## City Pages

Workers are fetched by matching all upazilas under the city's district. Both the **new official spelling** and the **legacy spelling** are searched simultaneously so workers who registered before an official rename are still found.

| Route | City | Official Name | Legacy Name |
|---|---|---|---|
| `/dhaka` | ঢাকা | Dhaka | — |
| `/gazipur` | গাজীপুর | Gazipur | — |
| `/narayanganj` | নারায়ণগঞ্জ | Narayanganj | — |
| `/chattogram` | চট্টগ্রাম | Chattogram | Chittagong |
| `/sylhet` | সিলেট | Sylhet | — |
| `/rajshahi` | রাজশাহী | Rajshahi | — |
| `/cumilla` | কুমিল্লা | Cumilla | Comilla |
| `/barishal` | বরিশাল | Barishal | Barisal |
| `/jessore` | যশোর | Jashore | Jessore |
| `/bogura` | বগুড়া | Bogura | Bogra |
| `/khulna` | খুলনা | Khulna | — |
| `/feni` | ফেনী | Feni | — |
| `/coxsbazar` | কক্সবাজার | Cox's Bazar | — |

If a selected category has **no workers in that city**, a dismissible orange banner appears — "X — কোনো সঠিক ফলাফল পাওয়া যায়নি / সব [category] কারিগর দেখানো হচ্ছে" — and nationwide workers in that trade are shown instead.

---

## Deployment

### Backend → Render

```env
NODE_ENV=production
MONGO_URI=your-atlas-connection-string
JWT_SECRET=your-long-random-secret
CLIENT_URL=https://karigori.org
```

Build: `npm install` · Start: `npm start`

### Frontend → Vercel

```env
VITE_API_URL=https://your-service.onrender.com
```

After deploying frontend, update Render's `CLIENT_URL` to your Vercel URL and redeploy backend.

---

## Security

- Never commit `server/.env`, `client/.env`, or any credentials
- `server/uploads/` is git-ignored — never commit user documents
- Security headers set on every response: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` (production only)
- OTP codes are **never** logged in production (`NODE_ENV=production` gating)
- `console.*` and `debugger` statements are stripped from the production JS bundle by esbuild

---

*Built with ❤️ for Bangladesh — কারিগরিকে বিশ্বাস করুন*
