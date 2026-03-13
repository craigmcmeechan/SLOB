# UI Suite Architecture Specification

## Overview

A complete React-based desktop application UI framework inspired by enterprise software (Microsoft Office, VS Code, Adobe, Autodesk). This specification covers the design, implementation, and extensibility of a comprehensive UI suite featuring RibbonUI, docking panels, command system, and plugin architecture.

**Target Use Case**: Full desktop-style application shells with tabbed ribbon interfaces, dockable panels, command-driven UX, and extensible plugin support.

## Design Philosophy

### Core Principles

1. **Command-First Architecture**: All UI actions flow through a centralized command registry, not direct handlers
2. **Compound Components**: Namespaced, discoverable component API (e.g., `Ribbon.Tab`, `Ribbon.Group`)
3. **Provider-Based State**: Root providers manage theme, commands, layout, and application state
4. **Slot-Based Layout**: Components declare layout intent via slots for order-independent composition
5. **Plugin Ready**: All systems designed to support runtime extension and feature modules
6. **Accessibility First**: Semantic HTML roles, keyboard navigation, ARIA structure built in

### Key Differences from Generic UI Libraries

- **Not** a component library (buttons, cards, etc.)
- **Is** an application shell framework with integrated layout, state, and extension systems
- Treats Ribbon/Menu/StatusBar as integrated systems, not independent widgets
- Every UI element reads command metadata (icon, label, enabled state, action)

---

## System Architecture

### Layer Model

```
UIProvider (Theme + Tokens)
    ↓
AppStateProvider (Document + Selection + Mode)
    ↓
CommandProvider (Actions + Shortcuts + Icon Registry)
    ↓
PluginProvider (Runtime Extensibility)
    ↓
ShellProvider (Layout + Regions)
    ↓
DockProvider (Panel Layout)
    ↓
RibbonProvider (Tab State)
    ↓
UI.Shell (Compound Components)
```

Each layer has single responsibility and can be nested.

### System Responsibilities

| System | Role | Owns |
|--------|------|------|
| **UIProvider** | Theming | CSS variables, design tokens, color modes |
| **AppStateProvider** | Application State | Document, selection, status, mode |
| **CommandProvider** | Command Registry | Actions, shortcuts, enable/disable rules |
| **PluginProvider** | Extensibility | Plugin registry, feature modules |
| **ShellProvider** | Layout Structure | Regions (menubar, ribbon, workspace, status) |
| **DockProvider** | Panel Layout | Dockable panels, region allocation, tabs |
| **RibbonProvider** | Ribbon State | Active tab, contextual tabs, collapse state |

---

## Core Systems Specification

### 1. Theme System

#### Purpose
Centralized design token management with nested theme support and CSS variable integration.

#### Features
- **CSS Variables Integration**: Theme translates to CSS custom properties
- **Nested Themes**: Support for theme override at any level
- **Design Tokens**: Standardized spacing, typography, colors
- **Dark/Light Mode**: Runtime theme switching
- **Inheritance**: Parent theme merges with child overrides

#### API
```typescript
type UITheme = {
  colors?: {
    background?: string
    surface?: string
    text?: string
    accent?: string
    [key: string]: string
  }
  spacing?: Record<string, number>
  typography?: Record<string, any>
}

// Usage
<UIProvider theme={darkTheme}>
  {/* Nested override */}
  <UIProvider theme={{ colors: { background: "#fff" } }}>
    {/* Light region inside dark theme */}
  </UIProvider>
</UIProvider>
```

#### Implementation Notes
- Theme merging: `{ ...parent, ...child }`
- CSS variable output: `--ui-bg`, `--ui-text`, etc.
- Supports component-level token overrides
- Theme context available globally via `useTheme()`

---

## Command System (CRITICAL)

### Purpose
Centralized command registry that decouples UI from business logic. Commands are metadata + behavior contracts that every UI element reads from.

### Core Concept
Commands own: label, icon, shortcut, enable/disable rules, action
UI renders: command metadata

```
Ribbon.Button → useCommand("save") → reads command metadata → renders
Menu.Item → useCommand("save") → same metadata → renders
Keyboard Shortcut → command id → executes → same action
```

