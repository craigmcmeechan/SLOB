# Ribbon Window Component Specification

**Component Type**: Core System Component  
**Purpose**: Root application window & dynamic window management  
**Similar To**: Windows Forms Window component  
**Status**: Architecture & Specification

---

## Overview

The RibbonWindow component acts as both the main application root and a dynamic window creator. It manages:
- Application root window (primary window)
- Dialog windows (modal, blocking interaction with parent)
- Popup windows (modeless, non-blocking)
- Child windows (nested windows)
- Window state, sizing, positioning, z-ordering
- Window lifecycle (creation, focus, minimization, maximization, closing)

### Use Cases

1. **Application Root**
   - Primary application container
   - Holds ribbon, content area, status bar
   - Manages all child windows

2. **Modal Dialog**
   - Must be closed before accessing parent window
   - Overlay with darkened background
   - Blocks interaction with other windows

3. **Modeless Popup**
   - Can interact with other windows simultaneously
   - Can be minimized/maximized
   - Independent of parent

4. **Child Window**
   - Contained within parent
   - Inherits parent's theme/styling
   - Can be docked or floating

---

## Component Architecture

### Hierarchy

```
Application Root (RibbonWindow)
├── Ribbon (tab bar, controls)
├── Content Area (main application content)
├── Status Bar (status information)
└── Window Manager
    ├── Dialog Window (modal, blocking)
    ├── Popup Window (modeless)
    ├── Child Window 1 (nested)
    ├── Child Window 2 (nested)
    └── ... (more windows)
```

---

## Props Interface

### Core Props

```typescript
interface RibbonWindowProps {
  // Window Identity
  id: string                         // Unique window identifier
  title: string                      // Window title (shown in title bar)
  windowType?: 'root' | 'dialog' | 'popup' | 'child'  // Default: 'root'
  
  // Dimensions & Position
  width?: number                     // Width in pixels
  height?: number                    // Height in pixels
  minWidth?: number                  // Minimum width (default: 300)
  minHeight?: number                 // Minimum height (default: 200)
  maxWidth?: number                  // Maximum width
  maxHeight?: number                 // Maximum height
  x?: number                         // X position (left, in pixels)
  y?: number                         // Y position (top, in pixels)
  
  // State & Behavior
  resizable?: boolean                // Allow resizing (default: true)
  movable?: boolean                  // Allow moving (default: true)
  closable?: boolean                 // Show close button (default: true)
  minimizable?: boolean              // Show minimize button (default: true)
  maximizable?: boolean              // Show maximize button (default: true)
  fullscreenable?: boolean           // Allow fullscreen (default: false)
  
  // Dialog Specific
  modal?: boolean                    // Modal dialog (blocks parent)
  backdrop?: 'dark' | 'light' | 'blur'  // Backdrop style (default: 'dark')
  closeOnBackdropClick?: boolean     // Close on backdrop click (default: false)
  
  // Icon
  icon?: string                      // Window icon (shown in title bar)
  
  // Content
  children: React.ReactNode          // Window content
  
  // Callbacks
  onClose?: () => void               // Called when window closes
  onMinimize?: () => void            // Called when minimized
  onMaximize?: () => void            // Called when maximized
  onRestore?: () => void             // Called when restored from min/max
  onMove?: (x: number, y: number) => void  // Called on move
  onResize?: (width: number, height: number) => void  // Called on resize
  onFocus?: () => void               // Called on window focus
  onBlur?: () => void                // Called on window blur
  
  // State Management
  state?: RibbonWindowState          // Explicit state object
  
  // Localization
  i18nNamespace?: string             // i18n namespace (default: 'RibbonWindow')
}
```

### Window State Interface

```typescript
interface RibbonWindowState {
  // Current State
  isOpen: boolean                    // Window visible
  isFocused: boolean                 // Window has focus
  isMinimized: boolean               // Window minimized
  isMaximized: boolean               // Window maximized
  isFullscreen: boolean              // Window fullscreen
  isLoading: boolean                 // Window loading
  
  // Dimensions
  width: number
  height: number
  x: number                          // Left position
  y: number                          // Top position
  
  // Metadata
  zIndex: number                     // Stacking order
  createdAt: Date                    // Creation time
  lastFocusedAt: Date                // Last focus time
  
  // History
  previousWidth?: number
  previousHeight?: number
  previousX?: number
  previousY?: number
}
```

---

## Window Types

### 1. Root Window

**Purpose**: Application container  
**Properties**:
- Always visible
- Takes full viewport
- Cannot be closed
- Manages all child windows
- Single instance per application

```typescript
<RibbonWindow
  id="main"
  title="Application"
  windowType="root"
  children={<ApplicationContent />}
/>
```

### 2. Dialog Window

