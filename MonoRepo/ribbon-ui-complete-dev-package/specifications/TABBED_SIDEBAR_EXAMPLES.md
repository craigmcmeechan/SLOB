# Tabbed Sidebar - Complete Examples

**Purpose**: Practical examples of Tabbed Sidebar implementations  
**Scope**: Left sidebars, right sidebars, complete applications  

---

## Example 1: Mail Application (Left Sidebar)

```json
{
  "appId": "mail-app",
  "title": "Mail Client",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Mail",
    "sidebars": {
      "left": {
        "id": "mail-nav",
        "type": "sidebar",
        "position": "left",
        "width": 280,
        "visible": true,
        "collapsible": true,
        "showFooter": true,
        "defaultTabId": "mail",
        "tabs": [
          {
            "id": "mail",
            "label": "Mail",
            "icon": "envelope",
            "header": "Mail",
            "headerIcon": "envelope",
            "content": {
              "type": "groups",
              "groups": [
                {
                  "id": "favorites",
                  "label": "FAVORITES",
                  "expandable": true,
                  "expanded": true,
                  "items": [
                    {
                      "id": "inbox-fav",
                      "label": "Inbox",
                      "icon": "inbox",
                      "badge": 12,
                      "command": "mail.open-inbox"
                    },
                    {
                      "id": "sent",
                      "label": "Sent Items",
                      "icon": "send",
                      "command": "mail.open-sent"
                    },
                    {
                      "id": "drafts",
                      "label": "Drafts",
                      "icon": "draft",
                      "badge": 3,
                      "command": "mail.open-drafts"
                    }
                  ]
                },
                {
                  "id": "mail-folders",
                  "label": "MAIL",
                  "expandable": true,
                  "expanded": true,
                  "items": [
                    {
                      "id": "inbox",
                      "label": "Inbox",
                      "icon": "inbox",
                      "selected": true,
                      "badge": 24,
                      "badgeColor": "#70AD47",
                      "command": "mail.open-inbox"
                    },
                    {
                      "id": "starred",
                      "label": "Starred",
                      "icon": "star",
                      "badge": 5,
                      "command": "mail.open-starred"
                    },
                    {
                      "id": "important",
                      "label": "Important",
                      "icon": "flag",
                      "badge": 8,
                      "command": "mail.open-important"
                    },
                    {
                      "id": "personal",
                      "label": "Personal Folders",
                      "icon": "folder",
                      "expandable": true,
                      "expanded": false,
                      "children": [
                        {
                          "id": "personal-work",
                          "label": "Work",
                          "icon": "folder",
                          "command": "mail.open-folder-work"
                        },
                        {
                          "id": "personal-projects",
                          "label": "Projects",
                          "icon": "folder",
                          "command": "mail.open-folder-projects"
                        },
                        {
                          "id": "personal-clients",
                          "label": "Clients",
                          "icon": "folder",
                          "command": "mail.open-folder-clients"
                        }
                      ]
                    },
                    {
                      "id": "archive",
                      "label": "Archive",
                      "icon": "archive",
                      "command": "mail.open-archive"
                    },
                    {
                      "id": "junk",
                      "label": "Junk Email",
                      "icon": "trash",
                      "badge": 2,
                      "command": "mail.open-junk"
                    },
                    {
                      "id": "deleted",
                      "label": "Deleted Items",
                      "icon": "trash",
                      "command": "mail.open-deleted"
                    }
                  ]
                },
                {
                  "id": "calendar-section",
                  "label": "CALENDAR",
                  "expandable": true,
                  "expanded": false,
                  "items": [
                    {
                      "id": "my-calendar",
                      "label": "My Calendar",
                      "icon": "calendar",
                      "command": "calendar.open"
                    }
                  ]
                },
                {
                  "id": "all-folders",
                  "label": "ALL FOLDERS",
                  "expandable": true,
                  "expanded": false,
                  "items": []
                }
              ]
            }
          },
          {
            "id": "calendar",
            "label": "Calendar",
            "icon": "calendar",
            "header": "Calendar",
            "component": "CalendarSidebar"
          },
          {
            "id": "contacts",
            "label": "Contacts",
            "icon": "people",
            "header": "Contacts",
            "component": "ContactsSidebar"
          }
        ],
        "footer": {
          "controls": [
            {
              "id": "new-folder",
              "type": "button",
              "label": "New Folder",
              "icon": "folderAdd",
              "command": "mail.new-folder"
            },
            {
              "id": "separator",
              "type": "separator"
            },
            {
              "id": "settings",
              "type": "iconButton",
              "icon": "settings",
              "tooltip": "Settings",
              "command": "app.settings"
            }
          ]
        }
      }
    },
    "toolbar": {
      "id": "mail-toolbar",
      "iconStyle": "iconWithText",
      "groups": [
        {
          "id": "actions",
          "controls": [
            {
              "id": "new-mail",
              "type": "button",
              "label": "New Mail",
              "icon": "compose",
              "command": "mail.compose"
            },
            {
              "id": "reply",
              "type": "button",
              "label": "Reply",
              "icon": "reply",
              "command": "mail.reply",
              "disabled": true
            },
            {
              "id": "reply-all",
              "type": "button",
              "label": "Reply All",
              "icon": "replyAll",
              "command": "mail.reply-all",
              "disabled": true
            },
            {
              "id": "forward",
              "type": "button",
              "label": "Forward",
              "icon": "forward",
              "command": "mail.forward",
              "disabled": true
            }
          ]
        }
      ]
    },
    "contentArea": {
      "type": "grid",
      "component": "MailListView"
    }
  }
}
```