### Command Model
```typescript
type Command = {
  id: string                          // Unique identifier
  label: string                       // Display label
  icon?: string                       // Icon registry key
  execute: () => void                 // Action handler
  enabled?: boolean | (() => boolean) // Enable/disable rule
  visible?: boolean | (() => boolean) // Visibility rule
  shortcut?: string                   // Keyboard shortcut (e.g., "Ctrl+S")
  state?: boolean                     // For toggles
}
```

### Why Commands Are Required
1. **Consistency**: Same command looks identical in ribbon, menu, toolbar, context menu
2. **Enable/Disable**: Central rule engine vs scattered prop drilling
3. **Undo/Redo**: Command execution can be tracked and reversed
4. **Keyboard Shortcuts**: Map shortcuts to commands, not components
5. **Analytics**: Log command execution centrally
6. **Contextual UI**: Show/hide commands based on selection state
7. **Plugin Support**: Plugins register commands, shell renders them

---

## UI Components

### Ribbon System

#### Hierarchy
```
Ribbon
  ↓ Tab (e.g., "Home", "Insert", "View")
    ↓ Group (Section with label and controls)
      ↓ Controls (Button, Toggle, Dropdown)
```

#### Features
- **Tabs**: Mutually exclusive display areas
- **Groups**: Organize related commands with visual separators
- **Controls**: Command-driven buttons, toggles, dropdowns
- **Responsive**: Collapse to icons, then dropdown on space constraint
- **Keyboard**: Tab navigation, arrow keys within groups

#### Example
```jsx
<Ribbon defaultTab="home">
  <Ribbon.Tab id="home" label="Home">
    <Ribbon.Group label="Clipboard">
      <Ribbon.Button command="paste" size="large" />
      <Ribbon.Button command="copy" />
      <Ribbon.Button command="cut" />
    </Ribbon.Group>
    
    <Ribbon.Group label="Font">
      <Ribbon.Toggle command="bold" />
      <Ribbon.Toggle command="italic" />
    </Ribbon.Group>
  </Ribbon.Tab>
</Ribbon>
```

---

### MenuBar System

#### Hierarchy
```
MenuBar
  ↓ Menu
    ↓ MenuItem (reads from command)
    ↓ MenuSeparator
```

#### Features
- Traditional File/Edit/View menus
- Keyboard navigation (arrow keys)
- Command integration (label, icon, shortcut)
- Nested submenus
- Enable/disable from command state

#### Example
```jsx
<MenuBar>
  <Menu label="File">
    <MenuItem command="save" />
    <MenuSeparator />
    <MenuItem command="exit" />
  </Menu>
</MenuBar>
```

---

### StatusBar System

#### Features
- Display application status
- Progress indicators
- Tool state display
- Multiple regions (left, center, right)
- Reactive to app state

#### Example
```jsx
<StatusBar>
  <StatusText />
  <StatusProgress source="upload.progress" />
</StatusBar>
```

---

### Shell (Layout System)

#### Purpose
Manage overall application layout with slot-based region composition.

#### Regions
- `menubar` - Application menu
- `ribbon` - Ribbon interface
- `workspace` - Main content
- `left`, `right`, `bottom` - Docking regions
- `statusbar` - Status bar

#### Key Feature: Slot-Based Composition
Components declare their region via `.slot` property:

```typescript
MenuBar.slot = "menubar"
Ribbon.slot = "ribbon"
Workspace.slot = "workspace"
StatusBar.slot = "statusbar"
```

Shell collects and renders in fixed grid layout.

#### Benefits
- Order-independent composition
- Optional regions
- Plugin-friendly
- Extensible

---

### Docking Panel System

#### Purpose
Allow users to dock panels (Explorer, Properties, Search) to edges, resize, organize in tabs.

#### Model
```
DockLayout
  ↓ DockRegion (left/right/bottom)
    ↓ DockContainer (tab stack)
      ↓ Panel (user content)
```

#### State
```typescript
type DockLayoutState = {
  left: DockContainerState[]
  right: DockContainerState[]
  bottom: DockContainerState[]
}
```

#### Features
- Multi-panel tabs per region
- Resizable regions
- Collapse/expand
- Layout persistence
- Plugin panel registration

