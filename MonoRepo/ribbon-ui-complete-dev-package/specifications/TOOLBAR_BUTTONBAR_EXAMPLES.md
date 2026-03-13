# Toolbar & Window Button Bar - Complete Examples

**Purpose**: Practical examples of Toolbar and Window Button Bar implementations  
**Scope**: Simple to complex UI configurations  

---

## Example 1: Simple Toolbar-Only App

```json
{
  "appId": "simple-editor",
  "title": "Simple Editor",
  "theme": "light",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Simple Text Editor",
    "toolbar": {
      "id": "main-toolbar",
      "iconStyle": "iconWithText",
      "size": "medium",
      "groups": [
        {
          "id": "file",
          "controls": [
            {
              "id": "new",
              "type": "button",
              "label": "New",
              "icon": "new",
              "command": "file.new",
              "labelKey": "toolbar.file.new",
              "tooltipKey": "toolbar.tooltip.new"
            },
            {
              "id": "open",
              "type": "button",
              "label": "Open",
              "icon": "open",
              "command": "file.open",
              "labelKey": "toolbar.file.open"
            },
            {
              "id": "save",
              "type": "button",
              "label": "Save",
              "icon": "save",
              "command": "file.save",
              "labelKey": "toolbar.file.save"
            }
          ]
        },
        {
          "id": "edit",
          "separator": "before",
          "controls": [
            {
              "id": "undo",
              "type": "button",
              "label": "Undo",
              "icon": "undo",
              "command": "edit.undo"
            },
            {
              "id": "redo",
              "type": "button",
              "label": "Redo",
              "icon": "redo",
              "command": "edit.redo"
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "component": "TextEditor"
    }
  }
}
```

---

## Example 2: Toolbar with Icon-Only Buttons

```json
{
  "appId": "web-app",
  "title": "Web Application",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Web App",
    "toolbar": {
      "id": "compact-toolbar",
      "iconStyle": "iconOnly",
      "size": "small",
      "compact": true,
      "groups": [
        {
          "id": "main-actions",
          "controls": [
            {
              "id": "home",
              "type": "button",
              "icon": "home",
              "tooltip": "Home",
              "command": "nav.home"
            },
            {
              "id": "refresh",
              "type": "button",
              "icon": "refresh",
              "tooltip": "Refresh",
              "command": "page.refresh"
            },
            {
              "id": "print",
              "type": "button",
              "icon": "print",
              "tooltip": "Print",
              "command": "page.print"
            },
            {
              "id": "separator1",
              "type": "separator"
            },
            {
              "id": "settings",
              "type": "button",
              "icon": "settings",
              "tooltip": "Settings",
              "command": "app.settings"
            }
          ]
        }
      ]
    },
    "contentArea": {
      "component": "WebContent"
    }
  }
}
```

---

## Example 3: Dialog with Button Bar

```json
{
  "appId": "app",
  "title": "Application",
  "rootWindow": {
    "id": "main",
    "title": "Main",
    "toolbar": { ... },
    "contentArea": { ... }
  },
  "windows": [
    {
      "id": "dialog-save",
      "title": "Save Changes?",
      "windowType": "dialog",
      "modal": true,
      "backdrop": "dark",
      "width": 400,
      "height": 200,
      "showButtonBar": true,
      "buttonBar": {
        "preset": "save-cancel",
        "primaryButtonId": "btn-save"
      },
      "controls": [
        {
          "id": "message",
          "type": "label",
          "label": "You have unsaved changes. Do you want to save before closing?"
        }
      ]
    }
  ]
}
```

---

## Example 4: Complex Toolbar with Dropdowns

