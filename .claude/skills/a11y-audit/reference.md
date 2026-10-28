# a11y-audit reference

## WCAG 2.2 A/AA criteria that apply to components → what covers them

`axe` = scan-axe.mjs · `tok` = contrast-tokens.mjs · `kbd` = scan-keyboard.mjs ·
`aria` = ARIA snapshot + manifest claims (step 5) · `manual` = a person must check.

| SC            | Name                            | Component-level check                                                                           | Covered by                        |
| ------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------- |
| 1.1.1         | Non-text content                | icon-only buttons/links named; decorative icons `aria-hidden`                                   | axe (presence) · manual (meaning) |
| 1.3.1         | Info & relationships            | labels tied to inputs; radio/checkbox groups have `fieldset`/`role=group` + name; table headers | axe · aria                        |
| 1.3.5         | Identify input purpose          | `*Field` wrappers pass `autoComplete` through to the input                                      | manual                            |
| 1.4.1         | Use of color                    | error, status, badge, link states not color-only                                                | axe (links) · manual              |
| 1.4.3         | Contrast (minimum)              | 4.5:1 text, 3:1 ≥ 24px / 18.66px bold — every brand × scheme, incl. hover/placeholder           | axe · tok                         |
| 1.4.4         | Resize text                     | 200% zoom, no clipped text                                                                      | manual                            |
| 1.4.10        | Reflow                          | no 2-D scroll at 320 CSS px (data tables exempt)                                                | kbd                               |
| 1.4.11        | Non-text contrast               | input borders, focus ring, checkbox/switch/radio states, meaningful icons ≥ 3:1                 | tok · manual (states)             |
| 1.4.12        | Text spacing                    | no clipping with WCAG spacing overrides                                                         | kbd                               |
| 1.4.13        | Content on hover/focus          | tooltip/hover-card: Escape dismisses, pointer can move onto it, stays until dismissed           | kbd (Escape) · manual             |
| 2.1.1         | Keyboard                        | every action reachable/operable by keyboard                                                     | kbd                               |
| 2.1.2         | No keyboard trap                | Escape leaves modals; Tab never sticks                                                          | kbd                               |
| 2.1.4         | Character key shortcuts         | single-key shortcuts (Command, Kbd demos) can be turned off/remapped                            | manual                            |
| 2.2.1 / 2.2.2 | Timing / pause                  | toasts (Sonner) don't vanish before they can be read; carousel autoplay pausable                | manual                            |
| 2.4.3         | Focus order                     | logical order; overlays take focus and return it                                                | kbd                               |
| 2.4.6         | Headings & labels               | descriptive labels, dialog titles                                                               | manual                            |
| 2.4.7         | Focus visible                   | visible indicator on every focusable, also in forced colors                                     | kbd                               |
| 2.4.11        | Focus not obscured (min)        | sticky sidebar/header, toasts, drawers don't fully cover the focused item                       | manual                            |
| 2.5.1 / 2.5.7 | Pointer gestures / dragging     | slider, resizable, carousel have single-pointer, no-drag alternative                            | manual                            |
| 2.5.3         | Label in name                   | visible text is contained in the accessible name                                                | aria · manual                     |
| 2.5.8         | Target size (minimum)           | 24×24 CSS px or spacing exception — check `xs`/`sm` sizes and `iconOnly`                        | axe                               |
| 3.2.1 / 3.2.2 | On focus / on input             | focusing or changing a control doesn't navigate/submit                                          | manual                            |
| 3.3.1 / 3.3.2 | Error identification / labels   | error text linked via `aria-describedby`, `aria-invalid` set                                    | aria                              |
| 3.3.8         | Accessible authentication (min) | InputOTP accepts paste                                                                          | manual                            |
| 4.1.2         | Name, role, value               | correct role, name, state (`aria-expanded`, `aria-checked`, `aria-selected`)                    | axe · aria                        |
| 4.1.3         | Status messages                 | Sonner / Alert / Progress use `role=status`/`alert` without moving focus                        | aria                              |

## Keyboard contract per component (WAI-ARIA APG)

| Component(s)                            | Must do                                                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| button, toggle, link                    | Enter (+ Space for buttons/toggles) activates                                                            |
| checkbox, checkbox-button, switch       | Space toggles; state exposed (`aria-checked`)                                                            |
| radio-group, radio-button, toggle-group | one Tab stop; arrows move selection                                                                      |
| tabs                                    | one Tab stop on the active tab; ←/→ (↑/↓ vertical), Home/End; tabpanel focusable if it has no focusables |
| accordion                               | Enter/Space toggles; `aria-expanded` + `aria-controls`                                                   |
| dialog, alert-dialog, drawer, sheet     | focus moves inside, Tab trapped, Escape closes, focus returns to trigger; named by title                 |
| dropdown-menu, context-menu             | Enter/Space/↓ opens and focuses first item; arrows; Escape closes → trigger                              |
| menubar                                 | ←/→ between menus, ↓ opens, Escape closes                                                                |
| select                                  | select-only combobox: Enter/Space/↓/Alt+↓ open; type-ahead; Escape closes                                |
| combobox, command, search               | ↓ opens/moves, Enter selects, Escape closes/clears; active option exposed                                |
| popover, hover-card, navigation-menu    | Enter/Space opens (hover-card also on focus), Escape closes → trigger                                    |
| tooltip                                 | opens on keyboard focus, Escape dismisses, trigger has `aria-describedby` to the content                 |
| slider                                  | arrows ±step, Home/End, PageUp/PageDown; `aria-valuenow`/`valuetext`                                     |
| calendar, date-picker                   | grid arrows, PageUp/PageDown month, Home/End week; selected day announced                                |
| carousel                                | prev/next buttons named; `aria-roledescription` carousel/slide; no unpausable autoplay                   |
| input-otp                               | typing advances, Backspace goes back, paste fills all slots                                              |
| resizable                               | handle is `role=separator`, arrows resize, value exposed                                                 |
| breadcrumb, pagination                  | inside a named `nav`; current item `aria-current="page"`                                                 |
| data-table                              | `th` with scope; sortable headers expose `aria-sort`                                                     |
| sonner, alert, progress                 | live region; never steals focus                                                                          |

## Manual checklist (copy into every report; mark untested unless done)

- [ ] VoiceOver (Safari) and NVDA (Firefox/Chrome): name, role, state, and changes are announced for each variant
- [ ] Labels and alt text make sense, not just present
- [ ] Reading order matches visual order
- [ ] 200% browser zoom: nothing clipped or overlapping
- [ ] Real Windows High Contrast: borders, focus, checked states visible
- [ ] Tooltip/hover-card content can be hovered and stays until dismissed (1.4.13)
- [ ] Focus not hidden under sticky sidebar/header, toasts, drawers (2.4.11)
- [ ] Slider, resizable, carousel usable without dragging (2.5.7)
- [ ] Touch targets at `xs`/`sm` sizes on a real phone
- [ ] Error messages announced when they appear
