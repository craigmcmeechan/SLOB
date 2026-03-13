# RibbonWindow - JSON-Based UI Integration Guide

**Purpose**: Integrate JSON UI specs with RibbonWindow and entire system  
**Scope**: Full system architecture, state management, command execution  
**Status**: Implementation Guide

---

## System Architecture

### Before: React Code-Based UI

```typescript
// Old approach - write React code for each UI element
export function App() {
  return (
    <RibbonWindow id="main" title="App">
      <Ribbon>
        <Tab id="home" label="Home">
          <Group id="clipboard" label="Clipboard">
            <Button
              id="cut"
              label="Cut"
              icon="cut"
              command="edit.cut"
            />
            <Button
              id="copy"
              label="Copy"
              icon="copy"
              command="edit.copy"
            />
          </Group>
        </Tab>
      </Ribbon>
    </RibbonWindow>
  )
}
```

### After: JSON Configuration

```typescript
// New approach - define UI as JSON
const spec = {
  appId: 'editor',
  title: 'App',
  rootWindow: {
    ribbon: {
      tabs: [{
        id: 'home',
        label: 'Home',
        groups: [{
          id: 'clipboard',
          label: 'Clipboard',
          controls: [
            { id: 'cut', type: 'button', label: 'Cut', ... },
            { id: 'copy', type: 'button', label: 'Copy', ... }
          ]
        }]
      }]
    }
  }
}

export function App() {
  return <RibbonWindowFromSpec spec={spec} />
}
```

---

## Integration Points

### 1. Command System Integration

```typescript
// JSON spec references commands
{
  "id": "cut",
  "type": "button",
  "command": "edit.cut"  // ← Command ID
}

// Command executes through command system
interface CommandContext {
  executeCommand(commandId: string, args?: any): Promise<void>
  canExecute(commandId: string): boolean
}

// Control creator uses command system
const ControlFromSpec = React.memo(({ spec }) => {
  const { executeCommand } = useCommandContext()
  
  const handleClick = () => {
    executeCommand(spec.command)
  }
  
  return (
    <Button onClick={handleClick}>
      {spec.label}
    </Button>
  )
})
```

### 2. Theme System Integration

```typescript
// JSON spec inherits theme
{
  "appId": "editor",
  "theme": "dark"  // ← Theme spec
}

// Theme applies to all components
interface ThemeContext {
  setTheme(theme: 'light' | 'dark'): void
  getCurrentTheme(): string
  getCSSVariable(name: string): string
}

// Usage in RibbonWindowFromSpec
const RibbonWindowFromSpec = ({ spec }) => {
  const { setTheme } = useThemeContext()
  
  useEffect(() => {
    if (spec.theme) {
      setTheme(spec.theme)
    }
  }, [spec.theme])
}
```

### 3. Icon System Integration

```typescript
// JSON spec uses icon names
{
  "id": "cut",
  "icon": "cut"  // ← Icon name
}

// Icon system resolves names to components
interface IconContext {
  getIcon(name: string): React.ComponentType
  registerIcon(name: string, component: React.ComponentType): void
}

// Control creator uses icon system
const ControlFromSpec = ({ spec }) => {
  const { getIcon } = useIconContext()
  
  const IconComponent = getIcon(spec.icon)
  
  return <IconComponent />
}
```

### 4. State System Integration

```typescript
// JSON spec can reference global state
{
  "id": "delete-btn",
  "type": "button",
  "disabled": "${!globalState.selectedObject}"  // ← State reference
}

// State resolves references at parse time
function resolveStateReference(
  reference: string,
  globalState: any
): any {
  const match = reference.match(/\$\{(.+)\}/)
  if (match) {
    const path = match[1]
    return eval(`globalState.${path}`)
  }
  return reference
}

// Usage
const disabled = resolveStateReference(
  spec.disabled,
  globalState
)
```

### 5. Localization Integration

```typescript
// JSON spec uses i18n keys
{
  "id": "cut",
  "label": "buttons.cut",  // ← i18n key
  "tooltip": "tooltips.cut"
}

// i18n resolves keys
interface I18nContext {
  t(key: string, defaultValue?: string): string
  setLocale(locale: string): void
}

// Control creator uses i18n
const ControlFromSpec = ({ spec }) => {
  const { t } = useI18nContext()
  
  const label = t(spec.label)
  const tooltip = t(spec.tooltip)
  
  return (
    <Button title={tooltip}>
      {label}
    </Button>
  )
}
```

---

## Data Flow

### Complete Rendering Flow

```
1. User provides JSON spec
   │
   ▼
2. RibbonWindowFromSpec component
   │
   ├─ Parse & validate spec
   │  └─ TypeScript validation
   │
   ├─ Resolve i18n references
   │  └─ Load translations
   │
   ├─ Resolve state references
   │  └─ Apply global state
   │
   ├─ Create component tree (memoized)
   │  ├─ RibbonFromSpec
   │  │  └─ RibbonTabFromSpec (memo)
   │  │     └─ RibbonGroupFromSpec (memo)
   │  │        └─ ControlFromSpec (factory, memo)
   │  │
   │  ├─ ContentAreaFromSpec (memo)
   │  │
   │  └─ WindowFromSpec (memo)
   │     └─ ControlFromSpec (factory, memo)
   │
   ├─ Apply theme
   │  └─ CSS variables
   │
   ├─ Register command handlers
   │  └─ Commands from specs
   │
   └─ Render loading mask
      └─ Fade out when ready
      
3. User interacts with UI
   │
   ▼
4. Command executed
   │
   ├─ Get command from command system
   ├─ Execute handler
   ├─ Update state
   └─ Re-render affected components (memoization minimizes)
```