```json
{
  "id": "advanced-toolbar",
  "iconStyle": "iconWithText",
  "groups": [
    {
      "id": "format",
      "label": "Formatting",
      "controls": [
        {
          "id": "bold",
          "type": "toggleButton",
          "label": "Bold",
          "icon": "bold",
          "command": "format.bold"
        },
        {
          "id": "italic",
          "type": "toggleButton",
          "label": "Italic",
          "icon": "italic",
          "command": "format.italic"
        },
        {
          "id": "underline",
          "type": "toggleButton",
          "label": "Underline",
          "icon": "underline",
          "command": "format.underline"
        },
        {
          "id": "text-color",
          "type": "dropdownButton",
          "label": "Text Color",
          "icon": "textColor",
          "tooltip": "Choose text color",
          "dropdown": {
            "items": [
              { "id": "black", "label": "Black", "command": "color.black" },
              { "id": "red", "label": "Red", "command": "color.red" },
              { "id": "blue", "label": "Blue", "command": "color.blue" },
              { "id": "green", "label": "Green", "command": "color.green" },
              { "separator": true },
              { "id": "custom", "label": "Custom...", "command": "color.picker" }
            ]
          }
        }
      ]
    },
    {
      "id": "alignment",
      "separator": "before",
      "label": "Alignment",
      "controls": [
        {
          "id": "align-left",
          "type": "button",
          "icon": "alignLeft",
          "tooltip": "Align Left",
          "command": "align.left"
        },
        {
          "id": "align-center",
          "type": "button",
          "icon": "alignCenter",
          "tooltip": "Align Center",
          "command": "align.center"
        },
        {
          "id": "align-right",
          "type": "button",
          "icon": "alignRight",
          "tooltip": "Align Right",
          "command": "align.right"
        },
        {
          "id": "align-justify",
          "type": "button",
          "icon": "alignJustify",
          "tooltip": "Align Justify",
          "command": "align.justify"
        }
      ]
    }
  ]
}
```

---

## Example 5: Full Document Editor (Toolbar + Content + Button Bar)

```json
{
  "appId": "doc-editor",
  "title": "Document Editor",
  "theme": "light",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "document.docx",
    "toolbar": {
      "id": "editor-toolbar",
      "iconStyle": "iconWithText",
      "groups": [
        {
          "id": "file",
          "controls": [
            {
              "id": "new",
              "type": "button",
              "label": "New",
              "icon": "new",
              "command": "file.new"
            },
            {
              "id": "open",
              "type": "button",
              "label": "Open",
              "icon": "open",
              "command": "file.open"
            },
            {
              "id": "save",
              "type": "button",
              "label": "Save",
              "icon": "save",
              "command": "file.save"
            },
            {
              "id": "save-as",
              "type": "button",
              "label": "Save As...",
              "icon": "saveAs",
              "command": "file.saveAs"
            }
          ]
        },
        {
          "id": "edit",
          "separator": "before",
          "controls": [
            {
              "id": "undo",
              "type": "button",
              "label": "Undo",
              "icon": "undo",
              "command": "edit.undo"
            },
            {
              "id": "redo",
              "type": "button",
              "label": "Redo",
              "icon": "redo",
              "command": "edit.redo"
            }
          ]
        },
        {
          "id": "format",
          "separator": "before",
          "controls": [
            {
              "id": "bold",
              "type": "toggleButton",
              "icon": "bold",
              "tooltip": "Bold (Ctrl+B)",
              "command": "format.bold"
            },
            {
              "id": "italic",
              "type": "toggleButton",
              "icon": "italic",
              "tooltip": "Italic (Ctrl+I)",
              "command": "format.italic"
            },
            {
              "id": "underline",
              "type": "toggleButton",
              "icon": "underline",
              "tooltip": "Underline (Ctrl+U)",
              "command": "format.underline"
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "component": "DocumentEditor",
      "props": {
        "editable": true
      }
    },
    "statusBar": {
      "sections": [
        { "id": "position", "label": "Position", "value": "Page 1" },
        { "id": "words", "label": "Words", "value": "250" }
      ]
    }
  },
  "windows": [
    {
      "id": "dialog-open",
      "title": "Open Document",
      "windowType": "dialog",
      "modal": true,
      "width": 600,
      "height": 400,
      "showButtonBar": true,
      "buttonBar": {
        "preset": "ok-cancel",
        "primaryButtonId": "btn-ok"
      },
      "controls": [
        {
          "id": "file-list",
          "type": "label",
          "label": "Select file to open"
        }
      ]
    },
    {
      "id": "dialog-unsaved",
      "title": "Unsaved Changes",
      "windowType": "dialog",
      "modal": true,
      "width": 400,
      "height": 180,
      "showButtonBar": true,
      "buttonBar": {
        "preset": "save-discard-cancel",
        "primaryButtonId": "btn-save"
      },
      "controls": [
        {
          "id": "msg",
          "type": "label",
          "label": "You have unsaved changes. What would you like to do?"
        }
      ]
    }
  ]
}
```

