# Command

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Command component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Command`
- `CommandInput`
- `CommandList`
- `CommandEmpty`
- `CommandGroup`
- `CommandGroupLabel`
- `CommandItem`
- `CommandSeparator`
- `CommandShortcut`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `className` | string / node | — | — |
| `children` | string / node | — | — |


## Token map

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-tertiary`
- `--ds-color-icon-muted`
- `--ds-color-muted-foreground`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-radius-lg`
- `--ds-typography-labelsm-fontsize`

**L3 Component**
- `--ds-input-placeholder`
- `--ds-input-value`

## Accessibility

- Operates like a `role="combobox"` with `aria-haspopup="listbox"`.
- Keyboard: same as combobox; `Escape` closes the palette.
- Ensure the command input has a visible or visually-hidden label.
