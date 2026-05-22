'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
interface ThemeCtx { theme: Theme; setTheme: (t: Theme) => void; isDark: boolean; }

const Ctx = createContext<ThemeCtx>({ theme:'light', setTheme:()=>{}, isDark:false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isDark, setIsDark]    = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('atlas_theme') as Theme) || 'light';
    setThemeState(saved);
  }, []);

  useEffect(() => {
    const apply = (t: Theme) => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = t === 'dark' || (t === 'system' && prefersDark);
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply(theme);
    localStorage.setItem('atlas_theme', theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return <Ctx.Provider value={{ theme, setTheme, isDark }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
