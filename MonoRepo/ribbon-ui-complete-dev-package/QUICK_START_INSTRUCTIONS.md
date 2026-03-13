# Quick Start Guide - Get Running in 30 Minutes

**Choose your path**: Claude Code (automated) or Manual (step-by-step)

---

## 🟢 PATH A: Claude Code (RECOMMENDED)

### Time: ~30 minutes setup | Development: Claude handles it automatically

#### Step 1: Extract Archive (2 min)

```bash
tar -xzf ribbon-ui-development-package.tar.gz
cd ribbon-ui-complete-dev-package
```

#### Step 2: Copy to Your Project (5 min)

```bash
# From your project root:
cp -r /path/to/ribbon-ui-complete-dev-package ./docs/ribbon-ui

# Or if using Claude Code workspace:
# Copy the entire folder into your project
```

#### Step 3: Read Instructions (10 min)

```bash
cat docs/ribbon-ui/claude-code/CLAUDE_DEVELOPMENT.md
```

Key sections:
- Overview of what Claude will do
- System setup
- Development process
- Quality requirements

#### Step 4: Prepare Your Project (5 min)

```bash
# In your project root, create these directories:
mkdir -p src/components
mkdir -p src/styles/themes
mkdir -p src/i18n/locales/{en,es,fr,de}
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/contexts
mkdir -p src/utils

# Initialize git
git init
git add -A
git commit -m "chore: initial project setup"

# Set up git automation (optional but recommended)
cp docs/ribbon-ui/git-automation/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

#### Step 5: Give Claude the Prompt (5 min)

Open Claude Code and paste this:

```
I'm building a Ribbon UI component suite from specifications in ./docs/ribbon-ui/

Please read:
1. ./docs/ribbon-ui/claude-code/CLAUDE_DEVELOPMENT.md
2. ./docs/ribbon-ui/MASTER_DEVELOPMENT_GUIDE.md
3. ./docs/ribbon-ui/development-plan/phase-1-foundation.md

Then follow the instructions in CLAUDE_DEVELOPMENT.md to:
- Create components from specifications
- Implement with TypeScript (strict mode)
- Add CSS using templates in ./html-templates/
- Create unit tests (90%+ coverage)
- Add WCAG 2.1 AA accessibility
- Create Storybook stories
- Add i18n (en, es, fr, de)
- Auto-commit with changelog updates

Start with Phase 1 (foundation components).
```

#### Step 6: Monitor Progress (ongoing)

```bash
# After each component:
npm test              # Check tests pass
npm run storybook     # Verify stories work
git log --oneline     # See commits
cat CHANGELOG.md       # See progress tracked
```

---

## 🟡 PATH B: Manual Development

### Time: ~20 days development | Full control

#### Step 1: Extract & Understand (2 hours)

```bash
tar -xzf ribbon-ui-development-package.tar.gz
cd ribbon-ui-complete-dev-package

# Read in order:
1. MASTER_DEVELOPMENT_GUIDE.md (overview)
2. IMPLEMENTATION_CHECKLIST.md (complete list)
3. development-plan/phase-1-foundation.md (first phase)
```

#### Step 2: Set Up Project Structure (30 min)

```bash
# Create project structure
mkdir -p src/components/{RibbonWindow,Ribbon,Toolbar,Sidebar,ButtonBar,Controls}
mkdir -p src/styles/themes
mkdir -p src/i18n/locales/{en,es,fr,de}
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/contexts
mkdir -p src/utils
mkdir -p src/tests

# Initialize git
git init
git add -A
git commit -m "chore: project setup"

# Set up git automation
cp git-automation/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

#### Step 3: Follow Phase 1 (Days 1-3)

```bash
cat development-plan/phase-1-foundation.md

# Do in order:
1. Create base component class
2. Create CSS variable system
3. Create theme CSS files
4. Create icon system
5. Set up i18n
6. Create TypeScript types
```

#### Step 4: Reference Templates (For Each Component)

```bash
# When implementing a component:
# 1. Read the specification
cat specifications/RIBBON_WINDOW_SPECIFICATION.md

# 2. Review HTML template
cat html-templates/ribbon-window.html

# 3. Check component checklist
cat components/RibbonWindow/IMPLEMENTATION_CHECKLIST.md

# 4. Implement following template structure
# 5. Create tests matching spec
# 6. Commit with auto-changelog
```

#### Step 5: Follow All 5 Phases

```bash
# Phase 1: Foundation (Days 1-3)
cat development-plan/phase-1-foundation.md

# Phase 2: Core Components (Days 4-8)
cat development-plan/phase-2-core-components.md

# Phase 3: Advanced (Days 9-12)
cat development-plan/phase-3-advanced.md

# Phase 4: Integration (Days 13-15)
cat development-plan/phase-4-integration.md

# Phase 5: Testing (Days 16-18)
cat development-plan/phase-5-testing.md
```

#### Step 6: Track Progress

```bash
# After each component:
npm test                # Run tests
npm run lint           # Check code
npm run storybook      # View components
git log --oneline      # See commits
cat CHANGELOG.md       # Check progress
```

---

## 🎯 Which Path Should You Choose?

### Choose Claude Code If:
✅ You want **automated development**  
✅ You want **fastest time-to-completion** (20 days)  
✅ You want **automatic testing** and **accessibility**  
✅ You want **guaranteed code quality**  
✅ You want **auto-changelog** management  
✅ **Recommended!** 🌟

### Choose Manual If:
✅ You want to **understand each step**  
✅ You want **hands-on learning**  
✅ You prefer **incremental customization**  
✅ You want **fine-grained control**  

---

## 📋 Before You Start

- [ ] Extract archive
- [ ] Read MASTER_DEVELOPMENT_GUIDE.md
- [ ] Choose Claude Code OR Manual path
- [ ] Copy to your project
- [ ] Set up directory structure
- [ ] Initialize git
- [ ] Set up git automation (optional)
- [ ] Ready to begin!

---

## ⏱️ Timeline

### Claude Code
- Setup: 30 minutes
- Development: Automated (~20 days)
- Testing: Automated
- Deployment: Ready immediately

### Manual Development
- Setup: 30 minutes
- Phase 1: Days 1-3
- Phase 2: Days 4-8
- Phase 3: Days 9-12
- Phase 4: Days 13-15
- Phase 5: Days 16-18
- Total: ~20 days

---

## 🆘 Troubleshooting

### If Using Claude Code:
- Check: `claude-code/CLAUDE_DEVELOPMENT.md`
- Issue: Git automation not working → `git-automation/SETUP_INSTRUCTIONS.md`
- Issue: Tests failing → Check `e2e-tests/E2E_TEST_GUIDE.md`

### If Using Manual:
- Need component details → Check `specifications/`
- Need CSS structure → Check `html-templates/`
- Need test templates → Check `e2e-tests/`
- Stuck on something → Check `quick-reference/`

---

## 📞 Next Steps

### Claude Code Users:
→ Read: `claude-code/CLAUDE_DEVELOPMENT.md`

### Manual Users:
→ Read: `development-plan/phase-1-foundation.md`

---

**Ready?** Let's build! 🚀

