import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Heart, 
  History, 
  Zap, 
  TrendingUp, 
  Mail, 
  Calendar, 
  Shield, 
  ExternalLink,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { TOOLS } from '../constants';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

type TabType = 'account' | 'favorites' | 'futures' | 'results';

export default function UserDashboard() {
  const { user, loading, savedTools, toggleSaveTool } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [toast, setToast] = useState<string | null>(null);

  // Handle toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleToggleSave = async (toolId: string) => {
    const wasSaved = savedTools.includes(toolId);
    await toggleSaveTool(toolId);
    setToast(wasSaved ? 'Removed from saved tools' : 'Added to saved tools');
  };

  // Handle tab from query param
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['account', 'favorites', 'futures', 'results'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EA3323&color=fff`;
  const registrationDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const registrationTime = new Date(user.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: UserIcon },
    { id: 'favorites', label: 'Saved Tools', icon: Bookmark },
    { id: 'futures', label: 'Futures', icon: Zap },
    { id: 'results', label: 'Saved Results', icon: History },
  ] as const;

  const favoritedTools = TOOLS.filter(tool => savedTools.includes(tool.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>
          User <span className="text-brand-red">Dashboard</span>
        </h1>
        <p className="font-medium" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>Manage your account, favorites, and saved data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all group ${
                activeTab === tab.id 
                  ? 'bg-brand-red text-white shadow-xl shadow-brand-red/20' 
                  : 'bg-card-bg border border-border-primary hover:bg-bg-primary'
              }`}
              style={{ color: activeTab === tab.id ? '#FFFFFF' : (theme === 'dark' ? '#A0A0A0' : '#000000') }}
            >
              <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-white' : ''}`} style={{ color: activeTab === tab.id ? '#FFFFFF' : (theme === 'dark' ? '#A0A0A0' : '#606060') }} />
              <span className="uppercase tracking-widest">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="active-pill" className="ml-auto">
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card-bg border border-border-primary rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-brand-dark/5 min-h-[500px]"
            >
              {activeTab === 'account' && (
                <div className="space-y-10">
                  <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-border-primary">
                    <div className="relative">
                      <img 
                        src={avatarUrl} 
                        alt={displayName} 
                        className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-3xl font-black mb-1" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>{displayName}</h2>
                      <p className="font-bold uppercase tracking-widest text-sm mb-4" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>Pro Creator Plan</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                        <span className="px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-black uppercase tracking-widest">
                          Verified
                        </span>
                        <span className="px-4 py-1.5 rounded-full bg-bg-primary text-xs font-black uppercase tracking-widest border border-border-primary" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>
                          Member since 2024
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>Personal Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-primary border border-border-primary">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-red shadow-sm">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>Username</p>
                            <p className="text-sm font-black" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>{displayName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-primary border border-border-primary">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-red shadow-sm">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>Email Address</p>
                            <p className="text-sm font-black" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>{user.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>Account Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-primary border border-border-primary">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-red shadow-sm">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>Registered On</p>
                            <p className="text-sm font-black" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>{registrationDate}</p>
                            <p className="text-[10px] font-bold" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>{registrationTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-primary border border-border-primary">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-red shadow-sm">
                            <Bookmark className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>Saved Tools</p>
                            <p className="text-sm font-black" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>{savedTools.length} Tools</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>Your <span className="text-brand-red">Saved Tools</span></h2>
                    <span className="px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-black uppercase tracking-widest">
                      {favoritedTools.length} Saved
                    </span>
                  </div>

                  {favoritedTools.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoritedTools.map((tool) => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-bg-primary border border-border-primary hover:border-brand-red/30 transition-all group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-red shadow-sm group-hover:scale-110 transition-transform">
                            <tool.icon className="w-6 h-6" />
                          </div>
                          <div className="min-w-0 flex-grow">
                            <p className="text-sm font-black truncate" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>{t(`tool.${tool.id}.name`)}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>{tool.category}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleToggleSave(tool.id);
                            }}
                            className="p-2 rounded-lg hover:bg-brand-red/10 text-brand-red transition-colors"
                          >
                            <BookmarkCheck className="w-4 h-4 fill-current" />
                          </button>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-bg-primary rounded-[2rem] border border-dashed border-border-primary">
                      <Bookmark className="w-12 h-12 text-brand-gray/30 mx-auto mb-4" />
                      <p className="text-brand-gray font-bold">You haven't saved any tools yet.</p>
                      <Link to="/" className="text-brand-red font-black text-sm uppercase tracking-widest hover:underline mt-2 inline-block">
                        Browse Tools
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'futures' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-black" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>Upcoming <span className="text-brand-red">Futures</span></h2>
                  <div className="space-y-4">
                    {[
                      { title: 'AI Video Script Generator', desc: 'Generate full video scripts from a single keyword.', date: 'Coming Q2 2024' },
                      { title: 'Competitor Channel Spy', desc: 'Deep analytics on any YouTube channel in seconds.', date: 'Coming Q3 2024' },
                      { title: 'Thumbnail A/B Testing', desc: 'Test which thumbnail performs better before uploading.', date: 'Coming Q4 2024' },
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-bg-primary border border-border-primary relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                          <Zap className="w-5 h-5 text-brand-red/20 group-hover:text-brand-red transition-colors" />
                        </div>
                        <h3 className="text-lg font-black mb-1" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>{item.title}</h3>
                        <p className="text-sm font-medium mb-4" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>{item.desc}</p>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red bg-brand-red/10 px-3 py-1 rounded-full">
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-black" style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>Saved <span className="text-brand-red">Results</span></h2>
                  <div className="text-center py-20 bg-bg-primary rounded-[2rem] border border-dashed border-border-primary">
                    <Clock className="w-12 h-12 text-brand-gray/30 mx-auto mb-4" />
                    <p className="font-bold" style={{ color: theme === 'dark' ? '#A0A0A0' : '#606060' }}>No saved analysis results found.</p>
                    <p className="text-xs mt-1" style={{ color: theme === 'dark' ? '#606060' : '#909090' }}>Your tool analysis history will appear here.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-brand-dark text-white rounded-2xl shadow-2xl font-bold flex items-center gap-3 border border-white/10"
          >
            <BookmarkCheck className="w-5 h-5 text-brand-red" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
