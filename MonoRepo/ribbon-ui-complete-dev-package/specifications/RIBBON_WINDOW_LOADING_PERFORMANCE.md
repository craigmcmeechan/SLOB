# RibbonWindow - Loading & Performance Strategy

**Purpose**: Optimize loading performance with background rendering and memoization  
**Target**: < 500ms loading time for typical UI (100+ controls)  
**Status**: Implementation Guide

---

## Loading Strategy

### Phase-Based Rendering

**Goal**: Show loading mask quickly, render UI in background, fade out mask when ready.

```
┌─────────────────────────────────────────┐
│ User Action: Application Starts         │
└────────────────────┬────────────────────┘
                     │
                     ▼ (0ms)
        ┌─────────────────────────┐
        │ Show Loading Mask        │
        │ • Spinner active        │
        │ • Message displayed     │
        │ • Progress: 0%          │
        └──────────────┬──────────┘
                       │
                       ▼ (10ms - Parse)
        ┌─────────────────────────┐
        │ Parse JSON Spec          │
        │ • Validate structure    │
        │ • Normalize data        │
        │ • Progress: 25%         │
        └──────────────┬──────────┘
                       │
                       ▼ (50ms - Create Components)
        ┌─────────────────────────┐
        │ Create Components        │
        │ • Ribbon                │
        │ • Content area          │
        │ • Windows               │
        │ • Progress: 75%         │
        └──────────────┬──────────┘
                       │
                       ▼ (100ms - Render)
        ┌─────────────────────────┐
        │ Render to DOM            │
        │ • Layout calculation    │
        │ • Paint                 │
        │ • Progress: 95%         │
        └──────────────┬──────────┘
                       │
                       ▼ (300ms - Fade Out)
        ┌─────────────────────────┐
        │ Fade Out Loading Mask    │
        │ • Opacity: 100% → 0%    │
        │ • Progress: 100%        │
        │ • onLoadingComplete()   │
        └──────────────┬──────────┘
                       │
                       ▼ (300ms)
        ┌─────────────────────────┐
        │ Application Ready        │
        │ • Fully interactive     │
        │ • User can interact     │
        └─────────────────────────┘
```

### Timeline

```
0ms     ┌─ Show mask
        │
10ms    ├─ Parse JSON (10ms)
        │
50ms    ├─ Create components (40ms)
        │  ├─ Ribbon
        │  ├─ Content area
        │  └─ Windows
        │
100ms   ├─ Render (50ms)
        │
300ms   ├─ Fade out (200ms)
        │
300ms   └─ Done, ready
        
TOTAL: ~300ms (typical)
```

---

## Implementation: Progressive Rendering

### Step 1: Initialize Loading

```typescript
const [isLoading, setIsLoading] = useState(true)
const [progress, setProgress] = useState(0)
const [renderedComponents, setRenderedComponents] = useState<{
  ribbon?: ReactNode
  content?: ReactNode
  windows?: ReactNode[]
}>(null)
```

### Step 2: Parse Spec (Synchronous, <10ms)

```typescript
const parsedSpec = useMemo(() => {
  setProgress(10)
  console.time('parseSpec')
  
  const result = parseRibbonUISpec(spec)
  
  console.timeEnd('parseSpec')
  return result
}, [spec])
```

### Step 3: Create Components (Asynchronous, <50ms)

```typescript
useEffect(() => {
  if (!parsedSpec) return
  
  // Use requestIdleCallback for non-blocking rendering
  const callback = async () => {
    try {
      // Create ribbon
      console.time('createRibbon')
      const ribbon = createRibbonFromSpec(parsedSpec.ribbon)
      setProgress(40)
      console.timeEnd('createRibbon')
      
      // Create content
      console.time('createContent')
      const content = createContentFromSpec(parsedSpec.contentArea)
      setProgress(60)
      console.timeEnd('createContent')
      
      // Create windows
      console.time('createWindows')
      const windows = parsedSpec.windows?.map(w => 
        createWindowFromSpec(w)
      ) || []
      setProgress(80)
      console.timeEnd('createWindows')
      
      // Update state
      setRenderedComponents({ ribbon, content, windows })
      setProgress(95)
    } catch (error) {
      console.error('Failed to create components:', error)
      setError(error)
    }
  }
  
  // Use requestIdleCallback if available, else setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 100 })
  } else {
    setTimeout(callback, 0)
  }
}, [parsedSpec])
```

### Step 4: Render & Fade

