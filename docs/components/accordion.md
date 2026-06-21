# Accordion

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Accordion component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Accordion`
- `AccordionContent`
- `AccordionItem`
- `AccordionTrigger`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"in-box" \| "standalone"` | `"in-box"` |
| `hasSubtitle` | bool | `true \| false` | `false` |
| `hasIcon` | bool | `true \| false` | `false` |
| `compact` | bool | `true \| false` | `false` |
| `hasTitle` | bool | `true \| false` | `false` |
| `hasLinkButton` | bool | `true \| false` | `false` |
| `title` | string / node | — | — |
| `subtitle` | string / node | — | — |
| `icon` | string / node | — | — |
| `contentTitle` | string / node | — | — |
| `linkButton` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-card-radius`

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-border-focus`
- `--ds-color-content-primary`
- `--ds-color-content-secondary`
- `--ds-color-secondary-hover`
- `--ds-color-surface`
- `--ds-spacing-component-lg`
- `--ds-spacing-component-xl`
- `--ds-typography-bodylg-fontfamily`
- `--ds-typography-bodylg-fontsize`
- `--ds-typography-bodylg-fontweight`
- `--ds-typography-bodylg-lineheight`
- `--ds-typography-bodymd-fontfamily`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodymd-fontweight`
- `--ds-typography-bodymd-lineheight`
- `--ds-typography-headingmd-fontfamily`
- `--ds-typography-headingmd-fontsize`
- `--ds-typography-headingmd-fontweight`
- `--ds-typography-headingmd-lineheight`

## Accessibility

- Triggers are `<button>` elements with `aria-expanded` and `aria-controls`.
- Keyboard: `Space`/`Enter` toggles, `Tab` moves focus between triggers.
- Content panel is linked to its trigger via `id`/`aria-labelledby`.
