import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Customizer from './components/Customizer';
import ProfileMenu from './components/ProfileMenu';

// Lazy load pages
const Dashboard = lazy(() => import('./components/Dashboard'));
const ToolPage = lazy(() => import('./components/ToolPage'));
const InfoPage = lazy(() => import('./components/InfoPage'));
const Features = lazy(() => import('./pages/Features'));
const ToolsGuide = lazy(() => import('./pages/ToolsGuide'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Security = lazy(() => import('./pages/Security'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ToolsHub = lazy(() => import('./pages/ToolsHub'));
const PillarArticle = lazy(() => import('./pages/PillarArticle'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {!isLoginPage && <Navbar />}
      
      {/* Main Content */}
      <main className={`flex-grow ${!isLoginPage ? 'pb-[80px] md:pb-0' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tool/:id" element={<ToolPage />} />
            <Route path="/info/:slug" element={<InfoPage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/tools" element={<ToolsHub />} />
            <Route path="/best-youtube-tools" element={<PillarArticle />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/security" element={<Security />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global UI Elements */}
      {!isLoginPage && <Customizer />}
      {!isLoginPage && <ProfileMenu />}

      {/* Footer & Navigation */}
      {!isLoginPage && <Footer />}
      {!isLoginPage && <BottomNav />}
    </div>
  );
}
