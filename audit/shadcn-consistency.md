# shadcn Consistency Audit — kraken-ui-kit vs `base-nova`

Audited 2026-07-02 against the live shadcn registry, style **`base-nova`**
(`https://ui.shadcn.com/r/styles/base-nova/<name>.json`) — the official Base UI
style, i.e. the exact upstream this kit forks (`components.json` declares
`"style": "base-nova"`). Method: automated diff of exported symbols, `data-slot`
attributes, and cva variant axes for every component with a shadcn counterpart,
plus manual verification of flagged files.

**Coverage:** 45 of 56 kit components have a base-nova counterpart. The other 11
are kit extensions with no upstream: `avatar-stack`, `checkbox-button`,
`radio-button`, `data-table`, `data-table-cell`, `data-table-header`,
`form-table-cell`, `date-picker`, `link`, `search`, `time-input`.

**Headline numbers:** 23/45 components match the reference export surface and
slot contract exactly; 22 have gaps — 52 missing exports and 80 missing
`data-slot` attributes in total. No hardcoded palette colors anywhere (the
parity sweep held). Remaining px literals are geometry (switch travel, focus
`ring-[3px]` — which base-nova itself uses), not theme leaks.

---

## 1. Intentional divergences — keep, but they are the contract

These are Figma-first decisions recorded in MAPPING.md. They are _correct_ for
this kit; the audit lists them so nobody "fixes" them back to shadcn:

| Area                | Kit                                                                                             | shadcn base-nova                                                    | Verdict                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Button variants     | `primary/secondary/tonal/ghost/destructive/destructive-secondary/destructive-ghost`             | `default/outline/secondary/ghost/destructive/link`                  | Figma axis wins; document mapping for migrators (`default`→`primary`, `outline`→`secondary`) |
| Button sizing       | token-driven (`--ds-button-size-*`), `iconOnly` prop                                            | class-driven, `size="icon-*"` values                                | Kit approach is the design-system point                                                      |
| Alert prop          | `type`                                                                                          | `variant`                                                           | Figma axis name                                                                              |
| Tabs variant        | `badge`                                                                                         | `default`                                                           | Documented in MAPPING.md                                                                     |
| AlertDialog API     | prop-driven `AlertDialogContent` (`title`, `description`, `primaryActions`, `secondaryActions`) | composable `Header/Footer/Title/Action/Cancel/Media` parts          | Matches the Figma dialog anatomy; see §2 for the migration cost                              |
| Avatar API          | prop-driven (`fallback`, `src` props), `AvatarStack`                                            | composable `AvatarImage/AvatarFallback` + `AvatarBadge/AvatarGroup` | Same trade as AlertDialog                                                                    |
| Progress            | single `<Progress value>` with optional label row                                               | composable `Track/Indicator/Label/Value`                            | Kit is simpler; fine                                                                         |
| Sonner              | Base UI Toast (`toast`, `toastManager`)                                                         | `sonner` package                                                    | Intentional (parity checklist #40)                                                           |
| Drawer              | Base UI dialog, no `vaul`                                                                       | `vaul`                                                              | Intentional                                                                                  |
| `*Variants` exports | kit exports `cardVariants`, `switchVariants`, …                                                 | ref mostly doesn't                                                  | Harmless, useful — keep                                                                      |
| `*Field` wrappers   | `InputField`, `SelectField`, `ComboboxField`, `TextareaField`, `RadioGroupField`                | none                                                                | Kit extension — keep                                                                         |

## 2. Real gaps, ranked

### P1 — cheap compatibility fixes (do in one sweep)

1. **Missing `data-slot` on root/trigger/portal parts** (80 total). shadcn v4's
   styling contract is "every part carries `data-slot`"; the kit skips it on
   many Root/Trigger/Portal/Group wrappers: `dropdown-menu` (root, trigger,
   portal, group, radio-group, sub), `context-menu` (same set), `menubar`,
   `drawer` (root, trigger, portal, close), `hover-card`, `popover` (root,
   trigger). These are one-line additions with zero visual risk, and they make
   `in-data-[slot=…]`/`has-data-[slot=…]` selectors from upstream snippets work.
2. **Missing Portal exports**: `DropdownMenuPortal`, `ContextMenuPortal`,
   `MenubarPortal`. Trivial re-exports; needed for custom containers.
3. **`useCarousel`** — the hook exists internally; export it (upstream does;
   needed for custom prev/next UIs).
4. **`CalendarDayButton`** — upstream exports it for day-cell customization.

### P2 — missing parts consumers will actually hit

5. **Sidebar is the biggest functional gap.** Kit sidebar is a static rail
   (`collapsed` prop, 9 exports). Upstream is an app shell: `SidebarProvider`,
   `SidebarTrigger`, `SidebarInset`, `SidebarRail`, `SidebarMenuSub*`,
   `SidebarMenuBadge/Action/Skeleton`, `SidebarInput`, `SidebarSeparator`,
   cookie-persisted collapse, keyboard shortcut, mobile sheet mode. If apps are
   meant to build real layouts on this kit, port the provider/trigger/inset
   trio at minimum. (Figma models the rail only, so this is additive, not a
   parity break.)
6. **Combobox multi-select surface**: upstream has `ComboboxChips`,
   `ComboboxChip`, `ComboboxChipsInput`, `ComboboxValue`, `ComboboxTrigger`,
   `ComboboxCollection`, `useComboboxAnchor`. Kit only does single-select.
7. **`CommandDialog`** — the ⌘K palette-in-a-dialog composition everyone
   copy-pastes from shadcn docs.
8. **Item family**: `ItemGroup`, `ItemHeader`, `ItemFooter`, `ItemSeparator`
   missing (and upstream's `size` axis). Item is used as list scaffolding by
   other upstream snippets.
9. **`ButtonGroupSeparator`, `ButtonGroupText`** — needed for mixed toolbars.
10. **`AlertAction`** — upstream slot for a trailing button in alerts; kit has
    a close-icon boolean instead. Additive.
11. **`PopoverHeader/Title/Description`** — kit has none of the popover text
    scaffolding (upstream ships header/title/description with slots).
12. **`NavigationMenuPositioner`** — kit inlines the Base UI positioner inside
    Viewport; upstream exposes it (needed to control collision behavior).

### P3 — nice-to-have / naming

13. `accordion-trigger-icon` slot (upstream marks the chevron; useful for
    icon-swap styling), `empty-icon` slot, `resizable-panel` slot,
    `slider-range` (kit uses Base UI's `slider-indicator` name — pick one and
    document).
14. Shadow tokens don't exist — components use Tailwind `shadow-sm/md/lg`
    (10 files). Upstream does the same, so not a divergence, but it is a hole
    in the 3-layer token story (a brand can't theme elevation).
15. `AlertDialogClose` (kit-only) vs upstream `AlertDialogCancel` — if §1's
    prop-driven API stays, consider aliasing `AlertDialogCancel = AlertDialogClose`
    for copy-paste compat.

## 3. Storybook conformance (details in docs/storybook-conventions.md sweep)

Automated QA-checklist scan of all 57 story files: **13/57 fully clean.**

- 22 metas missing `component:` → autodocs renders no props table (the exact
  bug fixed for tooltip in parity #44, present in 21 more files).
- 14 metas typed with `Meta<…>` annotation instead of `satisfies Meta`.
- 7 components with a `disabled` control but no `Disabled` story: button,
  date-picker, link, search, time-input, toggle, toggle-group.
- `tooltip` has no `Playground` story (has `TooltipBox`/`TooltipIconPlayground`).
- Presence toggles without a paired gated content control where one is
  meaningful: `alert` (hasDescription/showCloseIcon), `textarea` (showCounter
  gates nothing), `card`/`item`/`data-table` (showAction), etc. Menus'
  hardcoded-children toggles are exempt per conventions.
- 1/57 stories carries a docs description; MAPPING.md one-liners could populate
  `parameters.docs.description.component` mechanically.

## 4. Recommended order of work

1. P1 sweep (slots + portal exports + 2 exports) — ~1 focused pass, no risk.
2. Storybook conformance fixes (§3) — mechanical, big autodocs payoff.
3. P2 items as backlog, sidebar first if product apps need real shells.
4. Add §1 table to MAPPING.md so the divergences are contract, not accident.

## 5. Addendum — §3 fixed on `storybook-quality-and-brand-rename`

The Storybook conformance items were fixed in the same sweep that produced this
report (story-audit score 13/57 → 35/57 clean; every remaining flag is a
conventions-exempt case — hardcoded children behind presence toggles, or
composed-example icons):

- `component:` added to all 22 metas (docs-only `as React.ComponentType<…>`
  association where StoryProps is a wrapper type).
- `satisfies Meta` conversion in 16 files (checkbox-button-group intentionally
  stays annotation-typed: its group props require `children`, which the render
  supplies).
- `Disabled` stories added: button, date-picker, link, search, time-input,
  toggle, toggle-group.
- `tooltip` playground renamed to `Playground`.
- Gating: alert `descriptionText` now gates on `hasDescription`; textarea
  `maxLength` on `showCounter`.
- 51/57 stories now carry `parameters.docs.description.component`, sourced
  from the MAPPING.md one-liners (the 6 without are sub-part/story-only files
  with no MAPPING entry).

## 6. Addendum — §2 applied (same branch, follow-up sweep)

Re-run of the comparison after applying the fixes: **clean components 22 → 34,
missing exports 52 → 39, missing `data-slot`s 80 → 36.** What was done:

- **P1 (all):** `data-slot` wrappers on every existing Root/Trigger/Portal/Group/
  Sub/RadioGroup part (dropdown-menu, context-menu, menubar, drawer, hover-card,
  popover, navigation-menu-item, resizable-panel, combobox group/separator),
  indicator slots on menu checkbox/radio items, `accordion-trigger-icon`,
  `progress-label`/`progress-value`; exported `DropdownMenuPortal`,
  `ContextMenuPortal`, `MenubarPortal`, `useCarousel`.
- **P2/P3 additive parts:** `ButtonGroupSeparator` + `ButtonGroupText`,
  `ItemGroup`/`ItemHeader`/`ItemFooter`/`ItemSeparator`, styled
  `PopoverHeader`/`PopoverTitle`/`PopoverDescription`, `alert-action` slot on
  Alert's `action` prop, `CommandDialog` (⌘K pattern), `AlertDialogCancel`
  compat alias. New parts covered by stories (button-group
  `WithTextAndSeparator`, item `Grouped`, command `Palette`, popover playground).
- **Documented, not changed:** the §1 divergence table now lives in MAPPING.md
  ("shadcn divergence contract") so it's contract, not accident.

**Backlog, second sweep — all four items shipped** (clean components 34 → 36,
missing exports 39 → 15, missing slots 36 → 17):

- **Sidebar app-shell**: `SidebarProvider` (controlled/uncontrolled collapse,
  cookie persistence, ⌘/Ctrl+B), `SidebarTrigger`, `SidebarRail`,
  `SidebarInset`, `SidebarInput`, `SidebarSeparator`, `SidebarGroupContent/
Action`, `SidebarMenuAction/Badge/Skeleton`, `SidebarMenuSub/SubItem/
SubButton`. The existing Figma-driven `Sidebar collapsed` prop still works
  standalone; it reads the provider only when the prop is unset. No mobile
  sheet mode yet. New `AppShell` story.
- **Combobox multi-select + select-surface**: `ComboboxChips/Chip/ChipsInput`
  (first consumer of the previously-dead `--ds-chip-*` token group),
  `ComboboxValue/Clear/Trigger/Label/Collection`, `useComboboxAnchor`. New
  `Multiple` story.
- **`CalendarDayButton`**: pass-through `components.DayButton` override —
  styling stays on the Calendar's `classNames`, so Figma visual parity is
  untouched; consumers get the extension point.
- **`NavigationMenuPositioner`**: alias of `NavigationMenuViewport` (same
  composition, upstream name); also fixed `side`/`align` being typed but never
  forwarded to the Base UI Positioner.

**What remains is the documented divergence contract, not gaps:** prop-driven
AlertDialog/Avatar/Progress/Alert-action APIs, `empty-media`/`slider-indicator`
slot naming, hover-card's inline portal, and shadcn's fixed-layout sidebar
internals (`sidebar-container/gap/inner`) that the kit's simpler static rail
doesn't need.
