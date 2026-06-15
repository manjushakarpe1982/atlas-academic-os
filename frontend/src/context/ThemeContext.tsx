'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeCtx { theme: Theme; setTheme: (t: Theme) => void; }

const ThemeContext = createContext<ThemeCtx>({ theme: 'light', setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Read saved theme on mount
  useEffect(() => {
    const saved = (localStorage.getItem('atlas-theme') || 'light') as Theme;
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('atlas-theme', t);
    applyTheme(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() { return useContext(ThemeContext); }

function applyTheme(theme: Theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const root = document.getElementById('atlas-root');
  if (!root) return;

  if (isDark) {
    root.style.filter = 'invert(1) hue-rotate(180deg)';
    root.style.backgroundColor = '#000';
  } else {
    root.style.filter = '';
    root.style.backgroundColor = '';
  }
}
