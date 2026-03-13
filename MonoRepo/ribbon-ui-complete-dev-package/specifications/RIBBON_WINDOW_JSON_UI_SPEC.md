# RibbonWindow - JSON-Based UI Specification System

**Purpose**: Define entire Ribbon UI application from JSON specification  
**Performance**: Optimized with React.memo and useMemo for minimal re-renders  
**Status**: Architecture & Implementation Guide

---

## Overview

Instead of writing React code to build UI, pass a JSON specification to RibbonWindow that describes:
- Ribbon structure (tabs, groups, controls)
- Dialog windows
- Popup windows
- Content area layout
- Application state

The window renders with a **loading mask** until all components are ready, then displays the complete UI.

---

## JSON Specification Structure

### Complete Application Spec

```json
{
  "appId": "document-editor",
  "title": "Document Editor",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "My Application",
    "icon": "document",
    "ribbon": {
      "tabs": [
        {
          "id": "home",
          "label": "Home",
          "groups": [
            {
              "id": "clipboard",
              "label": "Clipboard",
              "controls": [
                {
                  "id": "cut",
                  "type": "button",
                  "label": "Cut",
                  "icon": "cut",
                  "command": "edit.cut",
                  "tooltip": "Cut (Ctrl+X)"
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
              "label": "Formatting",
              "controls": [
                {
                  "id": "bold",
                  "type": "toggleButton",
                  "label": "B",
                  "icon": "bold",
                  "command": "format.bold",
                  "tooltip": "Bold (Ctrl+B)"
                },
                {
                  "id": "italic",
                  "type": "toggleButton",
                  "label": "I",
                  "icon": "italic",
                  "command": "format.italic",
                  "tooltip": "Italic (Ctrl+I)"
                }
              ]
            }
          ]
        },
        {
          "id": "edit",
          "label": "Edit",
          "groups": [
            {
              "id": "undo-redo",
              "label": "Undo/Redo",
              "controls": [
                {
                  "id": "undo",
                  "type": "button",
                  "label": "Undo",
                  "icon": "undo",
                  "command": "edit.undo"
                },
                {
                  "id": "redo",
                  "type": "button",
                  "label": "Redo",
                  "icon": "redo",
                  "command": "edit.redo"
                }
              ]
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "layout": "mainPanel|sidePanel",
      "panels": [
        {
          "id": "main",
          "type": "document",
          "component": "DocumentEditor"
        },
        {
          "id": "properties",
          "type": "properties",
          "component": "PropertiesPanel"
        }
      ]
    },
    "statusBar": {
      "sections": [
        {
          "id": "position",
          "label": "Position",
          "value": "Line 1, Column 1"
        },
        {
          "id": "mode",
          "label": "Mode",
          "value": "Insert"
        }
      ]
    }
  },
  "windows": [
    {
      "id": "search-dialog",
      "title": "Find & Replace",
      "windowType": "dialog",
      "modal": true,
      "width": 500,
      "height": 300,
      "backdrop": "dark",
      "controls": [
        {
          "id": "search-input",
          "type": "textInput",
          "label": "Find",
          "placeholder": "Enter text to find"
        },
        {
          "id": "replace-input",
          "type": "textInput",
          "label": "Replace With",
          "placeholder": "Enter replacement text"
        }
      ]
    },
    {
      "id": "properties-panel",
      "title": "Properties",
      "windowType": "popup",
      "width": 300,
      "height": 400,
      "x": 750,
      "y": 50,
      "resizable": true,
      "movable": true
    }
  ]
}
```

---

## JSON Schema Definition

### Root Schema

```typescript
interface RibbonUISpec {
  appId: string                        // Unique application identifier
  title: string                        // Application title
  version?: string                     // Spec version
  theme?: 'light' | 'dark'             // Theme
  locale?: string                      // Locale code (en, es, fr, de)
  rootWindow: RootWindowSpec           // Main window specification
  windows?: WindowSpec[]               // Additional windows (dialogs, popups)
  globalState?: Record<string, any>    // Initial application state
  metadata?: {
    createdAt?: string
    lastModified?: string
    author?: string
    description?: string
  }
}
```

