# Ribbon Control Implementation Guide

## Complete Development Path for All 21 Controls

This guide provides step-by-step implementation instructions for each control, including code templates, file locations, and testing strategies.

---

## Part 1: Project Structure

```
src/
├── ui/ribbon/
│   ├── components/
│   │   ├── controls/
│   │   │   ├── types.ts                 # Shared types for all controls
│   │   │   ├── Button.tsx
│   │   │   ├── ToggleButton.tsx
│   │   │   ├── SplitButton.tsx
│   │   │   ├── DropdownButton.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── RadioButton.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── Combobox.tsx
│   │   │   ├── SegmentedControl.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── NumberInput.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Separator.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── ButtonGroup.tsx
│   │   │   ├── ControlGroup.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   └── index.ts                 # Export all controls
│   │   │
│   │   ├── styles/
│   │   │   ├── controls.css
│   │   │   ├── controls-themes.css
│   │   │   ├── controls-accessibility.css
│   │   │   └── variables.css
│   │   │
│   │   ├── hooks/
│   │   │   ├── useControlSize.ts
│   │   │   ├── useControlState.ts
│   │   │   └── useKeyboard.ts
│   │   │
│   │   └── Ribbon.tsx                   # Main ribbon component
│   │
│   ├── stories/
│   │   ├── Button.stories.tsx
│   │   ├── ToggleButton.stories.tsx
│   │   ├── ... (one story per control)
│   │   └── Controls.stories.tsx         # All controls showcase
│   │
│   ├── tests/
│   │   ├── controls.test.tsx
│   │   ├── accessibility.test.tsx
│   │   ├── e2e/
│   │   │   └── ribbon-controls.cy.ts
│   │   └── __fixtures__/
│   │       └── mockData.ts
│   │
│   └── __docs__/
│       ├── MASTER_SPECIFICATION.md      # (from previous file)
│       ├── DETAILED_SPECS.md            # (from previous file)
│       ├── CONTRIBUTING.md              # How to add controls
│       └── API_REFERENCE.md             # All control APIs

tests/
├── unit/
│   └── ribbon-controls.test.tsx         # All unit tests
├── e2e/
│   └── ribbon-controls.e2e.cy.ts       # Cypress/Playwright tests
└── accessibility/
    └── ribbon-controls.a11y.test.ts    # Accessibility tests
```

---

## Part 2: Shared Types File

**File**: `src/ui/ribbon/components/controls/types.ts`