#### Example
```jsx
<DockProvider initialLayout={layout} panels={panels}>
  <Shell>
    <Workspace>
      <DockLayout>
        <Editor />
      </DockLayout>
    </Workspace>
  </Shell>
</DockProvider>
```

---

## Plugin Architecture

### Purpose
Enable runtime UI extension without rebuilding. Plugins can add:
- Dock panels
- Commands
- Menu items
- Ribbon tabs/groups

### Plugin Model
```typescript
type UIPlugin = {
  id: string
  commands?: Command[]
  panels?: UIPanel[]
  menu?: UIMenuContribution[]
  ribbon?: UIRibbonContribution[]
  activate?: () => void | Promise<void>
  deactivate?: () => void
}
```

### Plugin Lifecycle
1. **Register**: Plugin created
2. **Activate**: Features registered in global registries
3. **Runtime**: Shell renders plugin contributions
4. **Deactivate**: Cleanup

### System Architecture
```
PluginProvider
  ↓ PluginRegistry (central store)
    ↓ CommandProvider (reads registry)
    ↓ DockProvider (reads registry)
    ↓ Ribbon/Menu (read registry)
```

### Example Plugin
```typescript
export const ExplorerPlugin: UIPlugin = {
  id: "explorer",
  panels: [{
    id: "explorer",
    title: "Explorer",
    component: ExplorerPanel,
    defaultDock: "left"
  }],
  commands: [{
    id: "toggleExplorer",
    label: "Toggle Explorer",
    icon: "folder",
    execute: () => { /* ... */ }
  }],
  activate: () => {
    console.log("Explorer activated")
  }
}

// Load at runtime
const { load } = usePluginLoader()
load(ExplorerPlugin)
```

---

## Project Structure

```
ui/
├── provider/
│   ├── UIProvider.tsx
│   ├── ThemeContext.ts
│   └── index.ts
├── state/
│   ├── AppStateProvider.tsx
│   └── useAppState.ts
├── commands/
│   ├── CommandProvider.tsx
│   ├── useCommand.ts
│   └── index.ts
├── icons/
│   ├── Icon.tsx
│   ├── iconRegistry.ts
│   └── index.ts
├── shell/
│   ├── Shell.tsx
│   ├── ShellContext.ts
│   └── index.ts
├── ribbon/
│   ├── Ribbon.tsx
│   ├── RibbonTab.tsx
│   ├── RibbonGroup.tsx
│   ├── RibbonButton.tsx
│   └── index.ts
├── menu/
│   ├── MenuBar.tsx
│   ├── Menu.tsx
│   ├── MenuItem.tsx
│   └── index.ts
├── status/
│   ├── StatusBar.tsx
│   └── index.ts
├── dock/
│   ├── DockProvider.tsx
│   ├── DockLayout.tsx
│   ├── DockRegion.tsx
│   ├── DockContainer.tsx
│   └── index.ts
├── workspace/
│   ├── Workspace.tsx
│   └── index.ts
├── plugins/
│   ├── PluginProvider.tsx
│   ├── PluginRegistry.ts
│   ├── PluginContext.ts
│   ├── types.ts
│   └── index.ts
└── index.ts (public API)
```

---

## Usage Example

```jsx
import { UIProvider, CommandProvider, Shell, MenuBar, Ribbon, Workspace, StatusBar } from "@ui/suite"

const commands = {
  save: {
    id: "save",
    label: "Save",
    icon: "save",
    shortcut: "Ctrl+S",
    execute: () => saveDocument(),
    enabled: () => document.isDirty
  }
}

function App() {
  return (
    <UIProvider theme={darkTheme}>
      <CommandProvider commands={commands}>
        <Shell>
          <MenuBar>
            <Menu label="File">
              <MenuItem command="save" />
            </Menu>
          </MenuBar>
          
          <Ribbon defaultTab="home">
            <Ribbon.Tab id="home" label="Home">
              <Ribbon.Group label="File">
                <Ribbon.Button command="save" size="large" />
              </Ribbon.Group>
            </Ribbon.Tab>
          </Ribbon>
          
          <Workspace>{editor}</Workspace>
          <StatusBar><StatusText /></StatusBar>
        </Shell>
      </CommandProvider>
    </UIProvider>
  )
}
```

---

## Icon System

### Design Pattern: Registry-Based

Commands reference icons by key, not component:

```typescript
// Command owns icon reference
command: {
  id: "save",
  icon: "save"  // Icon registry key
}

// Icon registry maps keys to components
const iconRegistry = {
  save: SaveIcon,
  copy: CopyIcon
}

// UI renders icons via registry
<Icon name={cmd.icon} size={32} />
```

### Benefits
- **Consistency**: Same icon everywhere
- **Theming**: Swap icon set globally
- **Performance**: Lazy load icon sets
- **Plugin Safe**: No component coupling

---

## CSS Foundation

### Grid Layout
```css
.ui-shell {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    "menubar menubar menubar"
    "ribbon ribbon ribbon"
    "left workspace right"
    "status status status";
  height: 100vh;
}
```

### CSS Variables
```css
:root {
  --ui-bg: #ffffff;
  --ui-text: #000000;
  --ui-accent: #0078d4;
  --ui-divider: #e0e0e0;
}

.dark-theme {
  --ui-bg: #1e1e1e;
  --ui-text: #ffffff;
  --ui-accent: #0099ff;
}
```

---

## Accessibility

### ARIA Roles
- Ribbon: `tablist`, `tab`, `tabpanel`
- Menu: `menu`, `menuitem`
- Groups: `group` with `aria-label`

### Keyboard Navigation
- Tab: Move between major regions
- Arrow keys: Within ribbon groups and menus
- Enter: Activate buttons
- Escape: Close menus

### Screen Reader Support
- Semantic HTML
- Proper landmark roles
- Descriptive labels and descriptions

---

## Implementation Order

Build in this sequence:

1. Theme system
2. Command system
3. Shell layout
4. Menu system
5. Ribbon system
6. Status bar
7. Icon system
8. Keyboard shortcuts
9. Dock system
10. Plugin system

---

## Summary

This framework provides:

- **Modular Architecture**: Clear separation of concerns
- **Production-Ready**: Matches enterprise UI standards
- **Extensible**: Plugin system for runtime features
- **Accessible**: Built-in ARIA and keyboard support
- **Themeable**: CSS variable-based design system
- **Scalable**: Supports complex desktop applications

Command-first design ensures UI consistency across all surfaces. Provider-based state enables clean data flow. Plugin system allows feature extension without code rebuilds.

Use this specification as the foundation for implementing your complete UI suite.

---

## Backstage File Menu System

### Purpose

Backstage is a full-screen file management interface (Microsoft Office pattern) that replaces traditional File menus. Accessed via "File" button, it provides:

- **Document Operations**: New, Open, Save, Save As, Print
- **Recent Files**: Searchable, filterable recent documents list
- **File Info**: Properties, sharing, version history
- **Account & Settings**: User profile, application settings, add-ins
- **Export/Sharing**: Share documents, export formats, collaborate
- **Help & Feedback**: Support, tutorials, feedback

Instead of dropdown menu, Backstage is a full-screen overlay with sidebar navigation.

### Design Pattern

```
Backstage
  ├─ NavPane (left sidebar)
  │  ├─ Home (default view)
  │  ├─ Open
  │  ├─ Save As
  │  ├─ Print
  │  ├─ Share
  │  ├─ Export
  │  ├─ Info
  │  ├─ Settings
  │  └─ Help
  │
  └─ ContentPane (right side, large)
     ├─ Recent Files List
     ├─ File Actions
     ├─ Info Panel
     └─ Content varies per navigation item
```

### Backstage API

#### Type Definitions
```typescript
type BackstageTab = {
  id: string
  label: string
  icon?: string
  command?: string         // Command to execute on click
  badge?: string           // "New", "3", etc.
  component?: React.ComponentType<any>
}

type BackstageSection = {
  id: string
  label?: string
  tabs: BackstageTab[]
}

type BackstageState = {
  activeTab: string
  isOpen: boolean
}

type RecentFile = {
  id: string
  name: string
  path: string
  lastModified: Date
  icon?: string
  pinned?: boolean
}
```

#### Backstage Component API
```typescript
type BackstageProps = {
  isOpen: boolean
  onClose: () => void
  onFileAction: (action: string, file?: any) => void
  sections?: BackstageSection[]
  recentFiles?: RecentFile[]
  accountInfo?: {
    name: string
    email: string
    avatar?: string
  }
}
```

