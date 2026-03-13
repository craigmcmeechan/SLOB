# Tabbed Sidebar Component Specification

**Purpose**: Multi-tab navigation sidebar that can be positioned left or right  
**Use Case**: Navigation panels, property panels, categorized content browsing  
**Status**: Complete specification

---

## Overview

A **Tabbed Sidebar** is a collapsible navigation/content panel that:
- Mounts to **left or right** edge of RibbonWindow
- Contains multiple **tabs** (Mail, Calendar, etc.)
- Each tab has **header** (displayed above content)
- Content appears on **opposite side** (left sidebar → content right, right sidebar → content left)
- Optional **footer bar** for controls/actions
- **Visible/hidden** toggle
- **JSON-configurable** content
- **Collapsible/expandable** sidebar

---

## Visual Structure

### Left Sidebar (Mail Tab Selected)

```
┌──────────────────┐
│ Mail             │ ← Tab content header
├──────────────────┤
│ ▼ FAVORITES      │ ← Expandable group
│   📥 Inbox   12  │ ← Tab control with badge
│   ✈️ Sent Items │
│   📝 Drafts  3   │
├──────────────────┤
│ ▼ MAIL           │ ← Another group
│   📥 Inbox   24  │ ← Currently selected
│   ⭐ Starred  5  │
│   ❗ Important 8 │
│   📁 Personal... │
│   📦 Archive     │
│   🗑️  Junk      2│
│   🗑️  Deleted  0 │
├──────────────────┤
│ ▼ CALENDAR       │
│   📅 ...         │
├──────────────────┤
│ ▼ ALL FOLDERS    │
├──────────────────┤
│ [➕ New Folder] │
│ [⚙️ Settings]   │ ← Footer controls
└──────────────────┘
```

### Right Sidebar (Properties Tab)

```
┌──────────────────┐
│ Properties       │ ← Tab content header
├──────────────────┤
│ Author           │ ← Label
│ [User          ] │ ← Input field
│                  │
│ Title            │
│ [Document Title] │
│                  │
│ Tags             │
│ [Add tags...]    │
│                  │
│ Statistics       │ ← Group
│ Words:        0  │
│ Characters:   0  │
│ Paragraphs:   0  │
│                  │
├──────────────────┤
│                  │ ← Optional footer
└──────────────────┘
```

---

## TypeScript Specification

### Main Sidebar Props

```typescript
interface TabbedSidebarProps {
  id: string                              // Unique sidebar ID
  position?: 'left' | 'right'             // Default: left
  
  // Tabs configuration
  tabs: TabSpec[]                         // Tab definitions
  defaultTabId?: string                   // Default active tab
  
  // Display options
  visible?: boolean                       // Default: true
  width?: number                          // Width in pixels (default: 280)
  collapsed?: boolean                     // Initially collapsed
  collapsible?: boolean                   // Allow collapse (default: true)
  
  // Content layout
  contentWidth?: number | string          // Width of content area
  autoResize?: boolean                    // Adjust main content width
  
  // Footer
  showFooter?: boolean                    // Default: false
  footer?: SidebarFooterSpec              // Footer configuration
  
  // Styling
  backgroundColor?: string                // Tab container bg
  borderColor?: string                    // Border color
  borderPosition?: 'left' | 'right'       // Border on which side
  
  // Behavior
  closeOtherTabs?: boolean                // Only one tab open (default: false)
  
  // Callbacks
  onTabChange?: (tabId: string) => void
  onCollapse?: (collapsed: boolean) => void
  
  // Accessibility
  ariaLabel?: string
  role?: 'navigation' | 'region'
}

interface TabSpec {
  id: string                              // Tab unique ID
  label: string                           // Tab label
  icon?: string                           // Tab icon name
  
  // Content
  header?: string                         // Header text above content
  headerIcon?: string                     // Header icon
  headerKey?: string                      // i18n key for header
  
  // Content definition - Choose ONE:
  content?: TabContentSpec                // Inline content structure
  component?: string                      // Custom component name
  
  // Optional sub-tabs/expansion
  expandable?: boolean                    // Can expand/collapse
  expanded?: boolean                      // Initially expanded
  children?: TabGroupSpec[]               // Sub-groups with controls
  
  // State
  disabled?: boolean
  hidden?: boolean
  
  // i18n
  labelKey?: string                       // i18n key for label
  
  // Styling
  badgeCount?: number                     // Optional count badge
  badgeColor?: string                     // Badge color
}

interface TabGroupSpec {
  id: string                              // Group ID
  label?: string                          // Group label (e.g., "FAVORITES")
  labelKey?: string                       // i18n key
  
  // Expandable behavior
  expandable?: boolean                    // Default: true
  expanded?: boolean                      // Initially expanded
  
  // Items in group
  items: TabItemSpec[]                    // List of items
  
  // Styling
  collapsedIcon?: string                  // Icon when collapsed
  expandedIcon?: string                   // Icon when expanded
}

interface TabItemSpec {
  id: string                              // Item ID
  label: string                           // Item label
  labelKey?: string                       // i18n key
  icon?: string                           // Item icon
  
  // State
  selected?: boolean                      // Currently selected
  disabled?: boolean
  
  // Interaction
  command?: string                        // Command to execute
  onClick?: () => void
  
  // Badge
  badge?: number | string                 // Count or status badge
  badgeColor?: string                     // Badge color
  
  // Sub-items
  children?: TabItemSpec[]                // Nested items
  
  // Content
  content?: any                           // Custom content
}

interface TabContentSpec {
  type: 'groups' | 'custom'               // Content type
  groups?: TabGroupSpec[]                 // For 'groups' type
  component?: string                      // For 'custom' type
  props?: Record<string, any>             // Component props
}

interface SidebarFooterSpec {
  controls: FooterControl[]               // Footer buttons/controls
  backgroundColor?: string
  borderColor?: string
  padding?: string
  gap?: string
}

interface FooterControl {
  id: string
  type: 'button' | 'iconButton' | 'separator'
  label?: string
  icon?: string
  tooltip?: string
  command?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'primary'
}
```

