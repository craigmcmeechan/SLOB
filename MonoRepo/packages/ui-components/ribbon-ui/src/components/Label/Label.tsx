/**
 * Label Component
 * Display text label with optional icon and alignment
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './Label.css';

export interface LabelProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'muted' | 'error' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  nowrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

/**
 * Label Component
 * Simple text display with theming support
 */
export const Label = React.memo<LabelProps>(
  (
    {
      children,
      variant = 'default',
      size = 'medium',
      weight = 'normal',
      align = 'left',
      truncate = false,
      nowrap = false,
      className,
      style,
      'aria-label': ariaLabel,
    } => {
      const labelClasses = mergeClasses(
        'ribbon-label',
        `ribbon-label--${variant}`,
        `ribbon-label--${size}`,
        `ribbon-label--${weight}`,
        `ribbon-label--${align}`,
        truncate && 'ribbon-label--truncate',
        nowrap && 'ribbon-label--nowrap',
        className
      );

      return (
        <span
          className={labelClasses}
          style={style}
          aria-label={ariaLabel}
        >
          {children}
        </span>
      );
    }
  )
);

Label.displayName = 'Label';
