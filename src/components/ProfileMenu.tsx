import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Heart, LogOut, X, ChevronRight, Bookmark, LogIn } from 'lucide-react';
import { useMobileNav } from '../contexts/MobileNavContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu() {
  const { isProfileMenuOpen, setIsProfileMenuOpen } = useMobileNav();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EA3323&color=fff`;

  const menuItems = [
    { label: 'Account', icon: User, path: '/user-dashboard' },
    { label: 'Favorites', icon: Heart, path: '/user-dashboard' },
    { label: 'Saved Tools', icon: Bookmark, path: '/user-dashboard' },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsProfileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  const handleSignIn = () => {
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isProfileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card-bg rounded-t-[2.5rem] z-[70] p-8 pb-12 md:hidden border-t border-border-primary shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              {user ? (
                <div className="flex items-center gap-4">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-12 h-12 rounded-2xl border-2 border-brand-red/20 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-black text-zinc-950 dark:text-white leading-none mb-1">{displayName}</h3>
                    <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Pro Creator</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-bg-primary dark:bg-bg-primary/50 flex items-center justify-center text-brand-gray">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-zinc-950 dark:text-white leading-none mb-1">Guest User</h3>
                    <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Sign in to sync data</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="p-2 bg-bg-primary dark:bg-bg-primary/50 rounded-xl text-brand-gray hover:text-brand-red transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="space-y-3">
              {user ? (
                <>
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleItemClick(item.path)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-bg-primary dark:bg-bg-primary/30 border border-border-primary hover:border-brand-red/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-bg-primary flex items-center justify-center text-brand-red shadow-sm group-hover:scale-110 transition-transform">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-widest">{item.label}</span>
                      <ChevronRight className="ml-auto w-4 h-4 text-brand-gray" />
                    </button>
                  ))}

                  <div className="pt-4 mt-4 border-t border-border-primary">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-brand-red/5 border border-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-bg-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <LogOut className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-brand-red uppercase tracking-widest">Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-brand-red text-white shadow-lg shadow-brand-red/20 hover:bg-red-600 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Sign In / Sign Up</span>
                  <ChevronRight className="ml-auto w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
