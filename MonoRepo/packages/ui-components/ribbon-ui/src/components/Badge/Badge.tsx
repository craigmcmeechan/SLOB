/**
 * Badge Component
 * Small label for status, counts, or notifications
 */

import React from 'react';
import { mergeClasses } from '../base';
import './Badge.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  outline?: boolean;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Badge Component
 * Small visual indicator with variant support
 */
export const Badge = React.memo<BadgeProps>(
  (
    {
      children,
      variant = 'default',
      size = 'medium',
      outline = false,
      dot = false,
      className,
      style,
    } => {
      const badgeClasses = mergeClasses(
        'ribbon-badge',
        `ribbon-badge--${variant}`,
        `ribbon-badge--${size}`,
        outline && 'ribbon-badge--outline',
        dot && 'ribbon-badge--dot',
        className
      );

      return (
        <span
          className={badgeClasses}
          style={style}
        >
          {!dot && children}
        </span>
      );
    }
  )
);

Badge.displayName = 'Badge';