### Root Window Spec

```typescript
interface RootWindowSpec {
  id: string                           // Usually "main"
  windowType: 'root'                   // Always 'root'
  title: string                        // Window title
  icon?: string                        // Window icon
  ribbon: RibbonSpec                   // Ribbon configuration
  contentArea: ContentAreaSpec          // Main content area
  statusBar?: StatusBarSpec             // Optional status bar
  layout?: 'standard' | 'custom'        // Layout type
}
```

### Ribbon Spec

```typescript
interface RibbonSpec {
  tabs: RibbonTabSpec[]
  defaultTab?: string                  // ID of default tab
  collapsible?: boolean                // Allow collapse
}

interface RibbonTabSpec {
  id: string                           // Tab unique ID
  label: string                        // Display label
  icon?: string                        // Tab icon
  groups: RibbonGroupSpec[]            // Control groups
  tooltip?: string                     // Hover tooltip
}

interface RibbonGroupSpec {
  id: string                           // Group unique ID
  label: string                        // Display label
  controls: ControlSpec[]              // Controls in group
  collapsible?: boolean                // Can collapse
  collapsed?: boolean                  // Initially collapsed
}
```

### Control Spec (All Types)

```typescript
interface ControlSpec {
  id: string                           // Control unique ID
  type: ControlType                    // 'button', 'toggleButton', 'checkbox', etc
  label?: string                       // Display label
  icon?: string                        // Icon name
  command?: string                     // Command ID to execute
  tooltip?: string                     // Hover tooltip
  disabled?: boolean                   // Initially disabled
  hidden?: boolean                     // Initially hidden
  state?: Record<string, any>          // Control-specific state
  properties?: Record<string, any>     // Control properties
}

type ControlType = 
  | 'button'
  | 'toggleButton'
  | 'splitButton'
  | 'dropdownButton'
  | 'checkbox'
  | 'radioButton'
  | 'combobox'
  | 'segmentedControl'
  | 'textInput'
  | 'numberInput'
  | 'colorPicker'
  | 'label'
  | 'separator'
  | 'icon'
  | 'badge'
  | 'gallery'
  | 'slider'
  | 'progress'
  | 'menu'
  | 'buttonGroup'
  | 'controlGroup'
  | 'toolbar'
```

### Window Spec

```typescript
interface WindowSpec {
  id: string                           // Unique window ID
  title: string                        // Window title
  windowType: 'dialog' | 'popup' | 'child'
  width?: number                       // Width in pixels
  height?: number                      // Height in pixels
  x?: number                           // X position
  y?: number                           // Y position
  modal?: boolean                      // Modal dialog
  backdrop?: 'dark' | 'light' | 'blur'
  resizable?: boolean                  // Allow resizing
  movable?: boolean                    // Allow moving
  closable?: boolean                   // Show close button
  controls?: ControlSpec[]             // Window controls
  content?: ContentAreaSpec            // Window content
}
```

### Content Area Spec

```typescript
interface ContentAreaSpec {
  type: 'grid' | 'flex' | 'stack' | 'custom'
  layout?: string                      // Layout description
  panels?: PanelSpec[]                 // Content panels
  component?: string                   // Custom component name
  props?: Record<string, any>          // Custom component props
}

interface PanelSpec {
  id: string                           // Panel unique ID
  type: 'document' | 'properties' | 'tree' | 'custom'
  component?: string                   // Component to render
  props?: Record<string, any>          // Component props
  width?: number | string              // Width (px or %)
  height?: number | string             // Height (px or %)
}
```

### Status Bar Spec

```typescript
interface StatusBarSpec {
  sections: StatusSectionSpec[]
}

interface StatusSectionSpec {
  id: string                           // Section ID
  label: string                        // Section label
  value: string                        // Display value
  width?: number                       // Width in pixels
  resizable?: boolean                  // User resizable
}
```

