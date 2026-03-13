# HTML Component Templates Guide

This directory contains HTML structure templates showing how each component should be marked up and styled with CSS variables.

---

## How to Use Templates

1. **Review the HTML structure** - Shows semantic markup
2. **Identify CSS class names** - `.ribbon-{component}--{modifier}`
3. **Note CSS variables** - `var(--ribbon-primary)`, `var(--ribbon-padding)`, etc.
4. **Copy the pattern** - Implement in React following this structure
5. **Use CSS variables** - All colors/sizes from variables.css

---

## Template Structure

Each template shows:
- ✅ Semantic HTML elements
- ✅ Proper ARIA attributes
- ✅ CSS class naming convention
- ✅ CSS variable usage
- ✅ Responsive design pattern
- ✅ Theme support

---

## Files in This Directory

- `ribbon-window.html` - Application window container
- `ribbon-ui.html` - Office-style tabs/groups/controls
- `toolbar.html` - Simplified control bar
- `sidebar.html` - Left/right navigation panels
- `button-bar.html` - Dialog footer buttons
- `css-variables.css` - All CSS variables (colors, sizes, spacing)
- `controls/` - Individual control templates
  - `button.html`
  - `toggle.html`
  - `input.html`
  - `checkbox.html`
  - ... all 22+ controls

---

## CSS Naming Convention

```
.ribbon-{component}                  Main element
.ribbon-{component}--{variant}      Variant (primary, danger, etc.)
.ribbon-{component}--{size}         Size (small, medium, large)
.ribbon-{component}_{element}       Child element
.ribbon-{component}_{element}--{mod} Child modifier
```

**Example**:
```css
.ribbon-button                  /* Main button */
.ribbon-button--primary         /* Primary variant */
.ribbon-button--small           /* Small size */
.ribbon-button_icon             /* Icon child element */
.ribbon-button_icon--disabled   /* Disabled icon */
```

---

## CSS Variables Pattern

```css
/* Colors */
--ribbon-primary: #4472C4
--ribbon-surface: #FFFFFF
--ribbon-surface-variant: #F5F5F5
--ribbon-text: #262626

/* Sizing */
--ribbon-size-small: 20px
--ribbon-size-medium: 24px
--ribbon-size-large: 32px

/* Spacing */
--ribbon-padding: 8px
--ribbon-gap: 8px

/* Borders */
--ribbon-border-radius: 2px
--ribbon-border-width: 1px
```

Usage:
```css
.ribbon-button {
  padding: var(--ribbon-padding);
  background-color: var(--ribbon-surface);
  border-radius: var(--ribbon-border-radius);
}
```

---

## React Implementation Pattern

```tsx
import './Component.css'  // Uses CSS variables

export const Component = ({
  variant = 'default',
  size = 'medium',
  ...props
}) => {
  return (
    <button
      className={`
        ribbon-component
        ribbon-component--${variant}
        ribbon-component--${size}
      `}
      {...props}
    >
      {/* Content */}
    </button>
  )
}
```

---

## Theme Support Example

```css
/* Light theme (default) */
.ribbon-button {
  background-color: var(--ribbon-surface);
  color: var(--ribbon-text);
}

/* Dark theme override */
[data-theme="dark"] .ribbon-button {
  background-color: var(--ribbon-surface-dark);
  color: var(--ribbon-text-dark);
}

/* Accessible theme override */
[data-theme="accessible"] .ribbon-button {
  background-color: var(--ribbon-surface);
  color: var(--ribbon-text);
  border: 2px solid var(--ribbon-primary);
}
```

---

**Use these templates to understand the CSS structure needed for each component!**

