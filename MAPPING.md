# MAPPING.md — Figma ↔ Code

The bridge between **JIT DS 2.0** (Figma file `es0hWOiLEplsUrpR3EkBOK`) and this
repo. Every entry links straight to the **Figma node** and the **GitHub source
file**, with a one-line description. Inspecting a Figma component here yields the
real `.tsx` and the exact prop to set. Built for humans **and** AI agents (we're
on the Figma Professional plan, so this Markdown file replaces Code Connect
`.figma.tsx`).

**Link bases**
- Figma node: `https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=<id>` (node IDs below are written with `-`, e.g. `1854-52960`)
- GitHub source: `https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/<file>`

**Source of truth for names/IDs:** `JIT-DS-2.0-figma-shadcn-names.md` (design-audit
folder). **For code APIs:** the files under `src/components/ui/`. Regenerate/verify
with the `mapping-doctor` skill.

---

## How to read this file (conventions — read once)

These rules hold for **every** component, so the tables below don't repeat them:

1. **`State` axis → CSS, not a prop.** Figma sets carry a `State` axis
   (`rest | hover | focus | active`). In code these are pseudo-classes handled by
   the component's CSS — there is **no React prop**. Pin reconstructed examples to
   `state=rest`. The **only** state that is a prop is **`disabled`**.
2. **`iconOnly=true` ↔ icon-only semantics** — Button expresses it as the
   `iconOnly` prop; elsewhere render only an icon child.
3. **Figma variant values are already the exact code enum strings** — lowercase,
   1:1, no transform (Figma `variant=destructive` → `variant="destructive"`).
4. **Instance-swap (icons)** → a `lucide-react` icon passed as `leftIcon` /
   `rightIcon` / `icon` (or children). Figma icon-picker value = lucide icon name.
5. **Disambiguate duplicate Figma names by node ID** (see Part 4).
6. **Sub-parts are NOT separate files** — they compose into the parent's `.tsx`
   as exported parts (`dialog/header` → `DialogHeader` in `dialog.tsx`).

Brand/theme (`jit` ⇄ `randstadt`) and light/dark values are **not** props — they
cascade from `[data-theme]` on an ancestor via the token layer. Never hard-code.

---

## Part 1 — The v1 12 (full prop maps)

These mirror their Figma component API exactly and carry full Storybook controls.

### button — displays a button or a component that looks like a button; primary actions, form submits, dialog/menu triggers
[🎨 Figma `button` 1854:52960](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1854-52960) · [💻 button.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/button.tsx) · exports `Button`, `buttonVariants`

| Figma property | type | Code prop | Values |
|---|---|---|---|
| Variant | enum | `variant` | `primary` (default) · `secondary` · `tonal` · `ghost` · `destructive` · `destructive-secondary` · `destructive-ghost` |
| Size | enum | `size` | `xs` · `sm` · `md` (default) · `lg` |
| Icon only | bool | `iconOnly` | `true` / `false` |
| (left/right icon swap) | instance | `leftIcon` / `rightIcon` | lucide icon |
| State | axis | — (CSS) | `disabled` is the only prop |

> Button-size decision (was open): Figma `xs/sm/md/lg` already match the code
> strings 1:1 — **no mapping table needed**. `outline` is **not** a Button variant
> (`secondary` *is* the outline); `link` is its own component.

### badge — displays a badge or a component that looks like a badge; label/categorize items or show counts/status
[🎨 Figma `badge` 619:6877](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=619-6877) · [💻 badge.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/badge.tsx) · exports `Badge`, `badgeVariants`

| Figma property | Code prop | Values |
|---|---|---|
| Color | `color` | 8 colors |
| Appearance | `appearance` | `filled` · `outlined` · `ghost` |
| Size | `size` | `sm` · `md` (default) · `lg` |
| Shape | `shape` | `round` · `square` |
| left/right icon | `leftIcon` / `rightIcon` | lucide icon |

### input — displays a form input field; single-line text entry in forms
[🎨 Figma `input` 868:6657](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=868-6657) · [💻 input.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/input.tsx) · exports `Input`, **`InputField`** (wrapper to map to), `inputVariants`

