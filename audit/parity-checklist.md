# Parity Checklist — Figma ↔ Code

Systematic review of every component against its Figma variant matrix and shadcn props.  
Run with the `parity-reviewer` agent. Update status after each review.

**Status values:** `pending` · `✅ PASS` · `🔧 FIXED` · `⚠️ NEEDS WORK`

---

## v1 12 (full prop-map components)

| #   | Component   | Status   | Notes                                                                                 |
| --- | ----------- | -------- | ------------------------------------------------------------------------------------- |
| 1   | button      | ✅ PASS  | All 7 variants, 4 sizes, iconOnly, leftIcon/rightIcon, tokens — clean                 |
| 2   | badge       | ✅ PASS  | 8 colors, 3 appearances, 3 sizes, 2 shapes, icons — clean                             |
| 3   | input       | ✅ PASS  | InputField, 3 sizes, errorMessage, mandatory, decorations — clean                     |
| 4   | textarea    | 🔧 FIXED | Counter onChange clobbered by spread + initial value not seeded — both fixed          |
| 5   | select      | 🔧 FIXED | Story playground defaulted size='lg' instead of 'md' — corrected                      |
| 6   | checkbox    | ✅ PASS  | checked/indeterminate/error/disabled — clean; hoverScope extension documented         |
| 7   | radio-group | 🔧 FIXED | Indicator dot used hardcoded `bg-white` — replaced with `bg-current` to inherit token |
| 8   | switch      | 🔧 FIXED | Thumb knob had hardcoded `bg-white` — replaced with `--ds-color-white` token          |
| 9   | card        | ✅ PASS  | filled bool, all 7 sub-parts, cardVariants — clean                                    |
| 10  | alert       | 🔧 FIXED | Story defaults fixed, type prop aligned — commit c4ef2cc                              |
| 11  | dialog      | 🔧 FIXED | Tokenization fixed, story naming corrected — commit 37d9848                           |
| 12  | tabs        | 🔧 FIXED | variant mapping: Figma `default`→code `badge` documented — commit c4ef2cc             |

---

## Part 2 — Remaining parent components