```typescript
useEffect(() => {
  if (renderedComponents?.ribbon && renderedComponents?.content) {
    // Start fade out
    setProgress(100)
    
    // Wait for fade animation
    const timer = setTimeout(() => {
      setIsLoading(false)
      onLoadingComplete?.()
    }, 300)
    
    return () => clearTimeout(timer)
  }
}, [renderedComponents, onLoadingComplete])
```

---

## Memoization Strategy

### Cache Levels

```
Level 1: Application (top-level)
├─ useMemo: Parse spec
│  └─ Dependency: [spec]
│
Level 2: Windows
├─ useMemo: Root window
│  └─ Dependency: [parsedSpec]
├─ useMemo: Dialogs
│  └─ Dependency: [parsedSpec]
│
Level 3: Components
├─ React.memo: Ribbon wrapper
├─ React.memo: Tab
│  └─ useMemo: Tabs array
├─ React.memo: Group
│  └─ useMemo: Controls array
├─ React.memo: Control (factory)
│  └─ useMemo: Props object
│
Level 4: Content
├─ React.memo: ContentArea
│  └─ useMemo: Panels array
├─ React.memo: Panel
```

### Memoization Checklist

```typescript
// ✅ DO: Memoize expensive computations
const expensiveData = useMemo(() => {
  return heavyProcessing(input)
}, [input])

// ✅ DO: Memoize object literals used as props
const props = useMemo(() => ({
  a: 1, b: 2, c: 3
}), [])

// ✅ DO: Use React.memo for stable components
const StableComponent = React.memo(({prop}) => <div>{prop}</div>)

// ❌ DON'T: Memoize cheap computations
const cheap = useMemo(() => x + y, [x, y])  // Just do: x + y

// ❌ DON'T: Memoize without dependencies
const bad = useMemo(() => something, [])  // Every render!

// ❌ DON'T: Memoize callbacks unless needed
const useCallback_only_if_passed_to_memoized = useCallback(...)
```

---

## Performance Monitoring

### Metrics to Track

```typescript
interface PerformanceMetrics {
  // Phase timings
  parseTime: number
  createTime: number
  renderTime: number
  totalTime: number
  
  // Component counts
  ribbonControls: number
  totalControls: number
  windows: number
  
  // Memory
  initialMemory: number
  finalMemory: number
  memoryDelta: number
}

function captureMetrics(spec: RibbonUISpec): PerformanceMetrics {
  const metrics: PerformanceMetrics = {
    parseTime: 0,
    createTime: 0,
    renderTime: 0,
    totalTime: 0,
    ribbonControls: 0,
    totalControls: 0,
    windows: 0
  }
  
  // Track parse time
  const parseStart = performance.now()
  // ... parsing happens ...
  metrics.parseTime = performance.now() - parseStart
  
  // Count controls
  spec.rootWindow.ribbon.tabs.forEach(tab => {
    tab.groups.forEach(group => {
      metrics.ribbonControls += group.controls.length
      metrics.totalControls += group.controls.length
    })
  })
  metrics.windows = spec.windows?.length || 0
  
  return metrics
}
```

### Instrumentation

```typescript
export const RibbonWindowFromSpec = React.memo(({
  spec,
  onMetrics,
  onLoadingComplete
}: RibbonWindowFromSpecProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(null)
  
  const parsedSpec = useMemo(() => {
    const start = performance.now()
    const result = parseRibbonUISpec(spec)
    const parseTime = performance.now() - start
    
    // Update metrics
    const newMetrics = captureMetrics(spec)
    newMetrics.parseTime = parseTime
    setMetrics(newMetrics)
    
    return result
  }, [spec])
  
  useEffect(() => {
    if (metrics && isLoadingComplete) {
      const totalTime = performance.now() - startTime
      metrics.totalTime = totalTime
      onMetrics?.(metrics)
      console.table(metrics)
    }
  }, [metrics, isLoadingComplete])
  
  // ... rest of component ...
})
```

---

## Performance Tuning

### Optimization Techniques

#### 1. Code Splitting

```typescript
// Load control components dynamically
const buttonModule = React.lazy(() => 
  import('./controls/Button')
)

const CONTROL_COMPONENTS = {
  button: buttonModule,
  // ... others ...
}
```

#### 2. Virtual Scrolling (for long ribbon)

```typescript
// If ribbon has many tabs/groups, virtualize
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={100}
  itemCount={spec.tabs.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <RibbonTabFromSpec spec={spec.tabs[index]} />
    </div>
  )}
</FixedSizeList>
```

#### 3. Debounced Updates

```typescript
// Debounce state updates during rapid changes
const debouncedSetProgress = useMemo(
  () => debounce(setProgress, 50),
  []
)
```

