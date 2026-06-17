---
name: implement-figma-component
description: Implement a Figma component as a React component with Storybook story, matching the Figma component set 1:1. Reads Figma designs, builds CVA component + story, validates visually, then self-improves by appending learnings.
---

<!-- v1.3 — initial + Breadcrumb + library-wide story refinement + Phase 1.5 user-driven control scope -->

# Implement Figma Component in Storybook with 1:1 Validation Loop

## Context
You are building components for Kraken UI Kit (JIT DS 2.0), a shadcn-based design system with a 3-layer token architecture (global → semantic → component). The code lives in `~/Downloads/kraken-ui-kit`.
**Stack:** Next.js 16 / React 19 / Tailwind v4 / Base UI / CVA / Storybook 10 (nextjs-vite).
**Source of truth:** Figma file `es0hWOiLEplsUrpR3EkBOK` (accessible via Figma Console MCP and Figma Dev Mode MCP). Every component must match its Figma component set's properties 1:1.

---

## CRITICAL: Read Learnings First

Before starting any implementation, **always read** the learnings file at:
```
.claude/skills/implement-figma-component/learnings.md
```
This file accumulates discoveries from every prior run. Apply all applicable rules from it before proceeding. If the file doesn't exist yet, skip this step.

---

## The Task
Implement the requested component and its nested elements with a Storybook story whose controls panel is a 1:1 mirror of the Figma component set's property panel. Every Figma property must appear as a Storybook arg/control — same name, same options, same defaults. Nested component instances must expose their child props through the parent's Storybook args.

---

## Step-by-step

### Phase 1 — Read Figma Designs (Do this before writing ANY code)
Use the **Figma Dev Mode MCP** tools in this order:

**1a. Get a screenshot of the component set for visual reference:**
```
get_screenshot(nodeId: "<NODE_ID>")
```
Study the screenshot carefully — note all visible states, sizes, and nested elements.

**1b. Get the full design context including generated code hints:**
```
get_design_context(
  nodeId: "<NODE_ID>",
  artifactType: "REUSABLE_COMPONENT",
  clientFrameworks: "react",
  clientLanguages: "typescript"
)
```
Extract from the response:
- All variant properties: name, type (enum / boolean / instance-swap / text), all option values, and the default value
- Nested instances: for each instance-swap or embedded component, note its own properties (recurse one level deep)
- Visual tokens: which `--ds-<component>-*` CSS variables drive fills, borders, text, spacing, radius per variant

**1c. Get variable/token definitions for the node:**
```
get_variable_defs(nodeId: "<NODE_ID>", clientFrameworks: "react")
```
Map every token to the Layer-3 `--ds-<component>-*` CSS variable it corresponds to.

**1d. Get metadata for structural overview (if the design context is too large):**
```
get_metadata(nodeId: "<NODE_ID>")
```
Use this to understand the layer tree: which layers are instances, which are text overrides, which are hidden.

> **Stop here before writing code.** Produce a written summary of:
> - Every Figma property found (name, type, values, default)
> - Every nested instance and its exposed properties
> - The token map (Figma variable → CSS custom property → usage)
> - Whether this is a **CVA component** (has variant/size axes) or a **compound component** (single variant, compositional sub-components)

---

### Phase 1.5 — Define Storybook Controls (ask the user, then list every control)

After Phase 1 has revealed the component's real property surface, and **before writing any code**, pause and **ask the user what they want to be able to control in the Storybook controls panel.**

Use the `AskUserQuestion` tool. Frame the options around the component's actual axes, for example:

- Variant / appearance / color / size enums
- Boolean toggles (disabled, error, iconOnly, has*…)
- Text / content overrides (label, title, description)
- Icon / instance-swap slots
- Nested instance props (a Button inside a Card, a Badge inside a header…)
- Number / count props (items, max…)

Offer an "Everything" option and allow multi-select.

Then, based on the user's answer, produce an **exhaustive list of Storybook controllers (argTypes) to generate** — one row per control covering exactly what they asked for. For each controller specify:

