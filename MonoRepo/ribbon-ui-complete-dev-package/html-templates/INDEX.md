# HTML Templates - Complete Index

All templates in this folder show semantic HTML structure and CSS class naming conventions for implementing Ribbon UI components.

---

## Major Component Templates

| Template | Purpose |
|----------|---------|
| **css-variables.css** | Complete CSS variables system (colors, spacing, typography) |
| **ribbon-window.html** | Application container with header, content, sidebar, footer |
| **ribbon.html** | Office-style tabs/groups/controls interface |
| **toolbar.html** | Simplified horizontal control bar |
| **sidebar.html** | Left/right navigation and property panels |
| **button-bar.html** | Dialog footer with preset button configurations |

---

## Control Templates (21 files)

### Action Controls (4)
- **button.html** - Basic, primary, disabled, small, large variants
- **toggle.html** - On/off toggle button
- **splitbutton.html** - Primary action + dropdown
- **dropdown.html** - Dropdown menu button

### Selection Controls (4)
- **checkbox.html** - Single, multiple, indeterminate states
- **radio.html** - Radio button group
- **combobox.html** - Searchable dropdown with text input
- **segmented.html** - Mutually exclusive segments

### Input Controls (3)
- **textinput.html** - Text, placeholder, disabled states
- **numberinput.html** - Number input with +/- buttons
- **colorpicker.html** - Color selection with hex display

### Display Controls (4)
- **label.html** - Text labels (default, secondary, muted)
- **separator.html** - Horizontal and vertical dividers
- **icon.html** - Icons in different sizes and colors
- **badge.html** - Badge indicators (default, success, warning, danger)

### Specialized Controls (4)
- **gallery.html** - Grid of selectable items
- **slider.html** - Range input with labeled values
- **progress.html** - Progress bar with percentage
- **menu.html** - Dropdown menu items

### Container Controls (2)
- **buttongroup.html** - Group of related buttons
- **controlgroup.html** - Grouped controls with legend

---

## How to Use These Templates

1. **Understand Structure**: Each template shows semantic HTML with proper class names
2. **Review CSS**: CSS examples show variable usage and responsive design
3. **Implement in React**: Use the HTML structure as reference when building React components
4. **Follow Naming Convention**: `.ribbon-{component}--{modifier}` pattern throughout
5. **Use CSS Variables**: All colors, sizes, spacing use CSS variables for theming

---

## CSS Naming Convention

```
.ribbon-{component}                  Main element
.ribbon-{component}--{variant}      Variant (primary, danger, etc.)
.ribbon-{component}--{size}         Size (small, medium, large)
.ribbon-{component}_{element}       Child element
.ribbon-{component}_{element}--{mod} Child modifier
```

---

## CSS Variables Used

All templates use CSS variables defined in `css-variables.css`:

- Colors: `--ribbon-primary`, `--ribbon-surface`, `--ribbon-text`
- Sizing: `--ribbon-size-small`, `--ribbon-size-medium`, `--ribbon-size-large`
- Spacing: `--ribbon-padding`, `--ribbon-gap`, `--ribbon-margin`
- Borders: `--ribbon-border-width`, `--ribbon-border-radius`
- Typography: `--ribbon-font-family`, `--ribbon-font-size`, `--ribbon-font-weight`
- Transitions: `--ribbon-transition-fast`, `--ribbon-transition`

---

## Theme Support

All templates support 3 themes:

- **Light** (default): `--ribbon-primary: #4472C4`
- **Dark** `[data-theme="dark"]`: Darker surfaces, lighter text
- **Accessible** `[data-theme="accessible"]`: Higher contrast, larger text

Apply theme by setting `data-theme` attribute on root element.

---

## Total Templates

- **6 Major Component Templates**
- **21 Control Templates**
- **1 CSS Variables File**
- **28 Total Files**

All ready to reference when implementing React components!

