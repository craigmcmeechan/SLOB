# Ribbon Controls - i18n Localization Guide

## Overview

This guide explains how to implement internationalization (i18n) across all ribbon controls. Each control will include its own translation files, allowing for efficient LLM-assisted editing with minimal context.

---

## Architecture

### Folder Structure Per Control

```
src/ui/ribbon/components/controls/Button/
├── Button.tsx                 # Component code
├── Button.css                 # Styles
├── Button.test.tsx            # Tests
├── locales/
│   ├── en.json               # English translations
│   ├── es.json               # Spanish translations
│   ├── fr.json               # French translations
│   ├── de.json               # German translations
│   └── [lang].json           # Add more languages as needed
└── __docs__/
    └── SPECIFICATION.md      # Control specification
```

### Build Process

```
Build Time:
1. Scan all controls: /src/ui/ribbon/components/controls/*/locales/
2. For each language (en, es, fr, de, etc):
   - Concatenate all {lang}.json files
   - Merge into single translation file
   - Output: /dist/locales/{lang}.json

Result:
dist/locales/
├── en.json      # { Button: {...}, Toggle: {...}, ... }
├── es.json      # { Button: {...}, Toggle: {...}, ... }
├── fr.json      # { Button: {...}, Toggle: {...}, ... }
└── de.json      # { Button: {...}, Toggle: {...}, ... }
```

---

## Translation File Structure

### Per-Control Translation File (Button.tsx)

**File**: `src/ui/ribbon/components/controls/Button/locales/en.json`

```json
{
  "Button": {
    "ariaLabel": "Button",
    "tooltips": {
      "save": "Save (Ctrl+S)",
      "copy": "Copy (Ctrl+C)",
      "paste": "Paste (Ctrl+V)"
    },
    "labels": {
      "save": "Save",
      "copy": "Copy",
      "paste": "Paste"
    },
    "states": {
      "loading": "Loading...",
      "disabled": "This action is not available",
      "error": "Error occurred"
    },
    "errors": {
      "commandNotFound": "Command not found",
      "commandFailed": "Command execution failed"
    }
  }
}
```

### Build Output (All Languages Combined)

**File**: `dist/locales/en.json`

```json
{
  "Button": { /* all Button translations */ },
  "ToggleButton": { /* all Toggle translations */ },
  "Checkbox": { /* all Checkbox translations */ },
  "RadioButton": { /* all Radio translations */ },
  "Combobox": { /* all Combobox translations */ },
  "SegmentedControl": { /* all Segmented translations */ },
  "TextInput": { /* all TextInput translations */ },
  "NumberInput": { /* all NumberInput translations */ },
  "ColorPicker": { /* all ColorPicker translations */ },
  "Label": { /* all Label translations */ },
  "Separator": { /* all Separator translations */ },
  "Icon": { /* all Icon translations */ },
  "Badge": { /* all Badge translations */ },
  "Gallery": { /* all Gallery translations */ },
  "Slider": { /* all Slider translations */ },
  "Progress": { /* all Progress translations */ },
  "Menu": { /* all Menu translations */ },
  "ButtonGroup": { /* all ButtonGroup translations */ },
  "ControlGroup": { /* all ControlGroup translations */ },
  "Toolbar": { /* all Toolbar translations */ }
}
```

---

## Implementation in Components

### i18n Hook

Create a custom hook for translations:

```typescript
// hooks/useTranslation.ts
import { useCallback } from 'react'
import { useAppState } from '@context/AppStateContext'

export function useTranslation(controlName: string) {
  const { locale } = useAppState()
  const translations = require(`@locales/${locale}.json`)
  
  const t = useCallback((key: string, defaultValue?: string) => {
    const keys = key.split('.')
    let value = translations[controlName]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || defaultValue || key
  }, [locale, controlName])
  
  return { t, locale }
}
```

### Usage in Component

```typescript
// components/controls/Button.tsx
import { useTranslation } from '@hooks/useTranslation'

export function RibbonButton(props: RibbonButtonProps) {
  const { t } = useTranslation('Button')
  
  return (
    <button
      aria-label={props.ariaLabel || t('ariaLabel')}
      title={props.tooltip || t(`tooltips.${props.command}`)}
      disabled={isDisabled}
    >
      {loading && <span>{t('states.loading')}</span>}
      {isDisabled && <title>{t('states.disabled')}</title>}
    </button>
  )
}
```

### Default String Fallback

**Pattern**: `t('key') || "Default String"`

```typescript
// Example in component
<button title={t('tooltips.save') || 'Save'}>
  {t('labels.save') || 'Save'}
</button>

// The t() function tries to find translation
// If not found, returns undefined
// The || operator provides fallback
```