- **name** — the label shown in the panel
- **control type** — `select` / `inline-radio` (enums), `boolean` (toggles), `text` (content), `range` (numbers), icon/component-picker `select` (instance-swap slots)
- **options** (for enums / pickers) and **default** (matching the Figma default exactly)
- **category** — `table: { category: '...' }` for grouping, especially nested-instance props

**Do NOT double-check or re-confirm the controller list with the user — just prepare the full set of options and proceed to develop them** in Phase 4. The user states what they want once; generate everything needed to honor it.

Use the same mapping the rest of Phase 2 / Phase 4 already use:

| Figma property | Storybook control |
|---|---|
| Variant / Size / Color / Appearance / Shape (enum) | `select` or `inline-radio` |
| Boolean (disabled, error, iconOnly, has*) | `boolean` |
| State (rest / hover / focus / active) | NOT a control (CSS-only); only `disabled` is a prop |
| Text override (label / title / description) | `text` |
| Instance-swap slot (icons, nested component) | `select` icon/component picker (`none` first) |
| Number / count | `range` slider |
| Nested instance props | same control + `table: { category: 'Nested: <Name>' }` |

This makes the eventual controls panel a 1:1 mirror of exactly the surface the user cares about.

---

### Phase 2 — Determine Component Type and Map Props

**Decision: CVA vs Compound component**

| Signal | Component type |
|---|---|
| Multiple variants in Figma component set (Variant, Size, Color axes) | **CVA component** — use `cva()` with variant keys |
| Single `Variant=default`, no enum/boolean props, structural sub-parts | **Compound component** — export multiple sub-components, story controls expose composition |

Follow these mapping conventions:

| Figma property | React / CVA | Notes |
|---|---|---|
| Variant (enum) | `variant` CVA variant | Values are already lowercase-kebab in Figma. Map `primary → default` for shadcn if needed, or keep 1:1. |
| Size (enum: xs\|sm\|md\|lg) | `size` CVA variant | `md` = default in shadcn. |
| State (enum: rest\|hover\|focus\|active\|disabled) | CSS pseudo-states | **NOT a React prop.** Only `disabled` becomes a prop. Hover/focus/active = CSS `:hover/:focus-visible/:active`. |
| Boolean props (iconOnly, checked, hasTitle, showLabel, error) | boolean props | camelCase. |
| Color (enum) | `color` CVA variant | |
| Appearance / Skin (enum) | `appearance` / `skin` CVA variant | |
| Shape (enum) | `shape` CVA variant | |
| Instance-swap slots (left icon, right icon, nested component) | `ReactNode` props (`leftIcon`, `rightIcon`, etc.) | In Storybook: expose as a `select` control with icon/component picker. |
| Text overrides (label, title, description) | `children` or named `string` props | |

---

### Phase 3 — Build the Component (`.tsx`)

#### Pattern A: CVA Component
Follow the established pattern from `button.tsx` and `badge.tsx`:
```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  // base: consume local --<comp>-* CSS vars set by variants
  "...",
  {
    variants: {
      variant: { /* value: token-binding classes */ },
      size:    { /* value: dimension-token classes */ },
    },
    compoundVariants: [ /* cross-axis overrides */ ],
    defaultVariants: { /* match Figma defaults exactly */ },
  }
)
```

**Token binding pattern:** Each variant value sets local CSS vars pointing to Layer-3 `--ds-<component>-*` tokens, and the base class consumes them:
```
[--<shortname>-fill:var(--ds-<component>-<variant>-fill)]
[background-color:var(--<shortname>-fill)]
```

#### Pattern B: Compound Component (discovered: Breadcrumb)
When the Figma component set has only one variant and no configurable properties:
```tsx
import { cn } from "@/lib/utils"

function ComponentRoot({ className, ...props }: React.ComponentProps<"element">) {
  return <element data-slot="component" className={cn("...", className)} {...props} />
}

function ComponentPart({ className, ...props }: React.ComponentProps<"element">) {
  return <element data-slot="component-part" className={cn("...", className)} {...props} />
}

export { ComponentRoot, ComponentPart, ... }
```

