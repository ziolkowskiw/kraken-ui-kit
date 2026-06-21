# Toggle Group

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Toggle Group component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `ToggleGroup`
- `ToggleGroupItem`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `skin` | enum | `"outlined" \| "ghost"` | `"outlined"` |
| `size` | enum | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` |
| `iconOnly` | bool | `true \| false` | `false` |

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
- `--ds-button-size-xs-fontsize`
- `--ds-button-size-xs-height`
- `--ds-button-size-xs-paddingx`
- `--ds-button-size-xs-radius`

**L2 Semantic**
- `--ds-color-border-focus`

## Accessibility

- The group has `role="group"` with `aria-label` describing the option set.
- Each `ToggleGroupItem` has `aria-pressed` (single/multiple).
- Keyboard: `Tab` enters the group; `ArrowLeft`/`ArrowRight` moves between items (roving tabindex).