### Core Features

#### 1. Home Tab (Default View)
Displays:
- **Recent Files** with search
- **New Document** templates/quick actions
- **Account info** (upper right)
- **File operations** (New, Open, Save As)

```jsx
<Backstage.Tab id="home" label="Home">
  <Backstage.RecentFiles files={recentFiles} />
  <Backstage.NewDocumentOptions templates={templates} />
</Backstage.Tab>
```

#### 2. Open Tab
```jsx
<Backstage.Tab id="open" label="Open">
  <Backstage.BrowseFiles onSelect={openFile} />
  <Backstage.RecentFiles files={recentFiles} />
</Backstage.Tab>
```

#### 3. Save As Tab
```jsx
<Backstage.Tab id="saveAs" label="Save As">
  <Backstage.SaveAsForm 
    defaultFormat="pdf"
    onSave={saveFile}
  />
</Backstage.Tab>
```

#### 4. Print Tab
```jsx
<Backstage.Tab id="print" label="Print">
  <Backstage.PrintPreview document={activeDocument} />
  <Backstage.PrintSettings />
</Backstage.Tab>
```

#### 5. Share Tab
```jsx
<Backstage.Tab id="share" label="Share">
  <Backstage.ShareOptions document={activeDocument} />
  <Backstage.CollaborationSettings />
</Backstage.Tab>
```

#### 6. Info Tab
Shows document properties:
- Title, author, date created/modified
- File size, location
- Sharing status
- Version history
- Permissions

```jsx
<Backstage.Tab id="info" label="Info">
  <Backstage.DocumentInfo document={activeDocument} />
  <Backstage.VersionHistory versions={versions} />
</Backstage.Tab>
```

#### 7. Export Tab
```jsx
<Backstage.Tab id="export" label="Export">
  <Backstage.ExportFormats formats={["PDF", "DOCX", "SVG"]} />
</Backstage.Tab>
```

#### 8. Settings Tab
```jsx
<Backstage.Tab id="settings" label="Settings">
  <Backstage.AppSettings />
  <Backstage.PluginSettings />
</Backstage.Tab>
```

#### 9. Help Tab
```jsx
<Backstage.Tab id="help" label="Help">
  <Backstage.SearchHelp />
  <Backstage.Tutorials />
  <Backstage.Feedback />
</Backstage.Tab>
```

### Component Hierarchy

```typescript
export const Backstage = Object.assign(BackstageRoot, {
  Tab: BackstageTab,
  Section: BackstageSection,
  NavPane: BackstageNavPane,
  ContentPane: BackstageContentPane,
  RecentFiles: BackstageRecentFiles,
  RecentFileItem: BackstageRecentFileItem,
  BrowseFiles: BackstageBrowseFiles,
  SaveAsForm: BackstageSaveAsForm,
  PrintPreview: BackstagePrintPreview,
  PrintSettings: BackstagePrintSettings,
  ShareOptions: BackstageShareOptions,
  DocumentInfo: BackstageDocumentInfo,
  VersionHistory: BackstageVersionHistory,
  ExportFormats: BackstageExportFormats,
  AppSettings: BackstageAppSettings,
  SearchHelp: BackstageSearchHelp,
  Tutorials: BackstageTutorials,
  Feedback: BackstageFeedback,
  AccountPanel: BackstageAccountPanel
})
```

### Implementation Structure

```
ui/
├── backstage/
│   ├── Backstage.tsx (Root + Compound Components)
│   ├── BackstageProvider.tsx
│   ├── BackstageContext.ts
│   ├── BackstageNavPane.tsx
│   ├── BackstageContentPane.tsx
│   ├── tabs/
│   │   ├── BackstageHome.tsx
│   │   ├── BackstageOpen.tsx
│   │   ├── BackstageSaveAs.tsx
│   │   ├── BackstagePrint.tsx
│   │   ├── BackstageShare.tsx
│   │   ├── BackstageInfo.tsx
│   │   ├── BackstageExport.tsx
│   │   ├── BackstageSettings.tsx
│   │   └── BackstageHelp.tsx
│   ├── components/
│   │   ├── RecentFiles.tsx
│   │   ├── FileGrid.tsx
│   │   ├── PrintPreview.tsx
│   │   ├── SharePanel.tsx
│   │   ├── DocumentInfo.tsx
│   │   ├── VersionHistory.tsx
│   │   ├── ExportFormatSelector.tsx
│   │   ├── SearchHelp.tsx
│   │   └── AccountPanel.tsx
│   └── index.ts
```

