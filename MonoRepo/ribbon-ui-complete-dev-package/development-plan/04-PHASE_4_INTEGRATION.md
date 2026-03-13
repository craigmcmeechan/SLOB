# Phase 4: Integration (Days 13-15)

**Duration**: 3 days  
**Priority**: High  
**Dependencies**: Phase 3 complete  

---

## Day 13: JSON UI System

### Objective

Enable apps to be built entirely from JSON configuration without writing React code.

### Tasks

1. Create JSON UI schema definition
2. Create schema validator
3. Create component factory
4. Test JSON parsing
5. Create examples

### JSON UI Schema Structure

```json
{
  "windowType": "root",
  "title": "My App",
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
                "type": "button",
                "id": "paste",
                "label": "Paste",
                "icon": "paste",
                "variant": "primary"
              }
            ]
          }
        ]
      }
    ]
  },
  "contentArea": "Main content goes here",
  "buttonBar": {
    "preset": "okcancel"
  }
}
```

### Deliverables

- [ ] JSON schema defined
- [ ] Validator created
- [ ] Component factory working
- [ ] Examples created
- [ ] Tests (90%+)
- [ ] Documentation complete

---

## Day 14: Command System

### Objective

Enable command binding to UI controls with enable/disable logic.

### Tasks

1. Create command executor
2. Implement command registration
3. Add enable/disable conditions
4. Add keyboard shortcut support
5. Add undo/redo support

### Command Interface

```typescript
interface Command {
  id: string
  label: string
  icon?: string
  enabled?: (context: any) => boolean
  execute: (context: any) => void
  undo?: (context: any) => void
}
```

### Deliverables

- [ ] Command executor created
- [ ] Command registration working
- [ ] Enable/disable logic working
- [ ] Keyboard shortcuts working
- [ ] History/undo support
- [ ] Tests (90%+)
- [ ] Documentation

---

## Day 15: State Management & Theme

### Morning: State Management

1. Create context providers for:
   - Window state
   - Sidebar visibility
   - Global application state
2. Implement state persistence
3. Create hooks for state access

### Afternoon: Theme & i18n Integration

1. Complete theme provider
2. Runtime theme switching
3. Complete i18n system
4. Language switching
5. Locale persistence

### Deliverables

- [ ] Window state provider
- [ ] Global state provider
- [ ] Sidebar state management
- [ ] State persistence working
- [ ] Theme provider complete
- [ ] i18n complete
- [ ] All contexts working
- [ ] Tests (90%+)

---

## Quality Gate for Phase 4

Before moving to Phase 5, verify:

- [ ] JSON UI system working
- [ ] Command system functional
- [ ] State management working
- [ ] Theme system complete
- [ ] i18n system complete
- [ ] All integrations working
- [ ] 90%+ test coverage
- [ ] Documentation complete

---

## Next Phase

→ Read `05-PHASE_5_TESTING_AND_DOCS.md`

