/**
 * Radio Component
 * Single-selection radio button control
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './Radio.css';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  labelKey?: string;
  descriptionKey?: string;
}

export interface RadioProps {
  id?: string;
  name: string;
  value?: string;
  options: RadioOption[];
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  direction?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Radio Component
 * Single-selection from multiple options
 */
export const Radio = React.memo<RadioProps>(
  (
    {
      id,
      name,
      value,
      options,
      disabled = false,
      onChange,
      onBlur,
      onFocus,
      direction = 'vertical',
      className,
      style,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
    } => {
      const { t } = useLocalizationContext();
      const radioId = id || `radio-${Math.random().toString(36).slice(2)}`;

      const handleChange = (optionValue: string) => {
        if (!disabled) {
          onChange?.(optionValue);
        }
      };

      const radioClasses = mergeClasses(
        'ribbon-radio',
        `ribbon-radio--${direction}`,
        disabled && 'ribbon-radio--disabled',
        className
      );

      return (
        <fieldset
          className={radioClasses}
          style={style}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        >
          {options.map((option) => {
            const optionId = `${radioId}-${option.value}`;
            const optionLabel = option.labelKey ? t(option.labelKey) : option.label;
            const optionDesc = option.descriptionKey ? t(option.descriptionKey) : option.description;

            return (
              <div key={option.value} className="ribbon-radio__item">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled || disabled}
                  onChange={() => handleChange(option.value)}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  className="ribbon-radio__input"
                />
                <div className="ribbon-radio__box">
                  <div className="ribbon-radio__dot" />
                </div>
                <label htmlFor={optionId} className="ribbon-radio__label">
                  {optionLabel}
                </label>
                {optionDesc && (
                  <div className="ribbon-radio__description">{optionDesc}</div>
                )}
              </div>
            );
          })}
        </fieldset>
      );
    }
  )
);

Radio.displayName = 'Radio';
