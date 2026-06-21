# Avatar

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Avatar component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Avatar`
- `AvatarStack`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `size` | enum | `"2xl" \| "xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `roundness` | enum | `"round" \| "square"` | `"round"` |
| `src` | string / node | — | — |
| `alt` | string / node | — | — |
| `fallback` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L1 Primitive / Shared**
- `--ds-avatar-size-2xl`
- `--ds-avatar-size-lg`
- `--ds-avatar-size-md`
- `--ds-avatar-size-sm`
- `--ds-avatar-size-xl`
- `--ds-avatar-size-xs`

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-primary-muted`
- `--ds-color-primary-muted-foreground`
- `--ds-radius-full`
- `--ds-typography-labellg-fontsize`
- `--ds-typography-labellg-fontweight`
- `--ds-typography-labellg-lineheight`
- `--ds-typography-labelmd-fontsize`
- `--ds-typography-labelmd-fontweight`
- `--ds-typography-labelmd-lineheight`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-fontweight`
- `--ds-typography-labelsm-lineheight`

## Accessibility

- Provide meaningful `alt` on the image; use `aria-label` on the fallback when it shows initials.
- Decorative avatars (no semantic identity): `alt=""` and `aria-hidden="true"`.
