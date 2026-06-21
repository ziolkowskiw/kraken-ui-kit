# Pagination

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Pagination component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Pagination`
- `PaginationContent`
- `PaginationItem`
- `PaginationLink`
- `PaginationPrevious`
- `PaginationNext`
- `PaginationEllipsis`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `isActive` | bool | `true \| false` | `false` |


## Token map

**L2 Semantic**
- `--ds-color-content-tertiary`

## Accessibility

- Wrap in `<nav aria-label="Pagination">`.
- Current page link: `aria-current="page"`.
- Previous/Next links need accessible text (not icon-only).