#### Token usage rules
- Components with dedicated `--ds-<component>-*` tokens: use them via the local-var pattern
- Components WITHOUT dedicated Layer-3 tokens (discovered: Breadcrumb): use semantic Layer-2 tokens directly (`--ds-color-content-*`, `--ds-typography-*-*`) and reuse related component tokens (e.g., breadcrumb items reuse `--ds-button-size-xs-*` and `--ds-button-ghost-size-xs-*`)
- Never hardcode hex/rgb values
- Figma's inner `label-wrapper` spans with their own padding token must be preserved as inner `<span>` elements (discovered: Breadcrumb)

---

### Phase 4 — Build the Storybook Story (`.stories.tsx`)

#### For CVA Components:
```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { icons } from 'lucide-react'

type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : undefined
}

type StoryProps = React.ComponentProps<typeof Component> & {
  leftIconName?: IconName
  rightIconName?: IconName
}

const meta = {
  title: 'Components/<ComponentName>',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: [...VARIANTS] },
    size:    { control: 'inline-radio', options: [...SIZES] },
    disabled: { control: 'boolean' },
    leftIconName:  { control: 'select', options: ICON_OPTIONS, name: 'Left icon' },
    rightIconName: { control: 'select', options: ICON_OPTIONS, name: 'Right icon' },
    leftIcon:  { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },
  args: { /* defaults MUST match Figma defaults exactly */ },
  render: ({ leftIconName, rightIconName, ...args }: StoryProps) => (
    <Component
      {...args}
      leftIcon={renderIcon(leftIconName)}
      rightIcon={renderIcon(rightIconName)}
    />
  ),
} satisfies Meta<StoryProps>
```

#### For Compound Components (discovered: Breadcrumb):
```tsx
type StoryProps = {
  label1: string
  label2: string
  showOptionalPart: boolean
  // ... compositional controls
}

const meta = {
  title: 'Components/<ComponentName>',
  component: ComponentRoot,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label1: { control: 'text', name: 'Human-readable label' },
    showOptionalPart: { control: 'boolean', name: 'Show optional part' },
  },
  args: { /* defaults matching Figma's default composition */ },
  render: ({ label1, showOptionalPart, ...args }: StoryProps) => (
    <ComponentRoot>
      <ComponentPart>{label1}</ComponentPart>
      {showOptionalPart && <OptionalPart />}
    </ComponentRoot>
  ),
} satisfies Meta<StoryProps>
```

#### Required stories:
- `Playground` — all controls active (the "Figma property panel" experience)
- `AllVariants` or compositional variants — grid of all meaningful combinations
- Additional stories for key states/compositions

#### Nested Instance Props:
Group nested props using `table: { category: 'Nested: <InstanceName>' }` in `argTypes`. One level deep only.

---

### Phase 5 — Run Storybook and Verify

**5a. Start Storybook (if not already running):**
Check if already running first: `curl -s -o /dev/null -w "%{http_code}" http://localhost:6006`
If not running: `cd ~/Downloads/kraken-ui-kit && npm run storybook`

**5b. Verify story is registered:**
```bash
curl -s http://localhost:6006/index.json | python3 -c "import json,sys; d=json.load(sys.stdin); [print(k) for k in d.get('entries',{}).keys() if '<component>' in k.lower()]"
```

**5c. Open in browser for visual verification:**
Try Chrome MCP first (`navigate`). If Chrome MCP is unavailable (discovered: Breadcrumb), fall back to:
```bash
open -a "Google Chrome" "http://localhost:6006/?path=/story/components-<name>--playground"
```
Then use `mcp__computer-use__screenshot` + `mcp__computer-use__zoom` for visual verification. Chrome is granted at read-only tier via computer-use.

**5d. Compare against Figma screenshot:**
Fetch Figma screenshot with `get_screenshot(nodeId)` and compare side-by-side.

---

### Phase 6 — Visual Validation Dimensions

