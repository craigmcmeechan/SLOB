# Button Control Specification

**Control Name**: Button  
**Category**: Action (4)  
**Status**: ✅ Fully Specified  
**Priority**: Critical

## Overview
Button is the fundamental action control for triggering events and commands.

## Props
- `id`: string - unique identifier
- `label`: string - display text  
- `icon`: string - icon identifier
- `variant`: 'default' | 'primary' | 'danger' | 'success'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean - disabled state
- `loading`: boolean - loading state
- `onClick`: () => void - click handler

## Variants
- Default: Standard button
- Primary: Main action emphasis
- Danger: Destructive action
- Success: Positive action

## Tests Required
- [ ] All variants rendering
- [ ] Click events firing
- [ ] Disabled state blocking clicks
- [ ] Loading state display
- [ ] Keyboard navigation (Enter)
- [ ] 90%+ coverage

## Implementation Status
- [ ] Component created
- [ ] CSS styled (light/dark/accessible)
- [ ] Tests written
- [ ] Accessibility verified
- [ ] i18n added (en/es/fr/de)
- [ ] Storybook stories created
- [ ] E2E tests written
- [ ] Committed
