# Learnings — implement-figma-component

Accumulated discoveries from each component implementation run.
Read this file at the start of every run. Append new discoveries at the bottom.

---

## Breadcrumb — 2026-06-14

### Discovery: Compound components need a different pattern than CVA
**Category:** mapping
**Rule:** When the Figma component set has only `Variant=default` and no enum/boolean/size properties, build a compound component with multiple exported sub-components (e.g., `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`). Story controls expose text labels and boolean toggles for optional structural elements — not CVA variants.
**Why:** The Breadcrumb Figma component set had a single variant with no configurable properties. Trying to force CVA would have been empty boilerplate.
**Applies to:** all compound/compositional components (Breadcrumb, likely Tabs, DropdownMenu, Dialog, etc.)

### Discovery: Some components have no dedicated Layer-3 tokens
**Category:** token
**Rule:** When no `--ds-<component>-*` tokens exist in `tokens.css`, use semantic Layer-2 color tokens directly (`--ds-color-content-tertiary`, `--ds-color-content-primary`, etc.) and reuse related component tokens for sizing (e.g., breadcrumb items reuse `--ds-button-size-xs-*` and `--ds-button-ghost-size-xs-*`). This is acceptable when the component is structurally composed of ghost-button-like elements.
**Why:** Breadcrumb had no `--ds-breadcrumb-*` tokens in the CSS. Its items are visually identical to ghost buttons at xs size.
**Applies to:** compound components that reuse existing component patterns for their parts

### Discovery: Inner label-wrapper spans with padding tokens must be preserved
**Category:** validation
**Rule:** When the Figma design context shows a `label-wrapper` inner div/span with its own padding token (`button/size/xs/labelWrapperPaddingX`), create a matching inner `<span>` element in the React component. Without it, text padding won't match Figma.
**Why:** Breadcrumb links in Figma have `label-wrapper` → `paddingX: 6px` inside the link element. Omitting the inner span would lose 6px of padding on each side.
**Applies to:** any component whose Figma structure has inner wrapper layers with separate padding tokens

### Discovery: Chrome MCP may be unavailable — use computer-use fallback
**Category:** tooling
**Rule:** If `tabs_context_mcp` returns "not connected", fall back to: (1) `open -a "Google Chrome" <url>` via Bash, (2) `mcp__computer-use__request_access` for Chrome (read-only tier), (3) `mcp__computer-use__screenshot` + `zoom` for visual verification. Don't block on Chrome MCP being unavailable.
**Why:** Chrome MCP extension was disconnected during Breadcrumb session. Computer-use provided sufficient read-only visual verification.
**Applies to:** all components (tooling pattern)

### Discovery: Verify Storybook story registration via index.json
**Category:** tooling
**Rule:** Before attempting visual verification, confirm stories are registered: `curl -s http://localhost:6006/index.json | python3 -c "import json,sys; d=json.load(sys.stdin); [print(k) for k in d.get('entries',{}).keys() if '<name>' in k.lower()]"`. This catches story file issues before opening the browser.
**Why:** Faster feedback loop than opening Chrome and finding a blank story.
**Applies to:** all components (tooling pattern)

### Discovery: Storybook may already be running on port 6006
**Category:** tooling
**Rule:** Always check `curl -s -o /dev/null -w "%{http_code}" http://localhost:6006` before starting Storybook. If it returns 200, skip the start step. If you try to start on a taken port, Storybook prompts interactively for a new port, which blocks the terminal.
**Why:** During Breadcrumb session, `npm run storybook` hung waiting for interactive port-change confirmation because 6006 was already in use.
**Applies to:** all components (tooling pattern)

### Discovery: tsc type-check errors from node_modules are pre-existing
**Category:** tooling
**Rule:** Running `npx tsc --noEmit` on component files will produce errors from `node_modules` (Next.js, Storybook, MDX type issues due to moduleResolution settings). These are pre-existing and not caused by the component code. Don't block on them — verify via Storybook rendering instead.
**Why:** Breadcrumb tsc check showed ~20 errors, all from node_modules, none from the component files.
**Applies to:** all components (tooling pattern)

---

## Breadcrumb (controls enhancement) — 2026-06-14

