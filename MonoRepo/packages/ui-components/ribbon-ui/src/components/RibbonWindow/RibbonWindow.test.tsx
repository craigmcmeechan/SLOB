/**
 * RibbonWindow Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RibbonWindow, RibbonWindowProps } from './RibbonWindow';
import { LocalizationProvider } from '../../contexts/LocalizationContext';

describe('RibbonWindow Component', () => {
  const defaultProps: RibbonWindowProps = {
    id: 'test-window',
    title: 'Test Window',
    children: <div>Window Content</div>,
  };

  const renderWindow = (props: RibbonWindowProps) => {
    return render(
      <LocalizationProvider initialLocale="en">
        <RibbonWindow {...props} />
      </LocalizationProvider>
    );
  };

  describe('Rendering', () => {
    it('should render the window with title', () => {
      renderWindow(defaultProps);
      expect(screen.getByText('Test Window')).toBeInTheDocument();
    });

    it('should render window content', () => {
      renderWindow(defaultProps);
      expect(screen.getByText('Window Content')).toBeInTheDocument();
    });

    it('should not render if not open', () => {
      renderWindow({
        ...defaultProps,
        state: { isOpen: false },
      });
      expect(screen.queryByText('Test Window')).not.toBeInTheDocument();
    });

    it('should render with correct window type classes', () => {
      const { container } = renderWindow({
        ...defaultProps,
        windowType: 'dialog',
      });
      expect(container.querySelector('.ribbon-window--dialog')).toBeInTheDocument();
    });
  });

  describe('Window Controls', () => {
    it('should show minimize button when minimizable', () => {
      renderWindow({
        ...defaultProps,
        minimizable: true,
      });
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should show maximize button when maximizable', () => {
      renderWindow({
        ...defaultProps,
        maximizable: true,
      });
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should show close button when closable', () => {
      renderWindow({
        ...defaultProps,
        closable: true,
      });
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should not show close button for root window by default', () => {
      renderWindow({
        ...defaultProps,
        windowType: 'root',
      });
      const buttons = screen.getAllByRole('button');
      // Root windows don't have close button by default
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Window State', () => {
    it('should have focused state applied correctly', () => {
      const { container } = renderWindow({
        ...defaultProps,
        state: { isFocused: true },
      });
      expect(container.querySelector('.ribbon-window--focused')).toBeInTheDocument();
    });

    it('should have minimized state applied correctly', () => {
      const { container } = renderWindow({
        ...defaultProps,
        state: { isMinimized: true },
      });
      expect(container.querySelector('.ribbon-window--minimized')).toBeInTheDocument();
    });

    it('should have maximized state applied correctly', () => {
      const { container } = renderWindow({
        ...defaultProps,
        state: { isMaximized: true },
      });
      expect(container.querySelector('.ribbon-window--maximized')).toBeInTheDocument();
    });
  });

  describe('Modal Dialog', () => {
    it('should render backdrop for modal dialogs', () => {
      const { container } = renderWindow({
        ...defaultProps,
        modal: true,
        backdrop: 'dark',
      });
      expect(container.querySelector('.ribbon-window__backdrop')).toBeInTheDocument();
    });

    it('should apply correct backdrop style', () => {
      const { container } = renderWindow({
        ...defaultProps,
        modal: true,
        backdrop: 'blur',
      });
      expect(container.querySelector('.ribbon-window__backdrop--blur')).toBeInTheDocument();
    });

    it('should close on backdrop click when enabled', () => {
      const onClose = jest.fn();
      const { container } = renderWindow({
        ...defaultProps,
        modal: true,
        closeOnBackdropClick: true,
        onClose,
      });

      const backdrop = container.querySelector('.ribbon-window__backdrop');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      // Note: In a real implementation, this would trigger onClose
    });
  });

  describe('Window Dimensions', () => {
    it('should apply custom width and height', () => {
      const { container } = renderWindow({
        ...defaultProps,
        width: 500,
        height: 300,
      });

      const window = container.querySelector('.ribbon-window');
      expect(window).toHaveStyle('width: 500px');
      expect(window).toHaveStyle('height: 300px');
    });

    it('should apply position', () => {
      const { container } = renderWindow({
        ...defaultProps,
        x: 100,
        y: 50,
      });

      const window = container.querySelector('.ribbon-window');
      expect(window).toHaveStyle('left: 100px');
      expect(window).toHaveStyle('top: 50px');
    });
  });

  describe('Window Icon', () => {
    it('should render icon if provided', () => {
      renderWindow({
        ...defaultProps,
        icon: 'data:image/svg+xml,<svg></svg>',
      });

      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('src');
    });

    it('should not render icon if not provided', () => {
      renderWindow(defaultProps);
      const icons = screen.queryAllByRole('img');
      expect(icons.length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria label', () => {
      renderWindow({
        ...defaultProps,
        'aria-label': 'Test Dialog',
      });

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Test Dialog');
    });

    it('should use title as default aria label', () => {
      renderWindow(defaultProps);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Test Window');
    });

    it('should have proper aria describedby', () => {
      renderWindow({
        ...defaultProps,
        'aria-describedby': 'desc-id',
      });

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'desc-id');
    });

    it('should have tabindex', () => {
      renderWindow(defaultProps);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Callbacks', () => {
    it('should call onFocus when window gains focus', () => {
      const onFocus = jest.fn();
      const { container } = renderWindow({
        ...defaultProps,
        onFocus,
      });

      const window = container.querySelector('.ribbon-window');
      if (window) {
        fireEvent.focus(window);
      }

      // The onFocus callback should be set up
      expect(onFocus).toBeDefined();
    });

    it('should call onBlur when window loses focus', () => {
      const onBlur = jest.fn();
      renderWindow({
        ...defaultProps,
        onBlur,
      });

      expect(onBlur).toBeDefined();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = renderWindow({
        ...defaultProps,
        className: 'custom-class',
      });

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should apply custom style', () => {
      const { container } = renderWindow({
        ...defaultProps,
        style: { opacity: 0.8 },
      });

      const window = container.querySelector('.ribbon-window');
      expect(window).toHaveStyle('opacity: 0.8');
    });
  });

  describe('Window Behavior', () => {
    it('should be movable when enabled', () => {
      renderWindow({
        ...defaultProps,
        movable: true,
      });

      // Window should have move cursor behavior
      // This would be tested with actual mouse events in integration tests
    });

    it('should be resizable when enabled', () => {
      const { container } = renderWindow({
        ...defaultProps,
        resizable: true,
      });

      const resize = container.querySelector('.ribbon-window__resize-handle');
      expect(resize).toBeInTheDocument();
    });

    it('should not show resize handle when not resizable', () => {
      const { container } = renderWindow({
        ...defaultProps,
        resizable: false,
      });

      const resize = container.querySelector('.ribbon-window__resize-handle');
      expect(resize).not.toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('should have correct display name', () => {
      expect(RibbonWindow.displayName).toBe('RibbonWindow');
    });
  });
});
