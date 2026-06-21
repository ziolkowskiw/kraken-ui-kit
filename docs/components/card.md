# Card

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Displays a card with header, content, and footer. Use to group related content and actions into a surface.

## Anatomy

- `Card`
- `CardHeader`
- `CardFooter`
- `CardTitle`
- `CardAction`
- `CardDescription`
- `CardContent`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L3 Component**
- `--ds-card-border`
- `--ds-card-borderwidth`
- `--ds-card-fill`
- `--ds-card-foreground`
- `--ds-card-gap`
- `--ds-card-padding`
- `--ds-card-radius`

**L2 Semantic**
- `--ds-color-muted-foreground`

## Accessibility

- A card is a presentational container — it needs no role by default.
- If the card is interactive as a unit (clickable), use `role="article"` or a wrapping `<a>`; never add `onClick` to a plain `<div>`.
- Ensure `CardTitle` uses an appropriate heading level (`as="h2"` etc.) in document context.