### Discovery: Drive Storybook control states via URL args when Chrome is read-only
**Category:** tooling
**Rule:** computer-use grants Chrome at read-only tier, so you cannot click controls to test states. Instead, drive state through the story `args` URL: `http://localhost:6006/?path=/story/<id>&args=key:value;key2:value2` (semicolon-separated, colon between key/value). Better still, add preset stories that lock specific `args`, then `open` each and screenshot. This verifies every control combination without any clicks.
**Why:** Needed to verify breadcrumb collapse + separator states but could not interact with the controls panel. Dedicated preset stories (Collapsed, SlashSeparator) made each state a stable URL.
**Applies to:** all components (tooling pattern)

### Discovery: Overflow/collapse components get a dynamic story API (MUI/Ant model)
**Category:** story
**Rule:** For components that can overflow and collapse (breadcrumb, pagination, tabs, tag lists), don't hardcode a fixed number of children in the story. Expose a numeric `itemCount` plus the industry-standard collapse model — `maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse` — and build the visible nodes in a helper that inserts an ellipsis when `itemCount > maxItems && before + after < itemCount`. Generate labels from a realistic pool array. This makes the controls behave like a real component API rather than a static snapshot.
**Why:** A breadcrumb with only `item1Label`/`item2Label` controls couldn't demonstrate collapse behaviour. The MUI/Ant `maxItems` model is the de-facto industry standard and reads clearly to a designer sliding `itemCount`.
**Applies to:** components with overflow/collapse behaviour

### Discovery: Use `range` controls for numeric props and `table.category` to group them
**Category:** story
**Rule:** Numeric props (counts, thresholds) use `control: { type: 'range', min, max, step }` — a slider is far more legible to a designer than a number field. Group related controls into labelled, collapsible sections with `table: { category: '...' }` (e.g., 'Content' vs 'Collapse'). Storybook renders one collapsible header per category.
**Why:** The breadcrumb story has 6 controls across two concerns (content vs collapse); grouping + sliders made the panel self-explanatory.
**Applies to:** all components (story pattern)

### Discovery: Separator/glyph swaps are story-only helpers, not Figma props
**Category:** mapping
**Rule:** Offering separator variants (chevron vs slash) is an accepted story-only convenience even when Figma ships a single separator. Default the control to the Figma glyph (chevron) so the default story stays 1:1. Render alternates through the existing separator slot (`<BreadcrumbSeparator>{glyph}</BreadcrumbSeparator>`), sizing text glyphs with the same typography token as the labels.
**Why:** Industry breadcrumbs expose a separator choice; adding it as a story helper improves the playground without violating the Figma contract (default stays chevron).
**Applies to:** components with a configurable separator/divider slot

---

## Library-wide story refinement pass — 2026-06-14

### Discovery: Every component story gets a canonical `Playground` as its first export
**Category:** story
**Rule:** The first story export must be `export const Playground: Story = {}` — an empty story that inherits meta `args`/`render` so all controls are active. This is the "Figma property panel" entry point. Don't name the interactive story `Default`/`Rest`/`Badge`/etc.; add `Playground` first and keep the semantic state stories after it. Components with two distinct sub-components (e.g. Tooltip box vs icon) may have two playgrounds instead.
**Why:** Across 20 stories, 12 lacked a `Playground` and used inconsistent first-story names (Tabs even had a story mislabeled `Badge`). A uniform `Playground` makes the library predictable.
**Applies to:** all components (story pattern)

### Discovery: Destructure story-only args before spreading onto the component
**Category:** story
**Rule:** When a story's `StoryProps` adds story-only fields (text labels, `showX` toggles, nested-instance configs), never do `<Component {...args}>` in a secondary story's render — it leaks invalid props onto the DOM/component. Destructure the real component props (e.g. `({ filled }) => <Card filled={filled}>`), or route everything through the meta `render`. Watch this especially when upgrading a thin story (one CVA prop) into a rich compositional Playground.
**Why:** After giving Card/Tabs rich `StoryProps`, the pre-existing `Unfilled`/`Vertical` stories still spread `{...args}` onto the component and would have leaked `title`/`tabCount`/etc.
**Applies to:** all components (story pattern)