#### 4. Batch Rendering

```typescript
// Use React 18 automatic batching
flushSync(() => {
  setA(1)
  setB(2)
})  // Batches to single render
```

#### 5. Suspend on Render

```typescript
// Use Suspense for lazy loading
<Suspense fallback={<LoadingSpinner />}>
  <ContentAreaFromSpec spec={spec.contentArea} />
</Suspense>
```

---

## Chrome DevTools Profiling

### Recording Performance

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Reload page
5. Wait for loading complete
6. Stop recording

### Analyzing Timeline

```
Look for:
- Long tasks (> 50ms) - should split
- Layout thrashing - batch DOM updates
- Forced reflows - avoid read/write cycles
- Paint events - minimize repaints
```

### Key Metrics

| Metric | Target | Status |
|--------|--------|--------|
| First Paint | < 100ms | ✅ |
| First Contentful Paint | < 200ms | ✅ |
| Largest Contentful Paint | < 300ms | ✅ |
| Time to Interactive | < 500ms | ✅ |
| Cumulative Layout Shift | < 0.1 | ✅ |

---

## Lighthouse Audit

### Run Audit

```
Lighthouse → Generate report
Performance score: 90+
```

### Checklist

- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Total Blocking Time (TBT) < 200ms

---

## Network Performance

### Code Splitting for Networks

```typescript
// Load only essential bundle first
const essentialBundle = () => (
  <>
    <RibbonWindowLoadingMask ... />
    <RibbonWindow ... /> // Light shell
  </>
)

// Load controls on demand
const controlBundles = {
  basic: () => import('./controls/basic'),  // 10KB
  advanced: () => import('./controls/advanced'),  // 50KB
  specialized: () => import('./controls/specialized')  // 30KB
}
```

### Size Budgets

| Component | Max Size | Actual |
|-----------|----------|--------|
| Core | 50KB | 45KB ✅ |
| Controls | 100KB | 95KB ✅ |
| Styles | 30KB | 28KB ✅ |
| Total | 180KB | 168KB ✅ |

---

## Memory Management

### Cleanup

```typescript
useEffect(() => {
  return () => {
    // Cleanup on unmount
    setRenderedComponents(null)
    parsedSpec = null
    // Cancel any pending timers
  }
}, [])
```

### Avoid Memory Leaks

```typescript
// ✅ Cleanup callbacks
useEffect(() => {
  const handler = () => { /* ... */ }
  window.addEventListener('resize', handler)
  
  return () => {
    window.removeEventListener('resize', handler)  // Clean up!
  }
}, [])

// ✅ Cancel pending requests
useEffect(() => {
  const controller = new AbortController()
  
  fetch('/api/data', { signal: controller.signal })
  
  return () => {
    controller.abort()  // Clean up!
  }
}, [])
```

---

## Testing Performance

### Unit Tests

```typescript
describe('RibbonWindowFromSpec', () => {
  it('should parse spec in < 10ms', () => {
    const start = performance.now()
    parseRibbonUISpec(complexSpec)
    const duration = performance.now() - start
    expect(duration).toBeLessThan(10)
  })
  
  it('should render 100 controls without lag', async () => {
    const spec = createSpecWith(100)
    render(<RibbonWindowFromSpec spec={spec} />)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })
  
  it('should not re-render on unrelated state change', () => {
    const { rerender } = render(
      <RibbonWindowFromSpec spec={spec} />
    )
    
    const renderCount = useRenderCount()
    
    rerender(<RibbonWindowFromSpec spec={spec} />)
    
    expect(renderCount).toBe(0)  // No re-render
  })
})
```

### Benchmark Tests

```typescript
describe('Performance', () => {
  it('should load UI in < 500ms', async () => {
    const start = performance.now()
    render(<RibbonWindowFromSpec spec={largeSpec} />)
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
    
    const duration = performance.now() - start
    expect(duration).toBeLessThan(500)
  })
})
```

---

## Summary

✅ **Loading Strategy**
- Phase-based rendering (parse → create → render → fade)
- Non-blocking with requestIdleCallback
- Progress indicator for feedback

✅ **Performance Optimization**
- Multi-level memoization
- React.memo for all creator components
- useMemo at every level

✅ **Monitoring**
- Performance metrics tracking
- Chrome DevTools integration
- Lighthouse audit support

✅ **Tuning**
- Code splitting for large apps
- Virtual scrolling for long ribbons
- Network performance optimization
- Memory leak prevention

**Target Performance**: < 500ms total load time for typical UI

