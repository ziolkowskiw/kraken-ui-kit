# Data Table

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Data Table component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `TableTitle`
- `TableRow`
- `DataTable`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"title" \| "section" \| "white" \| "grey" \| "selected"` | `"title"` |
| `showTooltip` | bool | `true \| false` | `false` |
| `showAction` | bool | `true \| false` | `false` |
| `title` | string / node | — | — |
| `tooltip` | string / node | — | — |
| `actions` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-button-primary-content`

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-border`
- `--ds-color-content-primary`
- `--ds-color-muted`
- `--ds-color-primary-muted`
- `--ds-color-secondary-active`
- `--ds-color-surface`
- `--ds-radius-lg`
- `--ds-typography-headingmd-fontsize`
- `--ds-typography-headingmd-fontweight`
- `--ds-typography-headingmd-lineheight`

## Accessibility

- Use `<th scope="col">` for column headers and `<th scope="row">` for row headers.
- Sortable columns: the sort button inside `<th>` needs `aria-sort="ascending|descending|none"`.
- Interactive rows: prefer row-level action buttons over whole-row click targets.
