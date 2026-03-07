import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Moon, 
  Sun, 
  Palette, 
  User, 
  Info, 
  Mail, 
  LogOut, 
  ChevronRight,
  Shield,
  Bell
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme, COLORS } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const LANGUAGES = [
  'English', 'हिन्दी', 'Español', 'Français', 'Deutsch', 'Italiano', 'Português', '日本語', 'Русский'
] as const;

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const { user, logout } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EA3323&color=fff`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-dark dark:text-white tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-brand-gray font-medium">Customize your experience and manage your account.</p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-black text-brand-gray uppercase tracking-[0.2em] px-2">
            {t('settings.account')}
          </h2>
          {user ? (
            <Link 
              to="/user-dashboard"
              className="flex items-center gap-4 p-4 bg-card-bg dark:bg-bg-primary/50 border border-border-primary rounded-2xl hover:border-brand-red/30 transition-all group"
            >
              <img 
                src={avatarUrl} 
                alt={displayName} 
                className="w-12 h-12 rounded-xl border border-border-primary object-cover"
              />
              <div className="flex-grow">
                <p className="text-sm font-black text-brand-dark dark:text-white">{displayName}</p>
                <p className="text-xs text-brand-gray font-bold">{user.email}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-gray group-hover:text-brand-red transition-colors" />
            </Link>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-4 p-4 bg-card-bg dark:bg-bg-primary/50 border border-border-primary rounded-2xl hover:border-brand-red/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-primary dark:bg-bg-primary flex items-center justify-center text-brand-gray">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-black text-brand-dark dark:text-white">Sign In</p>
                <p className="text-xs text-brand-gray font-bold">Access your favorites and history</p>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-gray group-hover:text-brand-red transition-colors" />
            </Link>
          )}
        </section>

        {/* Preferences Section */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-black text-brand-gray uppercase tracking-[0.2em] px-2">
            Preferences
          </h2>
          <div className="bg-card-bg dark:bg-brand-dark/50 border border-border-primary rounded-2xl overflow-hidden divide-y divide-border-primary">
            {/* Language */}
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-brand-red" />
                <span className="text-sm font-bold text-brand-dark dark:text-white">{t('settings.language')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as any)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-black transition-all border ${
                      language === lang 
                        ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/20' 
                        : 'bg-bg-primary dark:bg-brand-dark text-brand-gray border-border-primary hover:border-brand-red/30'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="p-4 flex items-center justify-between">
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
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-brand-red" />
                <span className="text-sm font-bold text-brand-dark dark:text-white">{t('settings.accent')}</span>
              </div>
              <div className="flex gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      accentColor === color ? 'border-brand-red scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-black text-brand-gray uppercase tracking-[0.2em] px-2">
            Support & Info
          </h2>
          <div className="bg-card-bg dark:bg-brand-dark/50 border border-border-primary rounded-2xl overflow-hidden divide-y divide-border-primary">
            <Link to="/about" className="flex items-center justify-between p-4 hover:bg-bg-primary dark:hover:bg-brand-dark transition-all group">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-brand-gray group-hover:text-brand-red transition-colors" />
                <span className="text-sm font-bold text-brand-dark dark:text-white">{t('settings.about')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-gray" />
            </Link>
            <Link to="/contact" className="flex items-center justify-between p-4 hover:bg-bg-primary dark:hover:bg-brand-dark transition-all group">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-gray group-hover:text-brand-red transition-colors" />
                <span className="text-sm font-bold text-brand-dark dark:text-white">{t('settings.contact')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-gray" />
            </Link>
            <Link to="/privacy" className="flex items-center justify-between p-4 hover:bg-bg-primary dark:hover:bg-brand-dark transition-all group">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-brand-gray group-hover:text-brand-red transition-colors" />
                <span className="text-sm font-bold text-brand-dark dark:text-white">Privacy Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-gray" />
            </Link>
          </div>
        </section>

        {/* Logout Section */}
        {user && (
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 p-4 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-red hover:text-white transition-all active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            {t('settings.logout')}
          </button>
        )}
      </div>
    </div>
  );
}