---

## Translation File Naming

### Locale Code Format

Use standard locale codes:

```
Language Only:
- en (English)
- es (Spanish)
- fr (French)
- de (German)
- it (Italian)
- pt (Portuguese)
- zh (Chinese)
- ja (Japanese)

Language-Region:
- en-US (English - United States)
- en-GB (English - Great Britain)
- es-ES (Spanish - Spain)
- es-MX (Spanish - Mexico)
- pt-BR (Portuguese - Brazil)
- zh-CN (Chinese - Simplified)
- zh-TW (Chinese - Traditional)

Directory Structure:
src/ui/ribbon/components/controls/Button/locales/
├── en.json
├── en-US.json       (Optional: more specific)
├── es.json
├── es-MX.json       (Optional: more specific)
└── ...
```

---

## Build Script Example

Create `scripts/build-translations.js`:

```javascript
const fs = require('fs');
const path = require('path');

const CONTROLS_DIR = path.join(__dirname, '../src/ui/ribbon/components/controls');
const OUTPUT_DIR = path.join(__dirname, '../dist/locales');

// Get all unique locale files
const localesSet = new Set();
fs.readdirSync(CONTROLS_DIR).forEach(controlDir => {
  const localesPath = path.join(CONTROLS_DIR, controlDir, 'locales');
  if (fs.existsSync(localesPath)) {
    fs.readdirSync(localesPath).forEach(file => {
      if (file.endsWith('.json')) {
        localesSet.add(file.replace('.json', ''));
      }
    });
  }
});

// For each locale, concatenate all control translations
localesSet.forEach(locale => {
  const translations = {};
  
  fs.readdirSync(CONTROLS_DIR).forEach(controlDir => {
    const localeFile = path.join(
      CONTROLS_DIR, 
      controlDir, 
      'locales', 
      `${locale}.json`
    );
    
    if (fs.existsSync(localeFile)) {
      const content = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
      Object.assign(translations, content);
    }
  });
  
  // Create output file
  const outputFile = path.join(OUTPUT_DIR, `${locale}.json`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    outputFile, 
    JSON.stringify(translations, null, 2),
    'utf8'
  );
  
  console.log(`✓ Built ${locale}.json`);
});
```

### Add to `package.json`

```json
{
  "scripts": {
    "build:translations": "node scripts/build-translations.js",
    "build": "npm run build:translations && tsc && webpack"
  }
}
```

---

## Translation Keys Naming Convention

### Hierarchy

```
Control/
├── ariaLabel              # Screen reader label
├── tooltips/
│   ├── {action}          # Hover text for actions
│   └── {state}           # State-specific tooltips
├── labels/
│   ├── {action}          # Button/action labels
│   ├── placeholder       # Input placeholder
│   └── {variant}         # Variant-specific labels
├── states/
│   ├── loading           # Loading state message
│   ├── disabled          # Disabled state message
│   ├── error             # Error state message
│   └── success           # Success state message
├── errors/
│   ├── {errorCode}       # Specific error messages
│   └── generic           # Generic error message
├── messages/
│   ├── confirmation      # Confirmation message
│   ├── warning           # Warning message
│   └── info              # Info message
└── help/
    ├── {feature}         # Feature-specific help
    └── keyboard          # Keyboard shortcuts
```

### Examples

```json
{
  "Button": {
    "ariaLabel": "Execute action",
    "tooltips": {
      "save": "Save file (Ctrl+S)",
      "disabled": "Action not available in current state"
    },
    "labels": {
      "save": "Save",
      "saveAs": "Save As..."
    },
    "states": {
      "loading": "Processing..."
    },
    "errors": {
      "commandNotFound": "Command '{command}' not found"
    }
  },
  
  "Combobox": {
    "ariaLabel": "Select option",
    "labels": {
      "search": "Search",
      "noResults": "No matching options",
      "loading": "Loading options..."
    },
    "messages": {
      "selectOption": "Type to search or use arrow keys"
    }
  }
}
```

---

## Advantages of Per-Control Translation Files

### 1. **Token Efficiency**
When editing Button translations:
```
Old approach: Send entire 100KB translation file
New approach: Send only Button's ~2KB translation file
Savings: 98% token reduction for single control edits
```

### 2. **Easier for LLM Assistance**
- Edit single control = single translation file context
- Less context = faster, cheaper LLM requests
- Clearer scope = fewer hallucinations
- Easier to review changes

### 3. **Better Organization**
- Each control owns its translations
- Easy to find/update translations
- Clear where strings live
- Easier to delete unused strings

### 4. **Scalability**
- Add new languages without rebuilding everything
- Add new control without touching other translations
- Parallel translation work
- Incremental updates