---

## Loading Mask Component

### Purpose

Display a loading mask while:
1. JSON spec is being parsed
2. Components are being created
3. Content is being rendered in background

Then fade out mask when ready.

### Implementation

```typescript
interface RibbonWindowLoadingMaskProps {
  isLoading: boolean                   // Show mask?
  progress?: number                    // 0-100% progress
  message?: string                     // Loading message
  estimatedTime?: number               // Estimated milliseconds
  onComplete?: () => void              // Callback when done
}

export function RibbonWindowLoadingMask({
  isLoading,
  progress = 0,
  message = 'Loading application...',
  estimatedTime,
  onComplete
}: RibbonWindowLoadingMaskProps) {
  return (
    <div 
      className={`
        ribbon-loading-mask 
        ${isLoading ? 'ribbon-loading-mask--visible' : 'ribbon-loading-mask--hidden'}
      `}
    >
      {/* Backdrop */}
      <div className="ribbon-loading-mask__backdrop" />
      
      {/* Content */}
      <div className="ribbon-loading-mask__content">
        {/* Spinner */}
        <div className="ribbon-loading-mask__spinner" />
        
        {/* Message */}
        <div className="ribbon-loading-mask__message">
          {message}
        </div>
        
        {/* Progress Bar */}
        {progress > 0 && (
          <div className="ribbon-loading-mask__progress">
            <div 
              className="ribbon-loading-mask__progress-bar"
              style={{ width: `${progress}%` }}
            />
            <span className="ribbon-loading-mask__progress-text">
              {progress}%
            </span>
          </div>
        )}
        
        {/* Estimated Time */}
        {estimatedTime && (
          <div className="ribbon-loading-mask__time">
            Estimated time: {(estimatedTime / 1000).toFixed(1)}s
          </div>
        )}
      </div>
    </div>
  )
}
```

### CSS

```css
.ribbon-loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease-out;
}

.ribbon-loading-mask--hidden {
  opacity: 0;
  pointer-events: none;
}

.ribbon-loading-mask__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}

.ribbon-loading-mask__content {
  position: relative;
  z-index: 10000;
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-width: 300px;
}

.ribbon-loading-mask__spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ribbon-loading-mask__progress {
  margin-top: 20px;
  width: 200px;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.ribbon-loading-mask__progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s ease;
}
```

---

## Performance Optimization with useMemo & React.memo

### Architecture Pattern

```typescript
// 1. Memoize spec parsing
const parsedSpec = useMemo(() => {
  return parseRibbonSpec(jsonSpec)
}, [jsonSpec])

// 2. Memoize component creation
const renderedRibbon = useMemo(() => {
  return createRibbonFromSpec(parsedSpec.ribbon)
}, [parsedSpec])

// 3. Memoize content panels
const renderedContent = useMemo(() => {
  return createContentFromSpec(parsedSpec.contentArea)
}, [parsedSpec])

// 4. Only re-render when spec changes
return (
  <RibbonWindowImpl
    spec={parsedSpec}
    ribbon={renderedRibbon}
    content={renderedContent}
  />
)
```

### Main RibbonWindow Implementation

