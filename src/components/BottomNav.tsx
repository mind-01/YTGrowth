import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Video, Zap, BarChart3, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useMobileNav, MobileTab } from '../contexts/MobileNavContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { activeTab, setActiveTab, setIsProfileMenuOpen } = useMobileNav();
  
  const navItems: { label: string; icon: any; tab: MobileTab }[] = [
    { label: t('nav.home') || 'Home', icon: Home, tab: 'Home' },
    { label: 'Video', icon: Video, tab: 'Video' },
    { label: 'Shorts', icon: Zap, tab: 'Shorts' },
    { label: 'Analytics', icon: BarChart3, tab: 'Analytics' },
    { label: 'Profile', icon: User, tab: 'Profile' },
  ];

  const handleTabClick = (tab: MobileTab) => {
    if (tab === 'Profile') {
      setIsProfileMenuOpen(true);
      return;
    }

    setActiveTab(tab);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-brand-dark border-t border-gray-100 dark:border-border-primary shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50 h-[70px] px-2 md:hidden">
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab && location.pathname === '/';
          
          return (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative w-16 ${
                isActive ? 'text-brand-red' : 'text-brand-gray hover:text-brand-dark dark:hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-brand-red/10' : ''}`}>
                <Icon 
                  className={`w-6 h-6 transition-all ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} 
                />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tight ${
                isActive ? 'text-brand-red' : 'text-brand-gray font-bold'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