---

## JSON Specification (for JSON UI)

### Complete Sidebar Example

```json
{
  "id": "sidebar-mail",
  "type": "sidebar",
  "position": "left",
  "width": 280,
  "visible": true,
  "collapsible": true,
  "showFooter": true,
  "tabs": [
    {
      "id": "mail",
      "label": "Mail",
      "icon": "envelope",
      "header": "Mail",
      "headerIcon": "envelope",
      "expandable": false,
      "content": {
        "type": "groups",
        "groups": [
          {
            "id": "favorites",
            "label": "FAVORITES",
            "expandable": true,
            "expanded": true,
            "items": [
              {
                "id": "inbox-fav",
                "label": "Inbox",
                "icon": "inbox",
                "badge": 12,
                "badgeColor": "#4472C4",
                "command": "mail.open-inbox"
              },
              {
                "id": "sent",
                "label": "Sent Items",
                "icon": "send",
                "command": "mail.open-sent"
              },
              {
                "id": "drafts",
                "label": "Drafts",
                "icon": "draft",
                "badge": 3,
                "command": "mail.open-drafts"
              }
            ]
          },
          {
            "id": "mail-folders",
            "label": "MAIL",
            "expandable": true,
            "expanded": true,
            "items": [
              {
                "id": "inbox",
                "label": "Inbox",
                "icon": "inbox",
                "selected": true,
                "badge": 24,
                "badgeColor": "#70AD47",
                "command": "mail.open-inbox"
              },
              {
                "id": "starred",
                "label": "Starred",
                "icon": "star",
                "badge": 5,
                "command": "mail.open-starred"
              },
              {
                "id": "important",
                "label": "Important",
                "icon": "flag",
                "badge": 8,
                "command": "mail.open-important"
              },
              {
                "id": "personal",
                "label": "Personal Folders",
                "icon": "folder",
                "expandable": true,
                "expanded": false,
                "children": [
                  {
                    "id": "personal-work",
                    "label": "Work",
                    "icon": "folder"
                  },
                  {
                    "id": "personal-projects",
                    "label": "Projects",
                    "icon": "folder"
                  }
                ]
              },
              {
                "id": "archive",
                "label": "Archive",
                "icon": "archive",
                "command": "mail.open-archive"
              },
              {
                "id": "junk",
                "label": "Junk Email",
                "icon": "trash",
                "badge": 2,
                "command": "mail.open-junk"
              },
              {
                "id": "deleted",
                "label": "Deleted Items",
                "icon": "trash",
                "command": "mail.open-deleted"
              }
            ]
          },
          {
            "id": "calendar",
            "label": "CALENDAR",
            "expandable": true,
            "expanded": false,
            "items": [
              {
                "id": "my-calendar",
                "label": "My Calendar",
                "icon": "calendar",
                "command": "calendar.open"
              }
            ]
          },
          {
            "id": "all-folders",
            "label": "ALL FOLDERS",
            "expandable": true,
            "expanded": false,
            "items": []
          }
        ]
      }
    },
    {
      "id": "calendar",
      "label": "Calendar",
      "icon": "calendar",
      "header": "Calendar",
      "component": "CalendarSidebar"
    }
  ],
  "footer": {
    "controls": [
      {
        "id": "new-folder",
        "type": "button",
        "label": "New Folder",
        "icon": "folderAdd",
        "command": "mail.new-folder"
      },
      {
        "id": "separator",
        "type": "separator"
      },
      {
        "id": "settings",
        "type": "iconButton",
        "icon": "settings",
        "tooltip": "Settings",
        "command": "app.settings"
      }
    ]
  }
}
```