---

## Example 2: Document Editor (Left + Right Sidebars)

```json
{
  "appId": "doc-editor",
  "title": "Document Editor",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "document.docx",
    "sidebars": {
      "left": {
        "id": "nav",
        "type": "sidebar",
        "position": "left",
        "width": 250,
        "visible": true,
        "tabs": [
          {
            "id": "navigator",
            "label": "Navigator",
            "icon": "list",
            "header": "Document Structure",
            "content": {
              "type": "groups",
              "groups": [
                {
                  "id": "headings",
                  "label": "HEADINGS",
                  "expandable": true,
                  "expanded": true,
                  "items": [
                    {
                      "id": "h1",
                      "label": "Introduction",
                      "icon": "heading1",
                      "command": "nav.go-to-h1"
                    },
                    {
                      "id": "h2-1",
                      "label": "Background",
                      "icon": "heading2",
                      "command": "nav.go-to-h2-1"
                    },
                    {
                      "id": "h2-2",
                      "label": "Problem Statement",
                      "icon": "heading2",
                      "command": "nav.go-to-h2-2"
                    }
                  ]
                },
                {
                  "id": "tables",
                  "label": "TABLES",
                  "expandable": true,
                  "expanded": false,
                  "items": [
                    {
                      "id": "tbl1",
                      "label": "Table 1: Data Summary",
                      "icon": "table",
                      "command": "nav.go-to-table1"
                    }
                  ]
                },
                {
                  "id": "images",
                  "label": "IMAGES",
                  "expandable": true,
                  "expanded": false,
                  "items": [
                    {
                      "id": "img1",
                      "label": "Figure 1: Overview",
                      "icon": "image",
                      "command": "nav.go-to-img1"
                    }
                  ]
                }
              ]
            }
          },
          {
            "id": "styles",
            "label": "Styles",
            "icon": "paintBrush",
            "header": "Paragraph Styles",
            "component": "StylesSidebar"
          }
        ]
      },
      "right": {
        "id": "properties",
        "type": "sidebar",
        "position": "right",
        "width": 280,
        "visible": true,
        "defaultTabId": "properties",
        "tabs": [
          {
            "id": "properties",
            "label": "Properties",
            "icon": "info",
            "header": "Document Properties",
            "content": {
              "type": "groups",
              "groups": [
                {
                  "id": "doc-props",
                  "label": "DOCUMENT",
                  "expandable": false,
                  "items": []
                }
              ]
            }
          },
          {
            "id": "stats",
            "label": "Statistics",
            "icon": "chart",
            "header": "Statistics",
            "component": "StatisticsPanel"
          },
          {
            "id": "comments",
            "label": "Comments",
            "icon": "comment",
            "header": "Comments",
            "content": {
              "type": "groups",
              "groups": [
                {
                  "id": "all-comments",
                  "label": "ALL COMMENTS",
                  "items": []
                }
              ]
            }
          }
        ]
      }
    },
    "toolbar": {
      "id": "editor-toolbar",
      "groups": [...]
    },
    "contentArea": {
      "component": "DocumentEditor"
    }
  }
}
```

---

## Example 3: IDE/Code Editor

