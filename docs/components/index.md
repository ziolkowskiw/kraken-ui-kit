# Component docs index

Per-component references for the Kraken UI Kit (JIT DS 2.0). Each page covers:
**What it is** · **Anatomy** (exported parts) · **Props** (derived from source)
· **Token map** (`--ds-*` bindings) · **Accessibility** (keyboard + ARIA).

For Figma ↔ code mapping (node IDs, deep links, prop maps) see [MAPPING.md](../../MAPPING.md).
Rebuild this folder any time with `npm run docs:build`.

---

## Core v1 (full shadcn parity)
| Component | Description |
|---|---|
| [button](button.md) | Primary actions, form submits, dialog/menu triggers |
| [input](input.md) | Single-line text entry (use `InputField` wrapper) |
| [textarea](textarea.md) | Multi-line text entry (use `TextareaField` wrapper) |
| [select](select.md) | Single-choice dropdown (use `SelectField` wrapper) |
| [checkbox](checkbox.md) | Boolean check |
| [radio-group](radio-group.md) | Single-choice group (use `RadioGroupField` wrapper) |
| [switch](switch.md) | On/off instant toggle |
| [badge](badge.md) | Status/category label |
| [card](card.md) | Content container surface |
| [alert](alert.md) | Inline callout message |
| [dialog](dialog.md) | Modal overlay |
| [tabs](tabs.md) | Sectioned view switcher |

## Navigation & layout
| Component | Description |
|---|---|
| [accordion](accordion.md) | Collapsible section headings |
| [breadcrumb](breadcrumb.md) | Hierarchical path trail |
| [navigation-menu](navigation-menu.md) | Top-level nav with sub-menus |
| [pagination](pagination.md) | Page navigation |
| [sidebar](sidebar.md) | Primary app nav rail |
| [separator](separator.md) | Visual/semantic divider |
| [scroll-area](scroll-area.md) | Custom scrollbar container |
| [resizable](resizable.md) | Draggable split panes |

## Overlays & floating UI
| Component | Description |
|---|---|
| [dialog](dialog.md) | Modal overlay |
| [alert-dialog](alert-dialog.md) | Destructive confirmation modal |
| [drawer](drawer.md) | Side-edge sliding panel |
| [popover](popover.md) | Floating content panel |
| [hover-card](hover-card.md) | Supplementary info on hover |
| [tooltip](tooltip.md) | Short hint on focus/hover |
| [sonner](sonner.md) | Toast notifications |

## Menus & commands
| Component | Description |
|---|---|
| [dropdown-menu](dropdown-menu.md) | Trigger-activated menu |
| [context-menu](context-menu.md) | Right-click menu |
| [menubar](menubar.md) | Top-bar menu system |
| [command](command.md) | Command palette |

## Data & tables
| Component | Description |
|---|---|
| [table](table.md) | Semantic data table |
| [data-table](data-table.md) | Composed data table with header/cell |
| [data-table-header](data-table-header.md) | Column header |
| [data-table-cell](data-table-cell.md) | Data cell |

## Date & time
| Component | Description |
|---|---|
| [calendar](calendar.md) | Date grid |
| [date-picker](date-picker.md) | Date field + popover |
| [time-input](time-input.md) | Time field |

## Media & display
| Component | Description |
|---|---|
| [avatar](avatar.md) | User image/initials |
| [avatar-stack](avatar-stack.md) | Overlapping avatar group |
| [carousel](carousel.md) | Sliding gallery |
| [progress](progress.md) | Progress indicator |
| [skeleton](skeleton.md) | Loading placeholder |

## Toggles & controls
| Component | Description |
|---|---|
| [toggle](toggle.md) | Two-state button |
| [toggle-group](toggle-group.md) | Segmented / multi-toggle |
| [slider](slider.md) | Range value input |

## Forms (extended)
| Component | Description |
|---|---|
| [combobox](combobox.md) | Searchable select |
| [input-otp](input-otp.md) | One-time-password field |
| [search](search.md) | Search input |
| [checkbox-button](checkbox-button.md) | Labeled checkbox |
| [radio-button](radio-button.md) | Labeled radio |
| [form-table-cell](form-table-cell.md) | Form-table cell (v1.1+) |

## Kit extensions (no shadcn 1:1)
| Component | Description |
|---|---|
| [link](link.md) | Text hyperlink |
| [button-group](button-group.md) | Joined button row |
| [item](item.md) | Flexible list/option row |
| [empty](empty.md) | Empty-state display |

## Utilities
| Component | Description |
|---|---|
| [kbd](kbd.md) | Keyboard shortcut |
| [separator](separator.md) | Divider |
| [scroll-area](scroll-area.md) | Custom scrollbar |
