/**
 * Toolbar Component
 * Horizontal or vertical toolbar with grouped controls
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import { Button } from '../Button/Button';
import './Toolbar.css';

export interface ToolbarControl {
  id: string;
  type: 'button' | 'toggle' | 'separator';
  label?: string;
  icon?: string;
  tooltip?: string;
  disabled?: boolean;
  hidden?: boolean;
  pressed?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  onClick?: () => void;
  labelKey?: string;
  tooltipKey?: string;
}

export interface ToolbarGroup {
  id: string;
  label?: string;
  controls: ToolbarControl[];
  separator?: boolean;
  labelKey?: string;
}

export interface ToolbarProps {
  id: string;
  groups: ToolbarGroup[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  wrap?: boolean;
  compact?: boolean;
  onControlClick?: (controlId: string, groupId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Toolbar Component
 * Container for grouped controls
 */
export const Toolbar = React.memo<ToolbarProps>(
  (
    {
      id,
      groups,
      orientation = 'horizontal',
      size = 'medium',
      wrap = false,
      compact = false,
      onControlClick,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
    } => {
      const { t } = useLocalizationContext();

      const toolbarClasses = mergeClasses(
        'ribbon-toolbar',
        `ribbon-toolbar--${orientation}`,
        `ribbon-toolbar--${size}`,
        wrap && 'ribbon-toolbar--wrap',
        compact && 'ribbon-toolbar--compact',
        className
      );

      return (
        <div
          className={toolbarClasses}
          style={style}
          role="toolbar"
          aria-label={ariaLabel || t('toolbar.toolbar', 'Toolbar')}
          aria-describedby={ariaDescribedBy}
        >
          {groups.map((group, groupIndex) => (
            <React.Fragment key={group.id}>
              <div className="ribbon-toolbar__group">
                {group.label && (
                  <span className="ribbon-toolbar__group-label">
                    {group.labelKey ? t(group.labelKey) : group.label}
                  </span>
                )}

                <div className="ribbon-toolbar__controls">
                  {group.controls.map((control, controlIndex) => {
                    if (control.hidden) return null;

                    if (control.type === 'separator') {
                      return (
                        <div
                          key={control.id}
                          className="ribbon-toolbar__separator"
                          role="separator"
                        />
                      );
                    }

                    return (
                      <Button
                        key={control.id}
                        label={control.labelKey ? t(control.labelKey) : control.label}
                        icon={control.icon}
                        disabled={control.disabled}
                        variant={control.variant || 'secondary'}
                        size="small"
                        active={control.pressed}
                        onClick={() => {
                          control.onClick?.();
                          onControlClick?.(control.id, group.id);
                        }}
                        title={
                          control.tooltip ||
                          (control.tooltipKey ? t(control.tooltipKey) : undefined)
                        }
                      />
                    );
                  })}
                </div>
              </div>

              {group.separator && groupIndex < groups.length - 1 && (
                <div
                  className="ribbon-toolbar__separator"
                  role="separator"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }
  )
);

Toolbar.displayName = 'Toolbar';
