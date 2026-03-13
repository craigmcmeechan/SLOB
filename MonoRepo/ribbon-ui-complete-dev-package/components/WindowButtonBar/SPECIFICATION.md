# Window Button Bar Component Specification

**Component Name**: WindowButtonBar  
**Category**: Dialog/Window Footer  
**Status**: Fully Specified  
**Priority**: High

---

## Overview

WindowButtonBar provides a fixed footer for window/dialog buttons with preset configurations for common scenarios.

## Props Interface

```typescript
interface WindowButtonBarProps {
  preset?: 'ok' | 'okcancel' | 'yesno' | 'yesnocancel' | 'retrycancel' | 'custom'
  buttons: ButtonConfig[]
  defaultButton?: string
  cancelButton?: string
  onButtonClick?: (buttonId: string) => void
  theme?: 'light' | 'dark' | 'accessible'
}

interface ButtonConfig {
  id: string
  label: string
  variant?: 'primary' | 'default' | 'danger'
  disabled?: boolean
}
```

## Presets

- **ok**: Single OK button
- **okcancel**: OK + Cancel
- **yesno**: Yes + No
- **yesnocancel**: Yes + No + Cancel
- **retrycancel**: Retry + Cancel
- **custom**: Custom buttons

## Key Features

- **9 Presets**: Common button configurations
- **Fixed Height**: 40px footer
- **Keyboard Support**: Enter activates default, Escape activates cancel
- **Responsive**: Buttons stack on mobile
- **Custom Buttons**: Define custom button sets

## CSS Classes

```
.ribbon-button-bar
.ribbon-button-bar_container
.ribbon-button-bar_button
.ribbon-button-bar_button--primary
.ribbon-button-bar_separator
```

## Implementation Checklist

- [ ] WindowButtonBar.tsx created
- [ ] CSS styling (all themes)
- [ ] All 9 presets working
- [ ] Unit tests (90%+)
- [ ] Accessibility verified
- [ ] i18n (4 languages)
- [ ] Storybook stories
- [ ] E2E tests
- [ ] Git commit with changelog
