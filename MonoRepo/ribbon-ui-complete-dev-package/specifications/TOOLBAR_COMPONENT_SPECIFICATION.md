# Toolbar Component Specification

**Purpose**: Simplified control container for linear command presentation  
**Use Case**: Top-level action bars, optional ribbon alternative, quick access toolbars  
**Status**: Complete specification

---

## Overview

A **Toolbar** is a simplified alternative to the Ribbon UI, providing a clean, horizontal button container ideal for:

- **Simple applications** (don't need Ribbon complexity)
- **Quick access toolbars** (supplementary to Ribbon)
- **Modal dialogs** (toolbar instead of buttons)
- **Web-native apps** (lightweight alternative to Ribbon)

Unlike Ribbon (tabs → groups → controls), Toolbar is flat: **Toolbar → Groups → Controls**

---

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Cut] [Copy] [Paste] │ [Bold] [Italic] [Underline]  [▼] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
  Group 1                 Group 2 (separator)                
  (Clipboard)             (Formatting)

Icon Only:          [Cut icon]
Icon + Text:        [Cut icon] Cut
Icon + Text Right:  [Cut] Cut (text to right)
Large Icons:        [Cut icon - larger] Cut
```

---

## TypeScript Specification

### Main Toolbar Props

```typescript
interface ToolbarProps {
  id: string                           // Unique toolbar ID
  groups: ToolbarGroupSpec[]           // Control groups
  
  // Display options
  orientation?: 'horizontal' | 'vertical'  // Default: horizontal
  size?: 'small' | 'medium' | 'large'      // Default: medium
  
  // Icon styling
  iconStyle?: 'iconOnly' | 'iconWithText' | 'textOnly'
  iconPosition?: 'left' | 'top'        // Text position relative to icon
  iconSize?: 'small' | 'medium' | 'large'  // 16px, 24px, 32px
  
  // Layout
  wrap?: boolean                       // Allow wrapping (default: false)
  compact?: boolean                    // Reduce spacing (default: false)
  
  // Styling
  backgroundColor?: string
  borderRadius?: string
  padding?: string
  gap?: string                         // Space between groups
  
  // Accessibility
  ariaLabel?: string
  ariaDescription?: string
  
  // Callbacks
  onControlClick?: (controlId: string) => void
  onCommandExecute?: (command: string) => void
}

interface ToolbarGroupSpec {
  id: string                           // Group ID
  label?: string                       // Optional group label
  controls: ToolbarControlSpec[]       // Controls in group
  separator?: 'before' | 'after' | 'both'  // Visual separator
  collapsible?: boolean                // Can collapse (default: false)
  collapsed?: boolean                  // Initially collapsed
  
  // Styling
  backgroundColor?: string
  borderRadius?: string
  padding?: string
  gap?: string                         // Space between controls
}

interface ToolbarControlSpec {
  id: string                           // Control ID
  type: ControlType                    // 'button', 'toggleButton', 'separator', etc
  
  // Display
  label?: string                       // Button text (if iconWithText)
  icon?: string                        // Icon name
  tooltip?: string                     // Hover tooltip
  
  // State
  disabled?: boolean
  hidden?: boolean
  pressed?: boolean                    // For toggle buttons
  
  // Behavior
  command?: string                     // Command ID to execute
  onClick?: () => void                 // Click handler
  
  // Styling overrides
  variant?: 'default' | 'primary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  
  // Dropdown
  dropdown?: ToolbarDropdownSpec
  
  // i18n
  labelKey?: string                    // i18n key for label
  tooltipKey?: string                  // i18n key for tooltip
}

interface ToolbarDropdownSpec {
  items: ToolbarDropdownItem[]
  direction?: 'down' | 'up' | 'right'  // Default: down
  trigger?: 'click' | 'hover'          // Default: click
}

interface ToolbarDropdownItem {
  id: string
  label: string
  icon?: string
  command?: string
  disabled?: boolean
  separator?: boolean
  submenu?: ToolbarDropdownItem[]
}

