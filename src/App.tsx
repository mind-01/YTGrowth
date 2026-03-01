import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ToolPage from './components/ToolPage';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-grow pb-[80px] md:pb-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tool/:id" element={<ToolPage />} />
          </Routes>
        </main>

        {/* Footer & Navigation */}
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
}
