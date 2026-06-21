# Breadcrumb

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Breadcrumb component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Breadcrumb`
- `BreadcrumbList`
- `BreadcrumbItem`
- `BreadcrumbLink`
- `BreadcrumbPage`
- `BreadcrumbSeparator`
- `BreadcrumbEllipsis`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L3 Component**
- `--ds-button-ghost-fillhover`
- `--ds-button-ghost-size-xs-paddingx`
- `--ds-button-size-xs-height`
- `--ds-button-size-xs-icononlypadding`
- `--ds-button-size-xs-labelwrapperpaddingx`
- `--ds-button-size-xs-paddingy`
- `--ds-button-size-xs-radius`

**L2 Semantic**
- `--ds-color-content-primary`
- `--ds-color-content-tertiary`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-fontweight`
- `--ds-typography-labelsm-lineheight`
- `--ds-typography-overline-fontsize`
- `--ds-typography-overline-fontweight`
- `--ds-typography-overline-lineheight`

## Accessibility

- Wrapped in a `<nav aria-label="Breadcrumb">`; current page marked with `aria-current="page"`.
- Keyboard: all links are natively focusable.