type ControlType = 
  | 'button'
  | 'toggleButton'
  | 'splitButton'
  | 'dropdownButton'
  | 'separator'
  | 'spacer'
  | 'label'
  | 'textInput'
  | 'combobox'
  | 'colorPicker'
```

---

## JSON Specification (for JSON UI)

### Toolbar in JSON

```json
{
  "id": "main-toolbar",
  "type": "toolbar",
  "orientation": "horizontal",
  "size": "medium",
  "iconStyle": "iconWithText",
  "iconPosition": "left",
  "gap": "4px",
  "groups": [
    {
      "id": "clipboard",
      "controls": [
        {
          "id": "cut",
          "type": "button",
          "label": "Cut",
          "icon": "cut",
          "command": "edit.cut",
          "tooltip": "Cut (Ctrl+X)",
          "labelKey": "toolbar.cut",
          "tooltipKey": "toolbar.tooltip.cut"
        },
        {
          "id": "copy",
          "type": "button",
          "label": "Copy",
          "icon": "copy",
          "command": "edit.copy",
          "tooltip": "Copy (Ctrl+C)"
        },
        {
          "id": "paste",
          "type": "button",
          "label": "Paste",
          "icon": "paste",
          "command": "edit.paste",
          "tooltip": "Paste (Ctrl+V)"
        }
      ]
    },
    {
      "id": "formatting",
      "separator": "before",
      "controls": [
        {
          "id": "bold",
          "type": "toggleButton",
          "label": "Bold",
          "icon": "bold",
          "command": "format.bold",
          "tooltip": "Bold (Ctrl+B)"
        },
        {
          "id": "italic",
          "type": "toggleButton",
          "label": "Italic",
          "icon": "italic",
          "command": "format.italic",
          "tooltip": "Italic (Ctrl+I)"
        },
        {
          "id": "underline",
          "type": "toggleButton",
          "label": "Underline",
          "icon": "underline",
          "command": "format.underline",
          "tooltip": "Underline (Ctrl+U)"
        }
      ]
    },
    {
      "id": "alignment",
      "separator": "before",
      "controls": [
        {
          "id": "align-left",
          "type": "button",
          "icon": "alignLeft",
          "tooltip": "Align Left"
        },
        {
          "id": "align-center",
          "type": "button",
          "icon": "alignCenter",
          "tooltip": "Align Center"
        },
        {
          "id": "align-right",
          "type": "button",
          "icon": "alignRight",
          "tooltip": "Align Right"
        }
      ]
    }
  ]
}
```

---

## Icon Styles

### 1. Icon Only
```
┌────┐  ┌────┐  ┌────┐
│ ✂️  │  │ 📋  │  │ 📄  │
└────┘  └────┘  └────┘
 Cut     Copy    Paste

Best for: Familiar icons, space-constrained, web apps
Size: 24px (medium)
Hover shows tooltip
```

### 2. Icon With Text (Text to Right)
```
┌────┬──────┐  ┌────┬──────┐  ┌────┬──────┐
│ ✂️  │ Cut  │  │ 📋  │ Copy │  │ 📄  │Paste│
└────┴──────┘  └────┴──────┘  └────┴──────┘

Best for: Learning users, important commands
Size: 24px icon + 13px text
Padding: 6px vertical, 8px horizontal
```

### 3. Icon With Text (Text Below)
```
   ✂️          📋          📄
  Cut         Copy        Paste

Best for: Large toolbars, touch interfaces
Size: 32px icon + 11px text
Padding: 8px all
```

### 4. Text Only
```
[Cut] [Copy] [Paste] [Bold] [Italic]

