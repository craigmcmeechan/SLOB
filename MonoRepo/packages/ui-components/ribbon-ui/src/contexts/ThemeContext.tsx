/**
 * ThemeContext - Provides theme management across the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { Theme } from '../types/index';
import { useTheme } from '../hooks/useTheme';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleAccessible: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

/**
 * ThemeProvider - Wrap your app with this to provide theme context
 */
export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const themeState = useTheme(initialTheme);

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useThemeContext - Use theme context in components
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      'useThemeContext must be used within a ThemeProvider'
    );
  }

  return context;
}
