# Checkbox

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

A control that toggles between checked and not checked. Use for opt-in/agree flows or multi-select lists.

## Anatomy

- `Checkbox`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `error` | bool | `true \| false` | `false` |


## Token map

**L3 Component**
- `--ds-checkbox-bordercolor`
- `--ds-checkbox-bordererror`
- `--ds-checkbox-bordererrorhover`
- `--ds-checkbox-borderhover`
- `--ds-checkbox-borderwidth`
- `--ds-checkbox-checked`
- `--ds-checkbox-checkedborder`
- `--ds-checkbox-checkeddisabled`
- `--ds-checkbox-checkedhover`
- `--ds-checkbox-cornerradius`
- `--ds-checkbox-fill`
- `--ds-checkbox-filldisabled`
- `--ds-checkbox-fillhover`

**L2 Semantic**
- `--ds-color-border-focus`
- `--ds-color-primary-foreground`
- `--ds-shadow-control`

## Accessibility

- Native `<input type="checkbox">` via Base UI — keyboard and screen-reader accessible.
- Indeterminate state: set the DOM `indeterminate` property (not an HTML attribute); assistive technology announces "mixed".
- Always pair with a visible `<label>` or `aria-label`.
