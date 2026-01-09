import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { ThemeMode } from '@/types';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>('theme', 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme };
}
