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

**L3 Component**
- `--ds-button-size-md-radius`
- `--ds-button-size-sm-radius`

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-primary`
- `--ds-color-icon-muted`
- `--ds-color-muted`
- `--ds-spacing-component-lg`
- `--ds-spacing-component-md`
- `--ds-spacing-component-sm`
- `--ds-spacing-component-xl`
- `--ds-typography-bodymd-fontfamily`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodymd-lineheight`
- `--ds-typography-headinglg-fontfamily`
- `--ds-typography-headinglg-fontsize`
- `--ds-typography-headinglg-fontweight`
- `--ds-typography-headinglg-lineheight`

## Accessibility

- Use a heading + description + action pattern so screen readers get full context.
- The action button in an empty state must have an accessible label, not just an icon.
