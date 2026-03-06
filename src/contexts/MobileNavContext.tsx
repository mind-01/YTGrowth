import React, { createContext, useContext, useState } from 'react';

export type MobileTab = 'Home' | 'Video' | 'Shorts' | 'Analytics' | 'Profile';

interface MobileNavContextType {
  activeTab: MobileTab;
  setActiveTab: (tab: MobileTab) => void;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (isOpen: boolean) => void;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<MobileTab>('Home');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <MobileNavContext.Provider value={{ activeTab, setActiveTab, isProfileMenuOpen, setIsProfileMenuOpen }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const context = useContext(MobileNavContext);
  if (context === undefined) {
    throw new Error('useMobileNav must be used within a MobileNavProvider');
  }
  return context;
}
