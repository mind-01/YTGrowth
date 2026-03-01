import React from 'react';
import { Youtube, Disc } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black text-brand-gray uppercase tracking-[0.2em]">
              © 2026 YTGrowth
            </p>
            <div className="h-4 w-px bg-gray-100" />
            <div className="flex gap-4">
              <a href="#" className="text-[10px] font-black text-brand-gray uppercase tracking-[0.2em] hover:text-brand-red transition-all">Privacy</a>
              <a href="#" className="text-[10px] font-black text-brand-gray uppercase tracking-[0.2em] hover:text-brand-red transition-all">Terms</a>
            </div>
          </div>
          
          <div className="flex gap-6 items-center">
            <a href="#" className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-brand-gray hover:bg-brand-red/10 hover:text-brand-red transition-all">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-brand-gray hover:bg-brand-red/10 hover:text-brand-red transition-all">
              <Disc className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
