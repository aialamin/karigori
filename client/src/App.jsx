import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext.jsx';
import { ConfigProvider, useConfig } from './context/ConfigContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BottomNav from './components/BottomNav.jsx';
import NoticeModal from './components/NoticeModal.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const Home            = lazy(() => import('./pages/Home.jsx'));
const Browse          = lazy(() => import('./pages/Browse.jsx'));
const WorkerProfile   = lazy(() => import('./pages/WorkerProfile.jsx'));
const Login           = lazy(() => import('./pages/Login.jsx'));
const Register        = lazy(() => import('./pages/Register.jsx'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard.jsx'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard.jsx'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard.jsx'));
const Disclaimer      = lazy(() => import('./pages/Disclaimer.jsx'));
const Privacy         = lazy(() => import('./pages/Privacy.jsx'));
const Terms           = lazy(() => import('./pages/Terms.jsx'));
const LocalLanding    = lazy(() => import('./pages/LocalLanding.jsx'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-green-100 border-t-green-700 rounded-full animate-spin" />
    </div>
  );
}

/* Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/* Inner shell — has access to ConfigContext */
function Shell() {
  const { notice, loaded } = useConfig();
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    if (!notice?.active || !notice?.message) return;
    // Show only once per session
    const key = `kg_notice_seen_${notice.message.slice(0, 20)}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    setShowNotice(true);
  }, [loaded, notice]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 min-w-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/browse"              element={<Browse />} />
            <Route path="/browse/:category"    element={<Browse />} />
            <Route path="/worker/:id"          element={<WorkerProfile />} />
            <Route path="/login"               element={<Login />} />
            <Route path="/register"            element={<Register />} />
            <Route path="/disclaimer"          element={<Disclaimer />} />
            <Route path="/privacy"             element={<Privacy />} />
            <Route path="/terms"               element={<Terms />} />
            <Route path="/:city/:service"      element={<LocalLanding />} />
            <Route path="/dashboard" element={
              <ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />

      {/* Admin notice modal */}
      {showNotice && notice?.active && (
        <NoticeModal notice={notice} onClose={() => setShowNotice(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ConfigProvider>
          <Shell />
        </ConfigProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