---

## Example 6: Spreadsheet with Toolbar

```json
{
  "appId": "spreadsheet",
  "title": "Spreadsheet",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "budget.xlsx",
    "toolbar": {
      "id": "sheet-toolbar",
      "iconStyle": "iconWithText",
      "compact": true,
      "groups": [
        {
          "id": "file",
          "controls": [
            { "id": "new", "type": "button", "label": "New", "icon": "new", "command": "file.new" },
            { "id": "open", "type": "button", "label": "Open", "icon": "open", "command": "file.open" },
            { "id": "save", "type": "button", "label": "Save", "icon": "save", "command": "file.save" }
          ]
        },
        {
          "id": "cells",
          "separator": "before",
          "controls": [
            { "id": "cut", "type": "button", "icon": "cut", "tooltip": "Cut" },
            { "id": "copy", "type": "button", "icon": "copy", "tooltip": "Copy" },
            { "id": "paste", "type": "button", "icon": "paste", "tooltip": "Paste" }
          ]
        },
        {
          "id": "format",
          "separator": "before",
          "controls": [
            { "id": "currency", "type": "button", "icon": "currency", "tooltip": "Currency" },
            { "id": "percent", "type": "button", "icon": "percent", "tooltip": "Percent" },
            { "id": "decimal", "type": "button", "icon": "decimal", "tooltip": "Decimal Places" }
          ]
        }
      ]
    },
    "contentArea": {
      "component": "SpreadsheetGrid"
    }
  }
}
```

---

## Example 7: Settings Dialog (Apply/OK/Cancel)

```json
{
  "id": "dialog-settings",
  "title": "Settings",
  "windowType": "dialog",
  "modal": true,
  "width": 500,
  "height": 400,
  "showButtonBar": true,
  "buttonBar": {
    "preset": "apply-ok-cancel",
    "primaryButtonId": "btn-ok"
  },
  "controls": [
    {
      "id": "appearance",
      "type": "label",
      "label": "Appearance"
    },
    {
      "id": "theme",
      "type": "combobox",
      "label": "Theme:",
      "properties": {
        "options": ["Light", "Dark", "High Contrast"]
      }
    },
    {
      "id": "font-size",
      "type": "combobox",
      "label": "Font Size:",
      "properties": {
        "options": ["Small", "Normal", "Large", "Extra Large"]
      }
    },
    {
      "id": "separator1",
      "type": "separator"
    },
    {
      "id": "behavior",
      "type": "label",
      "label": "Behavior"
    },
    {
      "id": "auto-save",
      "type": "checkbox",
      "label": "Auto-save changes"
    },
    {
      "id": "confirm-close",
      "type": "checkbox",
      "label": "Confirm before closing"
    }
  ]
}
```

---

## Example 8: Confirmation Dialog (Yes/No)

```json
{
  "id": "dialog-delete",
  "title": "Delete Item",
  "windowType": "dialog",
  "modal": true,
  "width": 350,
  "height": 150,
  "showButtonBar": true,
  "buttonBar": {
    "preset": "yes-no",
    "primaryButtonId": "btn-yes"
  },
  "controls": [
    {
      "id": "icon",
      "type": "icon",
      "icon": "warning"
    },
    {
      "id": "message",
      "type": "label",
      "label": "Are you sure you want to delete this item? This action cannot be undone."
    }
  ]
}
```

---

## Example 9: Vertical Toolbar (Side Navigation)

```json
{
  "id": "side-toolbar",
  "orientation": "vertical",
  "iconStyle": "iconOnly",
  "size": "medium",
  "groups": [
    {
      "id": "main",
      "controls": [
        {
          "id": "home",
          "type": "button",
          "icon": "home",
          "tooltip": "Home",
          "command": "nav.home"
        },
        {
          "id": "projects",
          "type": "button",
          "icon": "folder",
          "tooltip": "Projects",
          "command": "nav.projects"
        },
        {
          "id": "settings",
          "type": "button",
          "icon": "settings",
          "tooltip": "Settings",
          "command": "nav.settings"
        }
      ]
    },
    {
      "id": "user",
      "separator": "before",
      "controls": [
        {
          "id": "profile",
          "type": "button",
          "icon": "user",
          "tooltip": "Profile",
          "command": "user.profile"
        },
        {
          "id": "logout",
          "type": "button",
          "icon": "logout",
          "tooltip": "Logout",
          "command": "user.logout"
        }
      ]
    }
  ]
}
```

