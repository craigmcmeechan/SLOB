/**
 * ButtonBar Component
 * Dialog footer with preset button configurations
 */

import React from 'react';
import { mergeClasses } from '../base';
import { Button } from '../Button/Button';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './ButtonBar.css';

export type ButtonBarPreset =
  | 'ok-cancel'
  | 'yes-no'
  | 'save-cancel'
  | 'save-discard-cancel'
  | 'apply-cancel'
  | 'ok'
  | 'custom';

export interface ButtonBarAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  onClick?: () => void;
  labelKey?: string;
}

export interface ButtonBarProps {
  preset?: ButtonBarPreset;
  actions?: ButtonBarAction[];
  layout?: 'left' | 'center' | 'right';
  gap?: 'compact' | 'normal' | 'loose';
  onOk?: () => void;
  onCancel?: () => void;
  onYes?: () => void;
  onNo?: () => void;
  onSave?: () => void;
  onDiscard?: () => void;
  onApply?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

/**
 * ButtonBar Component
 * Dialog footer with common button presets
 */
export const ButtonBar = React.memo<ButtonBarProps>(
  (
    {
      preset = 'ok-cancel',
      actions,
      layout = 'right',
      gap = 'normal',
      onOk,
      onCancel,
      onYes,
      onNo,
      onSave,
      onDiscard,
      onApply,
      className,
      style,
      'aria-label': ariaLabel,
    } => {
      const { t } = useLocalizationContext();

      const getPresetActions = (): ButtonBarAction[] => {
        switch (preset) {
          case 'ok-cancel':
            return [
              { id: 'ok', label: t('buttonbar.ok', 'OK'), variant: 'primary', onClick: onOk },
              { id: 'cancel', label: t('buttonbar.cancel', 'Cancel'), variant: 'secondary', onClick: onCancel },
            ];
          case 'yes-no':
            return [
              { id: 'yes', label: t('buttonbar.yes', 'Yes'), variant: 'primary', onClick: onYes },
              { id: 'no', label: t('buttonbar.no', 'No'), variant: 'secondary', onClick: onNo },
            ];
          case 'save-cancel':
            return [
              { id: 'save', label: t('buttonbar.save', 'Save'), variant: 'primary', onClick: onSave },
              { id: 'cancel', label: t('buttonbar.cancel', 'Cancel'), variant: 'secondary', onClick: onCancel },
            ];
          case 'save-discard-cancel':
            return [
              { id: 'save', label: t('buttonbar.save', 'Save'), variant: 'primary', onClick: onSave },
              { id: 'discard', label: t('buttonbar.discard', 'Discard'), variant: 'secondary', onClick: onDiscard },
              { id: 'cancel', label: t('buttonbar.cancel', 'Cancel'), variant: 'secondary', onClick: onCancel },
            ];
          case 'apply-cancel':
            return [
              { id: 'apply', label: t('buttonbar.apply', 'Apply'), variant: 'primary', onClick: onApply },
              { id: 'cancel', label: t('buttonbar.cancel', 'Cancel'), variant: 'secondary', onClick: onCancel },
            ];
          case 'ok':
            return [
              { id: 'ok', label: t('buttonbar.ok', 'OK'), variant: 'primary', onClick: onOk },
            ];
          case 'custom':
          default:
            return actions || [];
        }
      };

      const presetActions = getPresetActions();

      const buttonBarClasses = mergeClasses(
        'ribbon-button-bar',
        `ribbon-button-bar--${layout}`,
        `ribbon-button-bar--gap-${gap}`,
        className
      );

      return (
        <div
          className={buttonBarClasses}
          style={style}
          role="group"
          aria-label={ariaLabel || t('buttonbar.actions', 'Dialog actions')}
        >
          {presetActions.map((action) => (
            <Button
              key={action.id}
              label={action.labelKey ? t(action.labelKey) : action.label}
              variant={action.variant || 'secondary'}
              disabled={action.disabled}
              onClick={action.onClick}
              size="medium"
            />
          ))}
        </div>
      );
    }
  )
);

ButtonBar.displayName = 'ButtonBar';