```typescript
// ===== BASE TYPES =====
export type RibbonSize = 'small' | 'medium' | 'large'
export type RibbonVariant = 'primary' | 'secondary'
export type RibbonOrientation = 'horizontal' | 'vertical'
export type RibbonStatusVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

// ===== BASE PROPS =====
export interface RibbonControlProps {
  // Identification
  id?: string
  className?: string
  style?: React.CSSProperties
  
  // State
  disabled?: boolean
  
  // Size
  size?: RibbonSize
  
  // Accessibility
  ariaLabel?: string
  ariaDescription?: string
  role?: string
  
  // Events
  onFocus?: () => void
  onBlur?: () => void
}

// ===== ACTION CONTROLS =====
export interface RibbonButtonProps extends RibbonControlProps {
  command: string
  label?: string
  icon?: string
  tooltip?: string
  showLabel?: boolean
  showIcon?: boolean
  loading?: boolean
  active?: boolean
  variant?: RibbonVariant
  hasDropdown?: boolean
  dropdownItems?: MenuItemConfig[]
  onDropdown?: (isOpen: boolean) => void
  onClick?: () => void
  fullWidth?: boolean
  compact?: boolean
  role?: 'button' | 'menuitem' | 'tab'
}

export interface RibbonToggleButtonProps extends RibbonButtonProps {
  pressed?: boolean
  onChange?: (pressed: boolean) => void
  iconPressed?: string
  labelPressed?: string
  role?: 'switch' | 'button'
}

export interface RibbonSplitButtonProps extends RibbonControlProps {
  primaryCommand: string
  primaryLabel?: string
  primaryIcon?: string
  dropdownItems: MenuItemConfig[]
  onDropdownSelect?: (command: string) => void
  size?: RibbonSize
  orientation?: RibbonOrientation
  compact?: boolean
}

export interface RibbonDropdownButtonProps extends RibbonControlProps {
  label: string
  icon?: string
  items: MenuItemConfig[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect?: (command: string) => void
  size?: RibbonSize
  placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end'
  variant?: 'button' | 'icon-button'
}

// ===== SELECTION CONTROLS =====
export interface RibbonCheckboxProps extends RibbonControlProps {
  label: string
  checked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  description?: string
  name?: string
}

export interface RibbonRadioButtonProps extends RibbonControlProps {
  name: string
  value: string
  label: string
  checked?: boolean
  onChange?: (value: string) => void
  description?: string
}

export interface RibbonRadioGroupProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  children: React.ReactNode
  direction?: RibbonOrientation
  gap?: 'compact' | 'normal'
}

export interface ComboboxOption {
  label: string
  value: string
  disabled?: boolean
  group?: string
}

export interface RibbonComboboxProps extends RibbonControlProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  searchable?: boolean
  onSearch?: (query: string) => void
  placeholder?: string
  label?: string
  clearable?: boolean
  onClear?: () => void
  size?: RibbonSize
  width?: number | 'full'
  maxHeight?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  renderOption?: (option: ComboboxOption) => React.ReactNode
  renderValue?: (option: ComboboxOption) => React.ReactNode
}

export interface SegmentedOption {
  label: string
  value: string
  icon?: string
  disabled?: boolean
}

export interface RibbonSegmentedControlProps extends RibbonControlProps {
  options: SegmentedOption[]
  value?: string
  onChange?: (value: string) => void
  size?: RibbonSize
  variant?: 'filled' | 'outlined'
  fullWidth?: boolean
  exclusive?: boolean
}

// ===== INPUT CONTROLS =====
export interface RibbonTextInputProps extends RibbonControlProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  icon?: string
  clearable?: boolean
  onClear?: () => void
  onKeyDown?: (e: KeyboardEvent) => void
  onKeyUp?: (e: KeyboardEvent) => void
  error?: boolean | string
  width?: number | 'full'
  size?: RibbonSize
  readOnly?: boolean
  label?: string
}

export interface RibbonNumberInputProps extends RibbonControlProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  showSpinner?: boolean
  decimals?: number
  unit?: string
  showUnit?: boolean
  allowKeyboardStep?: boolean
  clampValue?: boolean
  width?: number
  size?: RibbonSize
}

export interface RibbonColorPickerProps extends RibbonControlProps {
  value?: string
  onChange?: (color: string) => void
  swatches?: string[]
  allowTransparent?: boolean
  showHex?: boolean
  showRGB?: boolean
  showHSL?: boolean
  variant?: 'button' | 'inline'
  size?: RibbonSize
  presets?: Array<{ name: string; colors: string[] }>
  closeOnSelect?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// ===== DISPLAY CONTROLS =====
export interface RibbonLabelProps extends RibbonControlProps {
  text: string
  label?: string
  variant?: RibbonStatusVariant | 'normal' | 'emphasis' | 'muted'
  size?: RibbonSize
  tooltip?: string
  onClick?: () => void
  bold?: boolean
  italic?: boolean
  truncate?: boolean
  maxLines?: number
}

export interface RibbonSeparatorProps extends RibbonControlProps {
  orientation?: RibbonOrientation
  color?: string
  length?: number
  margin?: number | { x?: number; y?: number }
}

export interface RibbonIconProps extends RibbonControlProps {
  name: string
  size?: RibbonSize | number
  label?: string
  variant?: 'primary' | 'secondary' | 'muted'
  color?: string
  tooltip?: string
  onClick?: () => void
  spin?: boolean
  flip?: 'horizontal' | 'vertical'
  rotate?: 0 | 90 | 180 | 270
}

export interface RibbonBadgeProps extends RibbonControlProps {
  content: string | number
  label?: string
  variant?: RibbonStatusVariant
  size?: 'small' | 'medium'
  max?: number
  dot?: boolean
  pulse?: boolean
}

// ===== SPECIALIZED CONTROLS =====
export interface GalleryItem {
  id: string
  label: string
  icon?: string
  description?: string
  command?: string
  disabled?: boolean
  preview?: React.ReactNode
}

export interface RibbonGalleryProps extends RibbonControlProps {
  items: GalleryItem[]
  value?: string
  onChange?: (itemId: string) => void
  onHover?: (itemId: string) => void
  columns?: number
  size?: RibbonSize
  direction?: RibbonOrientation
  scrollable?: boolean
  maxVisible?: number
  renderItem?: (item: GalleryItem, isSelected: boolean) => React.ReactNode
  loading?: boolean
}

export interface RibbonSliderProps extends RibbonControlProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  showLabels?: boolean
  valueFormat?: (value: number) => string
  width?: number | 'full'
  orientation?: RibbonOrientation
  size?: RibbonSize
  showTooltip?: boolean
  allowKeyboardStep?: boolean
}

export interface RibbonProgressProps extends RibbonControlProps {
  value: number
  variant?: 'determinate' | 'indeterminate'
  size?: 'small' | 'medium'
  showValue?: boolean
  label?: string
  labelPosition?: 'above' | 'below' | 'inside'
  color?: 'primary' | 'success' | 'warning' | 'error'
  width?: number | 'full'
  animated?: boolean
  striped?: boolean
}

export interface MenuItemConfig {
  command?: string
  label?: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  badge?: string | number
  submenu?: MenuItemConfig[]
  separator?: boolean
  dangerous?: boolean
}

export interface RibbonMenuProps extends RibbonControlProps {
  items: MenuItemConfig[]
  onSelect?: (commandId: string) => void
  maxHeight?: number
  maxWidth?: number
  closeOnSelect?: boolean
  searchable?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// ===== CONTAINER CONTROLS =====
export interface RibbonButtonGroupProps extends RibbonControlProps {
  children?: React.ReactNode
  buttons?: RibbonButtonProps[]
  orientation?: RibbonOrientation
  size?: RibbonSize
  gap?: 'compact' | 'normal' | 'spacious'
  exclusive?: boolean
  variant?: 'default' | 'outlined' | 'filled'
  separator?: boolean
}

export interface RibbonControlGroupProps extends RibbonControlProps {
  children: React.ReactNode
  label?: string
  description?: string
  direction?: RibbonOrientation
  gap?: 'compact' | 'normal' | 'spacious'
  vertical?: boolean
  showDivider?: boolean
  dividerPosition?: 'before' | 'after' | 'both'
  compact?: boolean
  variant?: 'default' | 'outlined' | 'subtle'
}

export interface RibbonToolbarProps extends RibbonControlProps {
  children: React.ReactNode
  direction?: RibbonOrientation
  wrap?: boolean
  gap?: 'compact' | 'normal' | 'spacious'
  align?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  dividers?: boolean
  size?: 'small' | 'medium'
}
```

