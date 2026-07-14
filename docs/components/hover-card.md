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
- `--ds-color-content-secondary`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-radius-lg`
- `--ds-shadow-overlay`
- `--ds-typography-bodysm-fontfamily`
- `--ds-typography-bodysm-fontsize`
- `--ds-typography-bodysm-lineheight`
- `--ds-typography-labellg-fontfamily`
- `--ds-typography-labellg-fontsize`
- `--ds-typography-labellg-fontweight`
- `--ds-typography-labellg-lineheight`

## Accessibility

- Content is supplementary — never put required information only in a hover card.
- Must also open on keyboard focus (not just `mouseenter`); Base UI handles this.
- Add `role="tooltip"` or `role="dialog"` depending on whether it's interactive.
