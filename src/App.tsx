import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ToolPage from './components/ToolPage';
import InfoPage from './components/InfoPage';
import Features from './pages/Features';
import ToolsGuide from './pages/ToolsGuide';
import FAQ from './pages/FAQ';
import Security from './pages/Security';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import About from './pages/About';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Customizer from './components/Customizer';
import ProfileMenu from './components/ProfileMenu';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-grow pb-[80px] md:pb-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tool/:id" element={<ToolPage />} />
            <Route path="/info/:slug" element={<InfoPage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/tools" element={<ToolsGuide />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/security" element={<Security />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {/* Global UI Elements */}
        <Customizer />
        <ProfileMenu />

        {/* Footer & Navigation */}
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
}
