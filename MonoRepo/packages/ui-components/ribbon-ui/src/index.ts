/**
 * Ribbon UI Component Suite
 * Main export file for Phase 1: Foundation
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export * from './components/base';

// ============================================================================
// TYPES
// ============================================================================

export type {
  Theme,
  ThemeConfig,
  LocaleCode,
  LocaleConfig,
  LocaleMessages,
  CommonProps,
  AccessibleProps,
  InteractiveProps,
  ControlType,
  ControlConfig,
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  RibbonTab,
  RibbonGroup,
  RibbonConfig,
  WindowConfig,
  WindowState,
  UISchema,
  ToolbarConfig,
  SidebarConfig,
  SidebarTab,
  Command,
  CommandContext,
  UIState,
  StateChangeEvent,
  IconProps,
  TooltipProps,
  TooltipPosition,
  MenuItem,
  MenuConfig,
} from './types/index';

export { ControlType, WindowState } from './types/index';

// ============================================================================
// i18n (INTERNATIONALIZATION)
// ============================================================================

export {
  AVAILABLE_LOCALES,
  LOCALE_MESSAGES,
  t,
  formatMessage,
  getLocaleMessages,
  isSupportedLocale,
  getDefaultLocale,
  detectLocale,
} from './i18n/index';

// ============================================================================
// HOOKS
// ============================================================================

export { useTheme } from './hooks/useTheme';
export { useLocalization } from './hooks/useLocalization';

// ============================================================================
// CONTEXTS & PROVIDERS
// ============================================================================

export { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
export type { ThemeProviderProps } from './contexts/ThemeContext';

export {
  LocalizationProvider,
  useLocalizationContext,
} from './contexts/LocalizationContext';
export type { LocalizationProviderProps } from './contexts/LocalizationContext';

// ============================================================================
// ICONS
// ============================================================================

export {
  getIcon,
  hasIcon,
  getAvailableIcons,
  COMMON_ICONS,
  MANUFACTURING_ICONS,
  ICON_SIZES,
} from './utils/icons';
export type { IconName, IconConfig } from './utils/icons';

// ============================================================================
// STYLES
// ============================================================================

// Import CSS files
import './styles/variables.css';
import './styles/themes/light.css';
import './styles/themes/dark.css';
import './styles/themes/accessible.css';

// ============================================================================
// VERSION INFO
// ============================================================================

export const VERSION = '0.1.0';
export const LIBRARY_NAME = '@ribbon-ui/core';
export const PHASE = 'Phase 1: Foundation';
