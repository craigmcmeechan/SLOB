/**
 * RibbonWindow Component - Storybook Stories
 */

import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { RibbonWindow, RibbonWindowProps } from './RibbonWindow';
import { LocalizationProvider } from '../../contexts/LocalizationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

const meta: Meta<typeof RibbonWindow> = {
  title: 'Components/RibbonWindow',
  component: RibbonWindow,
  decorators: [
    (Story) => (
      <ThemeProvider initialTheme="light">
        <LocalizationProvider initialLocale="en">
          <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Story />
          </div>
        </LocalizationProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof RibbonWindow>;

/**
 * Default window
 */
export const Default: Story = {
  args: {
    id: 'main-window',
    title: 'Ribbon UI Window',
    width: 800,
    height: 600,
    children: (
      <div style={{ padding: '20px' }}>
        <h2>Welcome to Ribbon UI</h2>
        <p>This is a RibbonWindow component. You can move and resize this window.</p>
        <p>This is a sample window content area with multiple lines of text.</p>
      </div>
    ),
  },
};

/**
 * Modal dialog
 */
export const ModalDialog: Story = {
  args: {
    id: 'modal-dialog',
    title: 'Confirmation Dialog',
    windowType: 'dialog',
    modal: true,
    backdrop: 'dark',
    width: 400,
    height: 250,
    x: 512,
    y: 300,
    closable: true,
    minimizable: false,
    maximizable: false,
    children: (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h3>Confirm Action</h3>
        <p style={{ flex: 1 }}>Are you sure you want to proceed with this action?</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button style={{ padding: '8px 16px' }}>Cancel</button>
          <button style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white' }}>
            Confirm
          </button>
        </div>
      </div>
    ),
  },
};

/**
 * Popup window
 */
export const PopupWindow: Story = {
  args: {
    id: 'popup-window',
    title: 'Help Window',
    windowType: 'popup',
    width: 500,
    height: 400,
    x: 400,
    y: 200,
    closable: true,
    children: (
      <div style={{ padding: '20px' }}>
        <h3>Help Information</h3>
        <p>This is a modeless popup window. You can interact with other windows while this is open.</p>
        <ul>
          <li>Drag the title bar to move the window</li>
          <li>Drag the corner to resize the window</li>
          <li>Click minimize to minimize the window</li>
          <li>Click close to close the window</li>
        </ul>
      </div>
    ),
  },
};

/**
 * Minimized window
 */
export const MinimizedWindow: Story = {
  args: {
    ...Default.args,
    id: 'minimized-window',
    state: {
      isMinimized: true,
    },
  },
};

/**
 * Maximized window
 */
export const MaximizedWindow: Story = {
  args: {
    ...Default.args,
    id: 'maximized-window',
    state: {
      isMaximized: true,
    },
  },
};

/**
 * With icon
 */
export const WithIcon: Story = {
  args: {
    ...Default.args,
    id: 'window-with-icon',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
  },
};

/**
 * Small window
 */
export const SmallWindow: Story = {
  args: {
    ...Default.args,
    id: 'small-window',
    title: 'Small Window',
    width: 300,
    height: 200,
    x: 100,
    y: 100,
    minWidth: 250,
    minHeight: 150,
  },
};

/**
 * Large window
 */
export const LargeWindow: Story = {
  args: {
    ...Default.args,
    id: 'large-window',
    width: 1200,
    height: 800,
  },
};

/**
 * Non-resizable window
 */
export const NonResizable: Story = {
  args: {
    ...Default.args,
    id: 'non-resizable',
    title: 'Fixed Size Window',
    resizable: false,
    width: 500,
    height: 400,
  },
};

/**
 * Non-movable window
 */
export const NonMovable: Story = {
  args: {
    ...Default.args,
    id: 'non-movable',
    title: 'Fixed Position Window',
    movable: false,
    x: 0,
    y: 0,
  },
};

/**
 * Multiple windows (Interactive)
 */
export const MultipleWindows: Story = {
  render: () => {
    const [windows, setWindows] = useState([
      { id: 'window-1', title: 'Window 1', x: 50, y: 50 },
      { id: 'window-2', title: 'Window 2', x: 400, y: 150 },
      { id: 'window-3', title: 'Window 3', x: 700, y: 250 },
    ]);

    const handleClose = (id: string) => {
      setWindows(windows.filter((w) => w.id !== id));
    };

    return (
      <>
        {windows.map((window) => (
          <RibbonWindow
            key={window.id}
            id={window.id}
            title={window.title}
            width={400}
            height={300}
            x={window.x}
            y={window.y}
            onClose={() => handleClose(window.id)}
          >
            <div style={{ padding: '20px' }}>
              <h3>{window.title}</h3>
              <p>This is window content for {window.title}.</p>
              <p>You can open multiple windows and interact with them independently.</p>
            </div>
          </RibbonWindow>
        ))}
      </>
    );
  },
};

/**
 * With rounded corners (theme variation)
 */
export const WithRoundedCorners: Story = {
  args: {
    ...Default.args,
    id: 'rounded-window',
    style: {
      borderRadius: '12px',
    },
  },
};

/**
 * Dark theme window
 */
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider initialTheme="dark">
        <LocalizationProvider initialLocale="en">
          <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#1e1e1e' }}>
            <Story />
          </div>
        </LocalizationProvider>
      </ThemeProvider>
    ),
  ],
  args: {
    ...Default.args,
    id: 'dark-window',
    title: 'Dark Theme Window',
  },
};

/**
 * Accessible theme window
 */
export const AccessibleTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider initialTheme="accessible">
        <LocalizationProvider initialLocale="en">
          <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Story />
          </div>
        </LocalizationProvider>
      </ThemeProvider>
    ),
  ],
  args: {
    ...Default.args,
    id: 'accessible-window',
    title: 'Accessible Theme Window',
  },
};
