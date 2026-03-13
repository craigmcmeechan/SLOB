# Complete Claude Code Development Instructions

**Purpose**: Tell Claude Code exactly how to build the Ribbon UI component suite  
**Version**: 4.0.0 | **Estimated Time**: 20 days automated development

---

## Overview

This document provides **complete, step-by-step instructions** for using Claude Code to build the entire Ribbon UI component suite from specifications.

Claude Code will:

✅ Create all 5 major components (RibbonWindow, Ribbon, Toolbar, Sidebar, ButtonBar)  
✅ Create all 22+ control types  
✅ Implement full TypeScript with strict mode  
✅ Add CSS styling (light/dark/accessible themes)  
✅ Create unit tests (90%+ coverage)  
✅ Add WCAG 2.1 AA accessibility  
✅ Create Storybook stories  
✅ Add i18n support (4 languages)  
✅ Auto-commit with changelog updates  

---

## Phase 1: Foundation Setup (Days 1-3)

### Claude's Task

Create the base infrastructure that all other components depend on:

1. **Component Base Class** (`src/components/base.ts`)
   - Props interface
   - Common functionality
   - Export/import pattern

2. **CSS Variable System** (`src/styles/variables.css`)
   - Color definitions
   - Sizing variables
   - Spacing values
   - Typography settings

3. **Theme Files**
   - `src/styles/themes/light.css`
   - `src/styles/themes/dark.css`
   - `src/styles/themes/accessible.css`
   - Variable overrides per theme

4. **Icon System** (`src/utils/icons.ts`)
   - SVG icon loading
   - Icon sizing
   - Color support

5. **i18n Setup** (`src/i18n/`)
   - Locale structure
   - Translation loader
   - Language switching hook

6. **TypeScript Types** (`src/types/`)
   - Common interfaces
   - Control props
   - System types

### Instructions to Give Claude

```
Phase 1: Create foundation components

1. Create Component Base Class (src/components/base.ts)
   - Base React.memo wrapper
   - Common props interface
   - Accessibility attributes support
   - Theme support

2. Create CSS Variable System (src/styles/variables.css)
   - OnlyOffice color palette
   - Size variables (small, medium, large)
   - Spacing values
   - Font settings
   - Used by all components

3. Create Theme Files
   - Light theme: src/styles/themes/light.css
   - Dark theme: src/styles/themes/dark.css
   - Accessible: src/styles/themes/accessible.css
   - Override CSS variables per theme

4. Create Icon System (src/utils/icons.ts)
   - Load SVG icons
   - Support sizing
   - Color customization

5. Set up i18n
   - Create locale file structure
   - Create translation loader hook
   - Support 4 languages (en, es, fr, de)

6. Create TypeScript Types (src/types/)
   - Common component props
   - Control interfaces
   - System types

Tests:
- Unit tests for base class (70%+ coverage)
- CSS variables verify properly
- i18n loads correctly

Commit:
- Git commit with detailed message
- Changelog auto-updates
- Ready for Phase 2
```

---

## Phase 2: Core Components (Days 4-8)

### Components to Create

#### RibbonWindow (Days 4-5)

**Reference**: `./html-templates/ribbon-window.html`  
**Specification**: `./specifications/RIBBON_WINDOW_SPECIFICATION.md`

**Claude's Task**:
```
Implement RibbonWindow component

1. Create RibbonWindow.tsx
   - Window container management
   - Move/resize functionality
   - Min/max dimensions
   - State management
   - Keyboard shortcuts

2. Create RibbonWindow.css
   - Use HTML template structure
   - Apply CSS variables
   - Support all 3 themes
   - Responsive design

3. Create RibbonWindow.test.tsx
   - Props validation
   - Window state management
   - Accessibility attributes
   - Keyboard navigation
   - 90%+ coverage

4. Create RibbonWindow.stories.tsx
   - Default window
   - Dialog variant
   - Popup variant
   - Custom sizes

5. Add i18n Support
   - Locale files (en, es, fr, de)
   - Window labels/tooltips
   - Accessible descriptions

6. Git Commit
   - Detailed message
   - Auto-changelog updates
```

#### Ribbon UI (Days 5-6)

**Reference**: `./html-templates/ribbon-ui.html`  
**Specification**: `./specifications/RIBBON_CONTROLS_MASTER_SPECIFICATION.md`

**Claude's Task**: Create tabs, groups, control management

#### All 22 Controls (Days 6-8)

For each control:
1. Read spec from `./components/{ControlName}/SPECIFICATION.md`
2. Review HTML template from `./html-templates/controls/{control}.html`
3. Implement component with all props
4. Add CSS styling (all themes)
5. Create unit tests (90%+)
6. Add Storybook stories
7. Add i18n (4 languages)
8. Git commit + auto-changelog

---

## Phase 3: Advanced Components (Days 9-12)

### Toolbar, Sidebar, ButtonBar

Same pattern as Phase 2:
1. Read specification
2. Review HTML template
3. Implement with tests
4. Add themes/i18n
5. Commit with changelog

---

## Phase 4: Integration (Days 13-15)

### Connect Everything

1. JSON UI system
2. Command system
3. State management
4. Theme switching
5. Full i18n

---

