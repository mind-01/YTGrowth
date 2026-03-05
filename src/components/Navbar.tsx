import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, TrendingUp, LogOut, User as UserIcon, Heart, Menu, LayoutGrid, Sun, Moon, Palette } from 'lucide-react';
import { TOOLS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, COLORS } from '../contexts/ThemeContext';

interface NavDropdownProps {
  label: string;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
  className?: string;
}

function NavDropdown({ label, isOpen, onMouseEnter, onMouseLeave, children, className = "" }: NavDropdownProps) {
  return (
    <div 
      className={`relative h-16 flex items-center ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
          isOpen ? 'bg-brand-red text-white' : 'bg-bg-primary text-brand-gray hover:bg-border-primary'
        }`}
      >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 mt-0 bg-card-bg rounded-b-[2rem] border border-border-primary shadow-2xl overflow-hidden"
            style={{ minWidth: '200px' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { t } = useLanguage();
  const { user, signInWithGoogle, logout } = useAuth();
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  const currentToolId = location.pathname.split('/').pop();

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  useEffect(() => {
    setActiveMenu(null);
    setSearchQuery('');
  }, [location.pathname]);

  const categories = ['SEO', 'Content', 'Channel', 'Analytics'] as const;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EA3323&color=fff`;

  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderToolLink = (tool: any) => (
    <Link
      key={tool.id}
      to={tool.path}
      className={`flex items-start gap-3 p-3 rounded-2xl transition-all group ${
        currentToolId === tool.id 
          ? 'bg-brand-red/5 text-brand-red' 
          : 'hover:bg-brand-red/5 text-brand-dark'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        currentToolId === tool.id 
          ? 'bg-brand-red text-white' 
          : 'bg-bg-primary group-hover:bg-brand-red/10 group-hover:text-brand-red text-brand-gray'
      }`}>
        <tool.icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold leading-tight mb-0.5">{t(`tool.${tool.id}.name`)}</p>
        <p className="text-[10px] text-brand-gray leading-tight line-clamp-1 group-hover:text-brand-gray/80">
          {t(`tool.${tool.id}.desc`)}
        </p>
      </div>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-border-primary shadow-sm">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group mr-4">
            <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-red/30 group-hover:scale-110 transition-transform relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <TrendingUp className="w-5 h-5 relative z-10" />
            </div>
            <span className="text-xl font-black tracking-tighter">
              <span className="text-brand-red">YT</span>
              <span className="text-brand-dark">Growth</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Category Shortcuts */}
            {['SEO', 'Content', 'Channel'].map((cat) => (
              <div 
                key={cat}
                className="relative h-16 flex items-center"
                onMouseEnter={() => handleMouseEnter(cat.toLowerCase())}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeMenu === cat.toLowerCase() ? 'bg-brand-red text-white' : 'bg-card-bg text-brand-gray hover:bg-bg-primary'
                  }`}
                >
                  <span>{t(`cat.${cat.toLowerCase()}`)}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === cat.toLowerCase() ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeMenu === cat.toLowerCase() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute top-full left-0 mt-0 w-[280px] bg-card-bg rounded-b-2xl border border-border-primary shadow-2xl overflow-hidden p-4"
                    >
                      <div className="space-y-1">
                        {TOOLS.filter(t => t.category === cat).map(tool => renderToolLink(tool))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* All Tools Mega Menu */}
            <div 
              className="relative h-16 flex items-center"
              onMouseEnter={() => handleMouseEnter('all')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeMenu === 'all' ? 'bg-brand-red text-white' : 'bg-bg-primary text-brand-gray hover:bg-border-primary'
                }`}
              >
                <span>{t('nav.all_tools')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'all' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeMenu === 'all' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[90vw] max-w-[1000px] bg-card-bg rounded-b-[2.5rem] border border-border-primary shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-6 border-b border-border-primary bg-bg-primary/30">
                      <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
                        <input
                          type="text"
                          placeholder={t('nav.quick_search')}
                          className="w-full !pl-14 pr-4 py-3 bg-card-bg border border-border-primary rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all shadow-sm"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                      {categories.map(category => {
                        const categoryTools = filteredTools.filter(t => t.category === category);
                        if (categoryTools.length === 0) return null;

                        return (
                          <div key={category} className="space-y-5">
                            <h3 className="text-[11px] font-black text-brand-gray uppercase tracking-[0.25em] border-b border-border-primary pb-3">
                              {category === 'Analytics' ? t('cat.analytics_global') : t(`cat.${category.toLowerCase()}_tools`)}
                            </h3>
                            <div className="space-y-2">
                              {categoryTools.map(tool => renderToolLink(tool))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-5 bg-brand-dark text-center">
                      <p className="text-[11px] font-bold text-bg-primary/50 uppercase tracking-[0.3em]">
                        {t('nav.ultimate_suite')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative flex items-center gap-3">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-bg-primary border border-border-primary hover:border-brand-red/50 transition-all shadow-sm active:scale-95"
              >
                <div className="relative">
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-8 h-8 rounded-full border border-border-primary object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EA3323&color=fff`;
                    }}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex flex-col items-start leading-none hidden sm:flex">
                  <span className="text-[13px] font-black text-brand-dark">
                    {displayName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-bold text-brand-gray uppercase tracking-wider">
                    Creator
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-brand-gray transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-card-bg border border-border-primary rounded-[2rem] shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-6 border-b border-border-primary bg-bg-primary/30">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={avatarUrl} 
                            alt={displayName} 
                            className="w-10 h-10 rounded-full border border-border-primary"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-black text-brand-dark truncate">{displayName}</p>
                            <p className="text-[10px] font-bold text-brand-gray truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-widest w-fit">
                          <TrendingUp className="w-3 h-3" />
                          Pro Creator
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          to="/user-dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-brand-gray hover:text-brand-dark hover:bg-bg-primary transition-all group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-bg-primary flex items-center justify-center group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <span>Account</span>
                        </Link>
                        <Link
                          to="/user-dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-brand-gray hover:text-brand-dark hover:bg-bg-primary transition-all group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-bg-primary flex items-center justify-center group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors">
                            <Heart className="w-4 h-4" />
                          </div>
                          <span>Favorites</span>
                        </Link>
                        <button 
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-brand-gray hover:text-brand-red hover:bg-brand-red/5 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-bg-primary flex items-center justify-center group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login"
              className="px-6 py-2 bg-brand-red text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-brand-red/20 flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Top Bar */}
      <div className="lg:hidden flex items-center justify-between h-16 px-4">
        <button 
          onClick={() => setActiveMenu(activeMenu === 'all' ? null : 'all')}
          className="p-2 text-brand-dark hover:bg-bg-primary rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white shadow-md">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-lg font-black tracking-tighter">
            <span className="text-brand-red">YT</span>
            <span className="text-brand-dark">Growth</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
            className={`p-2 rounded-xl transition-colors ${activeMenu === 'settings' ? 'bg-brand-red text-white' : 'text-brand-dark hover:bg-bg-primary'}`}
          >
            <LayoutGrid className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Settings Overlay (Theme & Color) */}
      <AnimatePresence>
        {activeMenu === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-card-bg border-b border-border-primary shadow-2xl z-50 p-6 space-y-8"
          >
            {/* Account Info (Mobile Only) */}
            {user && (
              <div className="flex items-center gap-4 p-4 bg-bg-primary dark:bg-brand-dark rounded-2xl border border-border-primary">
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  className="w-12 h-12 rounded-xl border border-border-primary object-cover"
                />
                <div className="flex-grow">
                  <p className="text-sm font-black text-brand-dark dark:text-white">{displayName}</p>
                  <Link to="/user-dashboard" onClick={() => setActiveMenu(null)} className="text-xs text-brand-red font-bold hover:underline">
                    View Dashboard
                  </Link>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setActiveMenu(null);
                  }}
                  className="p-2 text-brand-gray hover:text-brand-red transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            {!user && (
              <Link 
                to="/login" 
                onClick={() => setActiveMenu(null)}
                className="flex items-center justify-center gap-3 p-4 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-brand-red/20"
              >
                <UserIcon className="w-5 h-5" />
                Sign In / Sign Up
              </Link>
            )}

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-brand-red" /> : <Sun className="w-5 h-5 text-brand-red" />}
                <span className="text-sm font-bold text-brand-dark dark:text-white">{t('settings.theme')}</span>
              </div>
              <div className="flex bg-bg-primary dark:bg-brand-dark p-1 rounded-xl border border-border-primary">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    theme === 'light' ? 'bg-white dark:bg-brand-dark text-brand-red shadow-sm' : 'text-brand-gray'
                  }`}
                >
                  {t('settings.light')}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    theme === 'dark' ? 'bg-brand-red text-white shadow-sm' : 'text-brand-gray'
                  }`}
                >
                  {t('settings.dark')}
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-brand-red" />
                <span className="text-sm font-bold text-brand-dark dark:text-white">{t('settings.accent')}</span>
              </div>
              <div className="flex gap-3 justify-center">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      accentColor === color ? 'border-brand-red scale-110 shadow-lg' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Mega Menu Overlay */}
      <AnimatePresence>
        {activeMenu === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-card-bg border-b border-border-primary shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 border-b border-border-primary bg-bg-primary/30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
                <input
                  type="text"
                  placeholder={t('nav.quick_search')}
                  className="w-full !pl-12 pr-4 py-3 bg-card-bg border border-border-primary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 space-y-6">
              {categories.map(category => {
                const categoryTools = filteredTools.filter(t => t.category === category);
                if (categoryTools.length === 0) return null;
                return (
                  <div key={category} className="space-y-3">
                    <h3 className="text-[10px] font-black text-brand-gray uppercase tracking-widest border-b border-border-primary pb-2">
                      {category === 'Analytics' ? t('cat.analytics_global') : t(`cat.${category.toLowerCase()}_tools`)}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {categoryTools.map(tool => renderToolLink(tool))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
