/**
 * Sidebar Component
 * Tabbed sidebar container for navigation and context
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './Sidebar.css';

export interface SidebarTab {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  tooltip?: string;
  labelKey?: string;
  tooltipKey?: string;
}

export interface SidebarProps {
  id: string;
  tabs: SidebarTab[];
  position?: 'left' | 'right';
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  collapsible?: boolean;
  collapsed?: boolean;
  defaultActiveTabId?: string;
  onTabChange?: (tabId: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Sidebar Component
 * Tabbed sidebar with collapsible support
 */
export const Sidebar = React.memo<SidebarProps>(
  (
    {
      id,
      tabs,
      position = 'left',
      width = 280,
      minWidth = 200,
      maxWidth = 400,
      collapsible = true,
      collapsed = false,
      defaultActiveTabId,
      onTabChange,
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

      const sidebarClasses = mergeClasses(
        'ribbon-sidebar',
        `ribbon-sidebar--${position}`,
        isCollapsed && 'ribbon-sidebar--collapsed',
        className
      );

      const sidebarStyle: React.CSSProperties = {
        ...style,
        width: isCollapsed ? 'auto' : width,
        minWidth: isCollapsed ? undefined : minWidth,
        maxWidth: isCollapsed ? undefined : maxWidth,
      };

      const activeTab = tabs.find((t) => t.id === activeTabId);

      return (
        <div
          className={sidebarClasses}
          style={sidebarStyle}
          role="complementary"
          aria-label={ariaLabel || t('sidebar.sidebar', 'Sidebar')}
          aria-describedby={ariaDescribedBy}
        >
          {/* Tab List */}
          <div className="ribbon-sidebar__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={mergeClasses(
                  'ribbon-sidebar__tab',
                  activeTabId === tab.id && 'ribbon-sidebar__tab--active',
                  tab.disabled && 'ribbon-sidebar__tab--disabled'
                )}
                onClick={() => handleTabClick(tab.id)}
                disabled={tab.disabled}
                title={
                  tab.tooltip ||
                  (tab.tooltipKey ? t(tab.tooltipKey) : undefined) ||
                  tab.label
                }
                aria-selected={activeTabId === tab.id}
                aria-controls={`${id}-panel-${tab.id}`}
              >
                {!isCollapsed && (
                  <span className="ribbon-sidebar__tab-label">
                    {tab.labelKey ? t(tab.labelKey) : tab.label}
                  </span>
                )}
                {tab.badge && (
                  <span className="ribbon-sidebar__tab-badge">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Collapse Button */}
          {collapsible && (
            <button
              className="ribbon-sidebar__collapse-btn"
              onClick={handleToggleCollapse}
              title={
                isCollapsed
                  ? t('sidebar.expand', 'Expand')
                  : t('sidebar.collapse', 'Collapse')
              }
              aria-label={
                isCollapsed
                  ? t('sidebar.expand', 'Expand sidebar')
                  : t('sidebar.collapse', 'Collapse sidebar')
              }
            >
              <span className="ribbon-sidebar__collapse-icon">
                {isCollapsed ? '›' : '‹'}
              </span>
            </button>
          )}

          {/* Content Area */}
          {!isCollapsed && activeTab && (
            <div
              className="ribbon-sidebar__content"
              id={`${id}-panel-${activeTabId}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${activeTabId}`}
            >
              {activeTab.content}
            </div>
          )}
        </div>
      );
    }
  )
);

Sidebar.displayName = 'Sidebar';
