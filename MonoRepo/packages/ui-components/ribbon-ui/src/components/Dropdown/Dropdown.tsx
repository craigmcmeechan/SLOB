/**
 * Dropdown Component
 * Select control with dropdown menu
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './Dropdown.css';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  labelKey?: string;
}

export interface DropdownProps {
  id?: string;
  value?: string;
  options: DropdownOption[];
  placeholder?: string;
  label?: string;
  labelKey?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  errorKey?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

/**
 * Dropdown Component
 * Select single value from options
 */
export const Dropdown = React.memo<DropdownProps>(
  (
    {
      id,
      value,
      options,
      placeholder,
      label,
      labelKey,
      disabled = false,
      required = false,
      error,
      errorKey,
      onChange,
      onBlur,
      onFocus,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
    } => {
      const { t } = useLocalizationContext();
      const dropdownId = id || `dropdown-${Math.random().toString(36).slice(2)}`;
      const labelText = labelKey ? t(labelKey) : label;
      const errorText = errorKey ? t(errorKey) : error;
      const hasError = !!errorText;

      const dropdownClasses = mergeClasses(
        'ribbon-dropdown',
        disabled && 'ribbon-dropdown--disabled',
        hasError && 'ribbon-dropdown--error',
        className
      );

      const selectedOption = options.find((opt) => opt.value === value);
      const selectedLabel = selectedOption
        ? selectedOption.labelKey
          ? t(selectedOption.labelKey)
          : selectedOption.label
        : placeholder || t('dropdown.select', 'Select an option');

      return (
        <div className={dropdownClasses} style={style}>
          {labelText && (
            <label htmlFor={dropdownId} className="ribbon-dropdown__label">
              {labelText}
              {required && <span className="ribbon-dropdown__required">*</span>}
            </label>
          )}

          <div className="ribbon-dropdown__wrapper">
            <select
              id={dropdownId}
              value={value || ''}
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={disabled}
              required={required}
              className="ribbon-dropdown__select"
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid || hasError}
            >
              {!value && placeholder && (
                <option value="">{placeholder}</option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.labelKey ? t(option.labelKey) : option.label}
                </option>
              ))}
            </select>

            <span className="ribbon-dropdown__display">
              {selectedLabel}
            </span>

            <svg className="ribbon-dropdown__chevron" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {errorText && (
            <div className="ribbon-dropdown__error">{errorText}</div>
          )}
        </div>
      );
    }
  )
);

Dropdown.displayName = 'Dropdown';
