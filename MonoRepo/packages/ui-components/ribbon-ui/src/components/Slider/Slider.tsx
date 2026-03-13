/**
 * Slider Component
 * Range slider input control
 */

import React from 'react';
import { mergeClasses } from '../base';
import './Slider.css';

export interface SliderProps {
  id?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  showValue?: boolean;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Slider Component
 * Range input with visual track
 */
export const Slider = React.memo<SliderProps>(
  (
    {
      id,
      value = 0,
      min = 0,
      max = 100,
      step = 1,
      label,
      disabled = false,
      showValue = true,
      onChange,
      onBlur,
      onFocus,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
    } => {
      const sliderId = id || `slider-${Math.random().toString(36).slice(2)}`;
      const percentage = ((value - min) / (max - min)) * 100;

      const sliderClasses = mergeClasses(
        'ribbon-slider',
        disabled && 'ribbon-slider--disabled',
        className
      );

      return (
        <div className={sliderClasses} style={style}>
          {label && (
            <div className="ribbon-slider__header">
              <label htmlFor={sliderId} className="ribbon-slider__label">
                {label}
              </label>
              {showValue && (
                <span className="ribbon-slider__value">{value}</span>
              )}
            </div>
          )}

          <div className="ribbon-slider__wrapper">
            <input
              id={sliderId}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange?.(parseFloat(e.target.value))}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={disabled}
              className="ribbon-slider__input"
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
            />
            <div
              className="ribbon-slider__track"
              style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
            />
          </div>
        </div>
      );
    }
  )
);

Slider.displayName = 'Slider';