| Figma property | Code prop (on `InputField`) | Values |
|---|---|---|
| Size | `size` | `sm` · `md` (default) · `lg` |
| (label) | `label` | string |
| (helper) | `description` | string |
| State=error | `errorMessage` | string (presence drives the error look) |
| Mandatory | `mandatory` | bool |
| left/right decoration | `leftDecoration` / `rightDecoration` | node / lucide icon |
| State | — (CSS) | `disabled` only |

### textarea — displays a form textarea; multi-line text entry (comments, notes)
[🎨 Figma `textarea` 1832:20037](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1832-20037) · [💻 textarea.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/textarea.tsx) · exports `Textarea`, **`TextareaField`**. Shares `--ds-input-*` tokens.

| Figma property | Code prop (on `TextareaField`) | Values |
|---|---|---|
| (label/helper) | `label` / `description` | string |
| State=error | `errorMessage` | string |
| Mandatory | `mandatory` | bool |
| (counter) | `showCounter` + `maxLength` | bool + number |

### select — displays a list of options to pick from, triggered by a button; single-choice selection in forms
[🎨 Figma `select` 1637:17676](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1637-17676) · [💻 select.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/select.tsx) · exports `Select`, **`SelectField`** (wrapper), `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectValue`, `SelectSeparator`

| Figma property | Code prop (on `SelectField`) | Values |
|---|---|---|
| Size | `size` | `sm` · `md` (default) · `lg` |
| (label/helper) | `label` / `description` | string |
| State=error | `errorMessage` | string |
| Mandatory | `mandatory` | bool |
| (placeholder) | `placeholder` | string |
| sub-parts `select/item`, `/group`, `/footer` | → `SelectItem` / `SelectGroup` / footer slot | compose |

### checkbox — a control that toggles between checked and not checked; opt-in/agree or multi-select lists
[🎨 Figma `checkbox` 1074:5701](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1074-5701) · [💻 checkbox.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/checkbox.tsx) · exports `Checkbox`

| Figma property | Code prop | Values |
|---|---|---|
| Checked | `checked` | `false` · `true` · `indeterminate` (`indeterminate` prop) |
| State=error | `error` | bool |
| State | — (CSS) | `disabled` only |

### radio-group — a set of checkable buttons where only one can be checked; choose one from a small visible set
[🎨 Figma `radio-group` 1104:10652](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1104-10652) · [💻 radio-group.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/radio-group.tsx) · exports `RadioGroup`, `RadioGroupItem`, **`RadioGroupField`** (wrapper). Figma [`radio-group/item` 1084:8168](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1084-8168), [`/item-labeled` 1084:7716](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1084-7716) → `RadioGroupItem`.

| Figma property | Code prop (on `RadioGroupField`) | Values |
|---|---|---|
| Direction | `direction` | `vertical` · `horizontal` |
| (label/helper) | `label` / `description` | string |
| State=error | `errorMessage` | string |
| Mandatory | `mandatory` | bool |

### switch — a control that toggles between checked and not checked; instant on/off settings (no submit)
[🎨 Figma `switch` 1814:16852](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1814-16852) · [💻 switch.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/switch.tsx) · exports `Switch`

| Figma property | Code prop | Values |
|---|---|---|
| Size | `size` | `default` · `compact` |
| Checked | `checked` / `defaultChecked` | bool |
| State=error | `error` | bool |
| left/right label | `leftLabel` / `rightLabel` | string |
| State | — (CSS) | `disabled` only |

### card — displays a card with header, content, and footer; group related content and actions into a surface
[🎨 Figma `card` 950:3279](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=950-3279) · [💻 card.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/card.tsx) · exports `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`, `cardVariants`

| Figma property | Code prop | Values |
|---|---|---|
| Filled | `filled` | `true` · `false` |

### alert — displays a callout for user attention; inline, non-blocking messages (info, success, warning, error)
[🎨 Figma `alert` 535:3894](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=535-3894) · [💻 alert.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/alert.tsx) · exports `Alert`, `AlertTitle`, `AlertDescription`, `alertVariants`

| Figma property | Code prop | Values |
|---|---|---|
| Type | `type` | `neutral` · `error` · `success` · `informational` · `warning` |
| (icon) | `icon` | lucide icon / bool |
| (dismiss) | `onClose` | handler (renders close affordance) |
| (action) | `action` | node (renders action Button) |