Best for: Unfamiliar commands, mobile
Font: 12px, medium weight
Padding: 6px 10px
```

---

## Button Sizing

```typescript
interface ToolbarButtonSize {
  'small': {
    padding: '4px 8px',
    fontSize: '11px',
    minHeight: '20px'
  },
  'medium': {
    padding: '6px 12px',
    fontSize: '13px',
    minHeight: '24px'
  },
  'large': {
    padding: '8px 16px',
    fontSize: '14px',
    minHeight: '28px'
  }
}
```

---

## Component States

```typescript
interface ToolbarButtonState {
  normal: {
    background: '#F5F5F5',
    border: '#D9D9D9',
    color: '#262626',
    opacity: 1
  },
  hover: {
    background: '#EBEBEB',
    border: '#D9D9D9',
    color: '#262626',
    opacity: 1
  },
  active: {
    background: '#D9D9D9',
    border: '#D9D9D9',
    color: '#262626',
    opacity: 1
  },
  pressed: {
    // Toggle button when pressed
    background: '#4472C4',
    border: '#4472C4',
    color: '#FFFFFF',
    opacity: 1
  },
  disabled: {
    background: '#F5F5F5',
    border: '#D9D9D9',
    color: '#999999',
    opacity: 0.5
  },
  focus: {
    outline: '2px solid #4472C4',
    outlineOffset: '2px'
  }
}
```

---

## Separators & Spacing

### Visual Separators

```
Group 1              Group 2
[Cut][Copy][Paste]  │  [Bold][Italic]

Separator = 1px line, height = button height - 6px
Color (light theme): #D9D9D9
Color (dark theme): #565656
Margin: 4px horizontal
```

### Spacers

```typescript
{
  id: "space-1",
  type: "spacer",
  width: "16px"  // or flexible: true for flex-grow
}
```

---

## Dropdown Buttons in Toolbar

### Implementation

```typescript
interface ToolbarDropdownButton {
  id: "dropdown-format",
  type: "dropdownButton",
  label: "Format",
  icon: "format",
  tooltip: "Format options",
  dropdown: {
    items: [
      { id: "fmt-bold", label: "Bold", command: "format.bold" },
      { id: "fmt-italic", label: "Italic", command: "format.italic" },
      { separator: true },
      { id: "fmt-clear", label: "Clear Formatting", command: "format.clear" }
    ],
    direction: "down",
    trigger: "click"
  }
}
```

### Visual

```
┌──────────────┐
│ Format ▼     │
└──────────────┘
    │
    ├─ Bold
    ├─ Italic
    ├─ ─────
    └─ Clear

On click: dropdown appears
On escape or click outside: closes
```

---

## Localization (i18n)

### Toolbar Locale File Structure

```
src/
└── components/
    └── Toolbar/
        ├── Toolbar.tsx
        ├── Toolbar.css
        ├── Toolbar.test.tsx
        └── locales/
            ├── en.json      (REQUIRED)
            ├── es.json
            ├── fr.json
            └── de.json
```

### Locale File Format

```json
{
  "Toolbar": {
    "clipboard": {
      "label": "Clipboard",
      "cut": {
        "label": "Cut",
        "tooltip": "Cut (Ctrl+X)"
      },
      "copy": {
        "label": "Copy",
        "tooltip": "Copy (Ctrl+C)"
      },
      "paste": {
        "label": "Paste",
        "tooltip": "Paste (Ctrl+V)"
      }
    },
    "formatting": {
      "label": "Formatting",
      "bold": {
        "label": "Bold",
        "tooltip": "Bold (Ctrl+B)"
      },
      "italic": {
        "label": "Italic",
        "tooltip": "Italic (Ctrl+I)"
      },
      "underline": {
        "label": "Underline",
        "tooltip": "Underline (Ctrl+U)"
      }
    },
    "alignment": {
      "label": "Alignment",
      "left": {
        "tooltip": "Align Left"
      },
      "center": {
        "tooltip": "Align Center"
      },
      "right": {
        "tooltip": "Align Right"
      }
    }
  }
}
```

### Usage in Component

```typescript
const Toolbar = ({ spec }) => {
  const { t } = useTranslation('Toolbar')
  
  return (
    <toolbar>
      {spec.groups.map(group => (
        <div key={group.id}>
          {group.controls.map(control => (
            <button
              key={control.id}
              title={t(`${group.id}.${control.id}.tooltip`)}
            >
              {t(`${group.id}.${control.id}.label`)}
            </button>
          ))}
        </div>
      ))}
    </toolbar>
  )
}
```

---

## Implementation Guide

### Step 1: Create Toolbar Component

```typescript
import React, { useMemo, useCallback } from 'react'
import { useTranslation } from '@i18n/hooks'
import { useCommandContext } from '@context/CommandContext'
import './Toolbar.css'