```typescript
interface RibbonWindowFromSpecProps {
  spec: RibbonUISpec                   // JSON specification
  onLoadingComplete?: () => void       // Called when rendering done
  onError?: (error: Error) => void     // Called on error
}

export const RibbonWindowFromSpec = React.memo(({
  spec,
  onLoadingComplete,
  onError
}: RibbonWindowFromSpecProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  // 1. Parse specification (only when spec changes)
  const parsedSpec = useMemo(() => {
    try {
      setProgress(10)
      return parseRibbonUISpec(spec)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
      return null
    }
  }, [spec, onError])

  // 2. Create root window spec (only when parsed spec changes)
  const rootWindowSpec = useMemo(() => {
    if (!parsedSpec) return null
    setProgress(25)
    return parseWindowSpec(parsedSpec.rootWindow)
  }, [parsedSpec])

  // 3. Create ribbon (only when root window spec changes)
  const ribbon = useMemo(() => {
    if (!rootWindowSpec) return null
    setProgress(40)
    return <RibbonFromSpec spec={rootWindowSpec.ribbon} />
  }, [rootWindowSpec])

  // 4. Create content area (only when root window spec changes)
  const contentArea = useMemo(() => {
    if (!rootWindowSpec) return null
    setProgress(60)
    return <ContentAreaFromSpec spec={rootWindowSpec.contentArea} />
  }, [rootWindowSpec])

  // 5. Create additional windows (only when parsed spec changes)
  const windows = useMemo(() => {
    if (!parsedSpec || !parsedSpec.windows) return []
    setProgress(80)
    return parsedSpec.windows.map(windowSpec => (
      <WindowFromSpec key={windowSpec.id} spec={windowSpec} />
    ))
  }, [parsedSpec])

  // 6. Finish loading
  useEffect(() => {
    if (ribbon && contentArea) {
      setProgress(100)
      const timer = setTimeout(() => {
        setIsLoading(false)
        onLoadingComplete?.()
      }, 300) // Fade out animation time
      return () => clearTimeout(timer)
    }
  }, [ribbon, contentArea, onLoadingComplete])

  if (error) {
    return (
      <div className="ribbon-window-error">
        <h2>Error Loading Application</h2>
        <pre>{error.message}</pre>
      </div>
    )
  }

  return (
    <>
      {/* Loading Mask */}
      <RibbonWindowLoadingMask
        isLoading={isLoading}
        progress={progress}
        message="Loading application..."
      />

      {/* Main Window */}
      <RibbonWindow
        id={rootWindowSpec?.id || 'main'}
        title={rootWindowSpec?.title || spec.title}
        windowType="root"
      >
        {ribbon}
        {contentArea}
        {windows}
      </RibbonWindow>
    </>
  )
})

RibbonWindowFromSpec.displayName = 'RibbonWindowFromSpec'
```

---

## Component Creators (Memoized)

### Ribbon Creator

```typescript
interface RibbonFromSpecProps {
  spec: RibbonSpec
}

const RibbonFromSpec = React.memo(({
  spec
}: RibbonFromSpecProps) => {
  // Memoize tabs
  const tabs = useMemo(() => {
    return spec.tabs.map(tabSpec => (
      <RibbonTabFromSpec key={tabSpec.id} spec={tabSpec} />
    ))
  }, [spec.tabs])

  return (
    <Ribbon defaultTab={spec.defaultTab}>
      {tabs}
    </Ribbon>
  )
})

RibbonFromSpec.displayName = 'RibbonFromSpec'
```

### Tab Creator

```typescript
interface RibbonTabFromSpecProps {
  spec: RibbonTabSpec
}

const RibbonTabFromSpec = React.memo(({
  spec
}: RibbonTabFromSpecProps) => {
  // Memoize groups
  const groups = useMemo(() => {
    return spec.groups.map(groupSpec => (
      <RibbonGroupFromSpec key={groupSpec.id} spec={groupSpec} />
    ))
  }, [spec.groups])

  return (
    <Tab id={spec.id} label={spec.label} icon={spec.icon}>
      {groups}
    </Tab>
  )
})

RibbonTabFromSpec.displayName = 'RibbonTabFromSpec'
```

### Group Creator

```typescript
interface RibbonGroupFromSpecProps {
  spec: RibbonGroupSpec
}

const RibbonGroupFromSpec = React.memo(({
  spec
}: RibbonGroupFromSpecProps) => {
  // Memoize controls
  const controls = useMemo(() => {
    return spec.controls.map(controlSpec => (
      <ControlFromSpec key={controlSpec.id} spec={controlSpec} />
    ))
  }, [spec.controls])

  return (
    <Group label={spec.label} collapsible={spec.collapsible}>
      {controls}
    </Group>
  )
})

RibbonGroupFromSpec.displayName = 'RibbonGroupFromSpec'
```

### Control Creator (Factory)

