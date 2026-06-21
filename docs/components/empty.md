# Empty

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Empty component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Empty`
- `EmptyHeader`
- `EmptyMedia`
- `EmptyTitle`
- `EmptyDescription`
- `EmptyContent`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"icon" \| "default"` | `"icon"` |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-content-primary`
- `--ds-color-content-secondary`
- `--ds-color-icon-default`
- `--ds-color-icon-muted`
- `--ds-color-muted`
- `--ds-radius-lg`
- `--ds-spacing-component-2xl`
- `--ds-spacing-component-xl`
- `--ds-typography-bodymd-fontfamily`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodymd-lineheight`
- `--ds-typography-headingmd-fontfamily`
- `--ds-typography-headingmd-fontsize`
- `--ds-typography-headingmd-fontweight`
- `--ds-typography-headingmd-lineheight`

## Accessibility

- Use a heading + description + action pattern so screen readers get full context.
- The action button in an empty state must have an accessible label, not just an icon.