---

## Part 3: Implementation Checklist for Each Control

### For Every Control, Complete These Tasks:

**[ ] 1. Specification Review**
- [ ] Read detailed spec in CONTROL_SPECIFICATIONS_DETAILED.md
- [ ] Understand all props
- [ ] Know all states
- [ ] Review accessibility requirements
- [ ] Identify hidden requirements

**[ ] 2. Component Implementation**
- [ ] Create TypeScript file in `components/controls/`
- [ ] Define Props interface extending RibbonControlProps
- [ ] Implement React component with memo for performance
- [ ] Handle all states (default, hover, focus, disabled, error, loading)
- [ ] Implement accessibility (ARIA, keyboard nav, screen reader)
- [ ] Use CSS variables for theming
- [ ] Add proper TypeScript types
- [ ] Export from `components/controls/index.ts`

**[ ] 3. Styling**
- [ ] Create CSS classes following `.ribbon-{control}` pattern
- [ ] Support all size variants (small, medium, large)
- [ ] Define CSS variables used
- [ ] Implement theme switching
- [ ] Ensure high contrast mode support
- [ ] RTL language support

**[ ] 4. Storybook Stories**
- [ ] Create `.stories.tsx` file in `stories/`
- [ ] Default story with common props
- [ ] All variants (size, variant, state)
- [ ] All states (disabled, loading, error, active)
- [ ] Dark theme story
- [ ] Accessibility story
- [ ] Interactive story with controls

