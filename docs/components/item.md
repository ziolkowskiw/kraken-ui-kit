# Item

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Item component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Item`
- `ItemGroup`
- `ItemHeader`
- `ItemFooter`
- `ItemSeparator`
- `ItemMedia`
- `ItemContent`
- `ItemTitle`
- `ItemDescription`
- `ItemActions`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"default" \| "outline" \| "muted"` | `"default"` |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-primary`
- `--ds-color-content-secondary`
- `--ds-color-icon-default`
- `--ds-color-muted`
- `--ds-radius-md`
- `--ds-spacing-component-lg`
- `--ds-spacing-component-md`
- `--ds-spacing-component-sm`
- `--ds-typography-bodymd-fontfamily`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodymd-lineheight`
- `--ds-typography-labellg-fontfamily`
- `--ds-typography-labellg-fontsize`
- `--ds-typography-labellg-fontweight`
- `--ds-typography-labellg-lineheight`

## Accessibility

- When used in a list, wrap in `<ul>`/`<li>` or use `role="list"`/`role="listitem"`.
- If the item is a navigation link, use `<a>`; if a button, use `<button>`.
