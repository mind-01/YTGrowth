import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, LayoutGrid, List, Bookmark, BookmarkCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useMobileNav } from '../contexts/MobileNavContext';
import { TOOLS, Tool } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, loading, savedTools, toggleSaveTool, isSaved } = useAuth();
  const { activeTab } = useMobileNav();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toast, setToast] = useState<string | null>(null);
  const location = useLocation();

  const categories = ['All', 'Saved', 'SEO', 'Content', 'Channel', 'Analytics'];

  // Mobile filtering logic
  const getMobileFilteredTools = (tools: Tool[]) => {
    // Only apply mobile filtering on small screens
    if (window.innerWidth >= 768) return tools;

    switch (activeTab) {
      case 'Video':
        return tools.filter(t => [
          'title-gen', 'desc-gen', 'video-ideas', 'script-gen', 
          'thumb-maker', 'thumb-score', 'best-time', 'name-ideas',
          'seo-check', 'keyword-res'
        ].includes(t.id));
      case 'Shorts':
        return tools.filter(t => [
          'shorts-ideas', 'hook-gen', 'tag-gen', 'hash-gen'
        ].includes(t.id));
      case 'Analytics':
        return tools.filter(t => [
          'analytics-dash', 'comp-spy', 'trending-topics', 
          'sentiment', 'global-reach', 'audit', 'monetization'
        ].includes(t.id));
      default:
        return tools;
    }
  };

  const filteredTools = getMobileFilteredTools(TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    
    if (activeCategory === 'Saved') {
      matchesCategory = savedTools.includes(tool.id);
    }

    return matchesSearch && matchesCategory;
  }));

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleToggleSave = async (toolId: string) => {
    if (loading) return;
    if (!user) {
      setToast('Please sign in to save tools');
      return;
    }
    const wasSaved = isSaved(toolId);
    await toggleSaveTool(toolId);
    setToast(wasSaved ? 'Removed from saved tools' : 'Added to saved tools');
  };

  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16">
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-base sm:text-lg font-bold text-brand-dark tracking-tight leading-tight">
              Hello <span className="text-brand-red">{user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Creator'}</span>, ready to grow?
            </h1>
          </motion.div>
        ) : (
          <>
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-dark tracking-tight mb-4 sm:mb-6 leading-tight"
            >
              {t('hero.title')} <br className="hidden sm:block" />
              <span className="text-brand-red">{t('hero.subtitle')}</span>
            </h1>
            <p
              className="text-base sm:text-lg lg:text-xl text-brand-gray/80 max-w-4xl mx-auto px-4 font-normal leading-relaxed"
            >
              {t('hero.description').split(/[।.]\s+/).map((sentence, i, arr) => (
                <React.Fragment key={i}>
                  {sentence}{i < arr.length - 1 ? (t('hero.description').includes('।') ? '। ' : '. ') : ''}
                  {i === 0 && <br className="hidden md:block" />}
                </React.Fragment>
              ))}
            </p>
          </>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between mb-6 sm:mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-brand-gray w-4 h-4 sm:w-5 h-5" />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            className="input-field !pl-11 sm:!pl-14 !py-2.5 sm:!py-3 text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-brand-red text-white shadow-lg"
                  : "bg-card-bg text-brand-gray hover:bg-bg-primary border border-border-primary"
              )}
            >
              {t(`cat.${cat.toLowerCase()}`)}
            </button>
          ))}
          <div className="h-8 w-px bg-border-primary mx-2 hidden md:block" />
          <div className="flex bg-card-bg border border-border-primary rounded-full p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-full transition-all",
                viewMode === 'grid' ? "bg-bg-primary text-brand-dark" : "text-gray-400"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-full transition-all",
                viewMode === 'list' ? "bg-bg-primary text-brand-dark" : "text-gray-400"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              id={tool.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="relative group">
                <Link
                  to={tool.path}
                  className={cn(
                    "group block bg-card-bg rounded-2xl border border-border-primary p-5 sm:p-6 card-hover",
                    viewMode === 'list' && "flex items-center gap-4 sm:gap-6"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-colors",
                    "bg-bg-primary group-hover:bg-brand-red/10 text-brand-gray group-hover:text-brand-red",
                    viewMode === 'list' && "mb-0 shrink-0"
                  )}>
                    <tool.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <h3 className="font-bold text-brand-dark group-hover:text-brand-red transition-colors text-sm sm:text-base truncate">
                        {t(`tool.${tool.id}.name`)}
                      </h3>
                      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-bg-primary text-brand-gray shrink-0">
                        {t(`cat.${tool.category.toLowerCase()}`)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-gray line-clamp-2 leading-relaxed">
                      {t(`tool.${tool.id}.desc`)}
                    </p>
                  </div>
                </Link>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleSave(tool.id);
                  }}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-xl transition-all z-10",
                    isSaved(tool.id) 
                      ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" 
                      : "bg-bg-primary text-brand-gray hover:text-brand-red hover:bg-brand-red/10 opacity-0 group-hover:opacity-100"
                  )}
                  title={isSaved(tool.id) ? "Remove from saved" : "Save tool"}
                >
                  {isSaved(tool.id) ? (
                    <BookmarkCheck className="w-4 h-4 fill-current" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredTools.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeCategory === 'Saved' ? (
              <Bookmark className="text-brand-gray w-8 h-8" />
            ) : (
              <Search className="text-brand-gray w-8 h-8" />
            )}
          </div>
          <h3 className="text-xl font-bold text-brand-dark">
            {activeCategory === 'Saved' ? 'No saved tools yet' : t('dashboard.no_tools')}
          </h3>
          <p className="text-brand-gray">
            {activeCategory === 'Saved' 
              ? 'Click the bookmark icon on any tool card to save it here for quick access.' 
              : t('dashboard.no_tools_desc')}
          </p>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-brand-dark text-white rounded-2xl shadow-2xl font-bold flex items-center gap-3 border border-white/10"
          >
            <BookmarkCheck className="w-5 h-5 text-brand-red" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
