/**
 * TextInput Component
 * Single-line text input with validation and formatting
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './TextInput.css';

export interface TextInputProps {
  id?: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'url' | 'search' | 'tel';
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  label?: string;
  labelKey?: string;
  hint?: string;
  hintKey?: string;
  error?: string;
  errorKey?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onClear?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

/**
 * TextInput Component
 * Flexible text input with validation, icons, and hints
 */
export const TextInput = React.memo<TextInputProps>(
  (
    {
      id,
      value = '',
      placeholder,
      type = 'text',
      disabled = false,
      readOnly = false,
      required = false,
      minLength,
      maxLength,
      pattern,
      label,
      labelKey,
      hint,
      hintKey,
      error,
      errorKey,
      icon,
      iconPosition = 'left',
      clearable = false,
      onChange,
      onBlur,
      onFocus,
      onClear,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
    } => {
      const { t } = useLocalizationContext();
      const inputRef = React.useRef<HTMLInputElement>(null);
      const inputId = id || `textinput-${Math.random().toString(36).slice(2)}`;

      const labelText = labelKey ? t(labelKey) : label;
      const hintText = hintKey ? t(hintKey) : hint;
      const errorText = errorKey ? t(errorKey) : error;
      const hasError = !!errorText;
      const descIds = [ariaDescribedBy, hintText && `${inputId}-hint`, hasError && `${inputId}-error`]
        .filter(Boolean)
        .join(' ');

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
      };

      const handleClear = () => {
        onChange?.('');
        onClear?.();
        inputRef.current?.focus();
      };

      const inputClasses = mergeClasses(
        'ribbon-textinput',
        disabled && 'ribbon-textinput--disabled',
        readOnly && 'ribbon-textinput--readonly',
        hasError && 'ribbon-textinput--error',
        icon && `ribbon-textinput--icon-${iconPosition}`,
        clearable && value && 'ribbon-textinput--has-clear',
        className
      );

      return (
        <div className={inputClasses} style={style}>
          {labelText && (
            <label htmlFor={inputId} className="ribbon-textinput__label">
              {labelText}
              {required && <span className="ribbon-textinput__required">*</span>}
            </label>
          )}

          <div className="ribbon-textinput__wrapper">
            <input
              ref={inputRef}
              type={type}
              id={inputId}
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              minLength={minLength}
              maxLength={maxLength}
              pattern={pattern}
              onChange={handleChange}
              onBlur={onBlur}
              onFocus={onFocus}
              className="ribbon-textinput__input"
              aria-label={ariaLabel}
              aria-describedby={descIds || undefined}
              aria-invalid={ariaInvalid || hasError}
              aria-required={ariaRequired || required}
            />

            {icon && (
              <span className={mergeClasses('ribbon-textinput__icon', `ribbon-textinput__icon--${iconPosition}`)}>
                {icon}
              </span>
            )}

            {clearable && value && (
              <button
                type="button"
                className="ribbon-textinput__clear"
                onClick={handleClear}
                aria-label={t('textinput.clear', 'Clear')}
                tabIndex={-1}
              >
                ×
              </button>
            )}
          </div>

          {hintText && (
            <div id={`${inputId}-hint`} className="ribbon-textinput__hint">
              {hintText}
            </div>
          )}

          {errorText && (
            <div id={`${inputId}-error`} className="ribbon-textinput__error">
              {errorText}
            </div>
          )}
        </div>
      );
    }
  )
);

TextInput.displayName = 'TextInput';
