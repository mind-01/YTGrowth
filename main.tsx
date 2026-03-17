import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  accentColor: string;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const COLORS = [
  '#3B82F6', // Blue
  '#3F51B5', // Indigo
  '#ee2424ff', // Red
  '#10B981', // Green
  '#ff4d00ff', // Dark/Blackish
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('ytgrowth-theme');
    return (saved as Theme) || 'light';
  });

  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('ytgrowth-accent');
    return saved || COLORS[2]; // Default to Red
  });

  useEffect(() => {
    localStorage.setItem('ytgrowth-theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ytgrowth-accent', accentColor);
    document.documentElement.style.setProperty('--brand-color', accentColor);
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