### Discovery: Use `if: { arg: 'flag' }` to hide controls that don't apply
**Category:** story
**Rule:** Gate dependent controls with `if: { arg: 'someBoolean' }` so they disappear when irrelevant (e.g. hide all `actionButton*` controls unless `showButton` is true; hide `secondLineLabel` unless `hasSecondLine`). Keeps the panel clean and mirrors how Figma hides nested props when a slot is off. Pair with `table: { category: 'Nested: <X>' }` grouping.
**Why:** Alert and CheckboxButtonGroup already used this well; codifying it so every composite component does the same.
**Applies to:** components with optional slots / nested instances

### Discovery: Compositional components get a Playground that builds the composition from controls
**Category:** story
**Rule:** For compound components (Card, Dialog, Tabs, Breadcrumb, Accordion), the Playground exposes the structural slots as story-only args — text overrides for each region, `showX` booleans for optional regions, and nested-instance props (e.g. `triggerVariant`, `confirmVariant`) grouped under `table: { category: 'Nested: <Slot>' }`. The render assembles the sub-components from those args. This makes a single-variant Figma component still feel like a full API in the controls panel.
**Why:** Card previously exposed only `filled`; Dialog/Tabs had no Playground. Exposing slots + nested buttons made their panels genuinely useful.
**Applies to:** compound/compositional components

### Discovery: A story refactor can surface a real component bug — flag, don't silently fix
**Category:** validation
**Rule:** Building an exhaustive states matrix (e.g. checkbox Default/Error/Disabled × false/true/indeterminate) can reveal component bugs the per-state stories hid. When you spot one (checkbox indeterminate rendered a check instead of a minus because the indicator reads `props.checked`, undefined for uncontrolled `defaultChecked`+`indeterminate`), flag it as a separate task rather than changing component behaviour inside a story-only pass.
**Why:** The AllStates matrix exposed the indeterminate icon bug; fixing component logic was out of scope for a stories refinement and would change runtime behaviour without approval.
**Applies to:** all components (validation pattern)

### Discovery: Base UI state-indicators read state via the `render` prop, never `props.checked`
**Category:** token
**Rule:** For Base UI `Checkbox.Indicator` (and similar state indicators), do NOT branch on `props.checked` from the component's own props — it is `undefined` for uncontrolled (`defaultChecked`) usage, so the wrong icon always renders. Instead: (1) drop `keepMounted` so the indicator only mounts when checked/indeterminate (otherwise the icon shows on the rest/unchecked state), and (2) use the `render={(indicatorProps, state) => <span {...indicatorProps}>{state.indeterminate ? <MinusIcon/> : <CheckIcon/>}</span>}` prop to read the real `state` (`state.checked`, `state.indeterminate`). The `render` callback signature is `(props, state)` and you MUST spread `props` onto the returned element.
**Why:** checkbox.tsx used `keepMounted` + `(props as {checked}).checked === "indeterminate"`, which made the check icon appear on the rest state and never showed the minus for indeterminate. The render-prop state is the only correct source of truth.
**Applies to:** Base UI checkbox / radio / switch indicators and any state-driven icon swap

### Discovery: The same indicator bug is copy-pasted across a component family — fix every copy
**Category:** validation
**Rule:** When you fix a primitive's indicator/state pattern (e.g. checkbox.tsx), grep the family for the same code (`keepMounted`, `props.checked`, the indicator block) and fix every occurrence. checkbox-button.tsx had an identical copy of the checkbox indicator bug. Search: `grep -rn "keepMounted\|).checked ===" src/components/ui`.
**Why:** Fixing only checkbox.tsx left checkbox-button.tsx (and potentially radio) with the same rest-state/indeterminate bug until the user re-reported it.
**Applies to:** any component family that shares a primitive pattern (checkbox / checkbox-button / radio)

