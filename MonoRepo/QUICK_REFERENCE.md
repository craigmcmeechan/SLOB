# Ribbon UI - Quick Reference Guide

## 🎯 Project Status
**Phase 1**: ✅ COMPLETE (Foundation)
**Phase 2**: 🔄 STARTING (Core Components)
**Timeline**: 20 days estimated (automated development)

---

## 📦 Package Location
```
D:\App\MonoRepo\packages\ui-components\ribbon-ui\
```

## 🚀 Quick Start

### Import the library
```typescript
import {
  ThemeProvider,
  LocalizationProvider,
  useThemeContext,
  useLocalizationContext,
  COMMON_ICONS,
  getIcon,
} from '@ribbon-ui/core';
```

### Wrap your app
```typescript
<ThemeProvider initialTheme="light">
  <LocalizationProvider initialLocale="en">
    <YourApp />
  </LocalizationProvider>
</ThemeProvider>
```

### Use in components
```typescript
const { theme, setTheme } = useThemeContext();
const { locale, t } = useLocalizationContext();

// Translate
const label = t('ribbon.home');

// Format with variables
const message = t('manufacturing.quote', 'Quote');
```

---

## 🎨 CSS Variables Reference

### Colors
```css
--ribbon-primary: #2c3e50;
--ribbon-success: #27ae60;
--ribbon-warning: #f39c12;
--ribbon-error: #e74c3c;
--ribbon-text-primary: #333333;
--ribbon-bg-primary: #ffffff;
```

### Sizing
```css
--ribbon-size-button-md: 2rem;        /* 32px */
--ribbon-size-icon-md: 1.5rem;        /* 24px */
--ribbon-size-ribbon-height: 7rem;    /* 112px */
```

### Spacing
```css
--ribbon-space-1: 0.25rem;  /* 4px */
--ribbon-space-2: 0.5rem;   /* 8px */
--ribbon-space-4: 1rem;     /* 16px */
```

---

## 🌍 Languages & Locales

### Supported Languages
- **en** - English
- **es** - Spanish
- **fr** - French
- **de** - German

### Translation Keys (examples)
```
ribbon.home
ribbon.insert
controls.copy
controls.paste
manufacturing.quote
manufacturing.production
messages.welcome
accessibility.openMenu
```

---

## 🎨 Themes

### Available Themes
1. **light** - Default professional theme
2. **dark** - High-contrast dark theme
3. **accessible** - WCAG AAA compliant

### Switch Theme
```typescript
const { theme, setTheme } = useThemeContext();
setTheme('dark');
setTheme('light');
setTheme('accessible');
```

---

## 🎭 Icons (300+ Available)

### Common Icons
```typescript
COMMON_ICONS.SAVE        // Save
COMMON_ICONS.COPY        // Copy
COMMON_ICONS.UNDO        // Undo
COMMON_ICONS.BOLD        // Bold
COMMON_ICONS.SEARCH      // Search
```

### Manufacturing Icons
```typescript
MANUFACTURING_ICONS.PRODUCTION    // Factory
MANUFACTURING_ICONS.QUALITY       // QC
MANUFACTURING_ICONS.INVENTORY     // Package
MANUFACTURING_ICONS.DELIVERY      // Truck
```

### Get Icon Component
```typescript
const CopyIcon = getIcon('copy');
const SaveIcon = getIcon('save');
```

---

## 📝 File Structure

```
packages/ui-components/ribbon-ui/src/
├── components/
│   └── base.ts                        # Base utilities
├── styles/
│   ├── variables.css                  # CSS variables
│   └── themes/
│       ├── light.css
│       ├── dark.css
│       └── accessible.css
├── types/
│   └── index.ts                       # Type definitions
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en/common.json
│       ├── es/common.json
│       ├── fr/common.json
│       └── de/common.json
├── hooks/
│   ├── useTheme.ts
│   └── useLocalization.ts
├── contexts/
│   ├── ThemeContext.tsx
│   └── LocalizationContext.tsx
├── utils/
│   └── icons.ts
└── index.ts                           # Main export
```

---

## 🛠️ Development Commands

```bash
# From root directory
pnpm install                    # Install dependencies
pnpm dev                        # Start dev server
pnpm build                      # Build all packages
pnpm test                       # Run tests
pnpm lint                       # Lint code
pnpm storybook                  # Start Storybook

# From ribbon-ui directory
pnpm build
pnpm test
pnpm storybook
```

---

## 📋 Component Types

### Control Types Available
- Button, Toggle, Checkbox, Radio
- Dropdown, Menu, SplitButton
- Gallery, Spinner, ComboBox
- Input, DatePicker, ColorPicker
- Slider, Separator, Label, HelpIcon

### Control Interface
```typescript
interface ControlConfig {
  id: string;
  type: ControlType;
  label?: string;
  tooltip?: string;
  icon?: string;
  disabled?: boolean;
  visible?: boolean;
  properties?: Record<string, any>;
}
```

---

## 🎯 Phase 2 Components (Coming Next)

### RibbonWindow
- Window container with move/resize
- State management
- Keyboard shortcuts

### Ribbon
- Tab-based interface
- Group organization
- Control rendering

### Controls
- 22+ control types
- All variations and states

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| PHASE1_COMPLETE.md | Phase 1 detailed summary |
| DEVELOPMENT_PROGRESS.md | Progress tracking |
| EXECUTION_SUMMARY.md | Overall summary |
| QUICK_REFERENCE.md | This file |
| MEMORY.md | Developer notes |

---

## 🔍 Reference Specification Documents

Located in: `ribbon-ui-complete-dev-package/`

- `specifications/` - Component specifications
- `html-templates/` - HTML reference templates
- `components/` - Component implementation guides
- `development-plan/` - Phase-by-phase plans
- `e2e-tests/` - Test specifications

---

## 💡 Tips for Phase 2 Development

1. **Use CSS Variables**: All colors come from variables
2. **Type Everything**: Use TypeScript types from `src/types/`
3. **Support All Themes**: Test with light, dark, accessible
4. **Translate Everything**: Add all UI strings to locales
5. **Make it Accessible**: Follow WCAG 2.1 AA minimum
6. **Document Publicly**: JSDoc all public APIs
7. **Test Thoroughly**: Aim for 90%+ coverage

---

## ❓ Common Questions

**Q: How do I add a new translation?**
A: Add the key to all 4 locale files (en, es, fr, de) in `src/i18n/locales/`

**Q: How do I use CSS variables in components?**
A: Import `variables.css` and use `var(--ribbon-primary)` in your CSS

**Q: How do I create a themed component?**
A: Use CSS variables for colors, borders, shadows - they automatically respond to theme changes

**Q: Where do I find icon names?**
A: See `COMMON_ICONS` and `MANUFACTURING_ICONS` in `src/utils/icons.ts`, or use `getAvailableIcons()`

---

## 🚀 Next Steps

1. Review `PHASE1_COMPLETE.md` for detailed Phase 1 info
2. Check `DEVELOPMENT_PROGRESS.md` for timeline
3. Read `EXECUTION_SUMMARY.md` for what was accomplished
4. Start Phase 2: Implement RibbonWindow component
5. Reference specs in `ribbon-ui-complete-dev-package/`

---

**Last Updated**: 2026-03-13
**Phase 1 Status**: ✅ COMPLETE
**Ready for**: Phase 2 Development
