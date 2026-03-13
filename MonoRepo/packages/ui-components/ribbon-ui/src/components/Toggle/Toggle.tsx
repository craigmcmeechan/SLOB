/**
 * Toggle Switch Component
 * Selection control for binary on/off states
 */

import React from 'react';
import { mergeClasses } from '../base';
import './Toggle.css';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  // Content
  label?: string;
  description?: string;

  // Display
  size?: 'small' | 'medium' | 'large';

  // Styling
  className?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Toggle Component
 * Binary selection control (on/off, enabled/disabled)
 */
export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      size = 'medium',
      className,
      disabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      id,
      ...props
    },
    ref
  ) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    const containerClasses = mergeClasses(
      'ribbon-toggle-container',
      disabled && 'ribbon-toggle-container--disabled',
      className
    );

    const toggleClasses = mergeClasses(
      'ribbon-toggle',
      `ribbon-toggle--${size}`,
      disabled && 'ribbon-toggle--disabled'
    );

    return (
      <div className={containerClasses}>
        <div className={toggleClasses}>
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            className="ribbon-toggle__input"
            disabled={disabled}
            aria-label={ariaLabel || label}
            aria-describedby={ariaDescribedBy}
            {...props}
          />
          <label htmlFor={toggleId} className="ribbon-toggle__label" aria-hidden="true">
            <span className="ribbon-toggle__track" />
            <span className="ribbon-toggle__thumb" />
          </label>
        </div>

        {label && (
          <label htmlFor={toggleId} className="ribbon-toggle__text-label">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
