# Button

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Displays a button or a component that looks like a button. Use for primary actions, form submits, and dialog/menu triggers. For navigation styled as a button, use `link-button`.

## Anatomy

- `Button`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"destructive-secondary" \| "destructive-ghost" \| "primary" \| "secondary" \| "tonal" \| "ghost" \| "destructive"` | `"primary"` |
| `size` | enum | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` |
| `leftIcon` | string / node | — | — |
| `rightIcon` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-button-destructive-content`
- `--ds-button-destructive-contentdisabled`
- `--ds-button-destructive-fill`
- `--ds-button-destructive-fillactive`
- `--ds-button-destructive-filldisabled`
- `--ds-button-destructive-fillhover`
- `--ds-button-destructiveghost-border`
- `--ds-button-destructiveghost-borderdisabled`
- `--ds-button-destructiveghost-content`
- `--ds-button-destructiveghost-contentdisabled`
- `--ds-button-destructiveghost-fill`
- `--ds-button-destructiveghost-fillactive`
- `--ds-button-destructiveghost-filldisabled`
- `--ds-button-destructiveghost-fillhover`
- `--ds-button-destructivesecondary-border`
- `--ds-button-destructivesecondary-borderdisabled`
- `--ds-button-destructivesecondary-content`
- `--ds-button-destructivesecondary-contentdisabled`
- `--ds-button-destructivesecondary-fill`
- `--ds-button-destructivesecondary-fillactive`
- `--ds-button-destructivesecondary-filldisabled`
- `--ds-button-destructivesecondary-fillhover`
- `--ds-button-ghost-content`
- `--ds-button-ghost-contentdisabled`
- `--ds-button-ghost-fillactive`
- `--ds-button-ghost-filldisabled`
- `--ds-button-ghost-fillhover`
- `--ds-button-ghost-size-lg-paddingx`
- `--ds-button-ghost-size-md-paddingx`
- `--ds-button-ghost-size-sm-paddingx`
- `--ds-button-ghost-size-xs-paddingx`
- `--ds-button-primary-content`
- `--ds-button-primary-contentdisabled`
- `--ds-button-primary-fill`
- `--ds-button-primary-fillactive`
- `--ds-button-primary-filldisabled`
- `--ds-button-primary-fillhover`
- `--ds-button-secondary-border`
- `--ds-button-secondary-content`
- `--ds-button-secondary-contentdisabled`
- `--ds-button-secondary-fill`
- `--ds-button-secondary-fillactive`
- `--ds-button-secondary-filldisabled`
- `--ds-button-secondary-fillhover`
- `--ds-button-size-lg-fontsize`
- `--ds-button-size-lg-fontweight`
- `--ds-button-size-lg-height`
- `--ds-button-size-lg-icononlypadding`
- `--ds-button-size-lg-paddingx`
- `--ds-button-size-lg-radius`
- `--ds-button-size-md-fontsize`
- `--ds-button-size-md-fontweight`
- `--ds-button-size-md-height`
- `--ds-button-size-md-icononlypadding`
- `--ds-button-size-md-paddingx`
- `--ds-button-size-md-radius`
- `--ds-button-size-sm-fontsize`
- `--ds-button-size-sm-fontweight`
- `--ds-button-size-sm-height`
- `--ds-button-size-sm-icononlypadding`
- `--ds-button-size-sm-paddingx`
- `--ds-button-size-sm-radius`
- `--ds-button-size-xs-fontsize`
- `--ds-button-size-xs-fontweight`
- `--ds-button-size-xs-height`
- `--ds-button-size-xs-icononlypadding`
- `--ds-button-size-xs-paddingx`
- `--ds-button-size-xs-radius`
- `--ds-button-tonal-content`
- `--ds-button-tonal-contentdisabled`
- `--ds-button-tonal-fill`
- `--ds-button-tonal-fillactive`
- `--ds-button-tonal-filldisabled`
- `--ds-button-tonal-fillhover`

## Accessibility

- Native `<button>` (via Base UI) — keyboard and screen-reader accessible by default.
- `iconOnly` buttons: **always** provide `aria-label` (or `title`) with a text equivalent.
- Avoid `div`/`span` click handlers — use `<button>` or `<a>` as appropriate.
