# Input Otp

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Input Otp component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `InputOTP`
- `InputOTPGroup`
- `InputOTPSlot`
- `InputOTPSeparator`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `size` | enum | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` |
| `containerClassName` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-content-tertiary`

**L3 Component**
- `--ds-input-bordercolor`
- `--ds-input-borderfocus`
- `--ds-input-fill`
- `--ds-input-value`

## Accessibility

- Each digit slot should be individually focusable with a logical tab order.
- The group needs an overall `aria-label="Enter your one-time password"`.
- Announce completion state to screen readers (e.g. via a live region).
