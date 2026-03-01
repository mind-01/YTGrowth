import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, LayoutDashboard, Sparkles } from 'lucide-react';
import { TOOLS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

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
          isOpen ? 'bg-brand-red text-white' : 'bg-gray-50 text-brand-gray hover:bg-gray-100'
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
            className="absolute top-full left-0 mt-0 bg-white rounded-b-[2rem] border border-gray-100 shadow-2xl overflow-hidden"
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
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
          : 'hover:bg-red-50/50 text-brand-dark'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        currentToolId === tool.id 
          ? 'bg-brand-red text-white' 
          : 'bg-gray-100 group-hover:bg-brand-red/10 group-hover:text-brand-red text-brand-gray'
      }`}>
        <tool.icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold leading-tight mb-0.5">{tool.name}</p>
        <p className="text-[10px] text-brand-gray leading-tight line-clamp-1 group-hover:text-brand-gray/80">
          {tool.description}
        </p>
      </div>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group mr-4">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-red/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-brand-dark tracking-tighter">YTGrowth</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
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
                    activeMenu === cat.toLowerCase() ? 'bg-brand-red text-white' : 'bg-white text-brand-gray hover:bg-gray-50'
                  }`}
                >
                  <span>{cat}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === cat.toLowerCase() ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeMenu === cat.toLowerCase() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute top-full left-0 mt-0 w-[280px] bg-white rounded-b-2xl border border-gray-100 shadow-2xl overflow-hidden p-4"
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
                  activeMenu === 'all' ? 'bg-brand-red text-white' : 'bg-gray-50 text-brand-gray hover:bg-gray-100'
                }`}
              >
                <span>All Tools 🛠️</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'all' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeMenu === 'all' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[90vw] max-w-[1000px] bg-white rounded-b-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                      <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
                        <input
                          type="text"
                          placeholder="Quick search tools..."
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all shadow-sm"
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
                            <h3 className="text-[11px] font-black text-brand-gray uppercase tracking-[0.25em] border-b border-gray-100 pb-3">
                              {category === 'Analytics' ? 'Analytics & Global' : `${category} Tools`}
                            </h3>
                            <div className="space-y-2">
                              {categoryTools.map(tool => renderToolLink(tool))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-5 bg-brand-dark text-center">
                      <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.3em]">
                        The Ultimate YouTube Growth Suite
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-brand-gray hover:text-brand-dark hover:bg-gray-50 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2 bg-brand-red text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-brand-red/20">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
