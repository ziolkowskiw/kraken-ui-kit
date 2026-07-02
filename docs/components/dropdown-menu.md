# Dropdown Menu

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Dropdown Menu component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `DropdownMenu`
- `DropdownMenuTrigger`
- `DropdownMenuPortal`
- `DropdownMenuContent`
- `DropdownMenuGroup`
- `DropdownMenuItem`
- `DropdownMenuCheckboxItem`
- `DropdownMenuRadioGroup`
- `DropdownMenuRadioItem`
- `DropdownMenuLabel`
- `DropdownMenuSeparator`
- `DropdownMenuShortcut`
- `DropdownMenuSub`
- `DropdownMenuSubTrigger`
- `DropdownMenuSubContent`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `inset` | bool | `true \| false` | `false` |


## Token map

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-tertiary`
- `--ds-color-destructive`
- `--ds-color-destructive-muted`
- `--ds-color-muted-foreground`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-radius-lg`
- `--ds-typography-labelsm-fontsize`

**L1 Primitive / Shared**
- `--ds-menuitem-content`
- `--ds-menuitem-contentdisabled`
- `--ds-menuitem-fillhover`

## Accessibility

- The trigger has `aria-haspopup="menu"` and `aria-expanded`.
- Keyboard: `ArrowUp`/`ArrowDown` moves between items; `Escape` closes; `Enter`/`Space` activates.
- Checkable items use `aria-checked`; radio items use `aria-checked` within `role="radiogroup"`.