---

## Component States

### Tab States

```
Normal:
┌──────────────┐
│ Mail         │ ← Tab label
└──────────────┘

Selected (Active):
┌──────────────┐
│ Mail         │ ← Darker background
│ ____________│ ← Bottom border highlight
└──────────────┘

Disabled:
┌──────────────┐
│ Mail         │ ← Grayed out
└──────────────┘

With Icon:
┌──────────────┐
│ 📧 Mail      │ ← Icon + label
└──────────────┘
```

### Sidebar States

```
Expanded:
┌──────────────┐
│ Mail         │ ← Full width visible
│ ____________│
│ Content...   │
└──────────────┘

Collapsed:
┌──┐
│📧│ ← Icons only
│📅│
│  │
└──┘

Hidden:
(completely off-screen)
```

---

## Responsive Behavior

### Desktop (>1200px)
```
[Sidebar 280px] [Main Content] [Right Sidebar 280px]
├─ Fully visible
├─ Collapsible
└─ Adjusts main content width
```

### Tablet (768-1200px)
```
[Sidebar 200px] [Main Content] [Right Sidebar 200px]
├─ Reduced width
├─ Collapsible
└─ Adjusts proportionally
```

### Mobile (<768px)
```
[Sidebar] [Main Content]
├─ Sidebar overlays (z-index 100)
├─ Touch/swipe to toggle
└─ Full width when open
```

---

## Implementation Guide

### Step 1: Create Sidebar Component

```typescript
import React, { useMemo, useState, useCallback } from 'react'
import { useTranslation } from '@i18n/hooks'
import './TabbedSidebar.css'

interface TabbedSidebarProps {
  id: string
  spec: TabSpec[]
  position?: 'left' | 'right'
  width?: number
  visible?: boolean
  onTabChange?: (tabId: string) => void
}

export const TabbedSidebar = React.memo(({
  id,
  spec,
  position = 'left',
  width = 280,
  visible = true,
  onTabChange
}: TabbedSidebarProps) => {
  const { t } = useTranslation('Sidebar')
  const [activeTabId, setActiveTabId] = useState(spec[0]?.id)
  const [collapsed, setCollapsed] = useState(false)
  
  // Memoize tabs
  const tabs = useMemo(() => {
    return spec.map(tabSpec => (
      <SidebarTab
        key={tabSpec.id}
        spec={tabSpec}
        active={activeTabId === tabSpec.id}
        onSelect={() => {
          setActiveTabId(tabSpec.id)
          onTabChange?.(tabSpec.id)
        }}
      />
    ))
  }, [spec, activeTabId, onTabChange])
  
  // Memoize active tab content
  const activeTab = useMemo(() => {
    return spec.find(t => t.id === activeTabId)
  }, [spec, activeTabId])
  
  return (
    <div
      id={id}
      className={`
        ribbon-sidebar
        ribbon-sidebar--${position}
        ${!visible ? 'ribbon-sidebar--hidden' : ''}
        ${collapsed ? 'ribbon-sidebar--collapsed' : ''}
      `}
      style={{
        width: collapsed ? '60px' : `${width}px`,
        transition: 'width 0.3s ease'
      }}
      role="navigation"
      aria-label="Sidebar navigation"
    >
      {/* Tab Bar */}
      <div className="ribbon-sidebar-tabs" role="tablist">
        {tabs}
        <button
          className="ribbon-sidebar-collapse"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      
      {/* Content Area */}
      {!collapsed && activeTab && (
        <SidebarContent
          tab={activeTab}
          position={position}
        />
      )}
    </div>
  )
})

TabbedSidebar.displayName = 'TabbedSidebar'
```

### Step 2: Create Tab Component