## Phase 5: Testing & Docs (Days 16-18)

### Comprehensive Testing

1. Unit tests (90%+ coverage)
2. Accessibility tests (WCAG AA)
3. E2E tests (complete workflows)
4. Storybook stories (all components)
5. JSDoc documentation

---

## Instructions for Claude Code

### Copy This Exact Prompt

```
I'm building a Ribbon UI component suite using specifications in ./docs/ribbon-ui/

READ FIRST:
1. ./docs/ribbon-ui/claude-code/CLAUDE_DEVELOPMENT.md (this file)
2. ./docs/ribbon-ui/MASTER_DEVELOPMENT_GUIDE.md
3. ./docs/ribbon-ui/development-plan/phase-1-foundation.md

DEVELOPMENT PROCESS:

For each phase (1-6):
1. Read the phase specification in development-plan/
2. For each component:
   a. Read specification from specifications/
   b. Review HTML template from html-templates/
   c. Implement TypeScript component
   d. Create CSS (using CSS variables, all 3 themes)
   e. Create unit tests (90%+ coverage minimum)
   f. Add accessibility (WCAG 2.1 AA)
   g. Create Storybook story
   h. Add i18n (en, es, fr, de)
   i. Commit with this format:
      
      feat: implement {ComponentName}
      
      - Full TypeScript implementation
      - CSS styling (light/dark/accessible)
      - Unit tests (95% coverage)
      - WCAG 2.1 AA accessibility
      - i18n support (en, es, fr, de)
      - Storybook stories
      - JSDoc documentation
      
      Closes #{issue}

3. Git pre-commit hook auto-updates CHANGELOG.md

QUALITY REQUIREMENTS:
- TypeScript strict mode
- 90%+ test coverage (verify with: npm test -- --coverage)
- WCAG 2.1 AA accessibility (test with axe-core)
- <50ms render time
- All 3 themes working (light, dark, accessible)
- All 4 languages working (en, es, fr, de)
- JSDoc on all public APIs
- Storybook story per component

FOLDER STRUCTURE:
src/
├── components/
│   ├── RibbonWindow/
│   │   ├── RibbonWindow.tsx
│   │   ├── RibbonWindow.css
│   │   ├── RibbonWindow.test.tsx
│   │   ├── RibbonWindow.stories.tsx
│   │   └── locales/
│   │       ├── en.json
│   │       ├── es.json
│   │       ├── fr.json
│   │       └── de.json
│   ├── Ribbon/
│   ├── Toolbar/
│   ├── Sidebar/
│   ├── ButtonBar/
│   ├── Controls/
│   │   ├── Button/
│   │   ├── Toggle/
│   │   ├── ...all controls
│   │   └── Menu/
│   └── Helpers/
│       ├── Tooltip/
│       ├── ContextMenu/
│       └── ...etc
├── styles/
│   ├── variables.css
│   ├── themes/
│   │   ├── light.css
│   │   ├── dark.css
│   │   └── accessible.css
│   └── reset.css
├── i18n/
│   └── locales/
│       ├── en/
│       ├── es/
│       ├── fr/
│       └── de/
├── types/
│   └── index.ts
├── hooks/
│   ├── useTheme.ts
│   ├── useLocalization.ts
│   ├── useCommand.ts
│   └── useWindow.ts
├── contexts/
│   ├── ThemeContext.tsx
│   ├── CommandContext.tsx
│   └── WindowContext.tsx
└── utils/
    ├── constants.ts
    ├── helpers.ts
    └── validation.ts

BEGIN WITH PHASE 1!

Start by creating the foundation (base classes, themes, i18n).
Then move to Phase 2 (core components).
Ask me questions if anything is unclear.
```

### What to Expect

Claude Code will:

1. ✅ Ask clarifying questions about setup
2. ✅ Create files phase by phase
3. ✅ Implement each component
4. ✅ Create comprehensive tests
5. ✅ Auto-commit with changelog
6. ✅ Track progress in CHANGELOG.md
7. ✅ Produce production-ready code

### Monitor Progress

```bash
# After each component:
npm test                    # Verify tests pass
npm run lint               # Check TypeScript
npm run storybook          # View components
git log --oneline          # See commits
cat CHANGELOG.md           # Check progress

# Full coverage check
npm test -- --coverage     # Should be 90%+
```

---

## If Claude Needs Clarification

**Common Questions**:

- **"What version of React?"** → React 16.8+, TypeScript 4.0+
- **"Where do i18n files go?"** → `src/components/{Component}/locales/{lang}.json`
- **"How do CSS variables work?"** → See `html-templates/css_variables_template.css`
- **"Test framework?"** → Jest with React Testing Library
- **"Storybook setup?"** → Create `.stories.tsx` files
- **"Accessibility testing?"** → Use axe-core and keyboard nav

---

## Success Criteria

When Claude is done:

✅ All 5 components implemented  
✅ All 22+ controls implemented  
✅ 90%+ test coverage  
✅ WCAG 2.1 AA verified  
✅ All 4 languages working  
✅ All 3 themes working  
✅ Git history clean  
✅ CHANGELOG.md complete  
✅ **Ready for production!**

---

**Give Claude Code the prompt above and watch it build your component suite!** 🚀

