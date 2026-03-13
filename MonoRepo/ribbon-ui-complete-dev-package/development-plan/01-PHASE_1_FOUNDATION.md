# Phase 1: Foundation (Days 1-3)

**Duration**: 3 days  
**Priority**: Critical  
**Dependencies**: None  

---

## Day 1: Component Base and CSS Variables

### Morning: Component Base Class

Create `src/components/base.ts`:

```typescript
import React from 'react'

export interface BaseComponentProps {
  id?: string
  className?: string
  style?: React.CSSProperties
  title?: string
  ariaLabel?: string
  disabled?: boolean
  [key: string]: any
}

export const BaseComponent = React.memo(
  ({ children, ...props }: { children?: React.ReactNode } & BaseComponentProps) => (
    <div {...props}>{children}</div>
  )
)
```

### Afternoon: CSS Variables System

Create `src/styles/variables.css`:

```css
:root {
  /* Colors */
  --ribbon-primary: #4472C4;
  --ribbon-primary-hover: #3860A0;
  --ribbon-surface: #FFFFFF;
  --ribbon-surface-hover: #F5F5F5;
  --ribbon-text: #262626;
  --ribbon-border: #D0CECE;
  
  /* Sizing */
  --ribbon-size-small: 20px;
  --ribbon-size-medium: 24px;
  --ribbon-size-large: 32px;
  
  /* Spacing */
  --ribbon-padding: 8px;
  --ribbon-gap: 8px;
  --ribbon-margin: 12px;
  
  /* Borders */
  --ribbon-border-radius: 2px;
  --ribbon-border-width: 1px;
}
```

### Deliverables for Day 1
- [ ] Base component class created
- [ ] CSS variables defined
- [ ] Variables loaded in app
- [ ] Tests for base (70%+)

---

## Day 2: Theme System

### Morning: Create Theme Files

Create three theme files:
- `src/styles/themes/light.css` - Default theme
- `src/styles/themes/dark.css` - Dark mode
- `src/styles/themes/accessible.css` - High contrast

### Afternoon: Theme Provider

Create `src/contexts/ThemeContext.tsx`:

```typescript
import React, { createContext, useContext, useState } from 'react'

export type Theme = 'light' | 'dark' | 'accessible'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}
```

### Deliverables for Day 2
- [ ] 3 theme files created
- [ ] Theme variables defined
- [ ] ThemeProvider working
- [ ] Theme switching works
- [ ] Tests for themes (70%+)

---

## Day 3: i18n System

### Morning: i18n Setup

Create `src/i18n/locales/` structure:

```
src/i18n/locales/
├── en.json
├── es.json
├── fr.json
└── de.json
```

### Afternoon: i18n Hook

Create `src/hooks/useTranslation.ts`:

```typescript
import { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'

export const useTranslation = (namespace: string) => {
  const { translations, language } = useContext(LanguageContext)
  
  const t = (key: string, defaultValue?: string) => {
    return translations?.[namespace]?.[key] || defaultValue || key
  }
  
  return { t, language }
}
```

### Deliverables for Day 3
- [ ] i18n structure created
- [ ] Translation files created (en, es, fr, de)
- [ ] useTranslation hook works
- [ ] Language context provider
- [ ] Tests for i18n (70%+)

---

## Quality Gate for Phase 1

Before moving to Phase 2, verify:

- [ ] Base component class created and tested
- [ ] CSS variables system working
- [ ] All 3 themes functional
- [ ] Theme switching works
- [ ] i18n loader working
- [ ] All 4 languages loading
- [ ] TypeScript types defined
- [ ] 70%+ test coverage
- [ ] No console errors
- [ ] Code committed to git
- [ ] CHANGELOG.md updated

---

## Next Phase

→ Read `02-PHASE_2_CORE_COMPONENTS.md`

