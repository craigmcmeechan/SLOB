/**
 * Checkbox Component
 * Multi-state checkbox for selections with full accessibility
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './Checkbox.css';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  labelKey?: string;
  descriptionKey?: string;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

/**
 * Checkbox Component
 * Supports checked, unchecked, and indeterminate states
 */
export const Checkbox = React.memo<CheckboxProps>(
  (
    {
      id,
      checked = false,
      indeterminate = false,
      disabled = false,
      label,
      description,
      labelKey,
      descriptionKey,
      onChange,
      onBlur,
      onFocus,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
    } => {
      const { t } = useLocalizationContext();
      const inputRef = React.useRef<HTMLInputElement>(null);
      const labelText = labelKey ? t(labelKey) : label;
      const descriptionText = descriptionKey ? t(descriptionKey) : description;
      const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2)}`;
      const descId = descriptionText ? `${checkboxId}-desc` : undefined;

      React.useEffect(() => {
        if (inputRef.current) {
          inputRef.current.indeterminate = indeterminate;
        }
      }, [indeterminate]);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
      };

      const checkboxClasses = mergeClasses(
        'ribbon-checkbox',
        disabled && 'ribbon-checkbox--disabled',
        indeterminate && 'ribbon-checkbox--indeterminate',
        className
      );

      return (
        <div className={checkboxClasses} style={style}>
          <input
            ref={inputRef}
            type="checkbox"
            id={checkboxId}
            checked={checked && !indeterminate}
            disabled={disabled}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            className="ribbon-checkbox__input"
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy || descId}
            aria-invalid={ariaInvalid}
            aria-required={ariaRequired}
          />
          <div className="ribbon-checkbox__box">
            <svg className="ribbon-checkbox__check" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8L6 11L13 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg className="ribbon-checkbox__indeterminate" viewBox="0 0 16 16" fill="none">
              <line
                x1="4"
                y1="8"
                x2="12"
                y2="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {labelText && (
            <label htmlFor={checkboxId} className="ribbon-checkbox__label">
              {labelText}
            </label>
          )}
          {descriptionText && (
            <div id={descId} className="ribbon-checkbox__description">
              {descriptionText}
            </div>
          )}
        </div>
      );
    }
  )
);

Checkbox.displayName = 'Checkbox';
