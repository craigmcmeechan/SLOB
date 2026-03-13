/**
 * Base component utilities for the Ribbon UI system
 * Provides common functionality for all components
 */

export interface BaseComponentProps {
  /** CSS class name */
  className?: string;
  /** Data test ID for testing */
  'data-testid'?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA description */
  'aria-description'?: string;
  /** ARIA expanded state */
  'aria-expanded'?: boolean;
  /** ARIA pressed state */
  'aria-pressed'?: boolean;
  /** ARIA disabled state */
  'aria-disabled'?: boolean;
  /** ARIA hidden state */
  'aria-hidden'?: boolean;
  /** Role for accessibility */
  role?: string;
  /** Tab index */
  tabIndex?: number;
  /** Custom data attributes */
  [key: string]: any;
}

export interface ComponentConfig {
  /** Component display name */
  displayName: string;
  /** Component version */
  version: string;
  /** Component namespace */
  namespace: string;
}

/**
 * Get accessible attributes from props
 */
export function getAccessibilityProps(props: BaseComponentProps) {
  return {
    'aria-label': props['aria-label'],
    'aria-description': props['aria-description'],
    'aria-expanded': props['aria-expanded'],
    'aria-pressed': props['aria-pressed'],
    'aria-disabled': props['aria-disabled'],
    'aria-hidden': props['aria-hidden'],
    role: props.role,
    tabIndex: props.tabIndex,
  };
}

/**
 * Merge CSS classes safely
 */
export function mergeClasses(...classes: (string | undefined | false | null)[]): string {
  return classes
    .filter((cls): cls is string => typeof cls === 'string' && cls.length > 0)
    .join(' ');
}

/**
 * Create a component config
 */
export function createComponentConfig(
  displayName: string,
  version: string,
  namespace: string = 'ribbon-ui'
): ComponentConfig {
  return {
    displayName,
    version,
    namespace,
  };
}

/**
 * Validate required props
 */
export function validateRequired<T extends Record<string, any>>(
  props: T,
  required: (keyof T)[]
): void {
  const missing = required.filter((key) => props[key] === undefined || props[key] === null);

  if (missing.length > 0) {
    throw new Error(
      `Required props missing: ${missing.map((k) => String(k)).join(', ')}`
    );
  }
}
