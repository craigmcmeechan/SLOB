/**
 * Separator Component
 * Visual divider between content sections
 */

import React from 'react';
import { mergeClasses } from '../base';
import './Separator.css';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'light' | 'strong';
  spacing?: 'compact' | 'normal' | 'loose';
  className?: string;
  style?: React.CSSProperties;
  'aria-orientation'?: 'horizontal' | 'vertical';
  role?: string;
}

/**
 * Separator Component
 * Flexible divider for visual grouping
 */
export const Separator = React.memo<SeparatorProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'default',
      spacing = 'normal',
      className,
      style,
      'aria-orientation': ariaOrientation,
      role = 'separator',
    } => {
      const separatorClasses = mergeClasses(
        'ribbon-separator',
        `ribbon-separator--${orientation}`,
        `ribbon-separator--${variant}`,
        `ribbon-separator--spacing-${spacing}`,
        className
      );

      return (
        <div
          className={separatorClasses}
          style={style}
          role={role}
          aria-orientation={ariaOrientation || orientation}
        />
      );
    }
  )
);

Separator.displayName = 'Separator';
