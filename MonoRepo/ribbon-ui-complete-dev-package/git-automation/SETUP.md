# Git Automation Setup

## Install Pre-Commit Hook

```bash
# Copy pre-commit hook
cp pre-commit.sh .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit

# Verify
ls -la .git/hooks/pre-commit
```

## How It Works

After each component commit:

1. ✅ Validates commit message format
2. ✅ Extracts component name
3. ✅ Updates CHANGELOG.md
4. ✅ Adds changelog to commit
5. ✅ Verifies all checks pass

## Commit Message Format

```
feat: implement ComponentName

- Full TypeScript implementation
- CSS styling (light/dark/accessible)
- Unit tests (95% coverage)
- WCAG 2.1 AA accessibility
- i18n support (en, es, fr, de)
- Storybook stories
- JSDoc documentation

Closes #123
```

## Changelog Auto-Updates

CHANGELOG.md automatically gets:
- Component name and date
- Phase information
- Implementation status
- Test coverage percentage
- Commit hash link

## Troubleshooting

**Hook not running?**
```bash
chmod +x .git/hooks/pre-commit
```

**Manual changelog update?**
```bash
# Edit CHANGELOG.md directly
vim CHANGELOG.md

# Commit
git add CHANGELOG.md
git commit -m "docs: update changelog"
```

