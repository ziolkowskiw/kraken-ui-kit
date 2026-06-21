# Calendar

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Calendar component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Calendar`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L2 Semantic**
- `--ds-color-border-strong`
- `--ds-color-content-disabled`
- `--ds-color-content-primary`
- `--ds-color-content-secondary`
- `--ds-color-content-tertiary`
- `--ds-color-muted`
- `--ds-color-primary`
- `--ds-color-primary-foreground`
- `--ds-color-primary-hover`
- `--ds-color-primary-muted`

## Accessibility

- The date grid is navigable with arrow keys (react-day-picker behavior).
- Selected date is announced via `aria-selected="true"`; today is `aria-label`-annotated.
- Provide an accessible month/year heading so the grid context is always announced.
