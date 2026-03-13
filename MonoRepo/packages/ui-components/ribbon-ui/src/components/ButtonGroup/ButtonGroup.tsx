/**
 * ButtonGroup Component
 * Group of related buttons
 */

import React from 'react';
import { mergeClasses } from '../base';
import { Button, type ButtonProps } from '../Button/Button';
import './ButtonGroup.css';

export interface ButtonGroupItem extends Omit<ButtonProps, 'variant'> {
  id: string;
  active?: boolean;
}

export interface ButtonGroupProps {
  items: ButtonGroupItem[];
  exclusive?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  onItemClick?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

/**
 * ButtonGroup Component
 * Groups multiple buttons with optional exclusive selection
 */
export const ButtonGroup = React.memo<ButtonGroupProps>(
  (
    {
      items,
      exclusive = false,
      orientation = 'horizontal',
      size = 'medium',
      onItemClick,
      className,
      style,
      'aria-label': ariaLabel,
    } => {
      const groupClasses = mergeClasses(
        'ribbon-button-group',
        `ribbon-button-group--${orientation}`,
        `ribbon-button-group--${size}`,
        className
      );

      return (
        <div
          className={groupClasses}
          style={style}
          role="group"
          aria-label={ariaLabel}
        >
          {items.map((item, index) => (
            <Button
              key={item.id}
              {...item}
              size={size}
              variant={item.active ? 'primary' : 'secondary'}
              onClick={() => {
                item.onClick?.();
                onItemClick?.(item.id);
              }}
              className={mergeClasses(
                'ribbon-button-group__item',
                index === 0 && 'ribbon-button-group__item--first',
                index === items.length - 1 && 'ribbon-button-group__item--last',
                item.active && 'ribbon-button-group__item--active'
              )}
            />
          ))}
        </div>
      );
    }
  )
);

ButtonGroup.displayName = 'ButtonGroup';