---

## Language Support Implementation

### i18n Library Integration

Example with `i18next`:

```typescript
// i18n/config.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Load compiled translation files
const en = require('@locales/en.json')
const es = require('@locales/es.json')
const fr = require('@locales/fr.json')

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr }
    },
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
```

### Custom t() Implementation

```typescript
// i18n/useTranslation.ts
import { useContext } from 'react'
import { i18nContext } from './I18nProvider'

export function useTranslation(controlName: string) {
  const { translations, locale } = useContext(i18nContext)
  
  return {
    t: (key: string, defaultValue?: string) => {
      try {
        const keys = key.split('.')
        let value = translations[controlName]
        
        for (const k of keys) {
          if (value && typeof value === 'object') {
            value = value[k]
          } else {
            return defaultValue || key
          }
        }
        
        return value || defaultValue || key
      } catch {
        return defaultValue || key
      }
    },
    locale,
    changeLocale: (newLocale: string) => {
      // Implementation
    }
  }
}
```

---

## Build Process Integration

### Directory Structure for Build

```
src/ui/ribbon/
├── components/controls/
│   ├── Button/
│   │   ├── locales/en.json
│   │   ├── locales/es.json
│   │   └── ...
│   ├── ToggleButton/
│   │   ├── locales/en.json
│   │   └── ...
│   └── ...
└── i18n/
    └── build-translations.ts

dist/
└── locales/
    ├── en.json      (concatenated from all controls)
    ├── es.json      (concatenated from all controls)
    └── ...
```

### Build Command

```bash
# In package.json
"scripts": {
  "build:i18n": "ts-node src/ui/ribbon/i18n/build-translations.ts",
  "build": "npm run build:i18n && tsc && webpack"
}
```

---

## Translation File Template

Create per control:

```json
{
  "ControlName": {
    "ariaLabel": "ARIA label for screen readers",
    "tooltips": {
      "action": "Tooltip for hover"
    },
    "labels": {
      "primary": "Primary label"
    },
    "states": {
      "loading": "Loading message",
      "disabled": "Disabled message",
      "error": "Error message"
    },
    "messages": {
      "info": "Informational message"
    },
    "errors": {
      "commandFailed": "Error message format with {variable}"
    }
  }
}
```

---

## LLM-Friendly Editing

When editing translations with LLM assistance:

### Small Context = Better Results

**Example**: Editing Button translations

```
Prompt: "I need to update the German translation for Button control. 
Here's the current en.json and de.json files. 
Update de.json to match English, using professional German terms."

Input (only Button files, ~2KB each):
- Button/locales/en.json
- Button/locales/de.json

Cost: ~50 tokens
Result: Accurate German translations without hallucination
```

vs. Old Approach:

```
Prompt: "Update all German translations in the UI Suite"

Input (entire translation system, ~100KB):
- All control locales combined
- All previous versions
- All fallback strings

Cost: ~5000 tokens
Result: Risk of hallucination, context confusion
```

---

## Adding New Languages

### Steps

1. **Create translation files** for each control
   ```bash
   for control in Button ToggleButton Checkbox ...; do
     touch "src/ui/ribbon/components/controls/$control/locales/ja.json"
   done
   ```

2. **Fill in translations** (manual or with translator)

3. **Run build** to concatenate
   ```bash
   npm run build:i18n
   ```

4. **Test in application**
   ```typescript
   // In component
   i18n.changeLanguage('ja')
   ```

---

## Testing Translations

```typescript
// __tests__/i18n.test.ts
describe('Translations', () => {
  it('should have all required keys in all languages', () => {
    const languages = ['en', 'es', 'fr', 'de']
    const en = require('@locales/en.json')
    
    languages.forEach(lang => {
      const locale = require(`@locales/${lang}.json`)
      
      // Check all controls in en exist in locale
      Object.keys(en).forEach(control => {
        expect(locale).toHaveProperty(control)
      })
    })
  })
  
  it('should provide fallback for missing translations', () => {
    const { t } = useTranslation('Button')
    
    expect(t('nonexistent.key') || 'Default')
      .toBe('nonexistent.key')
  })
  
  it('should use default string when translation missing', () => {
    const { t } = useTranslation('Button')
    
    const result = t('missing.translation') || 'Save'
    expect(result).toBe('Save')
  })
})
```

---

## Summary

✅ **Per-control translation files** for easy LLM editing  
✅ **Build-time concatenation** into single file per language  
✅ **Default fallback strings** for missing translations  
✅ **Scalable structure** for adding new languages  
✅ **Token-efficient** for LLM-assisted updates  
✅ **Clear organization** for maintenance  

This approach keeps token counts minimal while maintaining full i18n support.

