# Button Group

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Button Group component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `ButtonGroup`
- `ButtonGroupSeparator`
- `ButtonGroupText`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `orientation` | enum | `"horizontal" \| "vertical"` | `"horizontal"` |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-button-size-md-fontsize`
- `--ds-button-size-md-height`
- `--ds-button-size-md-paddingx`
- `--ds-button-size-md-radius`

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-secondary`
- `--ds-color-muted`

## Accessibility

- Wrap in a `<div role="group" aria-label="…">` to announce the grouping to screen readers.
- Ensure each child button still has its own accessible label.
