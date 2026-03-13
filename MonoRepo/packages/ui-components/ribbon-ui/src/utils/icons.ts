/**
 * Icon system for Ribbon UI
 * Uses lucide-react for SVG icons
 */

import * as Icons from 'lucide-react';

export type IconName = keyof typeof Icons;

export interface IconConfig {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

/**
 * Get an icon component by name
 */
export function getIcon(name: IconName | string): any {
  const iconName = String(name) as IconName;

  // Capitalize first letter for icon names (e.g., 'copy' -> 'Copy')
  const componentName = (
    iconName.charAt(0).toUpperCase() + iconName.slice(1)
  ).replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as IconName;

  const Icon = (Icons as any)[componentName];

  if (!Icon) {
    console.warn(`Icon '${name}' not found. Using AlertCircle as fallback.`);
    return Icons.AlertCircle;
  }

  return Icon;
}

/**
 * Check if an icon exists
 */
export function hasIcon(name: string): boolean {
  const componentName = (name.charAt(0).toUpperCase() + name.slice(1)).replace(
    /-([a-z])/g,
    (g) => g[1].toUpperCase()
  ) as IconName;

  return componentName in Icons;
}

/**
 * Get all available icon names
 */
export function getAvailableIcons(): string[] {
  return Object.keys(Icons).filter(
    (key) =>
      typeof (Icons as any)[key] === 'function' &&
      key[0] === key[0].toUpperCase()
  );
}

/**
 * Common icon names used in Ribbon UI
 */
export const COMMON_ICONS = {
  // File operations
  FILE: 'File',
  SAVE: 'Save',
  OPEN: 'FolderOpen',
  NEW: 'FileText',
  PRINT: 'Printer',
  EXPORT: 'Download',
  IMPORT: 'Upload',
  CLOSE: 'X',
  EXIT: 'LogOut',

  // Edit operations
  UNDO: 'RotateCcw',
  REDO: 'RotateCw',
  CUT: 'Scissors',
  COPY: 'Copy',
  PASTE: 'Clipboard',
  DELETE: 'Trash2',
  CLEAR: 'Eraser',

  // Text operations
  BOLD: 'Bold',
  ITALIC: 'Italic',
  UNDERLINE: 'Underline',
  STRIKETHROUGH: 'Type',
  ALIGN_LEFT: 'AlignLeft',
  ALIGN_CENTER: 'AlignCenter',
  ALIGN_RIGHT: 'AlignRight',
  ALIGN_JUSTIFY: 'Justify',
  TEXT_COLOR: 'Type',
  HIGHLIGHT: 'Highlighter',

  // View operations
  ZOOM_IN: 'ZoomIn',
  ZOOM_OUT: 'ZoomOut',
  FULLSCREEN: 'Maximize2',
  MINIMIZE: 'Minimize2',
  SIDEBAR: 'Menu',
  VIEW: 'Eye',
  HIDE: 'EyeOff',

  // Navigation
  PREVIOUS: 'ChevronLeft',
  NEXT: 'ChevronRight',
  UP: 'ChevronUp',
  DOWN: 'ChevronDown',
  HOME: 'Home',
  SETTINGS: 'Settings',
  HELP: 'HelpCircle',
  INFO: 'Info',
  SEARCH: 'Search',

  // Status
  CHECK: 'Check',
  X: 'X',
  WARNING: 'AlertTriangle',
  ERROR: 'AlertCircle',
  SUCCESS: 'CheckCircle',
  INFO_CIRCLE: 'Info',
  LOADING: 'Loader',

  // Manufacturing specific
  BOX: 'Box',
  PACKAGE: 'Package',
  TRUCK: 'Truck',
  CALENDAR: 'Calendar',
  CLOCK: 'Clock',
  TIMER: 'Timer',
  PERCENT: 'Percent',
  DOLLAR: 'DollarSign',
  CHART: 'BarChart3',
  GRAPH: 'TrendingUp',
  FILTER: 'Filter',
  SORT: 'ArrowUpDown',
  STAR: 'Star',
  FLAG: 'Flag',
  TAG: 'Tag',

  // User/Account
  USER: 'User',
  USERS: 'Users',
  ACCOUNT: 'User',
  LOGIN: 'LogIn',
  LOGOUT: 'LogOut',
  LOCK: 'Lock',
  UNLOCK: 'Unlock',
  KEY: 'Key',

  // Tools
  WRENCH: 'Wrench',
  TOOL: 'Tool',
  HAMMER: 'Hammer2',
  SLIDERS: 'Sliders',

  // Social
  GITHUB: 'Github',
  GLOBE: 'Globe',
  LINK: 'Link',
  SHARE: 'Share2',
  MAIL: 'Mail',
  PHONE: 'Phone',
} as const;

/**
 * Manufacturing-specific icon names
 */
export const MANUFACTURING_ICONS = {
  PRODUCTION: 'Factory',
  QUALITY: 'ShieldCheck',
  INVENTORY: 'Package',
  SHIPPING: 'Truck',
  DELIVERY: 'TrendingUp',
  SCHEDULE: 'Calendar',
  TASK: 'CheckSquare',
  BATCH: 'Layers',
  ASSEMBLY: 'GitMerge',
  TESTING: 'TestTube2',
  DOCUMENTATION: 'FileText',
  APPROVAL: 'CheckCircle',
  REJECTION: 'XCircle',
  PENDING: 'Clock',
  COMPLETED: 'CheckCircle2',
} as const;

/**
 * Size mapping
 */
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;
