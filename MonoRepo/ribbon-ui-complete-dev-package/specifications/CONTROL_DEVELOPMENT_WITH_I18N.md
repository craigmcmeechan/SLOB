# Control Development Guide with i18n Localization

## Critical: Each Control Must Include Localization Folder

When creating any ribbon control, you MUST include a `locales/` folder with translation files.

---

## Project Structure (with Mandatory i18n)

```
src/ui/ribbon/components/controls/
│
├── Button/                          # Control folder
│   ├── Button.tsx                   # Component code
│   ├── Button.css                   # Styles
│   ├── Button.test.tsx              # Unit tests
│   ├── locales/                     # ← REQUIRED: Localization folder
│   │   ├── en.json                  # ← English translations (REQUIRED)
│   │   ├── es.json                  # ← Spanish (optional, for full i18n)
│   │   ├── fr.json                  # ← French (optional, for full i18n)
│   │   └── de.json                  # ← German (optional, for full i18n)
│   └── __docs__/
│       └── SPECIFICATION.md
│
├── ToggleButton/
│   ├── ToggleButton.tsx
│   ├── ToggleButton.css
│   ├── ToggleButton.test.tsx
│   ├── locales/                     # ← REQUIRED
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── fr.json
│   │   └── de.json
│   └── __docs__/
│       └── SPECIFICATION.md
│
├── ... (all 22 controls follow this structure)
│
└── index.ts                         # Export all controls

dist/locales/                        # ← BUILD OUTPUT (auto-generated)
├── en.json                          # All controls combined
├── es.json                          # All controls combined
├── fr.json                          # All controls combined
└── de.json                          # All controls combined
```

---

## Translation File Format

### Per-Control en.json

**File**: `src/ui/ribbon/components/controls/Button/locales/en.json`

```json
{
  "Button": {
    "ariaLabel": "Button",
    "tooltips": {
      "save": "Save (Ctrl+S)",
      "copy": "Copy (Ctrl+C)"
    },
    "labels": {
      "save": "Save",
      "copy": "Copy"
    },
    "states": {
      "loading": "Loading...",
      "disabled": "Not available",
      "error": "Error occurred"
    },
    "messages": {
      "confirmAction": "Are you sure?"
    }
  }
}
```

### Multiple Languages

Create same structure for each language:

```
Button/locales/
├── en.json       # {"Button": {...}}
├── es.json       # {"Button": {...}}  (Spanish)
├── fr.json       # {"Button": {...}}  (French)
└── de.json       # {"Button": {...}}  (German)
```

### Build Output (Concatenated)

**File**: `dist/locales/en.json` (generated at build time)

```json
{
  "Button": {
    "ariaLabel": "Button",
    "tooltips": {
      "save": "Save (Ctrl+S)",
      "copy": "Copy (Ctrl+C)"
    },
    ...
  },
  "ToggleButton": {
    "ariaLabel": "Toggle option",
    ...
  },
  "Checkbox": {
    "ariaLabel": "Checkbox",
    ...
  },
  ... (all 22 controls combined into single file)
}
```

---

## Using Translations in Components

### Step 1: Import Hook

```typescript
import { useTranslation } from '@hooks/useTranslation'
```

### Step 2: Get Translation Function

```typescript
export function RibbonButton(props: RibbonButtonProps) {
  const { t } = useTranslation('Button')
  
  // ...
}
```

### Step 3: Use with Fallback

```typescript
// Pattern: t(key) || "default string"

<button
  title={t('tooltips.save') || 'Save'}
  aria-label={t('ariaLabel') || 'Button'}
>
  {t('labels.save') || 'Save'}
</button>
```

### Complete Example

```typescript
import { useTranslation } from '@hooks/useTranslation'

export function RibbonButton(props: RibbonButtonProps) {
  const { t } = useTranslation('Button')
  const { executeCommand, isCommandEnabled } = useCommand(props.command)
  
  return (
    <button
      title={props.tooltip || t('tooltips.' + props.command) || 'Execute action'}
      aria-label={props.ariaLabel || t('ariaLabel') || 'Button'}
      onClick={() => !isDisabled && executeCommand()}
      disabled={isDisabled}
    >
      {isLoading && <span>{t('states.loading') || 'Loading...'}</span>}
      {!isLoading && props.label && <span>{props.label}</span>}
    </button>
  )
}
```

---

## Build Process

### Build Script: Concatenate All Locale Files

**File**: `scripts/build-translations.ts`

