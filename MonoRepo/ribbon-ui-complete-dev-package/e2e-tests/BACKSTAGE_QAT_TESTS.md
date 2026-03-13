# Backstage File Menu & Quick Access Toolbar E2E Tests

## Test Scenarios

### Scenario 1: Open Backstage Menu
```
GIVEN a user with an open document
WHEN clicking the File button
THEN Backstage menu opens
AND overlay appears
AND Recent category is active by default
AND all sidebar categories are visible
```

### Scenario 2: Navigate Backstage Categories
```
GIVEN Backstage menu is open
WHEN clicking different categories:
  - Recent
  - New
  - Open
  - Save
  - Save As
  - Print
  - Share
  - Export
  - Account
  - Options
  - Info
THEN each category displays its content
AND active category is highlighted
```

### Scenario 3: Open Recent Document from Backstage
```
GIVEN Backstage menu is open
AND Recent category is active
WHEN clicking a recent document
THEN the document opens
AND Backstage menu closes
AND document content loads
```

### Scenario 4: Save Document via Backstage
```
GIVEN Backstage menu is open
WHEN clicking Save As category
THEN file save dialog appears
WHEN entering filename and location
AND clicking Save button
THEN file is saved
AND menu closes
```

### Scenario 5: Print from Backstage
```
GIVEN Backstage menu is open
WHEN clicking Print category
THEN print preview appears
WHEN configuring print settings
AND clicking Print button
THEN document prints successfully
```

### Scenario 6: Access Account Settings
```
GIVEN Backstage menu is open
WHEN clicking Account category
THEN account info displays
WHEN clicking "Manage Account Settings"
THEN account settings page opens
```

### Scenario 7: Share Document
```
GIVEN Backstage menu is open
WHEN clicking Share category
THEN sharing options appear
WHEN selecting "Share with People"
THEN share dialog opens
WHEN entering email and clicking Send
THEN invitations sent
```

### Scenario 8: Use Quick Access Toolbar - Save
```
GIVEN a document with unsaved changes
WHEN clicking Save button in QAT
THEN document saves
AND button shows confirmation state
```

### Scenario 9: Use Quick Access Toolbar - Undo/Redo
```
GIVEN document with edit history
WHEN clicking Undo in QAT
THEN last edit is undone
WHEN clicking Redo
THEN undo is reversed
```

### Scenario 10: Customize Quick Access Toolbar
```
GIVEN Quick Access Toolbar visible
WHEN clicking customize button (⋮)
THEN customize menu appears
WHEN unchecking "Print"
THEN Print button disappears
WHEN re-checking "Print"
THEN Print button reappears
```

### Scenario 11: Add Commands to QAT
```
GIVEN QAT customize menu open
WHEN clicking "More Commands..."
THEN command selection dialog opens
WHEN selecting additional commands
AND clicking Add
THEN commands appear in QAT
```

### Scenario 12: Reorder QAT Buttons
```
GIVEN QAT buttons visible
WHEN dragging Save to different position
THEN button moves
AND new order is applied
AND order persists after restart
```

### Scenario 13: Show QAT Below Ribbon
```
GIVEN QAT in titlebar
WHEN clicking customize → "Show Below Ribbon"
THEN QAT moves below ribbon
WHEN clicking again
THEN QAT returns to titlebar
```

### Scenario 14: Close Backstage with Escape
```
GIVEN Backstage menu open
WHEN pressing Escape key
THEN menu closes
AND overlay disappears
AND focus returns to File button
```

### Scenario 15: Close Backstage by Clicking Outside
```
GIVEN Backstage menu open
WHEN clicking overlay/background
THEN menu closes
AND document regains focus
```

### Scenario 16: Keyboard Navigation in Backstage
```
GIVEN Backstage menu open
WHEN pressing Tab
THEN focus cycles through sidebar categories
WHEN pressing Arrow Down
THEN focus moves to next category
```

### Scenario 17: Keyboard Access to QAT
```
GIVEN focus not on QAT
WHEN pressing Alt+0
THEN focus moves to first QAT button
WHEN pressing Tab
THEN focus cycles through QAT buttons
```

### Scenario 18: QAT Tooltips
```
GIVEN QAT visible
WHEN hovering over a button
THEN tooltip appears showing:
  - Button name
  - Keyboard shortcut
WHEN mouse moves away
THEN tooltip disappears
```

### Scenario 19: Disabled QAT Buttons
```
GIVEN no undo history
WHEN hovering over Undo button
THEN button appears disabled (grayed out)
WHEN trying to click
THEN nothing happens

GIVEN after editing
WHEN undo history exists
THEN Undo button becomes enabled
```

### Scenario 20: QAT Settings Persistence
```
GIVEN customized QAT with reordered buttons
WHEN closing and reopening application
THEN QAT retains all customizations
AND button order is preserved
AND custom commands are still there
```

---

## Test Coverage Matrix

| Feature | Scenario | Status |
|---------|----------|--------|
| Open Backstage | 1 | ✓ |
| Navigate Categories | 2 | ✓ |
| Open Document | 3 | ✓ |
| Save Document | 4 | ✓ |
| Print Document | 5 | ✓ |
| Account Access | 6 | ✓ |
| Share Document | 7 | ✓ |
| QAT Save | 8 | ✓ |
| QAT Undo/Redo | 9 | ✓ |
| Customize QAT | 10 | ✓ |
| Add Commands | 11 | ✓ |
| Reorder Buttons | 12 | ✓ |
| QAT Position | 13 | ✓ |
| Close Backstage (Escape) | 14 | ✓ |
| Close Backstage (Click) | 15 | ✓ |
| Keyboard Nav Backstage | 16 | ✓ |
| Keyboard Access QAT | 17 | ✓ |
| Tooltips | 18 | ✓ |
| Disabled State | 19 | ✓ |
| Persistence | 20 | ✓ |

