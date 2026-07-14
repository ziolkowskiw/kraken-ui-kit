# Navigation Menu

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Navigation Menu component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `NavigationMenu`
- `NavigationMenuList`
- `NavigationMenuItem`
- `NavigationMenuTrigger`
- `NavigationMenuContent`
- `NavigationMenuLink`
- `NavigationMenuViewport`
- `NavigationMenuPositioner`
- `NavigationMenuIndicator`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L2 Semantic**
- `--ds-color-content-primary`
- `--ds-color-muted`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-radius-lg`
- `--ds-shadow-overlay`

## Accessibility

- Wrap in `<nav aria-label="Main">` to give the landmark a name.
- Keyboard: `Tab` / `Shift+Tab` navigates top-level items; submenus open on `Enter`/`Space`/`ArrowDown`.