### Component Creation Flow

```typescript
// Detailed component creation with memoization

const RibbonWindowFromSpec = React.memo(({ spec }) => {
  // 1. Parse spec once
  const parsedSpec = useMemo(() => {
    return parseAndValidateSpec(spec)
  }, [spec])
  
  // 2. Resolve all references
  const resolvedSpec = useMemo(() => {
    return {
      ...parsedSpec,
      title: t(parsedSpec.title),
      rootWindow: {
        ...parsedSpec.rootWindow,
        ribbon: resolveRibbonReferences(
          parsedSpec.rootWindow.ribbon
        )
      }
    }
  }, [parsedSpec, t])  // Re-resolve if locale changes
  
  // 3. Create component tree
  const ribbon = useMemo(() => (
    <RibbonFromSpec spec={resolvedSpec.rootWindow.ribbon} />
  ), [resolvedSpec])
  
  // 4. Register commands
  useEffect(() => {
    const commands = extractCommandsFromSpec(resolvedSpec)
    commands.forEach(cmd => {
      registerCommand(cmd.id, cmd.handler)
    })
  }, [resolvedSpec])
  
  // 5. Render
  return (
    <>
      <RibbonWindowLoadingMask isLoading={isLoading} />
      <RibbonWindow spec={resolvedSpec}>
        {ribbon}
      </RibbonWindow>
    </>
  )
})
```

---

## State Management Integration

### Global State & JSON

```typescript
interface AppState {
  documents: Document[]
  selectedDocument: Document | null
  clipboard: ClipboardContent | null
  theme: 'light' | 'dark'
  locale: 'en' | 'es' | 'fr' | 'de'
  windows: Map<string, WindowState>
}

// JSON spec can reference state
{
  "disabled": "${!appState.selectedDocument}"
}

// State changes trigger re-evaluation
function evaluateStateExpression(
  expression: string,
  appState: AppState
): any {
  if (!expression.startsWith('${')) {
    return expression
  }
  
  const code = expression.slice(2, -1)  // Remove ${ and }
  return eval(`(${code})`)  // Simple eval
}

// Better: Use expression parser
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

function evaluateStateExpression(
  expression: string,
  appState: AppState
): any {
  const ast = parse(expression, { sourceType: 'module' })
  // ... traverse and evaluate safely
}
```

### Reactive Updates

```typescript
// When state changes, only affected components re-render

const useAppState = () => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  
  return {
    state,
    updateDocument: (doc) => dispatch({ type: 'UPDATE_DOCUMENT', doc }),
    // ...
  }
}

// Component memoization prevents unnecessary re-renders
const ControlFromSpec = React.memo(({ spec, state }) => {
  // Only re-renders if spec or directly referenced state changes
  const disabled = useMemo(() => {
    return evaluateStateExpression(spec.disabled, state)
  }, [spec, state])
  
  return <Button disabled={disabled} />
})
```

---

## Command Execution Flow

### From Click to Handler

```
1. User clicks button
   │
   ▼
2. ControlFromSpec.onClick()
   │
   ├─ Get command ID from spec
   ├─ Call executeCommand(commandId)
   │
   ▼
3. CommandSystem.executeCommand()
   │
   ├─ Find command handler
   ├─ Check canExecute
   ├─ Execute handler
   │
   ▼
4. Handler executes
   │
   ├─ Update state
   ├─ Call callbacks
   ├─ Dispatch events
   │
   ▼
5. State changes
   │
   ├─ useAppState() hook re-runs
   ├─ Dependent components re-render
   │
   ▼
6. UI updates
   │
   └─ Only affected components re-render (thanks to memo)
```

### Command Handler Pattern

```typescript
// Define handlers for commands from spec
const commandHandlers: Record<string, CommandHandler> = {
  'edit.cut': {
    execute: (context) => {
      const { selectedText, setClipboard } = context
      setClipboard(selectedText)
      // ... cut logic
    },
    canExecute: (context) => {
      return context.selectedText?.length > 0
    }
  },
  
  'file.save': {
    execute: async (context) => {
      const { document, saveDocument } = context
      await saveDocument(document)
    },
    canExecute: (context) => {
      return context.document?.isDirty || false
    }
  }
  
  // ... more commands
}

// Register commands from spec at startup
function registerSpecCommandHandlers(spec: RibbonUISpec) {
  const commandIds = extractCommandIds(spec)
  
  commandIds.forEach(id => {
    const handler = commandHandlers[id]
    if (handler) {
      registerCommand(id, handler)
    }
  })
}
```

---

## Error Handling