### Discovery: Field labels carry a nested ⓘ tooltip-icon trigger in Figma — wire the existing TooltipIcon
**Category:** mapping
**Rule:** Figma field/group components (InputField, SelectField, TextareaField, RadioGroupField, CheckboxButtonGroup) render a "Label ⓘ" row — the ⓘ is the design system's `tooltip/icon` component (node 2077:3760), already implemented as `TooltipIcon` in tooltip.tsx. Expose it as an optional `tooltip?: React.ReactNode` prop on the field/group; when truthy, render `<TooltipProvider><TooltipIcon content={tooltip} /></TooltipProvider>` after the label (and after the mandatory `*`). In the story, expose `hasTooltip` (boolean) + `tooltipText` (text) under `table: { category: 'Nested: Tooltip' }` with `if: { arg: 'hasTooltip' }`, and pass `tooltip={hasTooltip ? tooltipText : undefined}`. Wrap in `TooltipProvider` inside the component so it works standalone in stories (nested providers are harmless).
**Why:** CheckboxButtonGroup's Figma label had the ⓘ tooltip trigger but the component omitted it. Reusing TooltipIcon kept it 1:1 with the design system instead of inventing a new icon.
**Applies to:** all field/group components with a label row. NOW APPLIED to InputField, SelectField, TextareaField, RadioGroupField, CheckboxButtonGroup — they all share an identical `{label && (<div className="flex items-center gap-1 h-4">…)}` block, so the same Edit propagates across files. Gotcha: radio-group.tsx did not `import * as React`, so adding `tooltip?: React.ReactNode` to its props required adding the React import (the JSX automatic runtime doesn't put `React` in scope for type references).

---

## CheckboxButton — match Figma button container (950:9032) — 2026-06-15

### Discovery: indeterminate is styled identically to checked (brand fill), not like unchecked
**Category:** token
**Rule:** In this DS, the checkbox `indeterminate` box uses the SAME brand fill/border as `checked` (`--ds-checkbox-checked` / `--ds-checkbox-checkedborder`), only the glyph differs (minus vs check). Base UI sets a separate `data-indeterminate` attribute (NOT `data-checked`), so every `data-checked:` style rule needs a parallel `data-indeterminate:` rule — fill, border, text color, hover, disabled, and the `data-[error]:data-checked:` error-fill override. Verify with the `checked=indeterminate` Figma variant via get_design_context before assuming indeterminate == unchecked.
**Why:** checkbox.tsx only styled `data-checked`, so indeterminate rendered a white box; Figma shows it brand-filled. Fixing the shared checkbox.tsx fixed both the standalone Checkbox and CheckboxButton.
**Applies to:** Base UI checkbox / any tri-state indicator

### Discovery: style a wrapper from a nested control's state with `has-[[data-*]]` / `group-has-[[data-*]]`
**Category:** token
**Rule:** A `<label>` wrapping a Base UI control can react to the control's state without JS. Use `has-[[data-checked]]:` / `has-[[data-indeterminate]]:` on the wrapper to restyle its own fill/border (e.g. CheckboxButton's container → `--ds-color-primary-muted` + brand border when checked). For a nested text element (not a direct sibling), `peer-data-checked:` does NOT reach it — the peer `~` combinator needs a sibling. Use the group pattern instead: wrapper has `group/cb`, descendant uses `group-has-[[data-checked]]/cb:[color:…]`. For an error override that must beat the checked rule, rely on specificity: `data-[error]:has-[[data-checked]]:…` (class + [data-error] + :has = higher than plain `has-[[data-checked]]:…`), so no Tailwind source-order gambling.
**Why:** CheckboxButton's container never restyled on checked, and its label color used a broken `peer-data-checked:` (the span is nested in a sibling div, so the peer combinator never matched).
**Applies to:** checkbox-button, radio-button, chip, any "selectable card" wrapping a control

### Discovery: composite controls should reuse the atomic primitive, not re-implement the Root
**Category:** token
**Rule:** CheckboxButton was duplicating the entire `CheckboxPrimitive.Root` block (fill/border/checked/error/indicator). Re-render the shared `Checkbox` (`import { Checkbox } from "./checkbox"`) instead — it inherits every fix (indicator render-prop, indeterminate fill, error states) for free and stays in sync. Type the wrapper props via `Omit<React.ComponentProps<typeof Checkbox>, "children">` so `error`, `checked`, `defaultChecked`, `indeterminate`, `disabled` all pass through.
**Why:** The duplicated Root had drifted — it lacked error-state styling and the indeterminate fill, and had the rest-state/indeterminate indicator bug. Reusing the primitive eliminated the drift.
**Applies to:** any component that embeds another DS primitive (checkbox-button, radio-group items, select items)

