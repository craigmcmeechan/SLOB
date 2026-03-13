# RibbonWindow Architecture & System Integration

## Overview

RibbonWindow is the foundational component that holds the entire Ribbon UI system. It serves as:
1. **Application Root** - The main container for the entire application
2. **Window Manager** - Creates and manages dialog windows, popups, and child windows
3. **System Integration Hub** - Connects Command, Theme, Icon, and State systems

---

## Application Architecture

### Before RibbonWindow

Individual ribbon controls exist in isolation:
```
Button
ToggleButton
Checkbox
Combobox
...
(22 controls, no container, no window management)
```

### After RibbonWindow

Complete application system with container and windows:
```
┌─────────────────────────────────────────┐
│        RibbonWindow (Root)              │
├─────────────────────────────────────────┤
│ ┌───────────────────────────────────┐   │
│ │  Ribbon (Tabs & Controls)         │   │
│ ├───────────────────────────────────┤   │
│ │  Home  │ Edit  │ View  │ Format   │   │
│ │  [Save][Copy][Paste]...          │   │
│ ├───────────────────────────────────┤   │
│ │                                   │   │
│ │     Main Content Area             │   │
│ │                                   │   │
│ │     (Document, Form, etc)         │   │
│ │                                   │   │
│ ├───────────────────────────────────┤   │
│ │  Status Bar                       │   │
│ └───────────────────────────────────┘   │
│                                         │
│  Window Manager (Background)            │
│  ├─ Dialog Windows (modal)              │
│ ├─ Popup Windows (modeless)             │
│  └─ Child Windows (nested docs)         │
└─────────────────────────────────────────┘
```

---

## System Layers

### Layer 1: RibbonWindow (Container)
- Root application window
- Window manager
- Focus management
- Z-ordering

### Layer 2: Ribbon System
- Tab bar with multiple tabs
- Control groups
- Command execution

### Layer 3: Controls (22)
- Action controls (Button, Toggle, Split, Dropdown)
- Selection controls (Checkbox, Radio, Combobox, Segmented)
- Input controls (Text, Number, Color)
- Display controls (Label, Separator, Icon, Badge)
- Specialized controls (Gallery, Slider, Progress, Menu)
- Container controls (ButtonGroup, ControlGroup, Toolbar)

### Layer 4: Core Systems
- Command System (executes commands)
- Theme System (colors, styles)
- Icon System (icons display)
- State System (application state)
- i18n System (localization)

---

## Component Hierarchy

```
<App>
  <RibbonWindowProvider>
    <RibbonWindow id="main" windowType="root">
      <Ribbon>
        <Tab id="home">
          <Group label="Clipboard">
            <Button command="cut" />
            <Button command="copy" />
            <Button command="paste" />
          </Group>
        </Tab>
      </Ribbon>
      
      <ContentArea>
        {/* Main application content */}
      </ContentArea>
      
      <StatusBar>
        {/* Status information */}
      </StatusBar>
      
      {/* Window Manager (manages dynamic windows) */}
    </RibbonWindow>
  </RibbonWindowProvider>
</App>
```

---

## Context Providers (Stacked)

```
App
└── CommandProvider
    └── ThemeProvider
        └── IconProvider
            └── AppStateProvider
                └── I18nProvider
                    └── RibbonWindowProvider
                        └── RibbonWindow (Root)
                            └── Ribbon
                                └── Controls
```

Each provider adds functionality:
- **CommandProvider**: Command execution and shortcuts
- **ThemeProvider**: CSS variables, dark/light mode
- **IconProvider**: Icon registry and rendering
- **AppStateProvider**: Application state management
- **I18nProvider**: Localization and translations
- **RibbonWindowProvider**: Window management

---

## Window Hierarchy

### Root Window

```
RibbonWindow (windowType="root")
├── Always visible
├── Full viewport
├── Contains: Ribbon + Content + StatusBar
├── Cannot be closed
├── Single instance per app
└── Cannot be moved/resized
```

### Dialog Windows

```
RibbonWindow (windowType="dialog", modal=true)
├── Floating over root
├── Modal (blocks parent interaction)
├── Darkened backdrop
├── Centered on parent
├── Can be closed by user
├── Multiple can exist
└── Highest z-index priority
```

### Popup Windows

```
RibbonWindow (windowType="popup", modal=false)
├── Independent windows
├── Can be positioned freely
├── Can be moved/resized
├── Can be minimized/maximized
├── Can interact with other windows
├── Multiple can exist
└── Normal z-index management
```

### Child Windows

```
RibbonWindow (windowType="child")
├── Contained within parent bounds
├── Stacked within parent
├── Part of parent lifecycle
├── Inherit parent theme
├── Can be positioned within parent
├── Multiple can exist
└── Cannot extend outside parent
```

---

## Data Flow

### Window Creation Flow

```
User Action
    │
    ▼
Component (e.g., openDialog())
    │
    ▼
useWindowManager() Hook
    │
    ▼
WindowManager.createWindow()
    │
    ├─ Generate unique ID
    ├─ Calculate position/size
    ├─ Assign z-index
    ├─ Store window state
    ├─ Subscribe to events
    │
    ▼
RibbonWindow Renders
    │
    ├─ Title bar
    ├─ Content
    ├─ Controls (min, max, close)
    ├─ Resize handle
    └─ Backdrop (if modal)
```

### Command Execution Flow

```
User Action (Click Button)
    │
    ▼
RibbonButton.onClick()
    │
    ▼
CommandContext.executeCommand()
    │
    ▼
Command System
    │
    ├─ Check command enabled
    ├─ Execute command
    ├─ Update application state
    │
    ▼
Application Response
    └─ Document saved, UI updated, etc.
```

