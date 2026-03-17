import React, { useState } from 'react';
import { Settings, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, COLORS } from '../contexts/ThemeContext';

export default function Customizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, accentColor, setTheme, setAccentColor } = useTheme();

  return (
    <>
      {/* Floating Toggle Button - Hidden on mobile, visible on desktop */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-brand-red text-white p-3 rounded-l-2xl shadow-2xl hover:pr-5 transition-all group hidden lg:block"
        aria-label="Customize Website"
      >
        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {/* Customizer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-[#1A202C] z-[60] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-brand-red p-4 flex items-center justify-between">
              <h2 className="text-white font-black uppercase tracking-wider text-lg">Customize Website</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-brand-dark/20 text-white p-1 rounded-full hover:bg-brand-dark/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Color Swatches */}
              <div className="space-y-4">
                <h3 className="text-white text-sm font-black uppercase tracking-widest">Color Swatches</h3>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                        accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1A202C] scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="space-y-4">
                <h3 className="text-white text-sm font-black uppercase tracking-widest">Theme</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                      theme === 'light' 
                        ? 'bg-[#2D3748] text-white' 
                        : 'bg-[#2D3748]/50 text-gray-400 border border-gray-700 hover:text-gray-300'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                      theme === 'dark' 
                        ? 'bg-brand-red text-white' 
                        : 'bg-[#2D3748]/50 text-gray-400 border border-gray-700 hover:text-gray-300'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Footer / Info */}
            <div className="mt-auto p-6 border-t border-gray-800">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest text-center">
                YTGrowth Customizer v1.0
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>
    </>
  );
}
