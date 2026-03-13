/**
 * useTheme hook - Manage theme switching
 */

import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types/index';

export function useTheme(initialTheme?: Theme) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (initialTheme) return initialTheme;

    if (typeof window === 'undefined') return 'light';

    // Check localStorage
    const saved = localStorage.getItem('ribbon-theme') as Theme | null;
    if (saved && ['light', 'dark', 'accessible'].includes(saved)) {
      return saved;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  const setCurrentTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);

      if (typeof window !== 'undefined') {
        localStorage.setItem('ribbon-theme', newTheme);

        // Update document class
        document.documentElement.className = document.documentElement.className
          .replace(/ribbon-(light|dark|accessible)/g, '')
          .trim();
        document.documentElement.classList.add(`ribbon-${newTheme}`);
      }
    },
    []
  );

  // Apply theme on mount and change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.className = document.documentElement.className
      .replace(/ribbon-(light|dark|accessible)/g, '')
      .trim();
    document.documentElement.classList.add(`ribbon-${theme}`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setCurrentTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setCurrentTheme]);

  const toggleAccessible = useCallback(() => {
    setCurrentTheme(theme === 'accessible' ? 'light' : 'accessible');
  }, [theme, setCurrentTheme]);

  return {
    theme,
    setTheme: setCurrentTheme,
    toggleTheme,
    toggleAccessible,
  };
}
