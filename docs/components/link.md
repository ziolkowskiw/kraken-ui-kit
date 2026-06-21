# Link

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Link component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Link`
- `LinkButton`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"default" \| "destructive"` | `"default"` |
| `size` | enum | `"xs" \| "sm" \| "md" \| "lg"` | — |
| `leftIcon` | string / node | — | — |
| `rightIcon` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-content-disabled`
- `--ds-color-content-link`
- `--ds-color-content-link-active`
- `--ds-color-content-link-hover`
- `--ds-color-content-link-visited`
- `--ds-color-destructive`
- `--ds-color-destructive-active`
- `--ds-color-destructive-hover`
- `--ds-radius-xs`
- `--ds-typography-bodymd-fontfamily`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodymd-lineheight`
- `--ds-typography-linklg-fontsize`
- `--ds-typography-linklg-fontweight`
- `--ds-typography-linklg-lineheight`
- `--ds-typography-linkmd-fontsize`
- `--ds-typography-linkmd-fontweight`
- `--ds-typography-linkmd-lineheight`
- `--ds-typography-linksm-fontsize`
- `--ds-typography-linksm-fontweight`
- `--ds-typography-linksm-lineheight`
- `--ds-typography-linkxs-fontsize`
- `--ds-typography-linkxs-fontweight`
- `--ds-typography-linkxs-lineheight`

## Accessibility

- Renders as `<a>` — inherently keyboard and screen-reader accessible.
- Use `link` for navigation; use `button` for actions (do not style a `<button>` as a link for navigation).
- External links: add `aria-label` or visually-hidden text to warn users ("opens in new tab").