---

## State Management

### RibbonWindow State

```typescript
{
  isOpen: boolean
  isFocused: boolean
  isMinimized: boolean
  isMaximized: boolean
  width: number
  height: number
  x: number
  y: number
  zIndex: number
}
```

### Application State

```typescript
{
  documents: Document[]
  selectedDocument: Document | null
  clipboard: ClipboardContent | null
  theme: 'light' | 'dark'
  locale: 'en' | 'es' | 'fr' | 'de'
  windows: Map<string, RibbonWindow>
  activeWindow: string | null
}
```

---

## Use Cases

### Use Case 1: Simple Document Editor

```
User starts application
    ↓
RibbonWindow root displays
    ├─ Ribbon with Home, Edit, Format, Help tabs
    ├─ Document area (empty)
    └─ Status bar (ready)

User clicks File → Open
    ↓
Dialog window opens (modal)
    ├─ File list
    ├─ Open button
    └─ Cancel button

User selects document → clicks Open
    ↓
Dialog closes
Document loads in content area
Status bar shows "Document: report.docx"
```

### Use Case 2: Multi-Document Editor

```
Document 1 open in root window

User clicks File → New Window
    ↓
New popup window opens
    ├─ Full ribbon
    ├─ Empty content area
    └─ Status bar

User opens Document 2 in popup
    ↓
Two independent windows visible
Can work on both documents simultaneously
Windows can be repositioned, resized, minimized

User clicks File → Close
    ↓
Current window closes
Other window remains open
```

### Use Case 3: Dialog & Popup Workflow

```
Main window with document open

User clicks Format → Font
    ↓
Font dialog opens (modal)
    ├─ Font family dropdown
    ├─ Font size spinner
    ├─ Preview area
    ├─ OK button
    └─ Cancel button

User cannot interact with main window
Can only close dialog with OK or Cancel

Meanwhile, user opens View → Search
    ↓
Search popup opens (non-modal, side-by-side with dialog)
    ├─ Search box
    ├─ Results list
    └─ Close button

User can interact with search independently
Dialog still blocks main window

User closes dialog
    ↓
Dialog closes, focus returns to main window
Search popup still open

User closes search
    ↓
Search popup closes
Main window fully interactive
```

---

## Integration with Existing Systems

### With Command System

```typescript
// Inside RibbonWindow
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'w') {
    // Ctrl+W: Close window
    windowManager.closeWindow(activeWindowId)
  }
}

// Command can create windows
executeCommand('windowNew', {
  windowType: 'popup',
  title: 'New Window'
})
```

### With Theme System

```typescript
// RibbonWindow uses theme CSS variables
.ribbon-window {
  background: var(--ribbon-window-bg)
  color: var(--ribbon-window-text)
  border-color: var(--ribbon-window-border)
}

// Dialog backdrop uses theme
.ribbon-window__backdrop--dark {
  background: rgba(0, 0, 0, var(--ribbon-backdrop-opacity))
}
```

### With Icon System

```typescript
// Window icons from icon registry
<RibbonWindow
  id="search-window"
  icon="search"  // Loaded from icon system
  title="Search"
/>

// Control buttons use icons
<TitleBarButton icon="minimize" />
<TitleBarButton icon="maximize" />
<TitleBarButton icon="close" />
```

### With Localization

```typescript
// Window text from i18n
const { t } = useTranslation('RibbonWindow')

<TitleBarButton
  aria-label={t('ariaLabels.close')}
  title={t('tooltips.close')}
/>

// Locale files
locales/en.json
locales/es.json
locales/fr.json
locales/de.json
```

---

## Development Timeline

### Phase 1: RibbonWindow (10-14 days)
Build the window component and manager

### Phase 2: Ribbon System (5-8 days)
Build the ribbon tab bar and groups

### Phase 3: Controls (9-11 days)
Build all 22 individual controls

### Phase 4: Systems (6-8 days)
Integrate Command, Theme, Icon, State systems

### Phase 5: Integration & Polish (2-3 days)
Full system integration and testing

**Total**: ~40 days for complete system

---

## File Organization

```
src/ui/ribbon/
├── components/
│   ├── RibbonWindow/          # Window container & manager
│   │   ├── RibbonWindow.tsx
│   │   ├── WindowManager.tsx
│   │   ├── WindowContext.tsx
│   │   └── locales/
│   │
│   ├── Ribbon/                # Ribbon tabs & groups
│   │   ├── Ribbon.tsx
│   │   ├── Tab.tsx
│   │   ├── Group.tsx
│   │   └── locales/
│   │
│   ├── controls/              # 22 individual controls
│   │   ├── Button/
│   │   ├── ToggleButton/
│   │   ├── ... (20 more)
│   │   └── Toolbar/
│   │
│   ├── StatusBar/             # Status bar component
│   │   └── StatusBar.tsx
│   │
│   └── systems/
│       ├── CommandSystem/
│       ├── ThemeSystem/
│       ├── IconSystem/
│       ├── StateSystem/
│       └── I18nSystem/
```

---

## Summary

RibbonWindow is the keystone component that:

✅ **Serves as Application Root** - Main container for entire app  
✅ **Manages Windows** - Creates dialogs, popups, child windows  
✅ **Coordinates Focus** - Focus management and z-ordering  
✅ **Integrates Systems** - Command, Theme, Icon, State, i18n  
✅ **Enables Controls** - All 22 controls work within windows  
✅ **Provides Context** - Window manager available to all components  

Without RibbonWindow, individual ribbon controls are just components.

With RibbonWindow, they become a complete, enterprise-grade UI framework.

