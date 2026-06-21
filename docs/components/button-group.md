# Button Group

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Button Group component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `ButtonGroup`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `orientation` | enum | `"horizontal" \| "vertical"` | `"horizontal"` |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

_No `--ds-*` tokens used directly — relies on Tailwind/shadcn semantic classes._

## Accessibility

- Wrap in a `<div role="group" aria-label="…">` to announce the grouping to screen readers.
- Ensure each child button still has its own accessible label.