| #   | Component       | Status   | Notes                                                                                                                                                                    |
| --- | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 13  | accordion       | 🔧 FIXED | Missing type prop (Base UI uses `multiple`), broken height animation, dead disabled CSS, hardcoded h-[26px]                                                              |
| 14  | alert-dialog    | 🔧 FIXED | Missing AlertDialogDescription/aria-describedby added; closeIcon default fixed to false                                                                                  |
| 15  | avatar          | 🔧 FIXED | Created missing avatar-stack.tsx re-export + docs; component itself clean                                                                                                |
| 16  | breadcrumb      | ✅ PASS  | All 7 exports, aria-current, separator, ellipsis — clean                                                                                                                 |
| 17  | calendar        | ✅ PASS  | Single/range/disabled modes, all tokens clean; added Disabled story                                                                                                      |
| 18  | carousel        | ✅ PASS  | Embla, orientation, 5 exports — clean; stale node ID in comment corrected                                                                                                |
| 19  | combobox        | ✅ PASS  | Popover+command, sm/md/lg, ComboboxField, full token coverage — clean                                                                                                    |
| 20  | command         | ✅ PASS  | All 7+ exports, search icon, groups, shortcuts, tokens clean; stale node ID fixed                                                                                        |
| 21  | context-menu    | 🔧 FIXED | Story only covered 7/14 parts — expanded to full surface; stale node ID fixed                                                                                            |
| 22  | date-picker     | 🔧 FIXED | Missing range mode added; WithValue/RangeSelection stories added; stale node ID fixed                                                                                    |
| 23  | drawer          | 🔧 FIXED | `rounded-t-xl` used wrong radius via CSS var chain — replaced with `--ds-radius-xl` token                                                                                |
| 24  | empty           | 🔧 FIXED | MAPPING.md had wrong part names (EmptyBody/EmptyAction) — corrected to EmptyDescription/EmptyContent                                                                     |
| 25  | dropdown-menu   | 🔧 FIXED | Story missing RadioGroup/RadioItem + inset label — added to Playground                                                                                                   |
| 26  | hover-card      | ✅ PASS  | Opens on hover via PreviewCard, --ds-color-popover surface, tokens clean                                                                                                 |
| 27  | input-otp       | ✅ PASS  | input-otp lib, xs/sm/md/lg sizes, copy-paste, 4 exports — clean                                                                                                          |
| 28  | item            | ✅ PASS  | default/outline/muted variants, ItemMedia/ItemActions slots, tokens clean                                                                                                |
| 29  | kbd             | ✅ PASS  | Semantic kbd element, KbdGroup combo pattern, all tokens clean                                                                                                           |
| 30  | menubar         | 🔧 FIXED | MenubarRadioItem missing entirely; story covered only 3/15 parts — both fixed                                                                                            |
| 31  | navigation-menu | 🔧 FIXED | NavigationMenuViewport unexported (inlined only); NavigationMenuIndicator missing entirely — both added                                                                  |
| 32  | pagination      | ✅ PASS  | All 7 exports, active page distinction, aria-current, ellipsis — clean                                                                                                   |
| 33  | popover         | 🔧 FIXED | PopoverClose never rendered in story; added to Playground. Stale node ID in comment to reconcile                                                                         |
| 34  | progress        | ✅ PASS  | value 0-100, track+indicator, optional label row, tokens clean                                                                                                           |
| 35  | resizable       | 🔧 FIXED | `withHandle` missing from argTypes; no bare-handle story — both added to Playground + NoHandle story                                                                     |
| 36  | separator       | 🔧 FIXED | Base UI `Separator` has no `decorative` prop — added manual bypass (role="none" aria-hidden) for decorative=true; fixed `0px` literal in gap fallback                    |
| 37  | skeleton        | ✅ PASS  | Single primitive, no variant axes, `--ds-color-muted` bg, `animate-pulse`, tokens clean                                                                                  |
| 38  | sidebar         | 🔧 FIXED | `text-[13px]` px literal → `--ds-typography-labelsm-fontsize` token; logo chip token fixed to `--ds-sidebar-primary`; `WithSubItems` story added for `/item-sub` surface |
| 39  | slider          | 🔧 FIXED | Missing `Disabled` and `Steps` stories — both added; core implementation clean                                                                                           |
| 40  | sonner          | ✅ PASS  | Base UI Toast (not sonner pkg) intentional; success/error/warning/info variants, tokens clean                                                                            |
| 41  | table           | ✅ PASS  | All 8 exports + tableZebra utility, hover CSS-only, tokens clean, story covers full structure                                                                            |
| 42  | toggle          | ✅ PASS  | outline/ghost variants, sm/md/lg, data-[pressed] CSS state, tokens clean                                                                                                 |
| 43  | toggle-group    | ✅ PASS  | skin/size context-threaded, seam geometry for Position axis, tokens clean                                                                                                |
| 44  | tooltip         | 🔧 FIXED | Meta lacked `component` field — autodocs had no prop inference; added `component: Tooltip`                                                                               |
| 45  | scroll-area     | ✅ PASS  | ScrollArea + ScrollBar, both orientations, `--ds-color-border-strong` thumb token, stories cover vertical + horizontal                                                   |

---

## Part 3 — Extensions (kit-specific)

| #   | Component       | Status   | Notes                                                                                                                   |
| --- | --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| 46  | link            | ✅ PASS  | Link + LinkButton, default/destructive variants, xs/sm/md/lg sizes, `--ds-color-content-link*` tokens, stories clean    |
| 47  | search          | ✅ PASS  | Search + SearchField, sm/md/lg, default/error/warning states, onClear, all input tokens, stories clean                  |
| 48  | time-input      | ✅ PASS  | TimeInput + TimeInputField, sm/md/lg, error via aria-invalid + has-[input[aria-invalid]], all tokens clean              |
| 49  | checkbox-button | ✅ PASS  | CheckboxButton + CheckboxButtonGroup, button/standalone variants, sm/md/lg, error/disabled states, 13 stories           |
| 50  | radio-button    | ✅ PASS  | RadioButton + RadioButtonGroup, button/standalone variants, sm/md/lg, error state, stories clean                        |
| 51  | button-group    | ✅ PASS  | ButtonGroup, horizontal/vertical orientation, seam geometry, role=group, stories cover icon toolbar                     |
| 52  | data-table      | 🔧 FIXED | `rounded-lg`/`rounded-t-lg` resolved to wrong radius via CSS var chain — replaced with explicit `--ds-radius-lg` tokens |
| 53  | form-table-cell | 🔧 FIXED | `rounded-lg` same CSS var chain bug + `text-sm` hardcoded font size — both replaced with token equivalents              |

---

## Summary

- Total: 53 components
- ✅ PASS: 28
- 🔧 FIXED: 25
- pending: 0
- ⚠️ NEEDS WORK: 0

_Last updated: 2026-06-23 — COMPLETE. All 53 components reviewed._