---

## Example 10: Complex Settings with Multiple Controls

```json
{
  "id": "dialog-advanced",
  "title": "Advanced Settings",
  "windowType": "dialog",
  "modal": true,
  "width": 600,
  "height": 500,
  "showButtonBar": true,
  "buttonBar": {
    "preset": "apply-reset-cancel",
    "primaryButtonId": "btn-apply"
  },
  "controls": [
    {
      "id": "performance",
      "type": "label",
      "label": "Performance Settings"
    },
    {
      "id": "cache-size",
      "type": "numberInput",
      "label": "Cache Size (MB):",
      "properties": { "min": 1, "max": 1000, "value": 128 }
    },
    {
      "id": "threads",
      "type": "numberInput",
      "label": "Worker Threads:",
      "properties": { "min": 1, "max": 16, "value": 4 }
    },
    {
      "id": "separator1",
      "type": "separator"
    },
    {
      "id": "network",
      "type": "label",
      "label": "Network Settings"
    },
    {
      "id": "timeout",
      "type": "numberInput",
      "label": "Timeout (seconds):",
      "properties": { "min": 5, "max": 300, "value": 30 }
    },
    {
      "id": "retries",
      "type": "numberInput",
      "label": "Retries:",
      "properties": { "min": 0, "max": 10, "value": 3 }
    }
  ]
}
```

---

## Example 11: Toolbar with Search Input

```json
{
  "id": "search-toolbar",
  "iconStyle": "iconWithText",
  "groups": [
    {
      "id": "search",
      "controls": [
        {
          "id": "search-input",
          "type": "textInput",
          "placeholder": "Search...",
          "properties": {
            "width": "250px"
          }
        },
        {
          "id": "search-btn",
          "type": "button",
          "icon": "search",
          "tooltip": "Search",
          "command": "search.execute"
        },
        {
          "id": "clear-btn",
          "type": "button",
          "icon": "clear",
          "tooltip": "Clear",
          "command": "search.clear"
        }
      ]
    },
    {
      "id": "options",
      "separator": "before",
      "controls": [
        {
          "id": "case-sensitive",
          "type": "toggleButton",
          "icon": "caseSensitive",
          "tooltip": "Case Sensitive"
        },
        {
          "id": "regex",
          "type": "toggleButton",
          "icon": "regex",
          "tooltip": "Regular Expression"
        }
      ]
    }
  ]
}
```

---

## Example 12: Multiple Buttons Bar (Large Dialog)

```json
{
  "id": "dialog-wizard",
  "title": "Setup Wizard",
  "windowType": "dialog",
  "modal": true,
  "width": 600,
  "height": 400,
  "showButtonBar": true,
  "buttonBar": {
    "preset": "custom",
    "alignment": "right",
    "buttons": [
      {
        "id": "btn-back",
        "label": "Back",
        "variant": "default",
        "disabled": true,
        "command": "wizard.back"
      },
      {
        "id": "btn-next",
        "label": "Next",
        "variant": "primary",
        "command": "wizard.next"
      },
      {
        "id": "btn-cancel",
        "label": "Cancel",
        "variant": "default",
        "cancelButton": true,
        "closeWindow": true
      }
    ]
  },
  "controls": [
    {
      "id": "step-indicator",
      "type": "label",
      "label": "Step 1 of 5: Welcome"
    }
  ]
}
```

---

## Summary

These examples show:

✅ **Simple Toolbar** - Icon+text buttons, common commands  
✅ **Icon-Only Toolbar** - Compact, web-style, with tooltips  
✅ **Toolbar + Content** - Main window with toolbar  
✅ **Dialog with Button Bar** - Standard dialog patterns  
✅ **Complex Toolbars** - Dropdowns, separators, multiple groups  
✅ **Different Button Bar Presets** - All 9 preset types  
✅ **Full-Featured Apps** - Toolbar + content + dialogs + button bars  
✅ **Vertical Toolbars** - Side navigation style  
✅ **Specialized Toolbars** - Search, format, etc  
✅ **Custom Button Bars** - Multi-button footers  

**All with full i18n support and theme awareness!**