**[ ] 5. Unit Tests**
- [ ] Renders correctly with default props
- [ ] Renders all variants correctly
- [ ] Props validation (required props)
- [ ] Event handlers (onClick, onChange, etc)
- [ ] State updates (controlled and uncontrolled)
- [ ] Accessibility attributes (aria-label, role, etc)
- [ ] Keyboard navigation (keyboard events)
- [ ] Disabled state
- [ ] CSS classes applied correctly
- [ ] Performance (memoization, no unnecessary renders)

**[ ] 6. Accessibility Testing**
- [ ] ARIA roles correct
- [ ] ARIA labels present where needed
- [ ] ARIA descriptions for complex controls
- [ ] Keyboard navigation working (Tab, Arrow keys, Space, Enter)
- [ ] Focus management
- [ ] Focus visible outline
- [ ] Screen reader announces correctly
- [ ] Color contrast 4.5:1 for text
- [ ] 3:1 for UI components
- [ ] No color-only information

**[ ] 7. Documentation**
- [ ] JSDoc comments on component
- [ ] Props documented with @param
- [ ] Examples in JSDoc
- [ ] README with usage examples
- [ ] Props table in markdown
- [ ] Variants table
- [ ] CSS variables documented
- [ ] Accessibility notes

**[ ] 8. E2E Tests**
- [ ] Component renders in page
- [ ] User can interact (click, type, etc)
- [ ] Correct output from interaction
- [ ] Works with theme system
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Works across browsers

**[ ] 9. Review & Polish**
- [ ] Code style consistent
- [ ] No console warnings
- [ ] No memory leaks
- [ ] Performance acceptable
- [ ] Bundle size acceptable
- [ ] Dependencies minimal

---

## Part 4: Example Implementation Template

**File**: `components/controls/Button.tsx`

```typescript
import React, { useCallback, useMemo } from 'react'
import type { RibbonButtonProps } from './types'
import { useCommand } from '@context/CommandContext'
import { Icon } from './Icon'
import './styles/Button.css'

/**
 * RibbonButton
 * 
 * Action control for executing commands. Can display icon, label, or both.
 * 
 * @example
 * ```tsx
 * <Ribbon.Button 
 *   command="save" 
 *   label="Save" 
 *   icon="save"
 *   size="large"
 * />
 * ```
 * 
 * @param props - Component props
 * @returns Rendered button element
 */
export const RibbonButton = React.forwardRef<
  HTMLButtonElement,
  RibbonButtonProps
>(({
  command,
  label,
  icon,
  size = 'small',
  variant = 'primary',
  disabled = false,
  loading = false,
  active = false,
  ariaLabel,
  tooltip,
  showLabel = true,
  showIcon = true,
  className,
  style,
  role,
  ...props
}, ref) => {
  const { executeCommand, isCommandEnabled } = useCommand(command)
  
  const isDisabled = useMemo(
    () => disabled || loading || !isCommandEnabled(),
    [disabled, loading, isCommandEnabled]
  )
  
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        executeCommand()
        props.onClick?.()
      }
    },
    [isDisabled, executeCommand, props.onClick]
  )
  
  const classes = useMemo(() => [
    'ribbon-button',
    `ribbon-button--${size}`,
    `ribbon-button--${variant}`,
    showLabel && showIcon && 'ribbon-button--with-label',
    loading && 'ribbon-button--loading',
    active && 'ribbon-button--active',
    isDisabled && 'ribbon-button--disabled',
    className
  ].filter(Boolean).join(' '), [size, variant, showLabel, showIcon, loading, active, isDisabled, className])
  
  const finalAriaLabel = ariaLabel || label
  
  return (
    <button
      ref={ref}
      className={classes}
      style={style}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={finalAriaLabel}
      aria-pressed={active}
      title={tooltip}
      role={role || 'button'}
      {...props}
    >
      {loading && <div className="ribbon-button__spinner" aria-hidden />}
      {showIcon && icon && (
        <Icon 
          name={icon} 
          size={size}
          className="ribbon-button__icon"
        />
      )}
      {showLabel && label && (
        <span className="ribbon-button__label">{label}</span>
      )}
    </button>
  )
})

RibbonButton.displayName = 'RibbonButton'
```