**Purpose**: Modal interaction  
**Properties**:
- Blocks parent window interaction
- Darkened backdrop
- Centered on parent
- Can only be closed by user action
- Requires acknowledgment before proceeding

```typescript
<RibbonWindow
  id="dialog-save"
  title="Save Document"
  windowType="dialog"
  modal={true}
  width={400}
  height={200}
  backdrop="dark"
  children={<SaveDialog />}
  onClose={() => setShowDialog(false)}
/>
```

### 3. Popup Window

**Purpose**: Independent window  
**Properties**:
- Non-blocking (modeless)
- Can interact with other windows
- Can be minimized/maximized
- Independent lifespan
- Stayable (stays on top optional)

```typescript
<RibbonWindow
  id="search-panel"
  title="Search"
  windowType="popup"
  width={300}
  height={400}
  x={100}
  y={100}
  resizable={true}
  movable={true}
  children={<SearchPanel />}
/>
```

### 4. Child Window

**Purpose**: Nested document  
**Properties**:
- Contained within parent bounds
- Inherits parent theme
- Stacked within parent
- Part of parent lifecycle
- Can be docked or floating

```typescript
<RibbonWindow
  id="details-pane"
  title="Details"
  windowType="child"
  width={250}
  height={300}
  x={750}
  y={0}
  children={<DetailsPane />}
/>
```

---

## State Management

### Window Manager (Context)

```typescript
interface RibbonWindowManager {
  // Create/Destroy
  createWindow(props: RibbonWindowProps): string  // Returns window ID
  closeWindow(id: string): void
  
  // Access
  getWindow(id: string): RibbonWindow | undefined
  getAllWindows(): RibbonWindow[]
  getRootWindow(): RibbonWindow | undefined
  
  // Focus Management
  focusWindow(id: string): void
  getActiveWindow(): RibbonWindow | undefined
  
  // Batch Operations
  closeAllDialogs(): void
  closeAllPopups(): void
  minimizeAll(): void
  
  // Window Positioning
  bringToFront(id: string): void
  sendToBack(id: string): void
  centerWindow(id: string): void
  
  // Event Subscription
  subscribe(event: string, callback: Function): Unsubscribe
}
```

### Usage Example

```typescript
const windowManager = useWindowManager()

// Create dialog
const dialogId = windowManager.createWindow({
  id: 'confirm-dialog',
  title: 'Confirm Action',
  windowType: 'dialog',
  modal: true,
  width: 400,
  height: 200,
  children: <ConfirmDialog />,
  onClose: () => {
    windowManager.closeWindow(dialogId)
  }
})

// Focus window
windowManager.focusWindow(dialogId)

// Get all windows
const allWindows = windowManager.getAllWindows()
console.log(`Total windows open: ${allWindows.length}`)
```

---

## Default Sizing & Positioning

### By Window Type

| Property | Root | Dialog | Popup | Child |
|----------|------|--------|-------|-------|
| Width | 100% viewport | 400-600px | 300-800px | 200-600px |
| Height | 100% viewport | 200-400px | 300-600px | 200-400px |
| Position | Full screen | Centered | Manual | Manual |
| Resizable | No | Limited | Yes | Yes |
| Movable | No | No | Yes | Yes |
| Modal | No | Yes | No | No |

### Default Dimensions

```typescript
const DEFAULTS = {
  root: { width: '100%', height: '100%' },
  dialog: { width: 500, height: 300, x: 'center', y: 'center' },
  popup: { width: 500, height: 400, x: 100, y: 100 },
  child: { width: 300, height: 300, x: 0, y: 0 }
}
```

---

## Title Bar & Controls

### Title Bar Contents

```
┌─────────────────────────────────────────┐
│ [Icon] Title Text   [_] [□] [✕]        │
└─────────────────────────────────────────┘
  ↑      ↑             ↑   ↑   ↑
  Icon   Title         Min Max Close
```

### Buttons (Conditional)

- **Minimize** (`_`): Show if `minimizable=true` and `windowType!='dialog'`
- **Maximize/Restore** (`□`): Show if `maximizable=true` and `windowType!='dialog'`
- **Close** (`✕`): Show if `closable=true`

### Localization

```json
{
  "RibbonWindow": {
    "ariaLabels": {
      "minimize": "Minimize window",
      "maximize": "Maximize window",
      "restore": "Restore window",
      "close": "Close window",
      "titleBar": "Window title bar",
      "resizeHandle": "Resize window"
    },
    "tooltips": {
      "minimize": "Minimize",
      "maximize": "Maximize",
      "restore": "Restore",
      "close": "Close (Ctrl+W)",
      "resizeCorner": "Drag to resize",
      "resizeEdge": "Drag to resize"
    }
  }
}
```

---

## Z-Ordering & Focus Management