| Dimension | What to check |
|---|---|
| **Colors** | Fill, border, text — must match token values exactly. No hardcoded hex. |
| **Spacing** | Padding, gap, margin — must match Figma's spacing tokens. |
| **Typography** | Font size, weight, line-height, letter-spacing per size variant. |
| **Border radius** | Per size/variant axis. |
| **Icons** | Correct size, color, and position (left/right slot). |
| **States** | Hover, focus, active, disabled — verify CSS pseudo-state styling matches Figma. |
| **Nested components** | Correct child component renders at correct size/variant defaults. |
| **Shadow/elevation** | If the component has drop shadows, verify they match Figma's shadow tokens. |
| **Inner wrappers** | Label-wrapper spans with padding tokens must be preserved (discovered: Breadcrumb). |

---

### Phase 7 — Iterate Until 1:1

Fix and re-validate in a tight loop until all mismatches are resolved.

**Common failure modes:**

| Symptom | Likely cause |
|---|---|
| Color is close but not exact | Wrong token tier used (global instead of semantic/component) |
| Spacing is off by 2–4px | Missing padding on a wrapper div vs. the component root |
| Control missing from Storybook | Figma property not mapped in `argTypes` |
| Control has wrong options | `options` array doesn't match all Figma enum values |
| Default value is wrong | `args` object not aligned with Figma component's default variant |
| Nested prop doesn't work | `render` function not destructuring the nested arg and passing it down |
| State=hover doesn't style | CSS pseudo-class missing or overridden by Tailwind base |
| Text padding doesn't match Figma | Missing inner label-wrapper `<span>` with its own padding token (discovered: Breadcrumb) |
| No dedicated component tokens exist | Use semantic L2 tokens directly + reuse related component tokens like button sizing (discovered: Breadcrumb) |

---

### Phase 8 — Nested Instance Prop-Exposure Rules

**0. Compose the REAL existing component — never re-implement its markup.**
When a Figma component nests an instance of another design-system component (e.g. an Alert that contains a Button, a Card that contains a Badge, a header cell that contains a Checkbox), first check whether that component already exists in `src/components/ui/`. If it does, **import and render the actual component** inside the parent — do NOT copy its Tailwind/markup into the parent. This keeps a single source of truth: a later change to `button.tsx` automatically shows up everywhere Button is composed (Alert, Card, DataTable, Dialog…).

