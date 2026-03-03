import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TOOLS, Tool } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const location = useLocation();

  const categories = ['All', 'SEO', 'Content', 'Channel', 'Analytics'];

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
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
          className="inline-block px-4 py-1.5 mb-4 rounded-full bg-red-50 text-red-600 text-sm font-semibold tracking-wide uppercase"
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            className="input-field pl-12"
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
                  ? "bg-brand-dark text-white shadow-lg"
                  : "bg-white text-brand-gray hover:bg-gray-100 border border-gray-200"
              )}
            >
              {t(`cat.${cat.toLowerCase()}`)}
            </button>
          ))}
          <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />
          <div className="flex bg-white border border-gray-200 rounded-full p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-full transition-all",
                viewMode === 'grid' ? "bg-gray-100 text-brand-dark" : "text-gray-400"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-full transition-all",
                viewMode === 'list' ? "bg-gray-100 text-brand-dark" : "text-gray-400"
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
              <Link
                to={tool.path}
                className={cn(
                  "group block bg-white rounded-2xl border border-gray-100 p-6 card-hover",
                  viewMode === 'list' && "flex items-center gap-6"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                  "bg-gray-50 group-hover:bg-red-50 text-brand-gray group-hover:text-brand-red",
                  viewMode === 'list' && "mb-0 shrink-0"
                )}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-brand-dark group-hover:text-brand-red transition-colors">
                      {t(`tool.${tool.id}.name`)}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                      {t(`cat.${tool.category.toLowerCase()}`)}
                    </span>
                  </div>
                  <p className="text-sm text-brand-gray line-clamp-2">
                    {t(`tool.${tool.id}.desc`)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredTools.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-brand-dark">{t('dashboard.no_tools')}</h3>
          <p className="text-brand-gray">{t('dashboard.no_tools_desc')}</p>
        </div>
      )}
    </div>
  );
}