### Z-Index Levels

```
1000+ → Modal dialogs (highest priority)
900-999 → Popup windows
100-199 → Child windows
1 → Root window (lowest priority)
```

### Focus Behavior

1. **Dialog Focus**: Modal dialogs always on top
2. **Popup Focus**: Click brings to front
3. **Child Focus**: Click brings to front within parent
4. **Keyboard Focus**: Tab cycles through windows, Alt+Tab switches
5. **Auto Focus**: First interactive element in window

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+W` / `Alt+F4` | Close window |
| `Alt+Tab` | Switch window (when modal open) |
| `Tab` | Focus next element |
| `Shift+Tab` | Focus previous element |
| `Escape` | Close dialog (if allowed) |
| `Ctrl+Shift+W` | Close all popup windows |
| `Ctrl+Shift+M` | Minimize all windows |

---

## Accessibility Requirements (WCAG 2.1 AA)

### Aria Attributes

```typescript
<div
  role="dialog"                    // Or 'window' for non-modal
  aria-modal={isModal}             // true for dialogs
  aria-labelledby="window-title"   // Title element ID
  aria-describedby={descId}        // Description if applicable
  aria-hidden={!isVisible}         // Hidden when closed
>
```

### Keyboard Navigation

- Tab cycles through interactive elements
- Escape closes dialog (if allowed)
- Shift+Tab goes to previous element
- Alt+F4 closes window
- Focus trap in modal dialogs

### Screen Reader

- Announces window title
- Announces window type (dialog, window)
- Announces modal status
- Announces button actions

---

## Window Events & Lifecycle

### Event Sequence

```
1. createWindow()           // Window created
2. onBeforeOpen()           // Before display
3. (Window renders)
4. onOpen()                 // After display
5. (User interacts)
6. onMove/onResize events   // As user moves/resizes
7. onFocus/onBlur events    // Focus changes
8. onMinimize/onMaximize    // State changes
9. onBeforeClose()          // Before closing
10. onClose()               // After closing
11. (Cleanup)
```

### Event Example

```typescript
<RibbonWindow
  id="window-1"
  title="My Window"
  onFocus={() => console.log('Window focused')}
  onMove={(x, y) => console.log(`Moved to ${x}, ${y}`)}
  onResize={(w, h) => console.log(`Resized to ${w}x${h}`)}
  onClose={() => console.log('Window closed')}
/>
```

---

## Constraints & Collision Detection

### Boundaries

- Window cannot move outside viewport
- Window respects minimum/maximum sizes
- Dialog cannot be moved outside viewport
- Child window contained within parent bounds

### Collision Prevention

```typescript
// Calculate valid position
const validPosition = {
  x: Math.max(0, Math.min(x, viewportWidth - width)),
  y: Math.max(0, Math.min(y, viewportHeight - height))
}
```

---

## Persisting Window State

### Save to LocalStorage

```typescript
const saveWindowState = (window: RibbonWindow) => {
  const key = `window-state-${window.id}`
  localStorage.setItem(key, JSON.stringify({
    width: window.state.width,
    height: window.state.height,
    x: window.state.x,
    y: window.state.y,
    isMaximized: window.state.isMaximized
  }))
}
```

### Restore from Storage

```typescript
const restoreWindowState = (id: string): Partial<RibbonWindowState> | null => {
  const key = `window-state-${id}`
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : null
}
```

---

## Examples

### Basic Root Window

```typescript
<RibbonWindow
  id="main"
  title="My Application"
  windowType="root"
  children={
    <>
      <Ribbon />
      <MainContent />
      <StatusBar />
    </>
  }
/>
```

### Modal Dialog

```typescript
<RibbonWindow
  id="save-dialog"
  title="Save Document"
  windowType="dialog"
  modal={true}
  width={500}
  height={300}
  backdrop="dark"
  closeOnBackdropClick={false}
  children={<SaveDialogContent />}
  onClose={() => setShowDialog(false)}
/>
```

### Popup Search

```typescript
<RibbonWindow
  id="search-panel"
  title={t('RibbonWindow.panels.search') || 'Search'}
  windowType="popup"
  width={400}
  height={500}
  x={window.innerWidth - 420}
  y={80}
  resizable={true}
  movable={true}
  children={<SearchPanel />}
  onClose={() => setSearchOpen(false)}
/>
```

### Child Document Window

```typescript
<RibbonWindow
  id={`document-${docId}`}
  title={documentName}
  windowType="child"
  width={600}
  height={500}
  x={documentIndex * 50}
  y={documentIndex * 50}
  children={<DocumentEditor docId={docId} />}