```json
{
  "appId": "code-editor",
  "title": "Code Editor",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "Project: My App",
    "sidebars": {
      "left": {
        "id": "explorer",
        "type": "sidebar",
        "position": "left",
        "width": 300,
        "visible": true,
        "tabs": [
          {
            "id": "files",
            "label": "Explorer",
            "icon": "fileExplorer",
            "header": "File Explorer",
            "content": {
              "type": "groups",
              "groups": [
                {
                  "id": "src",
                  "label": "src/",
                  "expandable": true,
                  "expanded": true,
                  "items": [
                    {
                      "id": "components",
                      "label": "components/",
                      "icon": "folder",
                      "expandable": true,
                      "expanded": false,
                      "children": [
                        {
                          "id": "button",
                          "label": "Button.tsx",
                          "icon": "file",
                          "command": "editor.open-button"
                        },
                        {
                          "id": "input",
                          "label": "Input.tsx",
                          "icon": "file",
                          "command": "editor.open-input"
                        }
                      ]
                    },
                    {
                      "id": "app",
                      "label": "App.tsx",
                      "icon": "file",
                      "selected": true,
                      "command": "editor.open-app"
                    },
                    {
                      "id": "index",
                      "label": "index.ts",
                      "icon": "file",
                      "command": "editor.open-index"
                    }
                  ]
                }
              ]
            }
          },
          {
            "id": "search",
            "label": "Search",
            "icon": "search",
            "header": "Find in Files",
            "component": "SearchPanel"
          },
          {
            "id": "git",
            "label": "Source Control",
            "icon": "gitBranch",
            "header": "Git",
            "component": "GitPanel"
          },
          {
            "id": "extensions",
            "label": "Extensions",
            "icon": "extensions",
            "header": "Extensions",
            "component": "ExtensionsPanel"
          }
        ]
      }
    },
    "contentArea": {
      "component": "Editor"
    }
  }
}
```

---

## Example 4: Design Application (Right Sidebar)

```json
{
  "appId": "design-app",
  "title": "Design Tool",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "design.sketch",
    "sidebars": {
      "right": {
        "id": "design-panel",
        "type": "sidebar",
        "position": "right",
        "width": 300,
        "visible": true,
        "defaultTabId": "layers",
        "tabs": [
          {
            "id": "layers",
            "label": "Layers",
            "icon": "layers",
            "header": "Layers",
            "component": "LayersPanel"
          },
          {
            "id": "design",
            "label": "Design",
            "icon": "palette",
            "header": "Design Properties",
            "component": "DesignPanel"
          },
          {
            "id": "styles",
            "label": "Styles",
            "icon": "paintBrush",
            "header": "Global Styles",
            "component": "StylesPanel"
          },
          {
            "id": "assets",
            "label": "Assets",
            "icon": "folder",
            "header": "Assets",
            "component": "AssetsPanel"
          }
        ]
      }
    },
    "contentArea": {
      "component": "Canvas"
    }
  }
}
```

---

## Example 5: Project Management Tool

```json
{
  "appId": "project-manager",
  "title": "Project Manager",
  "rootWindow": {
    "id": "main",
    "windowType": "root",
    "title": "My Projects",
    "sidebars": {
      "left": {
        "id": "projects",
        "type": "sidebar",
        "position": "left",
        "width": 280,
        "visible": true,
        "tabs": [
          {
            "id": "projects-list",
            "label": "Projects",
            "icon": "folder",
            "header": "Your Projects",
            "content": {
              "type": "groups",
              "groups": [
                {
                  "id": "active",
                  "label": "ACTIVE",
                  "expandable": true,
                  "expanded": true,
                  "items": [
                    {
                      "id": "proj1",
                      "label": "Website Redesign",
                      "icon": "folder",
                      "selected": true,
                      "badge": 3,
                      "badgeColor": "#FF6600",
                      "command": "project.open-1"
                    },
                    {
                      "id": "proj2",
                      "label": "Mobile App",
                      "icon": "folder",
                      "badge": 5,
                      "command": "project.open-2"
                    }
                  ]
                },
                {
                  "id": "archived",
                  "label": "ARCHIVED",
                  "expandable": true,
                  "expanded": false,
                  "items": [
                    {
                      "id": "proj3",
                      "label": "2024 Annual Report",
                      "icon": "folder",
                      "command": "project.open-3"
                    }
                  ]
                }
              ]
            }
          }
        ],
        "footer": {
          "controls": [
            {
              "id": "new-project",
              "type": "button",
              "label": "New Project",
              "icon": "plus",
              "command": "project.new"
            }
          ]
        }
      }
    },
    "contentArea": {
      "component": "ProjectBoard"
    }
  }
}
```

---

## Summary

These examples show:

✅ **Mail App** - Mail folders, calendar, contacts tabs with footer  
✅ **Document Editor** - Left navigator + Right properties  
✅ **Code Editor** - Explorer, search, source control tabs  
✅ **Design App** - Layers, design, styles, assets tabs  
✅ **Project Manager** - Active/archived projects  

All with:
- Expandable groups
- Badge counts
- Nested items
- Footer controls
- Full i18n support
- Command integration

