# Scroll Area

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Scroll Area component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `ScrollArea`
- `ScrollBar`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L2 Semantic**
- `--ds-color-border-strong`
- `--ds-radius-full`

## Accessibility

- The scrollable region should have `tabindex="0"` when it contains non-interactive content, so keyboard users can scroll.
- `overflow: auto` is preferred over `overflow: hidden` for native keyboard scrollability.