### Discovery: a nested control should not show its own :hover inside a hoverable wrapper
**Category:** token
**Rule:** When a primitive (checkbox/radio) is embedded in a hoverable container (CheckboxButton, RadioButton, selectable card), the inner control's own `:hover` styles fire whenever the pointer is over it, double-reacting alongside the container. Give the primitive a `disableHover?: boolean` prop that gates ALL its hover utilities (`hover:`, `data-checked:hover:`, `data-[error]:hover:`, etc.) behind `!disableHover && [ ...hoverClasses ]` in the `cn()` call, and pass `disableHover={variant !== "standalone"}` from the wrapper. Standalone usage keeps hover (the box is the interactive element); inside a button only the container's `hover:` rules apply. Group the hover utilities into one conditional array rather than scattering them, so the toggle is a single switch.
**Why:** Hovering a CheckboxButton restyled the nested box too; the user wanted only the container to show hover. clsx treats `false && [...]` as empty, so gating the array cleanly removes every hover rule.
**Applies to:** checkbox-button, radio-button, chip, any control embedded in a hoverable container

---

## Data table + parts (2225:12619) — 2026-06-15

### Discovery: build a nested system bottom-up after mapping the whole page
**Category:** mapping
**Rule:** For a component made of many sub-components (data table = title, header, header-decoration, sorting-icons, cell, form-cell, row), don't start from the top instance — it's often just an empty `{children}` slot. First enumerate the page's component sets via `figma_execute` (walk page children, collect COMPONENT/COMPONENT_SET that aren't variants), dump every set's `componentPropertyDefinitions` in one call to get all variant props/booleans/slots at once, then build leaves → composites (sorting-icons → decoration → header → header-row; cell/form-cell → row → table).
**Why:** The "Data table" node was an empty container; the real parts were 11 separate sets on the same page. One `componentPropertyDefinitions` dump replaced ~11 design-context calls for the prop surface.
**Applies to:** any multi-part / nested component system

### Discovery: get_design_context times out on large component sets — inspect variants directly
**Category:** tooling
**Rule:** `get_design_context` on a big set (25-variant cell, 5-variant row with nested cells) times out (-32001). Instead: (1) `figma_execute` to list `set.children` (variant id+name) and read one variant's layout (`layoutMode`, padding array, `itemSpacing`, fills, bound variables); (2) call `get_design_context` on a SINGLE representative variant node id for the exact token bindings. Single-variant contexts return fast and include the real `var(--token)` names.
**Why:** The cell and row sets timed out; per-variant fetches (e.g. actions-icon 1227:14350, file 2225:12519) returned full detail instantly.
**Applies to:** any component set with many/heavy variants

### Discovery: Figma SLOT properties → compound container components
**Category:** mapping
**Rule:** A component prop of type `SLOT` (e.g. `table-row-container`, `table-header-container`, `data-table-container`) means the component is a layout wrapper you fill with children. Build it as a thin compound container (`<TableRow>`, `<TableHeaderRow>`, `<DataTable>`) that applies the wrapper's bg/padding/variant and renders `{children}`, rather than a CVA leaf.
**Why:** Row/header-row/table were all single-variant SLOT wrappers; the content is composed by the consumer from cells/headers.
**Applies to:** any Figma component whose property panel shows a SLOT

### Discovery: a "type" enum cell with 13 branches is a switch, not a CVA
**Category:** story
**Rule:** When one variant axis (cell `Type`: text/link/diff/badge/checkbox/actions/file/input/…) changes the entire content rather than just styling, implement it as a `switch (type)` returning different JSX (reusing Badge/Button/Checkbox/Input), not a CVA with 13 class-strings. Keep `alignment` (justify/text-align) and per-type container padding as the only CVA-ish bits. Expose nested config (badgeColor, fileName, actionLabel) grouped by `table.category` in the story.
**Why:** The cell's 13 types each render a different primitive; CVA only suits axes that vary styling on the same markup.
**Applies to:** "kind"/"type" enums that swap content wholesale (cells, list items, media objects)
