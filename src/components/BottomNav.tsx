import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Flame, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { 
      label: t('nav.home'), 
      icon: Home, 
      path: '/',
      active: location.pathname === '/'
    },
    { 
      label: t('nav.stats'), 
      icon: BarChart3, 
      path: '/tool/monetization',
      active: location.pathname === '/tool/monetization'
    },
    { 
      label: t('nav.trending'), 
      icon: Flame, 
      path: '/tool/trending-topics',
      active: location.pathname === '/tool/trending-topics'
    },
    { 
      label: t('nav.settings'), 
      icon: Settings, 
      path: '#',
      active: false
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50 h-[70px] px-6 md:hidden">
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all relative w-16 ${
                item.active ? 'text-brand-red' : 'text-brand-gray hover:text-brand-dark'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${item.active ? 'bg-brand-red/10' : ''}`}>
                <Icon 
                  className={`w-6 h-6 transition-all ${item.active ? 'stroke-[2.5px]' : 'stroke-2'}`} 
                />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${
                item.active ? 'text-brand-red' : 'text-brand-gray font-bold'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
