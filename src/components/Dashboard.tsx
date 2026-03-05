import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, LayoutGrid, List, Bookmark, BookmarkCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { TOOLS, Tool } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, savedTools, toggleSaveTool, isSaved } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const location = useLocation();

  const categories = ['All', 'Saved', 'SEO', 'Content', 'Channel', 'Analytics'];

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    
    if (activeCategory === 'Saved') {
      matchesCategory = savedTools.includes(tool.id);
    }

    return matchesSearch && matchesCategory;
  });

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
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 mb-4 rounded-full bg-brand-red/10 text-brand-red text-sm font-semibold tracking-wide uppercase"
        >
          {t('hero.badge')}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold text-brand-dark tracking-tight mb-4"
        >
          {t('hero.title')} <br />
          <span className="text-brand-red">{t('hero.subtitle')}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-brand-gray max-w-2xl mx-auto"
        >
          {t('hero.description')}
        </motion.p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-gray w-5 h-5" />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            className="input-field !pl-14"
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
                    "group block bg-card-bg rounded-2xl border border-border-primary p-6 card-hover",
                    viewMode === 'list' && "flex items-center gap-6"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                    "bg-bg-primary group-hover:bg-brand-red/10 text-brand-gray group-hover:text-brand-red",
                    viewMode === 'list' && "mb-0 shrink-0"
                  )}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-brand-dark group-hover:text-brand-red transition-colors">
                        {t(`tool.${tool.id}.name`)}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-bg-primary text-brand-gray">
                        {t(`cat.${tool.category.toLowerCase()}`)}
                      </span>
                    </div>
                    <p className="text-sm text-brand-gray line-clamp-2">
                      {t(`tool.${tool.id}.desc`)}
                    </p>
                  </div>
                </Link>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSaveTool(tool.id);
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
    </div>
  );
}
