/**
 * Ribbon Component
 * Office-style tab-based UI with groups and controls
 */

import React from 'react';
import { mergeClasses } from '../base';
import { Button } from '../Button/Button';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './Ribbon.css';

export interface RibbonControl {
  id: string;
  type: 'button' | 'toggle' | 'dropdown' | 'checkbox' | 'radio' | 'separator' | 'label';
  label?: string;
  icon?: string;
  tooltip?: string;
  disabled?: boolean;
  hidden?: boolean;
  pressed?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  labelKey?: string;
  tooltipKey?: string;
}

export interface RibbonGroup {
  id: string;
  label: string;
  controls: RibbonControl[];
  collapsible?: boolean;
  collapsed?: boolean;
  labelKey?: string;
}

export interface RibbonTab {
  id: string;
  label: string;
  icon?: string;
  groups: RibbonGroup[];
  disabled?: boolean;
  hidden?: boolean;
  labelKey?: string;
}

export interface RibbonProps {
  id: string;
  tabs: RibbonTab[];
  defaultActiveTabId?: string;
  size?: 'compact' | 'normal' | 'large';
  collapsed?: boolean;
  collapsible?: boolean;
  onTabChange?: (tabId: string) => void;
  onControlClick?: (controlId: string, groupId: string, tabId: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Ribbon Component
 * Office-style ribbon UI with tabs, groups, and controls
 */
export const Ribbon = React.memo<RibbonProps>(
  (
    {
      id,
      tabs,
      defaultActiveTabId,
      size = 'normal',
      collapsed = false,
      collapsible = true,
      onTabChange,
      onControlClick,
      onCollapsedChange,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
    } => {
      const { t } = useLocalizationContext();
      const [activeTabId, setActiveTabId] = React.useState<string>(
        defaultActiveTabId || tabs[0]?.id || ''
      );
      const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

      const handleTabClick = (tabId: string) => {
        if (tabs.find((t) => t.id === tabId)?.disabled) return;
        setActiveTabId(tabId);
        onTabChange?.(tabId);
      };

      const handleToggleCollapse = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        onCollapsedChange?.(newCollapsed);
      };

      const ribbonClasses = mergeClasses(
        'ribbon',
        `ribbon--${size}`,
        isCollapsed && 'ribbon--collapsed',
        className
      );

      const activeTab = tabs.find((t) => t.id === activeTabId);

      return (
        <div
          className={ribbonClasses}
          style={style}
          role="tablist"
          aria-label={ariaLabel || t('ribbon.ribbon', 'Ribbon')}
          aria-describedby={ariaDescribedBy}
        >
          {/* Tab List */}
          <div className="ribbon__tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={mergeClasses(
                  'ribbon__tab',
                  activeTabId === tab.id && 'ribbon__tab--active',
                  tab.disabled && 'ribbon__tab--disabled'
                )}
                onClick={() => handleTabClick(tab.id)}
                disabled={tab.disabled}
                role="tab"
                aria-selected={activeTabId === tab.id}
                aria-controls={`${id}-panel-${tab.id}`}
              >
                {tab.icon && <span className="ribbon__tab-icon">{tab.icon}</span>}
                <span className="ribbon__tab-label">
                  {tab.labelKey ? t(tab.labelKey) : tab.label}
                </span>
              </button>
            ))}

            {collapsible && (
              <button
                className="ribbon__collapse-btn"
                onClick={handleToggleCollapse}
                title={
                  isCollapsed
                    ? t('ribbon.expand', 'Expand')
                    : t('ribbon.collapse', 'Collapse')
                }
                aria-label={
                  isCollapsed
                    ? t('ribbon.expand', 'Expand ribbon')
                    : t('ribbon.collapse', 'Collapse ribbon')
                }
              >
                <span className="ribbon__collapse-icon">
                  {isCollapsed ? '∨' : '∧'}
                </span>
              </button>
            )}
          </div>

          {/* Content Area */}
          {!isCollapsed && activeTab && (
            <div
              className="ribbon__content"
              id={`${id}-panel-${activeTabId}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${activeTabId}`}
            >
              <div className="ribbon__groups">
                {activeTab.groups.map((group) => (
                  <div key={group.id} className="ribbon__group">
                    <div className="ribbon__group-header">
                      <h3 className="ribbon__group-label">
                        {group.labelKey ? t(group.labelKey) : group.label}
                      </h3>
                    </div>

                    <div className="ribbon__group-controls">
                      {group.controls.map((control) => {
                        if (control.hidden) return null;

                        if (control.type === 'separator') {
                          return (
                            <div
                              key={control.id}
                              className="ribbon__separator"
                              role="separator"
                            />
                          );
                        }

                        if (control.type === 'label') {
                          return (
                            <span key={control.id} className="ribbon__label">
                              {control.labelKey ? t(control.labelKey) : control.label}
                            </span>
                          );
                        }

                        return (
                          <Button
                            key={control.id}
                            label={control.labelKey ? t(control.labelKey) : control.label}
                            icon={control.icon}
                            disabled={control.disabled}
                            variant={control.variant || 'secondary'}
                            size={control.size || 'medium'}
                            active={control.pressed}
                            onClick={() => {
                              control.onClick?.();
                              onControlClick?.(control.id, group.id, activeTabId);
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
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  )
);

Ribbon.displayName = 'Ribbon';
