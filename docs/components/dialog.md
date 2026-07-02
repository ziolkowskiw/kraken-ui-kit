# Dialog

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

A window overlaid on the primary window, rendering content underneath inert. Use for focused tasks or confirmations.

## Anatomy

- `Dialog`
- `DialogClose`
- `DialogContent`
- `DialogDescription`
- `DialogFooter`
- `DialogHeader`
- `DialogOverlay`
- `DialogPortal`
- `DialogTitle`
- `DialogTrigger`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `showCloseButton` | bool | `true \| false` | `false` |


## Token map

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-muted`
- `--ds-color-muted-foreground`
- `--ds-color-overlay`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-radius-xl`

## Accessibility

- Built on Base UI `Dialog`; focus is trapped inside while open.
- Required: `DialogTitle` (visible or `visually-hidden`) linked via `aria-labelledby`.
- Optional: `DialogDescription` linked via `aria-describedby`.
- Restore focus to the trigger element on close.