```typescript
interface ControlFromSpecProps {
  spec: ControlSpec
}

const ControlFromSpec = React.memo(({
  spec
}: ControlFromSpecProps) => {
  // Memoize props object
  const controlProps = useMemo(() => ({
    id: spec.id,
    label: spec.label,
    icon: spec.icon,
    command: spec.command,
    tooltip: spec.tooltip,
    disabled: spec.disabled,
    hidden: spec.hidden,
    ...spec.properties
  }), [spec])

  // Factory: Create appropriate control based on type
  const ControlComponent = CONTROL_COMPONENTS[spec.type]
  
  if (!ControlComponent) {
    console.warn(`Unknown control type: ${spec.type}`)
    return null
  }

  return <ControlComponent {...controlProps} />
})

ControlFromSpec.displayName = 'ControlFromSpec'

// Control type mapping
const CONTROL_COMPONENTS = {
  button: Button,
  toggleButton: ToggleButton,
  splitButton: SplitButton,
  dropdownButton: DropdownButton,
  checkbox: Checkbox,
  radioButton: RadioButton,
  combobox: Combobox,
  segmentedControl: SegmentedControl,
  textInput: TextInput,
  numberInput: NumberInput,
  colorPicker: ColorPicker,
  label: Label,
  separator: Separator,
  icon: Icon,
  badge: Badge,
  gallery: Gallery,
  slider: Slider,
  progress: Progress,
  menu: Menu,
  buttonGroup: ButtonGroup,
  controlGroup: ControlGroup,
  toolbar: Toolbar
}
```

---

## Content Area Creator

```typescript
interface ContentAreaFromSpecProps {
  spec: ContentAreaSpec
}

const ContentAreaFromSpec = React.memo(({
  spec
}: ContentAreaFromSpecProps) => {
  // Memoize panels
  const panels = useMemo(() => {
    if (!spec.panels) return null
    return spec.panels.map(panelSpec => (
      <PanelFromSpec key={panelSpec.id} spec={panelSpec} />
    ))
  }, [spec.panels])

  // Custom component
  if (spec.component) {
    const CustomComponent = CUSTOM_COMPONENTS[spec.component]
    if (CustomComponent) {
      return <CustomComponent {...spec.props} />
    }
  }

  // Grid/flex layout
  return (
    <ContentArea type={spec.type} layout={spec.layout}>
      {panels}
    </ContentArea>
  )
})

ContentAreaFromSpec.displayName = 'ContentAreaFromSpec'
```

---

## Window Creator

```typescript
interface WindowFromSpecProps {
  spec: WindowSpec
}

const WindowFromSpec = React.memo(({
  spec
}: WindowFromSpecProps) => {
  // Memoize controls
  const controls = useMemo(() => {
    if (!spec.controls) return null
    return spec.controls.map(controlSpec => (
      <ControlFromSpec key={controlSpec.id} spec={controlSpec} />
    ))
  }, [spec.controls])

  // Memoize content
  const content = useMemo(() => {
    if (!spec.content) return controls
    return <ContentAreaFromSpec spec={spec.content} />
  }, [spec.content, controls])

  return (
    <RibbonWindow
      id={spec.id}
      title={spec.title}
      windowType={spec.windowType}
      width={spec.width}
      height={spec.height}
      x={spec.x}
      y={spec.y}
      modal={spec.modal}
      backdrop={spec.backdrop}
      resizable={spec.resizable}
      movable={spec.movable}
      closable={spec.closable}
    >
      {content}
    </RibbonWindow>
  )
})

WindowFromSpec.displayName = 'WindowFromSpec'
```

---

## Usage Example