/>
```

---

## Implementation Considerations

### Performance

- Lazy render off-screen windows
- Debounce move/resize events
- Memoize window components
- Use Portal for modals

### Mobile Responsiveness

- Stack windows on mobile
- Disable resize on touch
- Full-screen on small devices
- Touch-friendly button sizes (48px minimum)

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### CSS Variables

```css
--ribbon-window-bg: Window background
--ribbon-window-border: Window border color
--ribbon-window-shadow: Window shadow
--ribbon-window-titlebar-bg: Title bar background
--ribbon-window-titlebar-text: Title bar text
--ribbon-window-button-size: Control button size
--ribbon-window-border-radius: Corner roundness
--ribbon-window-transition-speed: Animation speed
```

---

## State Diagram

```
┌─────────────────────────────────────────┐
│          Window Creation                │
│         (createWindow called)           │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │   Created     │
         │ (not visible) │
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │     Open      │◄──────┐
         │  (visible)    │       │
         └───┬──────┬────┘       │
             │      │           │
             ▼      ▼           │
         ┌────┐ ┌────────┐      │
         │Min │ │Maximized│     │
         └──┬─┘ └───┬────┘      │
            └──────┬─────Restore─┘
                   ▼
            ┌──────────────┐
            │  Minimized/  │
            │  Maximized   │
            └──────┬───────┘
                   │
                   ▼
           ┌─────────────────┐
           │  Close Requested│
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │     Closed      │
           │  (destroyed)    │
           └─────────────────┘
```

---

## Integration with Ribbon System

### Window Manager Hook

```typescript
const useWindowManager = () => {
  const context = useContext(RibbonWindowContext)
  if (!context) {
    throw new Error('useWindowManager must be used within RibbonWindow')
  }
  return context
}
```

### Usage in Components

```typescript
export function MyDialog() {
  const windowManager = useWindowManager()
  
  const handleClose = () => {
    windowManager.closeWindow('my-dialog')
  }
  
  return <button onClick={handleClose}>Close</button>
}
```

---

## E2E Test Scenarios

### Test 1: Create Root Window
**Given**: No windows exist  
**When**: RibbonWindow with windowType="root" renders  
**Then**: Window is visible, takes full viewport, cannot be closed

### Test 2: Create Modal Dialog
**Given**: Root window exists  
**When**: Dialog window created with modal=true  
**Then**: Dialog appears, backdrop darkens, parent interaction blocked

### Test 3: Close Dialog
**Given**: Modal dialog open  
**When**: User clicks close button  
**Then**: Dialog closes, backdrop removed, parent interactive again

### Test 4: Focus Window
**Given**: Multiple windows open  
**When**: User clicks a window  
**Then**: Window comes to front, gains focus

### Test 5: Resize Window
**Given**: Resizable window open  
**When**: User drags resize handle  
**Then**: Window resizes, respects min/max, stays in viewport

### Test 6: Move Window
**Given**: Movable window open  
**When**: User drags title bar  
**Then**: Window moves, stays in viewport

### Test 7: Minimize/Maximize
**Given**: Window open with min/max buttons  
**When**: User clicks minimize/maximize  
**Then**: Window state changes, button updates

### Test 8: Keyboard Shortcuts
**Given**: Window focused  
**When**: User presses Ctrl+W  
**Then**: Window closes

### Test 9: Z-Index Management
**Given**: Multiple windows open  
**When**: Dialog created  
**Then**: Dialog on top, modal dialogs highest priority

### Test 10: Modal Focus Trap
**Given**: Modal dialog open  
**When**: User tabs through elements  
**Then**: Focus stays within dialog, cannot tab to parent

---

## Success Criteria

- [ ] Root window displays correctly
- [ ] Dialog windows block parent interaction
- [ ] Popup windows work independently
- [ ] Child windows render within parent bounds
- [ ] Window can be moved (if movable)
- [ ] Window can be resized (if resizable)
- [ ] Window can be minimized (if minimizable)
- [ ] Window can be maximized (if maximizable)
- [ ] Window can be closed (if closable)
- [ ] Focus management works correctly
- [ ] Z-ordering correct (dialogs on top)
- [ ] Keyboard shortcuts work
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] All localization strings present
- [ ] Window state persists (optional)
- [ ] Mobile responsive
- [ ] Cross-browser compatible

---

## Summary

The RibbonWindow component provides:

✅ **Application Root**: Full-viewport root window  
✅ **Modal Dialogs**: Blocking user interaction  
✅ **Modeless Popups**: Independent windows  
✅ **Child Windows**: Nested documents  
✅ **Full State Management**: Position, size, focus, z-order  
✅ **Accessibility**: WCAG 2.1 AA compliant  
✅ **Localization**: i18n support for all UI text  
✅ **Keyboard**: Complete shortcut support  
✅ **Responsive**: Mobile-friendly  

This component completes the Ribbon UI system as the overall application container and window manager.

