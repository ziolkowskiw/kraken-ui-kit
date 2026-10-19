# Hover Card

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Hover Card component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `HoverCard`
- `HoverCardTrigger`
- `HoverCardContent`
- `HoverCardTitle`
- `HoverCardCopy`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L2 Semantic**
- `--ds-color-content-primary`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-radius-lg`
- `--ds-shadow-overlay`
- `--ds-typography-bodymd-fontfamily`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodymd-lineheight`
- `--ds-typography-headingsm-fontfamily`
- `--ds-typography-headingsm-fontsize`
- `--ds-typography-headingsm-fontweight`
- `--ds-typography-headingsm-lineheight`

## Accessibility

- Content is supplementary — never put required information only in a hover card.
- Must also open on keyboard focus (not just `mouseenter`); Base UI handles this.
- Add `role="tooltip"` or `role="dialog"` depending on whether it's interactive.
