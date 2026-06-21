# Separator

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Separator component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Separator`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `orientation` | enum | `"horizontal" \| "vertical"` | `"horizontal"` |
| `spacing` | enum | `"0" \| "4" \| "8" \| "12" \| "16" \| "24" \| "32"` | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-border`
- `--ds-spacing-0`
- `--ds-spacing-12`
- `--ds-spacing-16`
- `--ds-spacing-24`
- `--ds-spacing-32`
- `--ds-spacing-4`
- `--ds-spacing-8`

## Accessibility

- Use `role="separator"` (default). For decorative separators: `role="none"` or `aria-hidden="true"`.