### Usage Example

```jsx
import { Backstage, useAppState } from "@ui/suite"

function BackstageUI({ isOpen, onClose }) {
  const { activeDocument } = useAppState()
  const [recentFiles, setRecentFiles] = useState([])
  
  const sections = [
    {
      id: "file-operations",
      tabs: [
        { id: "home", label: "Home", icon: "home" },
        { id: "open", label: "Open", icon: "folder-open" },
        { id: "saveAs", label: "Save As", icon: "save" }
      ]
    },
    {
      id: "document-actions",
      label: "Document",
      tabs: [
        { id: "print", label: "Print", icon: "printer" },
        { id: "share", label: "Share", icon: "share" },
        { id: "export", label: "Export", icon: "download" }
      ]
    },
    {
      id: "info-and-help",
      label: "Help",
      tabs: [
        { id: "info", label: "Info", icon: "info" },
        { id: "settings", label: "Settings", icon: "gear" },
        { id: "help", label: "Help", icon: "question" }
      ]
    }
  ]
  
  return (
    <BackstageProvider 
      isOpen={isOpen}
      sections={sections}
      recentFiles={recentFiles}
      onClose={onClose}
    >
      <Backstage>
        <Backstage.NavPane />
        <Backstage.ContentPane>
          <Backstage.Tab id="home" label="Home">
            <Backstage.RecentFiles files={recentFiles} />
          </Backstage.Tab>
          
          <Backstage.Tab id="open" label="Open">
            <Backstage.BrowseFiles />
          </Backstage.Tab>
          
          <Backstage.Tab id="saveAs" label="Save As">
            <Backstage.SaveAsForm />
          </Backstage.Tab>
          
          {/* ... more tabs ... */}
        </Backstage.ContentPane>
      </Backstage>
    </BackstageProvider>
  )
}

// Integration with Shell
<Shell>
  <MenuBar>
    <Menu label="File">
      <MenuItem command="openBackstage" />
    </Menu>
  </MenuBar>
  {backstageOpen && <BackstageUI isOpen={backstageOpen} onClose={closeBackstage} />}
  {/* ... rest of shell ... */}
</Shell>
```

### Backstage Context & Provider

```typescript
type BackstageContextValue = {
  activeTab: string
  setActiveTab: (id: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  sections: BackstageSection[]
  recentFiles: RecentFile[]
}

const BackstageContext = createContext<BackstageContextValue | null>(null)

export function BackstageProvider({ 
  isOpen, 
  onClose, 
  sections, 
  recentFiles,
  children 
}) {
  const [activeTab, setActiveTab] = useState("home")
  
  return (
    <BackstageContext.Provider 
      value={{ activeTab, setActiveTab, isOpen, sections, recentFiles }}
    >
      {children}
    </BackstageContext.Provider>
  )
}

export function useBackstage() {
  const ctx = useContext(BackstageContext)
  if (!ctx) throw new Error("useBackstage requires BackstageProvider")
  return ctx
}
```

### Keyboard & Navigation

- **Escape**: Close Backstage
- **Tab**: Navigate left sidebar
- **Arrow Keys**: Navigate within lists
- **Enter**: Activate selected item
- **Ctrl+O**: Open (navigate to Open tab)
- **Ctrl+S**: Save As (navigate to Save As tab)
- **Ctrl+P**: Print (navigate to Print tab)

### Accessibility

- All tabs: `role="tab"`, `aria-selected`
- Navigation pane: `role="navigation"`
- Content pane: `role="main"`
- Recent files list: `role="listbox"` with `role="option"` items
- Keyboard-navigable throughout
- Screen reader support for all panels

### CSS Layout

