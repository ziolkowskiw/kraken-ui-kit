# Toggle

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Toggle component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Toggle`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"outline" \| "ghost"` | `"outline"` |
| `size` | enum | `"sm" \| "md" \| "lg"` | `"md"` |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-button-secondary-border`
- `--ds-button-secondary-content`
- `--ds-button-secondary-fillactive`
- `--ds-button-secondary-fillhover`
- `--ds-button-size-lg-fontsize`
- `--ds-button-size-lg-height`
- `--ds-button-size-lg-paddingx`
- `--ds-button-size-lg-radius`
- `--ds-button-size-md-fontsize`
- `--ds-button-size-md-height`
- `--ds-button-size-md-paddingx`
- `--ds-button-size-md-radius`
- `--ds-button-size-sm-fontsize`
- `--ds-button-size-sm-height`
- `--ds-button-size-sm-paddingx`
- `--ds-button-size-sm-radius`

**L2 Semantic**
- `--ds-color-border-focus`

## Accessibility

- Element has `aria-pressed` (not `aria-checked`); toggled-on state is announced.
- Provide a descriptive `aria-label` for icon-only toggles.