---

## Part 5: Testing Template

**File**: `tests/controls/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { RibbonButton } from '@ui/ribbon'

expect.extend(toHaveNoViolations)

describe('RibbonButton', () => {
  describe('Rendering', () => {
    it('renders button with label', () => {
      render(<RibbonButton command="save" label="Save" />)
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    })

    it('renders button with icon', () => {
      render(<RibbonButton command="save" icon="save" />)
      // Icon should render if available
    })

    it('applies size classes', () => {
      const { rerender } = render(<RibbonButton command="save" size="small" />)
      expect(screen.getByRole('button')).toHaveClass('ribbon-button--small')
      
      rerender(<RibbonButton command="save" size="large" />)
      expect(screen.getByRole('button')).toHaveClass('ribbon-button--large')
    })
  })

  describe('Interaction', () => {
    it('executes command on click', async () => {
      const user = userEvent.setup()
      render(<RibbonButton command="save" label="Save" />)
      
      await user.click(screen.getByRole('button'))
      // Verify command was executed (mock command context)
    })

    it('handles keyboard activation with Space', async () => {
      const user = userEvent.setup()
      render(<RibbonButton command="save" label="Save" />)
      
      screen.getByRole('button').focus()
      await user.keyboard(' ')
      // Verify command was executed
    })

    it('handles keyboard activation with Enter', async () => {
      const user = userEvent.setup()
      render(<RibbonButton command="save" label="Save" />)
      
      screen.getByRole('button').focus()
      await user.keyboard('{Enter}')
      // Verify command was executed
    })
  })

  describe('States', () => {
    it('disables button when disabled prop true', () => {
      render(<RibbonButton command="save" label="Save" disabled />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('shows loading state', () => {
      render(<RibbonButton command="save" label="Save" loading />)
      expect(screen.getByRole('button')).toHaveClass('ribbon-button--loading')
    })

    it('shows active state', () => {
      render(<RibbonButton command="save" label="Save" active />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <RibbonButton command="save" label="Save" ariaLabel="Save document" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has aria-label for screen readers', () => {
      render(<RibbonButton command="save" ariaLabel="Save document" />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Save document')
    })

    it('shows tooltip on hover', async () => {
      const user = userEvent.setup()
      render(<RibbonButton command="save" tooltip="Save (Ctrl+S)" />)
      
      await user.hover(screen.getByRole('button'))
      // Tooltip should be visible
    })

    it('manages focus correctly', () => {
      render(<RibbonButton command="save" label="Save" />)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(button).toHaveFocus()
    })
  })

  describe('CSS Variables', () => {
    it('uses CSS variables for theming', () => {
      const { container } = render(<RibbonButton command="save" />)
      const button = container.querySelector('.ribbon-button')
      
      const styles = getComputedStyle(button)
      // Verify CSS variables are used
      expect(styles.backgroundColor).toContain('var(')
    })
  })
})
```

---

## Part 6: Storybook Template

**File**: `stories/Button.stories.tsx`

