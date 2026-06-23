# Avatar Stack

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link (`605:6567`).

## What it is

A horizontally overlapping group of `Avatar`s with an optional `+N` overflow
counter. Implemented as `AvatarStack`, exported from both `avatar.tsx` and the
re-export module `avatar-stack.tsx`.

## Anatomy

- `AvatarStack`
- `Avatar` (children)

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `size` | enum | `"2xl" \| "xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"sm"` |
| `roundness` | enum | `"round" \| "square"` | `"round"` |
| `max` | number | max visible avatars before `+N` overflow | — |

`size` and `roundness` are applied to every child `Avatar` via `cloneElement`.

> **State note:** `hover`, `focus`, `active` are CSS-only; there is no state prop.

## Token map

**L2 Semantic**
- `--ds-color-background` (ring separating overlapping avatars)
- `--ds-color-primary-muted` / `--ds-color-primary-muted-foreground` (overflow chip)
- `--ds-radius-full`

## Accessibility

- Provide meaningful `alt` / `fallback` on each child `Avatar`.
