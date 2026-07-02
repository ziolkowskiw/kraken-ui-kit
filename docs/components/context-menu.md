# Context Menu

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Context Menu component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `ContextMenu`
- `ContextMenuTrigger`
- `ContextMenuPortal`
- `ContextMenuContent`
- `ContextMenuGroup`
- `ContextMenuItem`
- `ContextMenuCheckboxItem`
- `ContextMenuRadioGroup`
- `ContextMenuRadioItem`
- `ContextMenuLabel`
- `ContextMenuSeparator`
- `ContextMenuShortcut`
- `ContextMenuSub`
- `ContextMenuSubTrigger`
- `ContextMenuSubContent`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `inset` | bool | `true \| false` | `false` |


## Token map

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-tertiary`
- `--ds-color-muted-foreground`
- `--ds-typography-labelsm-fontsize`

## Accessibility

- Triggered by right-click; add a keyboard alternative (e.g. `Shift+F10` or a toolbar button) for keyboard-only users.
- Menu items use `role="menuitem"`; checkable items `role="menuitemcheckbox"`.
- Keyboard: `ArrowUp`/`ArrowDown` moves focus; `Escape` closes.
