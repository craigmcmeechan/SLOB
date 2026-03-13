# RibbonWindow - JSON Configuration Examples

**Purpose**: Practical examples of JSON UI specifications  
**Scope**: Simple to complex UI configurations  

---

## Example 1: Minimal Application

```json
{
  "appId": "simple-app",
  "title": "Simple App",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Simple Application",
    "ribbon": {
      "tabs": [
        {
          "id": "home",
          "label": "Home",
          "groups": [
            {
              "id": "edit",
              "label": "Edit",
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
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "component": "SimpleEditor"
    }
  }
}
```

---

## Example 2: Document Editor (Word-like)

```json
{
  "appId": "document-editor",
  "title": "Document Editor",
  "theme": "light",
  "locale": "en",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Document.docx",
    "icon": "document",
    "ribbon": {
      "tabs": [
        {
          "id": "home",
          "label": "Home",
          "groups": [
            {
              "id": "clipboard",
              "label": "Clipboard",
              "controls": [
                {
                  "id": "cut",
                  "type": "button",
                  "label": "Cut",
                  "icon": "cut",
                  "command": "edit.cut",
                  "tooltip": "Cut (Ctrl+X)"
                },
                {
                  "id": "copy",
                  "type": "button",
                  "label": "Copy",
                  "icon": "copy",
                  "command": "edit.copy",
                  "tooltip": "Copy (Ctrl+C)"
                },
                {
                  "id": "paste",
                  "type": "splitButton",
                  "label": "Paste",
                  "icon": "paste",
                  "command": "edit.paste",
                  "tooltip": "Paste (Ctrl+V)"
                }
              ]
            },
            {
              "id": "formatting",
              "label": "Font",
              "controls": [
                {
                  "id": "font-family",
                  "type": "combobox",
                  "label": "Font",
                  "properties": {
                    "options": ["Arial", "Times", "Courier"],
                    "width": 150
                  }
                },
                {
                  "id": "font-size",
                  "type": "combobox",
                  "label": "Size",
                  "properties": {
                    "options": [8, 10, 12, 14, 16, 18, 20, 24],
                    "width": 80
                  }
                },
                {
                  "id": "separator1",
                  "type": "separator"
                },
                {
                  "id": "bold",
                  "type": "toggleButton",
                  "label": "B",
                  "icon": "bold",
                  "command": "format.bold",
                  "tooltip": "Bold (Ctrl+B)"
                },
                {
                  "id": "italic",
                  "type": "toggleButton",
                  "label": "I",
                  "icon": "italic",
                  "command": "format.italic",
                  "tooltip": "Italic (Ctrl+I)"
                },
                {
                  "id": "underline",
                  "type": "toggleButton",
                  "label": "U",
                  "icon": "underline",
                  "command": "format.underline",
                  "tooltip": "Underline (Ctrl+U)"
                }
              ]
            }
          ]
        },
        {
          "id": "insert",
          "label": "Insert",
          "groups": [
            {
              "id": "objects",
              "label": "Objects",
              "controls": [
                {
                  "id": "picture",
                  "type": "button",
                  "label": "Picture",
                  "icon": "picture",
                  "command": "insert.picture"
                },
                {
                  "id": "table",
                  "type": "button",
                  "label": "Table",
                  "icon": "table",
                  "command": "insert.table"
                },
                {
                  "id": "shape",
                  "type": "dropdownButton",
                  "label": "Shape",
                  "icon": "shape",
                  "command": "insert.shape"
                }
              ]
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "layout": "main|side",
      "panels": [
        {
          "id": "editor",
          "type": "document",
          "component": "DocumentEditor",
          "width": "100%"
        }
      ]
    },
    "statusBar": {
      "sections": [
        {
          "id": "position",
          "label": "Position",
          "value": "Page 1, Line 5"
        },
        {
          "id": "words",
          "label": "Words",
          "value": "1,234"
        },
        {
          "id": "zoom",
          "label": "Zoom",
          "value": "100%"
        }
      ]
    }
  },
  "windows": [
    {
      "id": "find-replace",
      "title": "Find & Replace",
      "windowType": "dialog",
      "modal": true,
      "width": 500,
      "height": 250,
      "x": 400,
      "y": 300,
      "backdrop": "dark",
      "controls": [
        {
          "id": "find-label",
          "type": "label",
          "label": "Find:"
        },
        {
          "id": "find-input",
          "type": "textInput",
          "placeholder": "Enter text to find"
        },
        {
          "id": "replace-label",
          "type": "label",
          "label": "Replace:"
        },
        {
          "id": "replace-input",
          "type": "textInput",
          "placeholder": "Enter replacement text"
        },
        {
          "id": "button-group",
          "type": "buttonGroup",
          "controls": [
            {
              "id": "find-next",
              "type": "button",
              "label": "Find Next"
            },
            {
              "id": "replace",
              "type": "button",
              "label": "Replace"
            },
            {
              "id": "replace-all",
              "type": "button",
              "label": "Replace All"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Example 3: Spreadsheet Application

```json
{
  "appId": "spreadsheet",
  "title": "Spreadsheet",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Budget.xlsx",
    "ribbon": {
      "tabs": [
        {
          "id": "home",
          "label": "Home",
          "groups": [
            {
              "id": "clipboard",
              "label": "Clipboard",
              "controls": [
                {
                  "id": "cut",
                  "type": "button",
                  "icon": "cut",
                  "command": "edit.cut"
                },
                {
                  "id": "copy",
                  "type": "button",
                  "icon": "copy",
                  "command": "edit.copy"
                },
                {
                  "id": "paste",
                  "type": "button",
                  "icon": "paste",
                  "command": "edit.paste"
                }
              ]
            },
            {
              "id": "formatting",
              "label": "Format",
              "controls": [
                {
                  "id": "format-number",
                  "type": "button",
                  "label": "#",
                  "icon": "number",
                  "command": "format.number"
                },
                {
                  "id": "format-percent",
                  "type": "button",
                  "label": "%",
                  "icon": "percent",
                  "command": "format.percent"
                },
                {
                  "id": "format-currency",
                  "type": "button",
                  "label": "$",
                  "icon": "currency",
                  "command": "format.currency"
                }
              ]
            },
            {
              "id": "alignment",
              "label": "Alignment",
              "controls": [
                {
                  "id": "align-left",
                  "type": "toggleButton",
                  "icon": "alignLeft",
                  "command": "align.left"
                },
                {
                  "id": "align-center",
                  "type": "toggleButton",
                  "icon": "alignCenter",
                  "command": "align.center"
                },
                {
                  "id": "align-right",
                  "type": "toggleButton",
                  "icon": "alignRight",
                  "command": "align.right"
                }
              ]
            }
          ]
        },
        {
          "id": "formulas",
          "label": "Formulas",
          "groups": [
            {
              "id": "functions",
              "label": "Function",
              "controls": [
                {
                  "id": "sum",
                  "type": "button",
                  "label": "SUM",
                  "command": "formula.sum"
                },
                {
                  "id": "average",
                  "type": "button",
                  "label": "AVERAGE",
                  "command": "formula.average"
                },
                {
                  "id": "count",
                  "type": "button",
                  "label": "COUNT",
                  "command": "formula.count"
                }
              ]
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "component": "SpreadsheetGrid"
    }
  }
}
```

---

## Example 4: Design Application with Panels

```json
{
  "appId": "design-app",
  "title": "Design Application",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "design.psd",
    "ribbon": {
      "tabs": [
        {
          "id": "design",
          "label": "Design",
          "groups": [
            {
              "id": "shapes",
              "label": "Shapes",
              "controls": [
                {
                  "id": "rectangle",
                  "type": "button",
                  "icon": "rectangle",
                  "command": "shape.rectangle"
                },
                {
                  "id": "circle",
                  "type": "button",
                  "icon": "circle",
                  "command": "shape.circle"
                },
                {
                  "id": "line",
                  "type": "button",
                  "icon": "line",
                  "command": "shape.line"
                }
              ]
            },
            {
              "id": "colors",
              "label": "Colors",
              "controls": [
                {
                  "id": "fill-color",
                  "type": "button",
                  "icon": "fillColor",
                  "command": "color.fill"
                },
                {
                  "id": "stroke-color",
                  "type": "button",
                  "icon": "strokeColor",
                  "command": "color.stroke"
                },
                {
                  "id": "color-picker",
                  "type": "colorPicker",
                  "label": "Pick"
                }
              ]
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "layout": "toolbox|canvas|properties",
      "panels": [
        {
          "id": "canvas",
          "type": "document",
          "component": "Canvas"
        }
      ]
    }
  },
  "windows": [
    {
      "id": "layers",
      "title": "Layers",
      "windowType": "popup",
      "width": 250,
      "height": 400,
      "x": 0,
      "y": 100,
      "resizable": true,
      "movable": true
    },
    {
      "id": "properties",
      "title": "Properties",
      "windowType": "popup",
      "width": 300,
      "height": 500,
      "x": 1020,
      "y": 100,
      "resizable": true,
      "movable": true
    }
  ]
}
```

---

## Example 5: Multi-Tab Application

```json
{
  "appId": "data-analyzer",
  "title": "Data Analyzer",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Data Analysis Project",
    "ribbon": {
      "tabs": [
        {
          "id": "home",
          "label": "Home",
          "groups": [
            {
              "id": "file",
              "label": "File",
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
                  "command": "file.save",
                  "disabled": false
                }
              ]
            }
          ]
        },
        {
          "id": "analysis",
          "label": "Analysis",
          "groups": [
            {
              "id": "statistics",
              "label": "Statistics",
              "controls": [
                {
                  "id": "mean",
                  "type": "button",
                  "label": "Mean",
                  "command": "stat.mean"
                },
                {
                  "id": "median",
                  "type": "button",
                  "label": "Median",
                  "command": "stat.median"
                },
                {
                  "id": "stdev",
                  "type": "button",
                  "label": "Std Dev",
                  "command": "stat.stdev"
                }
              ]
            },
            {
              "id": "charts",
              "label": "Visualization",
              "controls": [
                {
                  "id": "chart-line",
                  "type": "button",
                  "icon": "chartLine",
                  "command": "chart.line"
                },
                {
                  "id": "chart-bar",
                  "type": "button",
                  "icon": "chartBar",
                  "command": "chart.bar"
                },
                {
                  "id": "chart-pie",
                  "type": "button",
                  "icon": "chartPie",
                  "command": "chart.pie"
                }
              ]
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "layout": "data|chart",
      "panels": [
        {
          "id": "data",
          "type": "document",
          "component": "DataGrid"
        },
        {
          "id": "chart",
          "type": "document",
          "component": "ChartArea"
        }
      ]
    }
  }
}
```

---

## Example 6: Dialog Configuration

```json
{
  "appId": "app-with-dialogs",
  "title": "Application",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Main Window",
    "ribbon": {
      "tabs": [{
        "id": "home",
        "label": "Home",
        "groups": [{
          "id": "actions",
          "label": "Actions",
          "controls": [
            {
              "id": "open-file",
              "type": "button",
              "label": "Open File",
              "command": "file.open"
            }
          ]
        }]
      }]
    },
    "contentArea": {
      "type": "grid",
      "component": "MainEditor"
    }
  },
  "windows": [
    {
      "id": "dialog-save",
      "title": "Save Document",
      "windowType": "dialog",
      "modal": true,
      "backdrop": "dark",
      "width": 500,
      "height": 300,
      "controls": [
        {
          "id": "filename-label",
          "type": "label",
          "label": "Filename:"
        },
        {
          "id": "filename",
          "type": "textInput",
          "placeholder": "Enter filename"
        },
        {
          "id": "format-label",
          "type": "label",
          "label": "Format:"
        },
        {
          "id": "format",
          "type": "combobox",
          "properties": {
            "options": ["PDF", "Word", "Text", "HTML"]
          }
        },
        {
          "id": "button-group",
          "type": "buttonGroup",
          "controls": [
            {
              "id": "btn-save",
              "type": "button",
              "label": "Save",
              "command": "dialog.save"
            },
            {
              "id": "btn-cancel",
              "type": "button",
              "label": "Cancel",
              "command": "dialog.cancel"
            }
          ]
        }
      ]
    },
    {
      "id": "dialog-options",
      "title": "Options",
      "windowType": "dialog",
      "modal": true,
      "backdrop": "blur",
      "width": 600,
      "height": 400,
      "controls": [
        {
          "id": "appearance",
          "type": "label",
          "label": "Appearance"
        },
        {
          "id": "theme",
          "type": "segmentedControl",
          "label": "Theme",
          "properties": {
            "options": [
              { "id": "light", "label": "Light" },
              { "id": "dark", "label": "Dark" },
              { "id": "auto", "label": "Auto" }
            ]
          }
        },
        {
          "id": "language",
          "type": "combobox",
          "label": "Language",
          "properties": {
            "options": ["English", "Spanish", "French", "German"]
          }
        }
      ]
    }
  ]
}
```

---

## Example 7: State-Driven UI

```json
{
  "appId": "state-driven-app",
  "title": "Application",
  "globalState": {
    "isEditing": false,
    "selectedObject": null,
    "zoom": 100,
    "theme": "light"
  },
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Editor",
    "ribbon": {
      "tabs": [
        {
          "id": "edit",
          "label": "Edit",
          "groups": [
            {
              "id": "edit-group",
              "label": "Editing",
              "controls": [
                {
                  "id": "edit-btn",
                  "type": "toggleButton",
                  "label": "Edit",
                  "command": "view.toggleEdit",
                  "state": {
                    "pressed": "${globalState.isEditing}"
                  }
                },
                {
                  "id": "delete-btn",
                  "type": "button",
                  "label": "Delete",
                  "command": "edit.delete",
                  "disabled": "${!globalState.selectedObject}"
                }
              ]
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "component": "Editor",
      "props": {
        "isEditing": "${globalState.isEditing}",
        "selectedObject": "${globalState.selectedObject}",
        "zoom": "${globalState.zoom}"
      }
    }
  }
}
```

---

## Example 8: Dynamic Control Generation

```json
{
  "appId": "toolbar-builder",
  "title": "Toolbar Builder",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Toolbar Builder",
    "ribbon": {
      "tabs": [
        {
          "id": "home",
          "label": "Tools",
          "groups": [
            {
              "id": "basic-shapes",
              "label": "Shapes",
              "controls": [
                {
                  "id": "shape-rect",
                  "type": "button",
                  "icon": "rectangle",
                  "command": "tool.rectangle"
                },
                {
                  "id": "shape-circle",
                  "type": "button",
                  "icon": "circle",
                  "command": "tool.circle"
                },
                {
                  "id": "shape-star",
                  "type": "button",
                  "icon": "star",
                  "command": "tool.star"
                }
              ]
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "component": "ToolbarCanvas"
    }
  }
}
```

---

## Using JSON Configuration Programmatically

### Load from File

```typescript
import { RibbonWindowFromSpec } from '@ui/ribbon'

// Load from JSON file
const response = await fetch('/configs/app-config.json')
const spec = await response.json()

export function App() {
  return <RibbonWindowFromSpec spec={spec} />
}
```

### Generate from Data

```typescript
function generateSpecFromData(data: any): RibbonUISpec {
  return {
    appId: data.appId,
    title: data.title,
    rootWindow: {
      id: 'main',
      windowType: 'root',
      title: data.title,
      ribbon: {
        tabs: data.ribbonTabs.map((tab) => ({
          id: tab.id,
          label: tab.label,
          groups: tab.groups.map((group) => ({
            id: group.id,
            label: group.label,
            controls: group.controls.map((control) => ({
              id: control.id,
              type: control.type,
              label: control.label,
              icon: control.icon,
              command: control.command
            }))
          }))
        }))
      },
      contentArea: {
        type: 'grid',
        component: 'MainContent'
      }
    }
  }
}
```

### Validate Configuration

```typescript
import Ajv from 'ajv'

const ajv = new Ajv()
const validate = ajv.compile(ribbonUISpecSchema)

function validateConfig(spec: any): { valid: boolean; errors?: any[] } {
  const valid = validate(spec)
  return {
    valid,
    errors: validate.errors || undefined
  }
}

// Use
const { valid, errors } = validateConfig(mySpec)
if (!valid) {
  console.error('Invalid config:', errors)
}
```

---

## Summary

These examples show:

✅ **Simple apps** - Single tab, basic controls  
✅ **Document editors** - Multiple tabs, formatting  
✅ **Spreadsheets** - Complex formatting and functions  
✅ **Design apps** - Multi-panel layouts  
✅ **Data tools** - Analysis and visualization  
✅ **Dialogs** - Modal and modeless  
✅ **State-driven** - Dynamic UI based on state  
✅ **Dynamic generation** - Creating specs programmatically  

Any UI configuration can be represented as JSON and rendered with minimal code!