- Detect it from the Figma design context: a nested `INSTANCE` whose name matches an existing component (the generated code often emits a `function Button(...)`/`function Badge(...)` for the nested instance — that is your signal it's a real component, not bespoke markup).
- Match the Figma instance's variant/size props to the real component's props (e.g. Figma `button/secondary/sm` → `<Button variant="secondary" size="sm">`).
- If the existing component is missing a variant the Figma instance needs, extend the existing component (add the CVA variant) rather than forking a copy.
- If the component does NOT exist yet, build it as its own primitive first, then compose it (bottom-up — see the data-table learnings).

Then expose its props through the parent:

1. Identify all nested instances in the Figma component set that a user can configure
2. Expose each nested instance's properties as parent-level Storybook args, prefixed with the instance role name (`closeButtonVariant`, `headerBadgeColor`, etc.)
3. Group nested props using `table: { category: 'Nested: <InstanceName>' }` in `argTypes`
4. In the `render` function, destructure the nested args and pass them to the **imported** child component
5. **One level deep only** — grandchild props are NOT exposed

---

### Phase 9 — Self-Teaching: Update Learnings

After the component is verified, review the entire session and extract discoveries not already covered by this skill or the learnings file.

**9a. What to look for:**
- New Figma property types or mapping rules
- New CVA / Tailwind v4 / token patterns
- New `argTypes` control type rules
- New story wrapper/decorator requirements
- New common failure modes
- New Storybook CLI flags or workarounds
- New validation dimensions
- Corrected rules that turned out to be wrong

**9b. How to update:**
Append new discoveries to `.claude/skills/implement-figma-component/learnings.md` using this format:

```markdown
## [Component Name] — YYYY-MM-DD

### Discovery: [short title]
**Category:** [mapping | token | story | validation | tooling]
**Rule:** [the actionable rule]
**Why:** [what happened that revealed this]
**Applies to:** [all components | compound components | specific type]
```

**Rules for updating learnings:**
- Only add rules that will apply to at least one future component
- Don't add component-specific one-offs
- If a discovery contradicts an existing learning, update the existing one (mark as superseded with date)
- Keep learnings concise and actionable

---

## Verification Checklist

Complete all items before marking the component done:

**Figma → Code mapping**
- [ ] Every Figma property appears as a Storybook control with the same name, type, options, and default
- [ ] Figma `State` axis is NOT a control (CSS-only), except `disabled`
- [ ] All nested instance properties are exposed through the parent's args panel, grouped by instance
- [ ] Icon instance-swap slots use the lucide icon picker pattern

**Tokens**
- [ ] All color values come from `--ds-<component>-*` tokens or semantic `--ds-color-*` tokens (no hardcoded hex/rgb)
- [ ] Dimension values come from `--ds-<component>-size-*` tokens or reused component tokens (e.g., button sizing)
- [ ] Typography values come from `--ds-typography-*` tokens

**Visual validation (Storybook vs Figma screenshot)**
- [ ] Default/Playground story is pixel-accurate vs. Figma default variant
- [ ] All enum values render correctly when selected in the controls panel
- [ ] All size variants render correctly
- [ ] Nested instances render at correct defaults and respond to nested controls
- [ ] Hover, focus, active, and disabled states match Figma visually

**Self-teaching**
- [ ] Learnings file has been reviewed and updated with new discoveries
- [ ] No component-specific one-offs were added as general rules
- [ ] `Playground` story lets you configure everything from the controls panel (matches Figma 1:1)
- [ ] Component renders correctly in `npm run storybook` with no console errors

---

## Reference Files

| File | Purpose |
|---|---|
| `src/components/ui/button.tsx` | Template for CVA + token-binding pattern |
| `src/components/ui/button.stories.tsx` | Template for icon picker + Storybook controls |
| `src/components/ui/badge.tsx` | Template for multi-axis CVA (color × appearance × size × shape) |
| `src/components/ui/badge.stories.tsx` | Template for matrix stories |
| `src/components/ui/breadcrumb.tsx` | Template for compound component pattern (multiple sub-components) |
| `src/components/ui/breadcrumb.stories.tsx` | Template for compound component story (compositional controls) |
| `JIT-DS-2.0-naming-conventions.md` | Token path rules, CSS variable naming (`--ds-` prefix) |
| `JIT-DS-2.0-figma-shadcn-names.md` | Figma set → shadcn name + node ID mapping |

---

## Important Conventions

- **Token binding:** `[css-property:var(--ds-<component>-<path>)]` — never hardcode colors
- **CVA + local vars pattern:** variant sets `--<short>-fill`, base consumes `[background-color:var(--<short>-fill)]`
- **State mapping:** Figma `state=rest|hover|focus|active|disabled` → CSS only. Pin stories to `state=rest`. Only `disabled` is a React prop.
- **Size mapping:** Figma `xs|sm|md|lg` → code `xs|sm|md|lg` (shadcn default = our `md`)
- `iconOnly=true` → `size="icon"` in shadcn terms, but we keep `iconOnly` as a boolean prop
- `secondary` IS the outline variant — no separate `outline`
- No `link` variant on Button — Link and Link Button are separate components
- Form controls inherit Input tokens: checkbox/radio/select may alias `input/*` tokens
- **Compound components** (single Figma variant, compositional): export multiple sub-components, story controls expose text labels + structural toggles (discovered: Breadcrumb)
- **Token reuse:** when no dedicated `--ds-<component>-*` tokens exist, reuse related component tokens (e.g., breadcrumb → button ghost/xs tokens) + semantic color tokens (discovered: Breadcrumb)
- **Label wrappers:** preserve inner `<span>` elements with `labelWrapperPaddingX` when Figma has them (discovered: Breadcrumb)
- **Compose, don't copy (single source of truth):** when a Figma component nests an instance of an existing component (Button-in-Alert, Badge-in-Card, Checkbox-in-header), import and render the real component — never duplicate its markup — so edits to the child propagate to every parent. Extend the child's variants if needed; never fork a copy. See Phase 8 step 0.
