# Tabs

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Layered sections of content displayed one at a time. Use to switch between related views in the same space.

## Anatomy

- `Tabs`
- `TabsList`
- `TabsTrigger`
- `TabsContent`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"line" \| "badge"` | `"line"` |
| `depth` | enum | `"1" \| "2"` | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-card-radius`

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-border`
- `--ds-color-foreground`
- `--ds-color-muted-foreground`
- `--ds-color-primary`
- `--ds-color-status-neutral-bg`
- `--ds-color-status-neutral-border`
- `--ds-radius-lg`
- `--ds-spacing-component-xs`
- `--ds-typography-labellg-fontsize`
- `--ds-typography-labellg-fontweight`
- `--ds-typography-labellg-lineheight`
- `--ds-typography-labelmd-fontsize`
- `--ds-typography-labelmd-fontweight`
- `--ds-typography-labelmd-lineheight`

## Accessibility

- `TabsList` has `role="tablist"`; each `TabsTrigger` has `role="tab"` with `aria-selected` and `aria-controls`.
- Keyboard: `ArrowLeft`/`ArrowRight` moves between tabs (automatic activation).
- The active `TabsContent` has `role="tabpanel"` with `aria-labelledby`.