```typescript
import { Meta, StoryObj } from '@storybook/react'
import { RibbonButton } from '@ui/ribbon'

type Story = StoryObj<typeof RibbonButton>

const meta: Meta<typeof RibbonButton> = {
  title: 'Ribbon/Controls/Button',
  component: RibbonButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    variant: { control: 'radio', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    active: { control: 'boolean' },
  },
}

export default meta

export const Default: Story = {
  args: {
    command: 'save',
    label: 'Save',
    icon: 'save',
  },
}

export const IconOnly: Story = {
  args: {
    command: 'copy',
    icon: 'copy',
    ariaLabel: 'Copy',
    tooltip: 'Copy (Ctrl+C)',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <RibbonButton size="small" command="save" label="Save" />
      <RibbonButton size="medium" command="save" label="Save" />
      <RibbonButton size="large" command="save" label="Save" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <RibbonButton command="save" label="Default" />
      <RibbonButton command="save" label="Disabled" disabled />
      <RibbonButton command="save" label="Loading" loading />
      <RibbonButton command="save" label="Active" active />
    </div>
  ),
}

export const WithDropdown: Story = {
  args: {
    command: 'save',
    label: 'Save',
    hasDropdown: true,
    dropdownItems: [
      { command: 'saveAs', label: 'Save As...' },
      { command: 'saveAll', label: 'Save All' },
    ],
  },
}

export const DarkTheme: Story = {
  args: {
    command: 'save',
    label: 'Save',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const Accessibility: Story = {
  args: {
    command: 'save',
    label: 'Save Document',
    ariaLabel: 'Save document (Ctrl+S)',
    tooltip: 'Save changes to file',
  },
}
```

---

## Part 7: CSS Template

**File**: `styles/controls/Button.css`

```css
/* ===== Button Base ===== */
.ribbon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ribbon-gap-xs, 4px);
  padding: var(--ribbon-button-padding, 6px 12px);
  font-family: var(--ribbon-font-family);
  font-size: var(--ribbon-font-size-md);
  border-radius: var(--ribbon-border-radius, 4px);
  border: 1px solid var(--ribbon-button-border, transparent);
  background-color: var(--ribbon-button-bg, #f0f0f0);
  color: var(--ribbon-button-text, #333);
  cursor: pointer;
  transition: all var(--ribbon-transition-speed, 150ms) ease-in-out;
  user-select: none;
  white-space: nowrap;
  min-height: var(--ribbon-control-height-sm, 24px);
}

/* ===== Size Variants ===== */
.ribbon-button--small {
  padding: 4px 8px;
  font-size: var(--ribbon-font-size-sm);
  min-height: var(--ribbon-control-height-sm, 24px);
}

.ribbon-button--medium {
  padding: 6px 12px;
  min-height: var(--ribbon-control-height-md, 32px);
}

.ribbon-button--large {
  padding: 8px 16px;
  font-size: var(--ribbon-font-size-lg);
  min-height: var(--ribbon-control-height-lg, 40px);
}

/* ===== States ===== */
.ribbon-button:hover:not(:disabled) {
  background-color: var(--ribbon-button-hover-bg, #e0e0e0);
  border-color: var(--ribbon-button-hover-border, #999);
}

.ribbon-button:active:not(:disabled),
.ribbon-button--active {
  background-color: var(--ribbon-button-active-bg, #d0d0d0);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ribbon-button:disabled,
.ribbon-button--disabled {
  opacity: var(--ribbon-button-disabled-opacity, 0.5);
  cursor: not-allowed;
  pointer-events: none;
}

.ribbon-button:focus-visible {
  outline: 2px solid var(--ribbon-primary, #0078d4);
  outline-offset: 2px;
}

.ribbon-button--loading {
  pointer-events: none;
  opacity: 0.7;
}

/* ===== Icon and Label ===== */
.ribbon-button__icon {
  display: inline-block;
  flex-shrink: 0;
}

.ribbon-button__label {
  display: inline-block;
}

.ribbon-button:not(.ribbon-button--with-label) .ribbon-button__label {
  display: none;
}

/* ===== Loading Spinner ===== */
.ribbon-button__spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ribbon-spin 0.6s linear infinite;
  margin-right: 4px;
}

@keyframes ribbon-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Variants ===== */
.ribbon-button--primary {
  background-color: var(--ribbon-primary, #0078d4);
  color: white;
}

.ribbon-button--primary:hover:not(:disabled) {
  background-color: var(--ribbon-primary-hover, #106ebe);
}

.ribbon-button--secondary {
  background-color: var(--ribbon-secondary, #e0e0e0);
  color: var(--ribbon-text, #333);
}
```

