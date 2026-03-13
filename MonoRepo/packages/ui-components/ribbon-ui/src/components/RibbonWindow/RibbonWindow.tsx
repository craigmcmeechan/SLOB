/**
 * RibbonWindow Component
 * Root application window with support for dialogs, popups, and child windows
 * Manages window state, sizing, positioning, and lifecycle
 */

import React, { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { mergeClasses } from '../base';
import { useLocalizationContext } from '../../contexts/LocalizationContext';
import './RibbonWindow.css';

export type WindowType = 'root' | 'dialog' | 'popup' | 'child';
export type BackdropStyle = 'dark' | 'light' | 'blur';

/**
 * Window state interface
 */
export interface RibbonWindowState {
  isOpen: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  createdAt: Date;
  lastFocusedAt: Date;
  previousWidth?: number;
  previousHeight?: number;
  previousX?: number;
  previousY?: number;
}

/**
 * RibbonWindow props interface
 */
export interface RibbonWindowProps {
  // Window Identity
  id: string;
  title: string;
  windowType?: WindowType;

  // Dimensions & Position
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  x?: number;
  y?: number;

  // State & Behavior
  resizable?: boolean;
  movable?: boolean;
  closable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  fullscreenable?: boolean;

  // Dialog Specific
  modal?: boolean;
  backdrop?: BackdropStyle;
  closeOnBackdropClick?: boolean;

  // Icon
  icon?: string;

  // Content
  children: ReactNode;

  // Callbacks
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onRestore?: () => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (width: number, height: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;

  // State Management
  state?: Partial<RibbonWindowState>;

  // Styling
  className?: string;
  style?: React.CSSProperties;

  // i18n
  i18nNamespace?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * RibbonWindow Component
 * Main window container for ribbon UI applications
 */
export const RibbonWindow = React.memo<RibbonWindowProps>(
  ({
    id,
    title,
    windowType = 'root',
    width = 1024,
    height = 768,
    minWidth = 300,
    minHeight = 200,
    maxWidth,
    maxHeight,
    x = 0,
    y = 0,
    resizable = true,
    movable = true,
    closable = windowType !== 'root',
    minimizable = true,
    maximizable = true,
    fullscreenable = false,
    modal = windowType === 'dialog',
    backdrop = 'dark',
    closeOnBackdropClick = false,
    icon,
    children,
    onClose,
    onMinimize,
    onMaximize,
    onRestore,
    onMove,
    onResize,
    onFocus,
    onBlur,
    state: externalState,
    className,
    style,
    i18nNamespace = 'RibbonWindow',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
  }) => {
    const { t } = useLocalizationContext();
    const windowRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef<{ startX: number; startY: number } | null>(null);
    const resizingRef = useRef<{
      startX: number;
      startY: number;
      startWidth: number;
      startHeight: number;
    } | null>(null);

    // Local state
    const [windowState, setWindowState] = useState<RibbonWindowState>({
      isOpen: true,
      isFocused: windowType === 'root',
      isMinimized: false,
      isMaximized: false,
      isFullscreen: false,
      isLoading: false,
      width,
      height,
      x,
      y,
      zIndex: windowType === 'root' ? 10 : 100,
      createdAt: new Date(),
      lastFocusedAt: new Date(),
      ...externalState,
    });

    // Handle focus
    const handleFocus = useCallback(() => {
      setWindowState((prev) => ({
        ...prev,
        isFocused: true,
        lastFocusedAt: new Date(),
        zIndex: Math.max(prev.zIndex, 1000),
      }));
      onFocus?.();
    }, [onFocus]);

    // Handle blur
    const handleBlur = useCallback(() => {
      setWindowState((prev) => ({
        ...prev,
        isFocused: false,
      }));
      onBlur?.();
    }, [onBlur]);

    // Handle minimize
    const handleMinimize = useCallback(() => {
      setWindowState((prev) => ({
        ...prev,
        isMinimized: !prev.isMinimized,
      }));
      onMinimize?.();
    }, [onMinimize]);

    // Handle maximize
    const handleMaximize = useCallback(() => {
      if (windowState.isMaximized) {
        setWindowState((prev) => ({
          ...prev,
          isMaximized: false,
          width: prev.previousWidth || width,
          height: prev.previousHeight || height,
          x: prev.previousX || 0,
          y: prev.previousY || 0,
        }));
        onRestore?.();
      } else {
        setWindowState((prev) => ({
          ...prev,
          isMaximized: true,
          previousWidth: prev.width,
          previousHeight: prev.height,
          previousX: prev.x,
          previousY: prev.y,
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
        }));
        onMaximize?.();
      }
    }, [windowState.isMaximized, width, height, onMaximize, onRestore]);

    // Handle close
    const handleClose = useCallback(() => {
      setWindowState((prev) => ({
        ...prev,
        isOpen: false,
      }));
      onClose?.();
    }, [onClose]);

    // Handle backdrop click
    const handleBackdropClick = useCallback(() => {
      if (closeOnBackdropClick) {
        handleClose();
      }
    }, [closeOnBackdropClick, handleClose]);

    // Handle move start
    const handleMoveStart = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!movable) return;
        draggingRef.current = {
          startX: e.clientX - windowState.x,
          startY: e.clientY - windowState.y,
        };
      },
      [movable, windowState.x, windowState.y]
    );

    // Handle move
    useEffect(() => {
      const handleMove = (e: MouseEvent) => {
        if (!draggingRef.current) return;
        const newX = e.clientX - draggingRef.current.startX;
        const newY = e.clientY - draggingRef.current.startY;

        setWindowState((prev) => ({
          ...prev,
          x: newX,
          y: newY,
        }));
        onMove?.(newX, newY);
      };

      const handleMoveEnd = () => {
        draggingRef.current = null;
      };

      if (draggingRef.current) {
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleMoveEnd);
      }

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleMoveEnd);
      };
    }, [onMove]);

    // Handle resize start
    const handleResizeStart = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!resizable) return;
        e.preventDefault();
        resizingRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          startWidth: windowState.width,
          startHeight: windowState.height,
        };
      },
      [resizable, windowState.width, windowState.height]
    );

    // Handle resize
    useEffect(() => {
      const handleResize = (e: MouseEvent) => {
        if (!resizingRef.current) return;
        const deltaX = e.clientX - resizingRef.current.startX;
        const deltaY = e.clientY - resizingRef.current.startY;

        let newWidth = resizingRef.current.startWidth + deltaX;
        let newHeight = resizingRef.current.startHeight + deltaY;

        // Apply constraints
        newWidth = Math.max(minWidth, newWidth);
        newHeight = Math.max(minHeight, newHeight);
        if (maxWidth) newWidth = Math.min(maxWidth, newWidth);
        if (maxHeight) newHeight = Math.min(maxHeight, newHeight);

        setWindowState((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }));
        onResize?.(newWidth, newHeight);
      };

      const handleResizeEnd = () => {
        resizingRef.current = null;
      };

      if (resizingRef.current) {
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', handleResizeEnd);
      }

      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }, [minWidth, minHeight, maxWidth, maxHeight, onResize]);

    if (!windowState.isOpen) {
      return null;
    }

    const windowClasses = mergeClasses(
      'ribbon-window',
      `ribbon-window--${windowType}`,
      windowState.isFocused && 'ribbon-window--focused',
      windowState.isMinimized && 'ribbon-window--minimized',
      windowState.isMaximized && 'ribbon-window--maximized',
      windowState.isFullscreen && 'ribbon-window--fullscreen',
      className
    );

    const windowStyle: React.CSSProperties = {
      ...style,
      position: 'absolute',
      left: `${windowState.x}px`,
      top: `${windowState.y}px`,
      width: `${windowState.width}px`,
      height: `${windowState.height}px`,
      zIndex: windowState.zIndex,
    };

    return (
      <>
        {modal && (
          <div
            className={`ribbon-window__backdrop ribbon-window__backdrop--${backdrop}`}
            onClick={handleBackdropClick}
          />
        )}

        <div
          ref={windowRef}
          className={windowClasses}
          style={windowStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          role="dialog"
          aria-label={ariaLabel || title}
          aria-describedby={ariaDescribedBy}
          tabIndex={-1}
        >
          {/* Title Bar */}
          <div
            className="ribbon-window__titlebar"
            onMouseDown={handleMoveStart}
            role="banner"
          >
            {icon && (
              <img
                src={icon}
                alt=""
                className="ribbon-window__icon"
              />
            )}

            <div className="ribbon-window__title">{title}</div>

            <div className="ribbon-window__controls">
              {minimizable && (
                <button
                  className="ribbon-window__button ribbon-window__button--minimize"
                  onClick={handleMinimize}
                  aria-label={t('accessibility.collapseRibbon', 'Minimize')}
                  title={t('accessibility.collapseRibbon', 'Minimize')}
                />
              )}

              {maximizable && (
                <button
                  className="ribbon-window__button ribbon-window__button--maximize"
                  onClick={handleMaximize}
                  aria-label={t('accessibility.expandRibbon', 'Maximize')}
                  title={t('accessibility.expandRibbon', 'Maximize')}
                />
              )}

              {closable && (
                <button
                  className="ribbon-window__button ribbon-window__button--close"
                  onClick={handleClose}
                  aria-label={t('controls.close', 'Close')}
                  title={t('controls.close', 'Close')}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="ribbon-window__content">{children}</div>

          {/* Resize Handle */}
          {resizable && (
            <div
              className="ribbon-window__resize-handle"
              onMouseDown={handleResizeStart}
              aria-label={t('accessibility.collapseRibbon', 'Resize window')}
              title={t('accessibility.collapseRibbon', 'Resize window')}
            />
          )}
        </div>
      </>
    );
  }
);

RibbonWindow.displayName = 'RibbonWindow';