```typescript
import fs from 'fs'
import path from 'path'

const CONTROLS_DIR = path.join(__dirname, '../src/ui/ribbon/components/controls')
const OUTPUT_DIR = path.join(__dirname, '../dist/locales')

// Discover all available locales
const localesSet = new Set<string>()
fs.readdirSync(CONTROLS_DIR).forEach(controlDir => {
  const localesPath = path.join(CONTROLS_DIR, controlDir, 'locales')
  if (fs.existsSync(localesPath)) {
    fs.readdirSync(localesPath).forEach(file => {
      if (file.endsWith('.json')) {
        localesSet.add(file.replace('.json', ''))
      }
    })
  }
})

// For each locale, concatenate all control translations
localesSet.forEach(locale => {
  const translations: Record<string, any> = {}
  
  fs.readdirSync(CONTROLS_DIR).forEach(controlDir => {
    const localeFile = path.join(
      CONTROLS_DIR,
      controlDir,
      'locales',
      `${locale}.json`
    )
    
    if (fs.existsSync(localeFile)) {
      const content = JSON.parse(fs.readFileSync(localeFile, 'utf8'))
      Object.assign(translations, content)
    }
  })
  
  // Write output file
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${locale}.json`),
    JSON.stringify(translations, null, 2),
    'utf8'
  )
  
  console.log(`✓ Built locales/${locale}.json`)
})
```

### Add to package.json

```json
{
  "scripts": {
    "build:i18n": "ts-node scripts/build-translations.ts",
    "build": "npm run build:i18n && tsc && webpack"
  }
}
```

### Run Build

```bash
npm run build:i18n
# Output:
# ✓ Built locales/en.json
# ✓ Built locales/es.json
# ✓ Built locales/fr.json
# ✓ Built locales/de.json
```

---

## Why Per-Control Locales?

### Token Efficiency (Main Benefit)

**Scenario**: You need to update German translations for Button component

**Old approach** (full translation file):
```
Send: 100KB translation file (all controls, all languages)
Cost: ~5000 tokens
LLM context: Entire system, harder to focus
```

**New approach** (per-control locales):
```
Send: Button/locales/de.json only (~2KB)
Cost: ~50 tokens
LLM context: Only Button, clear scope
Result: 100x token savings!
```

### Other Benefits

✅ **Organization**: Each control owns its translations  
✅ **Maintainability**: Easy to find/update specific strings  
✅ **Scalability**: Add new languages without rebuilding  
✅ **Parallel Work**: Team members can work on different controls  
✅ **Version Control**: Cleaner diffs on control-by-control changes  

---

## Supported Languages

**Minimum**: English (en.json)

**Recommended**:
- en - English
- es - Spanish
- fr - French
- de - German

**Can add more**:
- it - Italian
- pt - Portuguese
- pt-BR - Portuguese (Brazil)
- zh - Chinese (Simplified)
- zh-TW - Chinese (Traditional)
- ja - Japanese
- ko - Korean

Create files as needed: `Button/locales/{lang}.json`

---

## Translation Keys Naming Convention

Use dot notation for hierarchical keys:

```
Button.ariaLabel           → Screen reader label
Button.tooltips.save       → Tooltip for save action
Button.tooltips.disabled   → Tooltip when disabled
Button.labels.save         → Label text for save
Button.states.loading      → "Loading..." message
Button.states.disabled     → "Not available" message
Button.messages.confirm    → Confirmation message
Button.errors.commandFailed → Error message
```

---

## Quality Checklist for Each Control

✅ **Localization Structure**
- [ ] `locales/` folder exists
- [ ] `locales/en.json` exists and complete
- [ ] All text strings in en.json (no hardcoded strings in component)
- [ ] Fallback strings provided: `t(key) || "default"`

✅ **Translation Quality**
- [ ] All UI strings in locales (ariaLabel, tooltip, label, etc)
- [ ] Error messages in locales
- [ ] Status messages in locales
- [ ] No hardcoded strings in component

✅ **Component Integration**
- [ ] Uses `useTranslation('ControlName')` hook
- [ ] Implements fallback pattern: `t(key) || "default"`
- [ ] aria-label from translations or prop
- [ ] title/tooltip from translations or prop

✅ **Build Integration**
- [ ] Script finds en.json file
- [ ] Script finds es.json, fr.json, de.json files
- [ ] Build concatenates into dist/locales/{lang}.json
- [ ] No errors during build

---

## Testing Translations

```typescript
describe('Button i18n', () => {
  it('should render English strings', () => {
    const { t } = useTranslation('Button')
    expect(t('ariaLabel')).toBeDefined()
    expect(t('tooltips.save')).toBeDefined()
  })

  it('should provide fallback when translation missing', () => {
    const { t } = useTranslation('Button')
    const result = t('nonexistent.key') || 'Default'
    expect(result).toBe('Default')
  })

  it('should have all required keys in all languages', () => {
    const languages = ['en', 'es', 'fr', 'de']
    const en = require('@locales/en.json')
    
    languages.forEach(lang => {
      const locale = require(`@locales/${lang}.json`)
      expect(locale).toHaveProperty('Button')
      Object.keys(en.Button).forEach(key => {
        expect(locale.Button).toHaveProperty(key)
      })
    })
  })
})
```

---

## Summary

**Each control MUST have**:
1. ✅ `locales/en.json` - English translations (required)
2. ✅ `locales/{lang}.json` - Other languages (optional)
3. ✅ Fallback strings: `t(key) || "default"`
4. ✅ No hardcoded user-facing strings in component
5. ✅ All strings use `useTranslation()` hook

**Build process**:
1. Script scans all `{control}/locales/*.json` files
2. Concatenates per language into `dist/locales/{lang}.json`
3. Components load from single file per language
4. Fallback strings handle missing translations

**Token efficiency**:
- Single control edit = single locale file = ~50 tokens
- Full system edit = entire translation system = ~5000 tokens
- **100x savings for single-control localization updates**

