/**
 * useLocalization hook - Manage language switching
 */

import { useState, useEffect, useCallback } from 'react';
import { LocaleCode, LocaleMessages } from '../types/index';
import {
  AVAILABLE_LOCALES,
  LOCALE_MESSAGES,
  t,
  formatMessage,
  detectLocale,
  isSupportedLocale,
} from '../i18n/index';

export function useLocalization(initialLocale?: LocaleCode) {
  const [locale, setLocale] = useState<LocaleCode>(() => {
    if (initialLocale && isSupportedLocale(initialLocale)) {
      return initialLocale;
    }

    if (typeof window === 'undefined') return 'en';

    // Check localStorage
    const saved = localStorage.getItem('ribbon-locale') as LocaleCode | null;
    if (saved && isSupportedLocale(saved)) {
      return saved;
    }

    // Detect from browser
    return detectLocale();
  });

  const setCurrentLocale = useCallback((newLocale: LocaleCode) => {
    if (!isSupportedLocale(newLocale)) {
      console.warn(`Locale '${newLocale}' is not supported`);
      return;
    }

    setLocale(newLocale);

    if (typeof window !== 'undefined') {
      localStorage.setItem('ribbon-locale', newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  // Set document language on mount and change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.lang = locale;
  }, [locale]);

  const translate = useCallback(
    (key: string, defaultValue?: string) => {
      return t(locale, key, defaultValue);
    },
    [locale]
  );

  const format = useCallback(
    (key: string, variables?: Record<string, string | number>) => {
      return formatMessage(locale, key, variables);
    },
    [locale]
  );

  const messages = LOCALE_MESSAGES[locale];

  return {
    locale,
    setLocale: setCurrentLocale,
    t: translate,
    format,
    messages,
    availableLocales: AVAILABLE_LOCALES,
  };
}