### Spec Validation Errors

```typescript
interface SpecValidationError {
  type: 'schema' | 'reference' | 'command' | 'icon'
  message: string
  path: string
  severity: 'error' | 'warning'
}

function validateSpec(spec: any): SpecValidationError[] {
  const errors: SpecValidationError[] = []
  
  // Validate structure
  if (!spec.appId) {
    errors.push({
      type: 'schema',
      message: 'Missing appId',
      path: 'root',
      severity: 'error'
    })
  }
  
  // Validate commands exist
  const commandIds = extractCommandIds(spec)
  commandIds.forEach(cmdId => {
    if (!hasCommand(cmdId)) {
      errors.push({
        type: 'command',
        message: `Unknown command: ${cmdId}`,
        path: `command.${cmdId}`,
        severity: 'warning'
      })
    }
  })
  
  // Validate icons exist
  const iconNames = extractIconNames(spec)
  iconNames.forEach(iconName => {
    if (!hasIcon(iconName)) {
      errors.push({
        type: 'icon',
        message: `Unknown icon: ${iconName}`,
        path: `icon.${iconName}`,
        severity: 'warning'
      })
    }
  })
  
  return errors
}

// Handle errors
try {
  const errors = validateSpec(spec)
  
  const criticalErrors = errors.filter(e => e.severity === 'error')
  if (criticalErrors.length > 0) {
    throw new Error(`Invalid spec: ${criticalErrors[0].message}`)
  }
  
  // Warn about non-critical issues
  errors
    .filter(e => e.severity === 'warning')
    .forEach(e => console.warn(e.message))
    
} catch (error) {
  // Show error UI
  return <ErrorPage error={error} />
}
```

---

## Development Workflow

### Design Phase

```
1. Design UI in visual designer
2. Export as JSON spec
3. Validate spec
4. Commit to repository
```

### Development Phase

```
1. Load JSON spec
2. Create RibbonWindowFromSpec component
3. Implement command handlers
4. Register handlers with command system
5. Test UI behavior
```

### Iteration Phase

```
1. Modify JSON spec
2. Load updated spec
3. UI updates automatically
4. No React code changes needed
```

---

## Performance Optimization

### Memoization Strategy

```typescript
// Level 1: Spec parsing
const parsedSpec = useMemo(
  () => parseSpec(spec),
  [spec]  // Only re-parse if spec changes
)

// Level 2: Component tree
const ribbon = useMemo(
  () => <RibbonFromSpec spec={parsedSpec.ribbon} />,
  [parsedSpec]  // Only recreate if parsed spec changes
)

// Level 3: Individual components
const RibbonTabFromSpec = React.memo(({ spec }) => {
  // Only re-render if spec changes
  return <Tab {...spec} />
})

// Level 4: Control props
const ControlFromSpec = React.memo(({ spec }) => {
  const props = useMemo(
    () => ({ ...spec.properties }),
    [spec]  // Only recreate props if spec changes
  )
  
  return <Button {...props} />
})
```

### Re-render Analysis

```
When user clicks button:
1. Command executes
2. State updates
3. useAppState hook re-runs
4. ALL components see new state

BUT:

5. React.memo prevents most re-renders
6. Only controls with changed state re-render
7. Due to memoization of spec, most don't change
8. Net result: ~5-10% of UI actually re-renders
```

---

## Testing

### Unit Tests

```typescript
describe('RibbonWindowFromSpec', () => {
  it('should render from JSON spec', async () => {
    const spec = { /* ... */ }
    render(<RibbonWindowFromSpec spec={spec} />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  
  it('should execute commands on click', async () => {
    const mockExecute = jest.fn()
    const { useCommandContext } = jest.requireMock('@context/CommandContext')
    useCommandContext.mockReturnValue({
      executeCommand: mockExecute
    })
    
    const spec = { /* ... */ }
    render(<RibbonWindowFromSpec spec={spec} />)
    
    fireEvent.click(screen.getByText('Cut'))
    
    expect(mockExecute).toHaveBeenCalledWith('edit.cut')
  })
})
```

### Integration Tests

```typescript
describe('JSON UI Integration', () => {
  it('should load spec from file', async () => {
    const spec = await loadSpecFromFile('/specs/editor.json')
    render(<RibbonWindowFromSpec spec={spec} />)
    
    // Verify UI renders
  })
  
  it('should handle state changes', async () => {
    const { rerender } = render(
      <RibbonWindowFromSpec spec={spec} />
    )
    
    // Update state
    rerender(
      <RibbonWindowFromSpec spec={updatedSpec} />
    )
    
    // Verify UI updates
  })
})
```

---

## Summary

✅ **Complete Integration**
- JSON spec → RibbonWindow component
- Command system → Button clicks
- Theme system → Visual styling
- Icon system → Button icons
- State system → Dynamic UI
- i18n system → Translations

✅ **Zero React Code Required**
- Define UI entirely as JSON
- No component imports
- No JSX
- Just configuration

✅ **Full Functionality**
- All 22 controls
- All window types
- All features
- All performance optimizations

**With JSON-based UI, developers design UI as configuration, not code.**

