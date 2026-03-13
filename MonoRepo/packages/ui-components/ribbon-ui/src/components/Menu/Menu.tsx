/**
 * Menu Component
 * Context menu or dropdown menu
 */

import React from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './Menu.css';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  submenu?: MenuItem[];
  onClick?: () => void;
  labelKey?: string;
}

export interface MenuProps {
  items: MenuItem[];
  visible?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

/**
 * Menu Component
 * Flexible menu with icon and submenu support
 */
export const Menu = React.memo<MenuProps>(
  (
    {
      items,
      visible = true,
      position = 'bottom',
      onClose,
      className,
      style,
      'aria-label': ariaLabel,
    } => {
      const { t } = useLocalizationContext();
      const menuRef = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (e: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            onClose?.();
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, [visible, onClose]);

      if (!visible) return null;

      const menuClasses = mergeClasses(
        'ribbon-menu',
        `ribbon-menu--${position}`,
        className
      );

      const renderMenuItems = (items: MenuItem[]) => {
        return items.map((item) => {
          if (item.divider) {
            return (
              <div key={item.id} className="ribbon-menu__divider" />
            );
          }

          return (
            <div key={item.id}>
              <button
                className={mergeClasses(
                  'ribbon-menu__item',
                  item.disabled && 'ribbon-menu__item--disabled'
                )}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  onClose?.();
                }}
              >
                {item.icon && (
                  <span className="ribbon-menu__icon">{item.icon}</span>
                )}
                <span className="ribbon-menu__label">
                  {item.labelKey ? t(item.labelKey) : item.label}
                </span>
                {item.submenu && (
                  <span className="ribbon-menu__arrow">›</span>
                )}
              </button>
            </div>
          );
        });
      };

      return (
        <div
          ref={menuRef}
          className={menuClasses}
          style={style}
          role="menu"
          aria-label={ariaLabel}
        >
          {renderMenuItems(items)}
        </div>
      );
    }
  )
);

Menu.displayName = 'Menu';