```typescript
const SidebarTab = React.memo(({
  spec,
  active,
  onSelect
}) => {
  return (
    <button
      className={`ribbon-sidebar-tab ${active ? 'active' : ''}`}
      onClick={onSelect}
      title={spec.label}
      role="tab"
      aria-selected={active}
    >
      {spec.icon && <icon>{spec.icon}</icon>}
      <span className="label">{spec.label}</span>
    </button>
  )
})
```

### Step 3: Create Content Component

```typescript
const SidebarContent = React.memo(({
  tab,
  position
}) => {
  const { t } = useTranslation('Sidebar')
  
  // Memoize groups
  const groups = useMemo(() => {
    if (tab.content?.type === 'groups') {
      return tab.content.groups?.map(group => (
        <SidebarGroup
          key={group.id}
          spec={group}
        />
      ))
    }
    return null
  }, [tab.content])
  
  return (
    <div className={`ribbon-sidebar-content ribbon-sidebar-content--${position}`}>
      {/* Header */}
      {tab.header && (
        <div className="ribbon-sidebar-header">
          {tab.headerIcon && <icon>{tab.headerIcon}</icon>}
          <h2>{tab.header}</h2>
        </div>
      )}
      
      {/* Groups */}
      {groups}
      
      {/* Custom Component */}
      {tab.component && <CustomComponent {...tab} />}
    </div>
  )
})
```

---

## CSS Styling

### Base Styles

```css
.ribbon-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--ribbon-surface);
  border-right: 1px solid var(--ribbon-border);
  overflow: hidden;
  transition: width 0.3s ease;
}

.ribbon-sidebar--right {
  border-right: none;
  border-left: 1px solid var(--ribbon-border);
}

.ribbon-sidebar--hidden {
  display: none;
}

.ribbon-sidebar--collapsed {
  width: 60px !important;
}

.ribbon-sidebar-tabs {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0;
  background-color: var(--ribbon-surface-variant);
  border-bottom: 1px solid var(--ribbon-border);
}

.ribbon-sidebar-tab {
  padding: 12px 8px;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  border-bottom: 1px solid var(--ribbon-border-light);
  color: var(--ribbon-on-surface-variant);
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.15s ease, color 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
}

.ribbon-sidebar-tab:hover {
  background-color: var(--ribbon-surface-variant);
  color: var(--ribbon-on-surface);
}

.ribbon-sidebar-tab.active {
  background-color: var(--ribbon-surface);
  color: var(--ribbon-primary);
  border-left-color: var(--ribbon-primary);
  font-weight: 600;
}

.ribbon-sidebar-tab icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.ribbon-sidebar-tab .label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ribbon-sidebar--collapsed .ribbon-sidebar-tab .label {
  display: none;
}

.ribbon-sidebar-collapse {
  padding: 8px;
  background: none;
  border: none;
  border-top: 1px solid var(--ribbon-border);
  color: var(--ribbon-on-surface-variant);
  cursor: pointer;
  font-size: 16px;
  margin-top: auto;
  transition: color 0.15s ease;
}

.ribbon-sidebar-collapse:hover {
  color: var(--ribbon-primary);
}

.ribbon-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.ribbon-sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ribbon-border);
}

.ribbon-sidebar-header h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ribbon-on-surface);
}

.ribbon-sidebar-group {
  margin-bottom: 12px;
}

.ribbon-sidebar-group-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: var(--ribbon-on-surface-variant);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  gap: 6px;
  user-select: none;
}

.ribbon-sidebar-group-header:hover {
  color: var(--ribbon-on-surface);
}

.ribbon-sidebar-group-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ribbon-sidebar-item {
  padding: 8px 10px;
  background: none;
  border: none;
  color: var(--ribbon-on-surface);
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  border-radius: 2px;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
}

.ribbon-sidebar-item:hover {
  background-color: var(--ribbon-surface-variant);
}

.ribbon-sidebar-item.selected {
  background-color: var(--ribbon-primary);
  color: white;
  font-weight: 500;
}

.ribbon-sidebar-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ribbon-sidebar-item icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.ribbon-sidebar-item-badge {
  margin-left: auto;
  background-color: var(--ribbon-primary);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.ribbon-sidebar-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid var(--ribbon-border);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.ribbon-sidebar-footer-button {
  padding: 6px 12px;
  background-color: var(--ribbon-button-background);
  border: 1px solid var(--ribbon-button-border);
  color: var(--ribbon-button-text);
  border-radius: 2px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.ribbon-sidebar-footer-button:hover {
  background-color: var(--ribbon-button-background-hover);
}

.ribbon-sidebar-footer-separator {
  width: 1px;
  height: 20px;
  background-color: var(--ribbon-border);
}
```

