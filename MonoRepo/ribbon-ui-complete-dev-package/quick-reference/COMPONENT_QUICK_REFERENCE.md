# Component Quick Reference Guide

Fast lookup for all components and their key properties.

---

## RibbonWindow

**Location**: `src/components/RibbonWindow/`  
**Props**:
- `title`: string
- `windowType`: 'root' | 'dialog' | 'popup' | 'child'
- `ribbon?`: RibbonProps
- `toolbar?`: ToolbarProps
- `sidebars?`: { left?, right? }
- `buttonBar?`: WindowButtonBarProps

**CSS Classes**:
```
.ribbon-window
.ribbon-window--root
.ribbon-window_titlebar
.ribbon-window_content
.ribbon-window_sidebar
```

---

## Ribbon

**Location**: `src/components/Ribbon/`  
**Props**:
- `tabs`: RibbonTab[]
- `activeTabId?`: string
- `onTabChange?`: (tabId: string) => void

**CSS Classes**:
```
.ribbon-ui
.ribbon-ui_tab
.ribbon-ui_tab--active
.ribbon-ui_group
```

---

## Toolbar

**Location**: `src/components/Toolbar/`  
**Props**:
- `groups`: ToolbarGroup[]
- `orientation?`: 'horizontal' | 'vertical'

**CSS Classes**:
```
.ribbon-toolbar
.ribbon-toolbar_group
.ribbon-toolbar_separator
```

---

## Sidebar

**Location**: `src/components/TabbedSidebar/`  
**Props**:
- `position`: 'left' | 'right'
- `tabs`: SidebarTab[]
- `visible?`: boolean

**CSS Classes**:
```
.ribbon-sidebar
.ribbon-sidebar_tabs
.ribbon-sidebar_content
```

---

## ButtonBar

**Location**: `src/components/WindowButtonBar/`  
**Props**:
- `preset?`: 'ok' | 'okcancel' | 'yesno' | etc.
- `buttons`: ButtonConfig[]
- `defaultButton?`: string

**CSS Classes**:
```
.ribbon-button-bar
.ribbon-button-bar_container
```

---

## Button Control

**Variants**: default, primary, danger, success  
**Sizes**: small, medium, large  

**Props**:
- `label`: string
- `icon?`: string
- `variant?`: 'primary' | 'danger'
- `size?`: 'small' | 'large'
- `onClick?`: () => void

---

## Toggle Button

**Props**:
- `isActive`: boolean
- `onChange`: (isActive: boolean) => void
- `label`: string

---

## Checkbox

**Props**:
- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `label`: string
- `disabled?`: boolean

---

## Radio Button

**Props**:
- `name`: string
- `value`: string
- `checked`: boolean
- `onChange`: (value: string) => void

---

## Text Input

**Props**:
- `value`: string
- `onChange`: (value: string) => void
- `placeholder?`: string
- `disabled?`: boolean
- `multiline?`: boolean

---

## Number Input

**Props**:
- `value`: number
- `onChange`: (value: number) => void
- `min?`: number
- `max?`: number
- `step?`: number

---

## Combobox

**Props**:
- `options`: Option[]
- `value`: string
- `onChange`: (value: string) => void
- `searchable?`: boolean

---

## Slider

**Props**:
- `min`: number
- `max`: number
- `value`: number
- `onChange`: (value: number) => void

---

## Progress

**Props**:
- `value`: number (0-100)
- `label?`: string
- `variant?`: 'success' | 'warning' | 'danger'

---

## Badge

**Props**:
- `label`: string
- `count?`: number
- `variant?`: 'success' | 'warning' | 'danger'

---

## Icon

**Props**:
- `name`: string
- `size?`: 'small' | 'medium' | 'large'
- `color?`: string

---

## Label

**Props**:
- `text`: string
- `variant?`: 'default' | 'secondary' | 'muted'

---

## Gallery

**Props**:
- `items`: GalleryItem[]
- `selectedId?`: string
- `columns?`: number
- `onSelect?`: (itemId: string) => void

---

## Menu

**Props**:
- `items`: MenuItem[]
- `onItemSelect?`: (itemId: string) => void

---

## Button Group

**Props**:
- `buttons`: ButtonConfig[]
- `exclusive?`: boolean

---

## Control Group

**Props**:
- `label`: string
- `children`: React.ReactNode
- `orientation?`: 'horizontal' | 'vertical'

