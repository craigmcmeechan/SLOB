/**
 * NumberInput Component
 * Numeric input with spinner controls
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './NumberInput.css';

export interface NumberInputProps {
  id?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  label?: string;
  labelKey?: string;
  disabled?: boolean;
  readOnly?: boolean;
  showSpinner?: boolean;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * NumberInput Component
 * Numeric input with increment/decrement buttons
 */
export const NumberInput = React.memo<NumberInputProps>(
  (
    {
      id,
      value = 0,
      min,
      max,
      step = 1,
      precision = 0,
      label,
      labelKey,
      disabled = false,
      readOnly = false,
      showSpinner = true,
      onChange,
      onBlur,
      onFocus,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
    } => {
      const { t } = useLocalizationContext();
      const inputRef = React.useRef<HTMLInputElement>(null);
      const inputId = id || `numberinput-${Math.random().toString(36).slice(2)}`;
      const labelText = labelKey ? t(labelKey) : label;

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
          let finalValue = newValue;
          if (min !== undefined && finalValue < min) finalValue = min;
          if (max !== undefined && finalValue > max) finalValue = max;
          onChange?.(finalValue);
        }
      };

      const handleIncrement = () => {
        let newValue = value + step;
        if (max !== undefined && newValue > max) newValue = max;
        onChange?.(newValue);
      };

      const handleDecrement = () => {
        let newValue = value - step;
        if (min !== undefined && newValue < min) newValue = min;
        onChange?.(newValue);
      };

      const inputClasses = mergeClasses(
        'ribbon-numberinput',
        disabled && 'ribbon-numberinput--disabled',
        readOnly && 'ribbon-numberinput--readonly',
        className
      );

      return (
        <div className={inputClasses} style={style}>
          {labelText && (
            <label htmlFor={inputId} className="ribbon-numberinput__label">
              {labelText}
            </label>
          )}

          <div className="ribbon-numberinput__wrapper">
            {showSpinner && (
              <button
                type="button"
                className="ribbon-numberinput__button ribbon-numberinput__button--down"
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && value <= min)}
                tabIndex={-1}
                aria-label={t('numberinput.decrease', 'Decrease')}
              >
                −
              </button>
            )}

            <input
              ref={inputRef}
              type="number"
              id={inputId}
              value={value}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              readOnly={readOnly}
              onChange={handleChange}
              onBlur={onBlur}
              onFocus={onFocus}
              className="ribbon-numberinput__input"
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
            />

            {showSpinner && (
              <button
                type="button"
                className="ribbon-numberinput__button ribbon-numberinput__button--up"
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && value >= max)}
                tabIndex={-1}
                aria-label={t('numberinput.increase', 'Increase')}
              >
                +
              </button>
            )}
          </div>
        </div>
      );
    }
  )
);

NumberInput.displayName = 'NumberInput';