---

## Part 8: CSS Variables Reference

Create `styles/variables.css`:

```css
:root {
  /* ===== Colors ===== */
  --ribbon-primary: #0078d4;
  --ribbon-primary-hover: #106ebe;
  --ribbon-secondary: #e0e0e0;
  --ribbon-text: #333;
  --ribbon-text-muted: #666;
  --ribbon-bg: #f5f5f5;
  --ribbon-border: #d0d0d0;
  
  /* Status Colors */
  --ribbon-success: #10893e;
  --ribbon-warning: #ffc641;
  --ribbon-error: #d13438;
  --ribbon-info: #0078d4;
  
  /* ===== Spacing ===== */
  --ribbon-gap-xs: 4px;
  --ribbon-gap-sm: 8px;
  --ribbon-gap-md: 12px;
  --ribbon-gap-lg: 16px;
  
  --ribbon-padding-xs: 4px;
  --ribbon-padding-sm: 8px;
  --ribbon-padding-md: 12px;
  --ribbon-padding-lg: 16px;
  
  /* ===== Typography ===== */
  --ribbon-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --ribbon-font-size-xs: 11px;
  --ribbon-font-size-sm: 12px;
  --ribbon-font-size-md: 13px;
  --ribbon-font-size-lg: 14px;
  --ribbon-font-weight-normal: 400;
  --ribbon-font-weight-semibold: 600;
  --ribbon-line-height: 1.4;
  
  /* ===== Sizing ===== */
  --ribbon-control-height-sm: 24px;
  --ribbon-control-height-md: 32px;
  --ribbon-control-height-lg: 40px;
  
  /* ===== Effects ===== */
  --ribbon-border-radius: 4px;
  --ribbon-border-radius-lg: 6px;
  --ribbon-transition-speed: 150ms;
  --ribbon-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --ribbon-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* ===== Control-Specific ===== */
  --ribbon-button-bg: #f0f0f0;
  --ribbon-button-hover-bg: #e0e0e0;
  --ribbon-button-active-bg: #d0d0d0;
  --ribbon-button-border: transparent;
  --ribbon-button-text: #333;
  --ribbon-button-disabled-opacity: 0.5;
  --ribbon-button-padding: 6px 12px;
  
  --ribbon-input-bg: white;
  --ribbon-input-border: #d0d0d0;
  --ribbon-input-border-focus: #0078d4;
  --ribbon-input-text: #333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ribbon-text: #f0f0f0;
    --ribbon-text-muted: #b0b0b0;
    --ribbon-bg: #2d2d2d;
    --ribbon-border: #4d4d4d;
    --ribbon-button-bg: #3d3d3d;
    --ribbon-button-hover-bg: #4d4d4d;
    --ribbon-button-active-bg: #5d5d5d;
    --ribbon-input-bg: #3d3d3d;
    --ribbon-input-border: #4d4d4d;
  }
}

@media (prefers-contrast: more) {
  :root {
    --ribbon-border-radius: 2px;
    --ribbon-button-border: currentColor;
  }
}
```

---

## Summary

This implementation guide provides:

1. **Project structure** - Organized file layout
2. **Shared types** - TypeScript interfaces for all controls
3. **Implementation checklist** - Step-by-step tasks
4. **Code templates** - Component, test, story, CSS examples
5. **CSS system** - Variables and classes for theming
6. **Testing strategy** - Unit, accessibility, E2E
7. **Documentation** - JSDoc and markdown

All 22 controls can be implemented following this consistent pattern, ensuring:
- Quality and completeness
- Accessibility compliance
- Proper testing
- Excellent documentation
- Easy maintenance
- Open-source readiness

