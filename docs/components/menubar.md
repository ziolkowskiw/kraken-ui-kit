# Menubar

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Menubar component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Menubar`
- `MenubarMenu`
- `MenubarGroup`
- `MenubarPortal`
- `MenubarRadioGroup`
- `MenubarSub`
- `MenubarTrigger`
- `MenubarContent`
- `MenubarItem`
- `MenubarCheckboxItem`
- `MenubarRadioItem`
- `MenubarLabel`
- `MenubarSeparator`
- `MenubarShortcut`
- `MenubarSubTrigger`
- `MenubarSubContent`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `inset` | bool | `true \| false` | `false` |


## Token map

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-border`
- `--ds-color-content-primary`
- `--ds-color-content-tertiary`
- `--ds-color-muted-foreground`
- `--ds-typography-labelsm-fontsize`

**L1 Primitive / Shared**
- `--ds-menuitem-fillhover`

## Accessibility

- The root element has `role="menubar"`; each trigger `role="menuitem"`.
- Keyboard: `ArrowLeft`/`ArrowRight` moves between top-level items; `ArrowDown` opens a menu.
- Focus returns to the triggering menubar item on close.