### dialog — a window overlaid on the primary window, content underneath inert; focused tasks/forms needing confirmation
[🎨 Figma `dialog` 1595:18496](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1595-18496) · [💻 dialog.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/dialog.tsx) · exports `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogOverlay`, `DialogPortal`. `dialog/header`, `/footer` → `DialogHeader` / `DialogFooter`.

| Figma property | Code prop | Values |
|---|---|---|
| (close button) | `showCloseButton` on `DialogContent` | bool |
| (title / subtitle) | `DialogTitle` / `DialogDescription` children | node |

### tabs — layered sections of content displayed one at a time; switch between related views in the same space
[🎨 Figma `tabs` 1825:18415](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1825-18415) · [💻 tabs.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/tabs.tsx) · exports `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`, `tabsTriggerVariants`

| Figma property | Code prop | Values |
|---|---|---|
| Variant | `variant` on `TabsList` | Figma `line` → `"line"` (default, underline strip) · Figma `default` → `"badge"` (pill/segmented, the "default" Figma variant maps to the `badge` code value) |
| Orientation | `orientation` on `Tabs` | `horizontal` · `vertical` |
| (disabled tab) | `disabled` on `TabsTrigger` | bool |
| (depth — code ext.) | `depth` on `TabsList` | `1` (default) · `2` — controls label scale; no Figma axis, intentional kit extension |

---

## Part 2 — Remaining parent components

Each maps 1:1 to one file. **Sub-parts compose into the parent file.** Conventions
from the top apply. Figma 🎨 and source 💻 are linked per row.

