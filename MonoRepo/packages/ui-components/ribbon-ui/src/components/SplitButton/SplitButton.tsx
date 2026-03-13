/**
 * SplitButton Component
 * Button with integrated dropdown menu
 */

import React from 'react';
import { mergeClasses } from '../base';
import { Button } from '../Button/Button';
import { Menu, type MenuItem } from '../Menu/Menu';
import './SplitButton.css';

export interface SplitButtonProps {
  id?: string;
  label: string;
  icon?: string;
  menuItems: MenuItem[];
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  onMenuItemClick?: (itemId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

/**
 * SplitButton Component
 * Primary button with dropdown menu
 */
export const SplitButton = React.memo<SplitButtonProps>(
  (
    {
      id,
      label,
      icon,
      menuItems,
      disabled = false,
      variant = 'primary',
      size = 'medium',
      onClick,
      onMenuItemClick,
      className,
      style,
      'aria-label': ariaLabel,
    } => {
      const [menuVisible, setMenuVisible] = React.useState(false);
      const containerRef = React.useRef<HTMLDivElement>(null);

      const handleMenuItemClick = (item: MenuItem) => {
        item.onClick?.();
        onMenuItemClick?.(item.id);
        setMenuVisible(false);
      };

      const updatedMenuItems = menuItems.map((item) => ({
        ...item,
        onClick: () => handleMenuItemClick(item),
      }));

      const splitButtonClasses = mergeClasses(
        'ribbon-split-button',
        disabled && 'ribbon-split-button--disabled',
        menuVisible && 'ribbon-split-button--menu-open',
        className
      );

      return (
        <div
          ref={containerRef}
          className={splitButtonClasses}
          style={style}
          aria-label={ariaLabel}
        >
          <Button
            label={label}
            icon={icon}
            disabled={disabled}
            variant={variant}
            size={size}
            onClick={onClick}
            className="ribbon-split-button__primary"
          />

          <button
            className="ribbon-split-button__menu-button"
            onClick={() => setMenuVisible(!menuVisible)}
            disabled={disabled}
            aria-label={`Toggle menu for ${label}`}
            aria-expanded={menuVisible}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {menuVisible && (
            <Menu
              items={updatedMenuItems}
              visible={menuVisible}
              onClose={() => setMenuVisible(false)}
              position="bottom"
              className="ribbon-split-button__menu"
            />
          )}
        </div>
      );
    }
  )
);

SplitButton.displayName = 'SplitButton';
