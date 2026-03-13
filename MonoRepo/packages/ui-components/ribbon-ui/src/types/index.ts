/**
 * Global type definitions for Ribbon UI
 */

/* ============================================================================
   Theme Types
   ============================================================================ */

export type Theme = 'light' | 'dark' | 'accessible';

export interface ThemeConfig {
  current: Theme;
  available: Theme[];
  customColors?: Record<string, string>;
}

/* ============================================================================
   Locale Types
   ============================================================================ */

export type LocaleCode = 'en' | 'es' | 'fr' | 'de';

export interface LocaleConfig {
  current: LocaleCode;
  available: LocaleCode[];
  messages: Record<string, string>;
}

export type LocaleMessages = Record<LocaleCode, Record<string, string>>;

/* ============================================================================
   Component Props Types
   ============================================================================ */

export interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

export interface AccessibleProps {
  'aria-label'?: string;
  'aria-description'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}

export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

/* ============================================================================
   Control Types
   ============================================================================ */

export enum ControlType {
  BUTTON = 'button',
  TOGGLE = 'toggle',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DROPDOWN = 'dropdown',
  MENU = 'menu',
  SPLIT_BUTTON = 'splitButton',
  GALLERY = 'gallery',
  SPINNER = 'spinner',
  COMBO_BOX = 'comboBox',
  INPUT = 'input',
  DATE_PICKER = 'datePicker',
  COLOR_PICKER = 'colorPicker',
  SLIDER = 'slider',
  SEPARATOR = 'separator',
  LABEL = 'label',
  HELP_ICON = 'helpIcon',
}

export interface ControlConfig {
  id: string;
  type: ControlType;
  label?: string;
  tooltip?: string;
  icon?: string;
  disabled?: boolean;
  visible?: boolean;
  properties?: Record<string, any>;
}

/* ============================================================================
   Button Types
   ============================================================================ */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends CommonProps, AccessibleProps, InteractiveProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

/* ============================================================================
   Ribbon Types
   ============================================================================ */

export interface RibbonTab {
  id: string;
  label: string;
  icon?: string;
  groups: RibbonGroup[];
}

export interface RibbonGroup {
  id: string;
  label: string;
  controls: ControlConfig[];
  columns?: number;
}

export interface RibbonConfig {
  tabs: RibbonTab[];
  activeTabId?: string;
  collapsible?: boolean;
}

/* ============================================================================
   Window Types
   ============================================================================ */

export enum WindowState {
  NORMAL = 'normal',
  MINIMIZED = 'minimized',
  MAXIMIZED = 'maximized',
  FULLSCREEN = 'fullscreen',
}

export interface WindowConfig {
  title: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  state?: WindowState;
  resizable?: boolean;
  movable?: boolean;
  closeable?: boolean;
}

/* ============================================================================
   JSON UI Schema Types
   ============================================================================ */

export interface UISchema {
  version: '1.0';
  name: string;
  description?: string;
  ribbon?: RibbonConfig;
  toolbar?: ToolbarConfig;
  sidebar?: SidebarConfig;
  theme?: Theme;
  locale?: LocaleCode;
}

export interface ToolbarConfig {
  visible?: boolean;
  items: ControlConfig[];
  position?: 'top' | 'bottom';
}

export interface SidebarConfig {
  visible?: boolean;
  width?: number;
  tabs: SidebarTab[];
  position?: 'left' | 'right';
}

export interface SidebarTab {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
}

/* ============================================================================
   Command System Types
   ============================================================================ */

export interface Command {
  id: string;
  label: string;
  category?: string;
  description?: string;
  icon?: string;
  keybinding?: string;
  execute: () => void | Promise<void>;
  canExecute?: () => boolean;
}

export interface CommandContext {
  commands: Map<string, Command>;
  execute: (commandId: string) => Promise<void>;
  registerCommand: (command: Command) => void;
  unregisterCommand: (commandId: string) => void;
}

/* ============================================================================
   State Management Types
   ============================================================================ */

export interface UIState {
  theme: Theme;
  locale: LocaleCode;
  windowState?: WindowState;
  sidebarVisible?: boolean;
  ribbonCollapsed?: boolean;
}

export interface StateChangeEvent {
  type: string;
  previousValue: any;
  newValue: any;
  timestamp: number;
}

/* ============================================================================
   Icon Types
   ============================================================================ */

export interface IconProps extends CommonProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  rotation?: 0 | 90 | 180 | 270;
  loading?: boolean;
}

/* ============================================================================
   Tooltip Types
   ============================================================================ */

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps extends CommonProps {
  content: string;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
}

/* ============================================================================
   Menu Types
   ============================================================================ */

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  submenu?: MenuItem[];
  disabled?: boolean;
  checked?: boolean;
  onSelect?: () => void;
}

export interface MenuConfig {
  items: MenuItem[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
