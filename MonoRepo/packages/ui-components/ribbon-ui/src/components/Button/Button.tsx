/**
 * Button Control Component
 * Action control for triggering commands
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import { getIcon } from '../../utils/icons';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Appearance
  variant?: ButtonVariant;
  size?: ButtonSize;

  // Content
  icon?: string;
  iconPosition?: 'left' | 'right';
  label?: string;
  loading?: boolean;

  // Display
  showLabel?: boolean;
  showIcon?: boolean;

  // State
  active?: boolean;

  // Styling
  fullWidth?: boolean;
  compact?: boolean;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Button Component
 * Primary action control for ribbon UI
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      icon,
      iconPosition = 'left',
      label,
      loading = false,
      showLabel = true,
      showIcon = true,
      active = false,
      fullWidth = false,
      compact = false,
      className,
      style,
      children,
      disabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const { t } = useLocalizationContext();

    // Determine content
    const displayLabel = label || (typeof children === 'string' ? children : '');
    const displayIcon = icon ? getIcon(icon) : null;

    const buttonClasses = mergeClasses(
      'ribbon-button',
      `ribbon-button--${variant}`,
      `ribbon-button--${size}`,
      active && 'ribbon-button--active',
      loading && 'ribbon-button--loading',
      fullWidth && 'ribbon-button--full-width',
      compact && 'ribbon-button--compact',
      disabled && 'ribbon-button--disabled',
      className
    );

    const contentClasses = mergeClasses(
      'ribbon-button__content',
      iconPosition === 'right' && 'ribbon-button__content--reverse'
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        style={style}
        disabled={disabled || loading}
        aria-label={ariaLabel || displayLabel}
        aria-describedby={ariaDescribedBy}
        aria-pressed={active}
        aria-busy={loading}
        {...props}
      >
        {loading && <span className="ribbon-button__loader" />}

        <div className={contentClasses}>
          {showIcon && displayIcon && (
            <span className="ribbon-button__icon">
              {React.createElement(displayIcon, {
                size: size === 'small' ? 16 : size === 'large' ? 24 : 20,
                 'aria-hidden': 'true',
              })}
            </span>
          )}

          {showLabel && displayLabel && (
            <span className="ribbon-button__label">{displayLabel}</span>
          )}

          {children && !displayLabel && showLabel && (
            <span className="ribbon-button__label">{children}</span>
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';
