/**
 * i18n - Internationalization system for Ribbon UI
 * Supports: English (en), Spanish (es), French (fr), German (de)
 */

import { LocaleCode, LocaleMessages } from '../types/index';

// Import locale files
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';
import frCommon from './locales/fr/common.json';
import deCommon from './locales/de/common.json';

/**
 * All available locales
 */
export const AVAILABLE_LOCALES: LocaleCode[] = ['en', 'es', 'fr', 'de'];

/**
 * All locale messages
 */
export const LOCALE_MESSAGES: LocaleMessages = {
  en: enCommon,
  es: esCommon,
  fr: frCommon,
  de: deCommon,
};

/**
 * Get a translated message
 * @param locale - Locale code
 * @param key - Translation key (dot notation supported: 'ribbon.home')
 * @param defaultValue - Default value if key not found
 */
export function t(
  locale: LocaleCode,
  key: string,
  defaultValue?: string
): string {
  const messages = LOCALE_MESSAGES[locale];

  if (!messages) {
    console.warn(`Locale '${locale}' not found`);
    return defaultValue || key;
  }

  const keys = key.split('.');
  let value: any = messages;

  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = value[k];
    } else {
      return defaultValue || key;
    }
  }

  return typeof value === 'string' ? value : defaultValue || key;
}

/**
 * Format a localized string with variables
 * @param locale - Locale code
 * @param key - Translation key
 * @param variables - Variables to replace (e.g., { name: 'John' })
 */
export function formatMessage(
  locale: LocaleCode,
  key: string,
  variables?: Record<string, string | number>
): string {
  let message = t(locale, key);

  if (!variables) return message;

  Object.entries(variables).forEach(([varKey, value]) => {
    const placeholder = `{${varKey}}`;
    message = message.replace(new RegExp(placeholder, 'g'), String(value));
  });

  return message;
}

/**
 * Get all messages for a locale
 */
export function getLocaleMessages(locale: LocaleCode): Record<string, any> {
  return LOCALE_MESSAGES[locale] || LOCALE_MESSAGES.en;
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is LocaleCode {
  return AVAILABLE_LOCALES.includes(locale as LocaleCode);
}

/**
 * Get the default locale (English)
 */
export function getDefaultLocale(): LocaleCode {
  return 'en';
}

/**
 * Detect locale from navigator
 */
export function detectLocale(): LocaleCode {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const browserLocale = navigator.language || navigator.languages?.[0] || 'en';
  const primaryLocale = browserLocale.split('-')[0].toLowerCase();

  if (isSupportedLocale(primaryLocale)) {
    return primaryLocale;
  }

  return 'en';
}