```css
.backstage-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--ui-bg);
  z-index: 9999;
  display: grid;
  grid-template-columns: 230px 1fr;
}

.backstage-navpane {
  grid-column: 1;
  border-right: 1px solid var(--ui-divider);
  padding: 20px 0;
}

.backstage-navpane-item {
  padding: 12px 20px;
  cursor: pointer;
  user-select: none;
}

.backstage-navpane-item.active {
  background: var(--ui-surface);
  border-left: 3px solid var(--ui-accent);
}

.backstage-contentpane {
  grid-column: 2;
  padding: 40px;
  overflow-y: auto;
}

.backstage-recentfiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.backstage-recentfile-item {
  cursor: pointer;
  padding: 12px;
  border: 1px solid var(--ui-divider);
  border-radius: 4px;
}

.backstage-recentfile-item:hover {
  background: var(--ui-surface);
}
```

### Integration with Command System

Backstage actions should trigger commands:

```typescript
const commands = {
  openBackstage: {
    id: "openBackstage",
    label: "File",
    execute: () => setBackstageOpen(true)
  },
  newDocument: {
    id: "newDocument",
    label: "New",
    icon: "document",
    shortcut: "Ctrl+N",
    execute: () => createNewDocument()
  },
  openFile: {
    id: "openFile",
    label: "Open",
    icon: "folder-open",
    shortcut: "Ctrl+O",
    execute: () => showFileDialog()
  },
  saveFile: {
    id: "saveFile",
    label: "Save",
    icon: "save",
    shortcut: "Ctrl+S",
    execute: () => saveCurrentDocument()
  },
  printFile: {
    id: "printFile",
    label: "Print",
    icon: "printer",
    shortcut: "Ctrl+P",
    execute: () => setBackstageTab("print")
  }
}
```

### Plugin Integration

Plugins can extend Backstage:

```typescript
type BackstagePluginContribution = {
  tab: BackstageTab
  section?: string  // which section to add to
  component?: React.ComponentType<any>
}

// Plugin
export const SaveToCloudPlugin: UIPlugin = {
  id: "save-to-cloud",
  backstage: [
    {
      tab: {
        id: "cloud-save",
        label: "Save to Cloud",
        icon: "cloud"
      },
      section: "file-operations",
      component: SaveToCloudPanel
    }
  ]
}
```

### Advanced Features

#### 1. Recent Files Search & Filter
```jsx
<Backstage.RecentFiles 
  files={recentFiles}
  searchable={true}
  filterOptions={["All", "Word", "Excel", "PDF"]}
  maxRecent={20}
/>
```

#### 2. File Pinning
Users can pin frequently used files:
```typescript
pinnedFiles: RecentFile[]
onTogglePin: (fileId: string) => void
```

#### 3. Collaborative Features
```jsx
<Backstage.Share>
  <ShareLink document={doc} />
  <SharedWith collaborators={collaborators} />
  <SharingPermissions />
</Backstage.Share>
```

#### 4. Version History
```jsx
<Backstage.VersionHistory 
  versions={versions}
  onRestore={(version) => restoreVersion(version)}
/>
```

#### 5. Account Panel (Top Right)
```jsx
<Backstage.AccountPanel 
  user={currentUser}
  onSignOut={signOut}
  onAccountSettings={openSettings}
/>
```

---

## Integration Summary: Complete UI Suite

When all systems work together:

```jsx
<UIProvider theme={theme}>
  <AppStateProvider>
    <CommandProvider commands={commands}>
      <PluginProvider>
        <Shell>
          {/* File Menu (Backstage) */}
          {backstageOpen && <Backstage isOpen onClose={closeBackstage} />}
          
          {/* Traditional Menu Bar */}
          <MenuBar>
            <Menu label="File">
              <MenuItem command="openBackstage" />
            </Menu>
          </MenuBar>
          
          {/* Ribbon Interface */}
          <Ribbon defaultTab="home">
            {/* Ribbon tabs and groups */}
          </Ribbon>
          
          {/* Main Work Area */}
          <Workspace>
            <DockLayout>
              <Editor />
            </DockLayout>
          </Workspace>
          
          {/* Status Feedback */}
          <StatusBar>
            <StatusText />
          </StatusBar>
        </Shell>
      </PluginProvider>
    </CommandProvider>
  </AppStateProvider>
</UIProvider>
```

This architecture supports enterprise-grade applications with professional UI patterns, extensibility, and accessibility - suitable for Office-style, CAD, video editing, or IDE-like applications.