```typescript
// Define your UI as JSON
const appSpec: RibbonUISpec = {
  appId: 'document-editor',
  title: 'Document Editor',
  rootWindow: {
    id: 'main',
    windowType: 'root',
    title: 'My Document',
    ribbon: {
      tabs: [
        {
          id: 'home',
          label: 'Home',
          groups: [
            {
              id: 'clipboard',
              label: 'Clipboard',
              controls: [
                {
                  id: 'cut',
                  type: 'button',
                  label: 'Cut',
                  icon: 'cut',
                  command: 'edit.cut'
                },
                {
                  id: 'copy',
                  type: 'button',
                  label: 'Copy',
                  icon: 'copy',
                  command: 'edit.copy'
                }
              ]
            }
          ]
        }
      ]
    },
    contentArea: {
      type: 'grid',
      component: 'DocumentEditor'
    }
  }
}

// Use in application
export function App() {
  return (
    <RibbonWindowFromSpec
      spec={appSpec}
      onLoadingComplete={() => console.log('App loaded!')}
      onError={(error) => console.error('Failed to load:', error)}
    />
  )
}
```

---

## Performance Characteristics

### Re-render Triggers

| Change | Triggers Re-render? |
|--------|-------------------|
| JSON spec changes | ✅ Yes (entire UI) |
| Single control disabled | ❌ No (control-level memo) |
| Single tab content change | ❌ No (tab-level memo) |
| Application state change | ❌ No (separate state) |
| Window position change | ❌ No (separate state) |
| Theme change | ✅ Yes (depends on implementation) |

### Memoization Levels

```
App
├── useMemo: Parsed spec
├── useMemo: Root window spec
├── useMemo: Ribbon
│   └── RibbonTabFromSpec (React.memo)
│       └── useMemo: Tabs
│           └── RibbonGroupFromSpec (React.memo)
│               └── useMemo: Groups
│                   └── ControlFromSpec (React.memo)
├── useMemo: Content area
│   └── ContentAreaFromSpec (React.memo)
│       └── useMemo: Panels
└── useMemo: Windows
    └── WindowFromSpec (React.memo)
        └── useMemo: Window controls
```

### Performance Optimization Techniques

1. **Spec Parsing**: Memoize parsing result
2. **Component Creation**: Memoize component trees
3. **React.memo**: Prevent prop-based re-renders
4. **useMemo**: Memoize intermediate values
5. **Key Prop**: Proper keys for list items
6. **Custom Comparison**: DeepEqual for prop comparison

---

## TypeScript Validation

```typescript
// Validate spec at parse time
function validateRibbonUISpec(spec: RibbonUISpec): spec is RibbonUISpec {
  if (!spec.appId) throw new Error('Missing appId')
  if (!spec.title) throw new Error('Missing title')
  if (!spec.rootWindow) throw new Error('Missing rootWindow')
  
  // Validate ribbon
  if (!spec.rootWindow.ribbon) throw new Error('Missing ribbon')
  
  // Validate all controls
  for (const tab of spec.rootWindow.ribbon.tabs) {
    for (const group of tab.groups) {
      for (const control of group.controls) {
        if (!control.id) throw new Error('Control missing ID')
        if (!control.type) throw new Error('Control missing type')
        if (!CONTROL_COMPONENTS[control.type]) {
          throw new Error(`Unknown control type: ${control.type}`)
        }
      }
    }
  }
  
  return true
}
```

---

## Error Handling

```typescript
type ValidationError = {
  type: 'spec' | 'parse' | 'render'
  message: string
  path?: string
  details?: unknown
}

const parseRibbonUISpec = (spec: any): RibbonUISpec => {
  try {
    validateRibbonUISpec(spec)
    return spec
  } catch (err) {
    const error: ValidationError = {
      type: 'spec',
      message: err instanceof Error ? err.message : String(err),
      details: spec
    }
    throw error
  }
}
```

---

## Summary

✅ **JSON-Based UI Definition**
- Entire application defined as JSON
- No React code required for UI structure
- Fully configurable

✅ **Loading Mask**
- Displays while components render
- Progress indicator
- Fade out when complete

✅ **Performance Optimization**
- useMemo at every level
- React.memo for all creators
- Only re-renders on spec change
- Lazy component creation

✅ **Type Safety**
- Full TypeScript support
- Validation at parse time
- Intellisense support

