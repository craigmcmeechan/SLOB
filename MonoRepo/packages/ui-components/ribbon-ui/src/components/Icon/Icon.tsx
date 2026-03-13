/**
 * Icon Component
 * Display an icon with theming and sizing support
 */

import React from 'react';
import { mergeClasses } from '../base';
import { getIcon } from '../../utils/icons';
import './Icon.css';

export interface IconProps {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

/**
 * Icon Component
 * Renders an icon from the icon registry
 */
export const Icon = React.memo<IconProps>(
  (
    {
      name,
      size = 'medium',
      color,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden = !ariaLabel,
    } => {
      const icon = getIcon(name);

      if (!icon) {
        return null;
      }

      const IconComponent = icon;

      const iconClasses = mergeClasses(
        'ribbon-icon',
        `ribbon-icon--${size}`,
        className
      );

      const iconStyle: React.CSSProperties = {
        ...style,
        ...(color && { color }),
      };

      return (
        <span
          className={iconClasses}
          style={iconStyle}
          role={ariaLabel ? 'img' : undefined}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden}
        >
          <IconComponent size="1em" />
        </span>
      );
    }
  )
);

Icon.displayName = 'Icon';