interface ToolbarProps {
  id: string
  spec: ToolbarSpec
  theme?: 'light' | 'dark'
  onCommandExecute?: (command: string) => void
}

export const Toolbar = React.memo(({
  id,
  spec,
  theme = 'light',
  onCommandExecute
}: ToolbarProps) => {
  const { t } = useTranslation('Toolbar')
  const { executeCommand } = useCommandContext()
  
  // Memoize groups
  const groups = useMemo(() => {
    return spec.groups.map(group => (
      <ToolbarGroup
        key={group.id}
        spec={group}
        theme={theme}
        onCommandExecute={onCommandExecute}
      />
    ))
  }, [spec.groups, theme, onCommandExecute])
  
  return (
    <div
      id={id}
      className={`ribbon-toolbar ribbon-toolbar--${spec.orientation || 'horizontal'} ribbon-toolbar--${theme}`}
      style={{
        padding: spec.padding || '4px',
        gap: spec.gap || '4px'
      }}
      role="toolbar"
      aria-label={spec.ariaLabel}
    >
      {groups}
    </div>
  )
})

Toolbar.displayName = 'Toolbar'
```

### Step 2: Create ToolbarGroup Component

```typescript
const ToolbarGroup = React.memo(({
  spec,
  theme,
  onCommandExecute
}) => {
  const controls = useMemo(() => {
    return spec.controls.map(control => (
      <ToolbarControl
        key={control.id}
        spec={control}
        theme={theme}
        onCommandExecute={onCommandExecute}
      />
    ))
  }, [spec.controls, theme, onCommandExecute])
  
  return (
    <div className="ribbon-toolbar-group" role="group">
      {controls}
      {spec.separator && <div className="ribbon-toolbar-separator" />}
    </div>
  )
})
```

### Step 3: Create ToolbarControl Factory

```typescript
const ToolbarControl = React.memo(({
  spec,
  theme,
  onCommandExecute
}) => {
  const handleClick = useCallback(() => {
    if (spec.command) {
      onCommandExecute?.(spec.command)
    }
  }, [spec.command, onCommandExecute])
  
  switch (spec.type) {
    case 'button':
      return <ToolbarButton spec={spec} onClick={handleClick} />
    case 'toggleButton':
      return <ToolbarToggleButton spec={spec} onClick={handleClick} />
    case 'separator':
      return <div className="ribbon-toolbar-separator" />
    case 'dropdownButton':
      return <ToolbarDropdownButton spec={spec} />
    default:
      return null
  }
})
```

---

## CSS Styling

### Base Styles

```css
.ribbon-toolbar {
  display: flex;
  align-items: center;
  background-color: var(--ribbon-surface);
  border-bottom: 1px solid var(--ribbon-border);
  padding: 4px;
  gap: 4px;
  min-height: 32px;
}

.ribbon-toolbar--vertical {
  flex-direction: column;
  align-items: flex-start;
}

.ribbon-toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ribbon-toolbar-separator {
  width: 1px;
  height: 24px;
  background-color: var(--ribbon-border);
  margin: 0 4px;
}

