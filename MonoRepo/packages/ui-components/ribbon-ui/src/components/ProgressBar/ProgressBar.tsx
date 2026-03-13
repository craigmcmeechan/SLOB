/**
 * ProgressBar Component
 * Visual progress indicator
 */

import React from 'react';
import { mergeClasses } from '../base';
import './ProgressBar.css';

export interface ProgressBarProps {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  striped?: boolean;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-valuenow'?: number;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
}

/**
 * ProgressBar Component
 * Visual progress indicator with variants
 */
export const ProgressBar = React.memo<ProgressBarProps>(
  (
    {
      value = 0,
      min = 0,
      max = 100,
      label,
      showLabel = false,
      showValue = false,
      variant = 'default',
      size = 'medium',
      striped = false,
      animated = false,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-valuenow': ariaValueNow,
      'aria-valuemin': ariaValueMin,
      'aria-valuemax': ariaValueMax,
    } => {
      const percentage = Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);

      const progressClasses = mergeClasses(
        'ribbon-progress',
        `ribbon-progress--${size}`,
        className
      );

      const barClasses = mergeClasses(
        'ribbon-progress__bar',
        `ribbon-progress__bar--${variant}`,
        striped && 'ribbon-progress__bar--striped',
        animated && 'ribbon-progress__bar--animated'
      );

      return (
        <div className={progressClasses} style={style}>
          {(showLabel || label) && (
            <div className="ribbon-progress__header">
              {label && (
                <label className="ribbon-progress__label">{label}</label>
              )}
              {showValue && (
                <span className="ribbon-progress__value">{Math.round(percentage)}%</span>
              )}
            </div>
          )}

          <div
            className="ribbon-progress__container"
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuenow={ariaValueNow ?? value}
            aria-valuemin={ariaValueMin ?? min}
            aria-valuemax={ariaValueMax ?? max}
          >
            <div
              className={barClasses}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    }
  )
);

ProgressBar.displayName = 'ProgressBar';