| Component | Figma node | Source | Description / key props |
|---|---|---|---|
| accordion | [🎨 492:2641](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=492-2641) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/accordion.tsx) | A vertically stacked set of interactive headings that each reveal a section of content; FAQs / progressive disclosure. `type="single\|multiple"`; `AccordionItem/Trigger/Content`. |
| alert-dialog | [🎨 674:2802](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=674-2802) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/alert-dialog.tsx) | A modal dialog that interrupts the user with important content and expects a response; destructive/irreversible confirmations. `AlertDialog` + `…Content/Overlay/Trigger/Close`. |
| avatar | [🎨 579:6117](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=579-6117) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/avatar.tsx) | An image element with a fallback for representing the user. `size`. Stack → `avatar-stack.tsx` ([🎨 605:6567](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=605-6567)). |
| breadcrumb | [🎨 684:1095](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=684-1095) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/breadcrumb.tsx) | Displays the path to the current resource using a hierarchy of links; navigation context in deep pages. `Breadcrumb/List/Item/Link/Page/Separator/Ellipsis`. |
| calendar | [🎨 897:4967](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=897-4967) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/calendar.tsx) | A date field component that allows users to select dates; standalone or inside date-picker. react-day-picker; `calendar/header`, `/day` compose. |
| carousel | [🎨 950:4516](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=950-4516) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/carousel.tsx) | A carousel with motion and swipe built using Embla; browse a set of images/cards. `orientation`. With-image variant [🎨 950:4542](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=950-4542). |
| combobox | [🎨 1292:5274](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1292-5274) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/combobox.tsx) | Autocomplete input with a list of suggestions (popover + command); searchable single-select over many options. `size`. (Figma "Select" set on dropdown-menu page — Part 4.) |
| command | [🎨 1134:17063](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1134-17063) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/command.tsx) | Fast, composable command menu; command palettes and quick search/launchers. `Command/Input/List/Empty/Group/Item/Shortcut`. Focused composition. |
| context-menu | [🎨 1134:17687](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1134-17687) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/context-menu.tsx) | Displays a menu of actions triggered by a right click; contextual actions on an item/row. Full surface; `Label` is a plain styled div. |
| date-picker | [🎨 895:1933](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=895-1933) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/date-picker.tsx) | A date picker component; pick a single date or range in forms. Composes `calendar` + `popover` + `button`. |
| drawer | [🎨 1627:895](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1627-895) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/drawer.tsx) | A panel that slides in from an edge of the screen; mobile sheets, filters, side forms. `side` (Dialog-based). `drawer/header`, `/footer` compose. |
| empty | [🎨 1686:7468](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1686-7468) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/empty.tsx) | A centred empty/zero-state — optional media, title, body, and action slot. Compound (shadcn-faithful): `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`. Media `variant`: `icon` (default) · `default`. `EmptyContent` is the action slot (composes real `Button`s). |
| dropdown-menu | [🎨 1049:6592](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1049-6592) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/dropdown-menu.tsx) | Displays a menu of actions or functions, triggered by a button; action/overflow menus. Full `DropdownMenu*` surface. `dropdown-menu/item`, `/group-label`, `/overflow`, `/decoration` compose. |
| hover-card | [🎨 1595:20118](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1595-20118) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/hover-card.tsx) | A card that previews a linked item on hover/focus. `HoverCard/Trigger/Content`. Surface = `--ds-color-popover`. |
| input-otp | [🎨 1698:13679](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1698-13679) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/input-otp.tsx) | Accessible one-time-password input with copy-paste; verification/2FA code entry. `size`; `input-otp` lib. |
| item | [🎨 1707:23695](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1707-23695) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/item.tsx) | A flexible, composable row for displaying content in a structured layout; list rows, option rows, settings entries. `variant`. `item/decoration-left\|right` compose. |
| kbd | [🎨 1719:48975](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1719-48975) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/kbd.tsx) | Keyboard shortcut display. `Kbd` renders one key; pair with `+` separator for combos. |
| menubar | [🎨 1696:13412](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1696-13412) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/menubar.tsx) | A horizontal bar of menus. `Menubar/Menu/Trigger/Content/Item/Separator/Group/Label/Sub/SubTrigger/SubContent`. |
| navigation-menu | [🎨 1696:13337](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1696-13337) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/navigation-menu.tsx) | A horizontal menu whose triggers reveal a shared floating panel. `NavigationMenu/List/Item/Trigger/Content/Link/Viewport/Indicator`. |
| pagination | [🎨 1760:679](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1760-679) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/pagination.tsx) | Pagination with page navigation, next and previous links; page through long lists/tables. `Pagination/Content/Item/Link/Previous/Next/Ellipsis`. |
| popover | [🎨 1762:1829](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1762-1829) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/popover.tsx) | Displays rich content in a portal, triggered by a button; small floating forms, info, pickers. `Popover/Trigger/Content/Close/Title/Description`. |
| progress | [🎨 1792:1815](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1792-1815) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/progress.tsx) | Rounded track + indicator with optional label row. `value` (0–100). `Progress`. |
| resizable | [🎨 1799:3154](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1799-3154) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/resizable.tsx) | Accessible resizable panel groups and layouts; split views and adjustable panes (`react-resizable-panels`). |
| separator | [🎨 449:1463](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=449-1463) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/separator.tsx) | Visually or semantically separates content; between sections, list items, toolbar groups. `orientation`. |
| skeleton | [🎨 1808:15417](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1808-15417) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/skeleton.tsx) | Muted, pulsing placeholder. `Skeleton` (set `className` for size). |
| sidebar | [🎨 1808:15231](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1808-15231) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/sidebar.tsx) | A composable, themeable sidebar component; primary app navigation. `Sidebar*` + `useSidebar`. `sidebar/item`, `/item-sub`, `/item-collapsed`, `/group-label` compose. |
| slider | [🎨 1811:15452](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1811-15452) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/slider.tsx) | An input where the user selects a value from within a given range; volume, ranges, numeric tuning. `slider/marker` composes. |
| sonner | [🎨 1813:16630](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1813-16630) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/sonner.tsx) | An opinionated toast component for React; transient success/error notifications. `Toaster` + `toast()`. |
| table | [🎨 1824:18395](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1824-18395) (cell), [header 1824:18391](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1824-18391) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/table.tsx) | A responsive table component; display rows/columns of data. `Table/Header/Body/Footer/Head/Row/Cell/Caption`. |
| toggle | [🎨 2010:3650](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=2010-3650) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/toggle.tsx) | A two-state button that can be either on or off; a single toggleable option (e.g. bold). `variant` + `size`. |
| toggle-group | [🎨 1429:3301](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1429-3301) (button), [icon 1429:14082](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1429-14082) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/toggle-group.tsx) | A set of two-state buttons that can be toggled on or off; segmented / multi-toggle controls. `ToggleGroup` (`type`, `size`) + `ToggleGroupItem`. |
| tooltip | [🎨 2115:1317](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=2115-1317) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/tooltip.tsx) | A popup that displays information when an element gets focus or is hovered; short hints on icons/controls. `Tooltip/Trigger/Content`. ⓘ trigger [🎨 2115:1280](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=2115-1280). |
| scroll-area | [🎨 1583:16330](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1583-16330) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/scroll-area.tsx) | Augments native scroll for custom, cross-browser styling; wrap scrollable regions with styled scrollbars. |

