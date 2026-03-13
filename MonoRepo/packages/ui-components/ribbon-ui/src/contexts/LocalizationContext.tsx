/**
 * LocalizationContext - Provides localization management across the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { LocaleCode, LocaleMessages } from '../types/index';
import { useLocalization } from '../hooks/useLocalization';

interface LocalizationContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string, defaultValue?: string) => string;
  format: (key: string, variables?: Record<string, string | number>) => string;
  messages: LocaleMessages[LocaleCode];
  availableLocales: LocaleCode[];
}

const LocalizationContext = createContext<LocalizationContextValue | undefined>(
  undefined
);

export interface LocalizationProviderProps {
  children: ReactNode;
  initialLocale?: LocaleCode;
}

/**
 * LocalizationProvider - Wrap your app with this to provide localization context
 */
export function LocalizationProvider({
  children,
  initialLocale,
}: LocalizationProviderProps) {
  const localizationState = useLocalization(initialLocale);

  return (
    <LocalizationContext.Provider value={localizationState}>
      {children}
    </LocalizationContext.Provider>
  );
}

/**
 * useLocalizationContext - Use localization context in components
 */
export function useLocalizationContext(): LocalizationContextValue {
  const context = useContext(LocalizationContext);

  if (context === undefined) {
    throw new Error(
      'useLocalizationContext must be used within a LocalizationProvider'
    );
  }

  return context;
}