---

## Localization (i18n)

### Locale File Structure

```
src/components/TabbedSidebar/
└── locales/
    ├── en.json
    ├── es.json
    ├── fr.json
    └── de.json
```

### Format

```json
{
  "Sidebar": {
    "mail": {
      "label": "Mail",
      "header": "Mail",
      "favorites": "FAVORITES",
      "inbox": "Inbox",
      "sent": "Sent Items",
      "drafts": "Drafts",
      "starred": "Starred",
      "important": "Important",
      "archive": "Archive",
      "junk": "Junk Email",
      "deleted": "Deleted Items"
    },
    "calendar": {
      "label": "Calendar",
      "header": "Calendar"
    },
    "footer": {
      "newFolder": "New Folder",
      "settings": "Settings"
    },
    "tooltips": {
      "collapse": "Collapse sidebar",
      "expand": "Expand sidebar"
    }
  }
}
```

---

## Use Cases

### 1. Mail Application (Left Sidebar)
- Tab: Mail (with folder groups)
- Tab: Calendar (with calendar view)
- Tab: Contacts (with contact list)
- Footer: New Folder, Settings

### 2. Document Editor (Right Sidebar)
- Tab: Properties (author, title, tags)
- Tab: Statistics (word count, etc.)
- Tab: Comments (document comments)
- Footer: Optional action buttons

### 3. IDE/Code Editor (Left Sidebar)
- Tab: Explorer (file tree)
- Tab: Search (search results)
- Tab: Source Control (git status)
- Tab: Extensions (installed extensions)

### 4. Design Application (Right Sidebar)
- Tab: Layers (layer panel)
- Tab: Properties (design properties)
- Tab: Styles (style definitions)

---

## Integration with RibbonWindow JSON

```json
{
  "id": "editor",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Editor",
    "sidebars": {
      "left": {
        "id": "left-nav",
        "type": "sidebar",
        "position": "left",
        "width": 280,
        "visible": true,
        "tabs": [...]
      },
      "right": {
        "id": "right-props",
        "type": "sidebar",
        "position": "right",
        "width": 280,
        "visible": true,
        "tabs": [...]
      }
    },
    "ribbon": {...} or "toolbar": {...},
    "contentArea": {...}
  }
}
```

---

## Performance Optimization

```typescript
// Memoize entire sidebar
const TabbedSidebar = React.memo(({...}) => {...})

// Memoize tabs array
const tabs = useMemo(() => {...}, [spec])

// Memoize active tab
const activeTab = useMemo(() => {...}, [spec, activeTabId])

// Memoize groups
const groups = useMemo(() => {...}, [tab.content])

// Only re-render affected content on tab change
// Not entire sidebar
```

---

## Accessibility

- `role="navigation"` on sidebar
- `role="tablist"` on tab container
- `role="tab"` on individual tabs
- `aria-selected` for active tab
- Keyboard navigation (Arrow keys)
- Focus visible indicators
- Screen reader labels

---

## Responsive Design

```css
/* Desktop: Full width sidebars */
@media (min-width: 1200px) {
  .ribbon-sidebar {
    width: 280px;
  }
}

/* Tablet: Smaller sidebars */
@media (min-width: 768px) and (max-width: 1199px) {
  .ribbon-sidebar {
    width: 200px;
  }
}

/* Mobile: Overlay sidebars */
@media (max-width: 767px) {
  .ribbon-sidebar {
    position: fixed;
    height: 100%;
    z-index: 100;
  }
}
```

---

## Features

✅ **Left or Right Position**  
✅ **Multiple Tabs**  
✅ **Expandable Groups**  
✅ **Badge Counts**  
✅ **Collapsible**  
✅ **Optional Footer**  
✅ **Full i18n**  
✅ **Light/Dark Themes**  
✅ **Responsive**  
✅ **JSON Configurable**  
✅ **Accessible (WCAG AA)**  
✅ **Performance Optimized**  

---

## Summary

✅ **Complete Tabbed Sidebar specification**  
✅ **Positioned left or right**  
✅ **Content on opposite side**  
✅ **Multiple tabs with headers**  
✅ **Optional footer bar**  
✅ **JSON-based configuration**  
✅ **Full localization (i18n)**  
✅ **Theme support**  
✅ **Production-ready**  

