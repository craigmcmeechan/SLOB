# Toolbar Component Specification

**Component Name**: Toolbar  
**Category**: Primary Interface  
**Status**: Fully Specified  
**Priority**: High

---

## Overview

Toolbar provides a simplified alternative to Ribbon, useful for applications that don't need tabs or hierarchical grouping.

## Props Interface

```typescript
interface ToolbarProps {
  groups: ToolbarGroup[]
  orientation?: 'horizontal' | 'vertical'
  theme?: 'light' | 'dark' | 'accessible'
  className?: string
}

interface ToolbarGroup {
  id: string
  controls: RibbonControl[]
  separator?: boolean
}
```

## Key Features

- **Flat Structure**: No tabs or hierarchy
- **Groups**: Logical grouping with separators
- **Responsive**: Adapts to container width
- **Orientation**: Horizontal or vertical
- **Icon Styles**: iconOnly, iconWithText, textOnly
- **All Controls**: 22+ control types supported

## CSS Classes

```
.ribbon-toolbar
.ribbon-toolbar--horizontal
.ribbon-toolbar--vertical
.ribbon-toolbar_group
.ribbon-toolbar_separator
.ribbon-toolbar_control
```

## Implementation Checklist

- [ ] Toolbar.tsx created
- [ ] CSS styling (all themes)
- [ ] Unit tests (90%+)
- [ ] Accessibility verified
- [ ] i18n (4 languages)
- [ ] Storybook stories
- [ ] E2E tests
- [ ] Git commit with changelog