---

## Part 3 — Extensions (kit-specific; no stock shadcn 1:1)

| Component | Figma node | Source | Description / key props |
|---|---|---|---|
| link | [🎨 372:4599](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=372-4599) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/link.tsx) | A text hyperlink (the kit's answer to shadcn `variant=link`, since Button has none); inline navigation in text. `variant` + `size`. |
| link-button | [🎨 492:2073](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=492-2073) | [💻 link.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/link.tsx) | A hyperlink styled as a button (`LinkButton`); navigation that should look like a button. |
| search | [🎨 1134:13835](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1134-13835) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/search.tsx) | A search input specialization (an Input with a search affordance); filter lists/tables, global search. `size`. |
| time-input | [🎨 903:5961](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=903-5961) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/time-input.tsx) | A time field (native `type="time"` styled shell); enter a time of day. `size`. |
| checkbox-button | [🎨 950:9032](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=950-9032) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/checkbox-button.tsx) | A labeled checkbox control; when the checkbox needs an inline label/description. `variant` + `size`. Group: [🎨 1085:8757](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1085-8757). |
| radio-button | [🎨 1084:7716](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1084-7716) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/radio-button.tsx) | A labeled radio control; when the radio needs an inline label/description. `variant` + `size`. |
| button-group | — (composition) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/button-group.tsx) | A joined row of buttons that share borders; grouped related actions. `orientation`. |
| data-table | [🎨 see data-table/*](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1824-18395) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/data-table.tsx) | Composed data table. Also `data-table-header.tsx`, `data-table-cell.tsx`. |
| form-table | [🎨 1411:*](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1411-0) | [💻](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/form-table-cell.tsx) | Form control sized for a data-table cell (sm). `inputType` selects the control: `text field \| select \| search \| date \| switch \| checkbox \| radio \| textarea`. Reuses kit form primitives. v1.1. |
| specification-header | [🎨 430:1377](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=430-1377) | — | Internal doc template; not a code component. |

---

## Part 4 — Duplicate-name disambiguation (resolve by node ID)

Legacy `Menu`×2 and `Sorting icons`×2 are now distinct — match on **node ID**, not name:

| Display-name collision | node id | → resolves to |
|---|---|---|
| "Select" set on the **dropdown-menu** page | [1292:5274](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1292-5274) | `combobox` → [combobox.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/combobox.tsx) |
| "Dropdown" set on the **Select** page | [1637:17676](https://www.figma.com/design/es0hWOiLEplsUrpR3EkBOK/?node-id=1637-17676) | `select` → [select.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/select.tsx) |
| Sorting icons (data-table) | `data-table/sorting-icons` | composes into [data-table.tsx](https://github.com/ziolkowskiw/kraken-ui-kit/blob/main/src/components/ui/data-table.tsx) |
| Sorting icons (form-table) | `form-table/sorting-icons` | composes into the form-table family |

---

## Coverage

- **47 parent components mapped** (12 v1 with full prop maps + 35 others +
  extensions), each linked to its Figma node and `.tsx` source.
- **Sub-parts** (`dialog/footer`, `select/item`, `sidebar/item`, …) intentionally
  have **no** standalone file — they compose into the parent's exported parts.
- **Not mapped** (no design / not UI): Charts, Aspect ratio, Icons asset library,
  `specification-header` (internal template).

> Maintenance: when a Figma set is renamed or a node ID changes, run the
> `mapping-doctor` skill (Phase 7) to re-verify this file against the live Figma.