.ribbon-toolbar-button {
  padding: 6px 12px;
  border: 1px solid var(--ribbon-button-border);
  background-color: var(--ribbon-button-background);
  color: var(--ribbon-button-text);
  border-radius: 2px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.ribbon-toolbar-button:hover {
  background-color: var(--ribbon-button-background-hover);
}

.ribbon-toolbar-button:active {
  background-color: var(--ribbon-button-background-active);
}

.ribbon-toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ribbon-toolbar-button--icon-only {
  padding: 6px;
  width: 24px;
  justify-content: center;
}

.ribbon-toolbar-button--toggle.pressed {
  background-color: var(--ribbon-primary);
  border-color: var(--ribbon-primary);
  color: white;
}
```

---

## Theme Support

### Light Theme

```css
.ribbon-toolbar--light {
  background-color: #FFFFFF;
  border-color: #D9D9D9;
}

.ribbon-toolbar--light .ribbon-toolbar-button {
  background-color: #F5F5F5;
  border-color: #D9D9D9;
  color: #262626;
}

.ribbon-toolbar--light .ribbon-toolbar-button:hover {
  background-color: #EBEBEB;
}

.ribbon-toolbar--light .ribbon-toolbar-separator {
  background-color: #D9D9D9;
}
```

### Dark Theme

```css
.ribbon-toolbar--dark {
  background-color: #2D2D30;
  border-color: #565656;
}

.ribbon-toolbar--dark .ribbon-toolbar-button {
  background-color: #3E3E42;
  border-color: #565656;
  color: #CCCCCC;
}

.ribbon-toolbar--dark .ribbon-toolbar-button:hover {
  background-color: #4E4E52;
}

.ribbon-toolbar--dark .ribbon-toolbar-separator {
  background-color: #565656;
}
```

---

## Accessibility

- `role="toolbar"` on container
- `role="group"` on groups
- Proper ARIA labels
- Keyboard navigation (Tab, Arrow keys)
- Focus visible (2px outline)
- Tooltip on hover/focus
- Disabled state indicated by opacity + cursor

---

## Performance Optimization

```typescript
// Memoize entire toolbar
const Toolbar = React.memo(({...}) => {...})

// Memoize groups
const groups = useMemo(() => {...}, [spec.groups])

// Memoize controls
const controls = useMemo(() => {...}, [spec.controls])

// Only re-render if spec changes (not on state)
```

---

## Use Cases

### 1. Simple Document Editor

```json
{
  "id": "editor-toolbar",
  "type": "toolbar",
  "iconStyle": "iconWithText",
  "groups": [
    {
      "id": "file",
      "controls": [
        { "id": "new", "label": "New", "icon": "new", "command": "file.new" },
        { "id": "open", "label": "Open", "icon": "open", "command": "file.open" },
        { "id": "save", "label": "Save", "icon": "save", "command": "file.save" }
      ]
    },
    {
      "id": "edit",
      "separator": "before",
      "controls": [
        { "id": "undo", "label": "Undo", "icon": "undo", "command": "edit.undo" },
        { "id": "redo", "label": "Redo", "icon": "redo", "command": "edit.redo" }
      ]
    }
  ]
}
```

### 2. Icon-Only Web Toolbar

```json
{
  "id": "web-toolbar",
  "type": "toolbar",
  "iconStyle": "iconOnly",
  "size": "small",
  "compact": true,
  "groups": [...]
}
```

### 3. Dialog Toolbar

```json
{
  "id": "dialog-toolbar",
  "type": "toolbar",
  "groups": [
    {
      "id": "actions",
      "controls": [
        { "id": "search", "type": "textInput", "placeholder": "Search..." },
        { "id": "btn-search", "label": "Search", "command": "dialog.search" }
      ]
    }
  ]
}
```

---

## Summary

✅ **Simplified control container**
- Flat structure (no tabs/groups complexity)
- Multiple icon styles (icon-only, icon+text)
- Flexible sizing and spacing

✅ **Full i18n support**
- Per-group, per-control translations
- Tooltip localization
- Label localization

✅ **Complete theming**
- Light and dark themes
- Custom styling options
- CSS variables

✅ **Accessibility**
- ARIA roles and labels
- Keyboard navigation
- Focus management

✅ **Performance optimized**
- React.memo for all components
- useMemo for collections
- Only re-renders on spec change

