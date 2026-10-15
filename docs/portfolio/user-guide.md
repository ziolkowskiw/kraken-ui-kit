# Kraken UI Kit — the complete user guide

Everything the kit contains and how to use each part of it. Written for anyone
picking the kit up cold: a developer consuming components, a designer changing
tokens in Figma, or an AI agent building UI with it.

**Stack:** Next.js 16 · React 19 · Tailwind v4 · Base UI · CVA · Storybook 10

---

## 1. What's inside

| Piece                   | What it is                                                                                           | Where                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 56 tokenized components | CVA-variant React components bound to `--ds-*` tokens, shadcn-parity APIs                            | `src/components/ui/`                |
| 835 design tokens       | 3-layer token system (global → semantic → component), exported from Figma                            | `tokens/` → `src/styles/tokens.css` |
| 2 brands                | `jit` (yellow, rounded, Moderat JIT) and `brand` (blue, sharp, Noto Sans), switched by one attribute | semantic token layer                |
| Storybook               | Every component's Figma property panel mirrored 1:1, with a live brand toggle                        | `npm run storybook` / hosted        |
| shadcn registry         | 60 installable items — components install into any app via `npx shadcn add @kraken/<name>`           | `registry.json`, GitHub Pages       |
| Figma↔code map          | Every Figma component node ID → its `.tsx` file + prop table (47 parent components)                  | `MAPPING.md`                        |
| Machine-readable layer  | Per-component JSON manifests + foundations + index, schema-validated, byte-diffed in CI              | `manifests/`                        |
| MCP server              | 6 tools that serve the manifests to any AI agent, local-only                                         | `mcp/`                              |
| 7 Claude skills         | Executable runbooks: token-sync, add-brand, add-component, drift-audit, mapping-doctor, and more     | `.claude/skills/`                   |
| 3 Claude agents         | figma-binder (mapping audit), parity-reviewer (Figma/shadcn parity), release (versioned releases)    | `.claude/agents/`                   |

## 2. Run it locally

```bash
npm install
npm run tokens:build   # rebuild src/styles/tokens.css from tokens/
npm run dev            # showcase app at http://localhost:3000 (brand toggle top-right)
npm run storybook      # component explorer at :6006 (Brand toggle in the toolbar)
```

Hosted, no install needed:

- Storybook: <https://ziolkowskiw.github.io/kraken-ui-kit/storybook/>
- Registry: <https://ziolkowskiw.github.io/kraken-ui-kit/r/>

## 3. Install components into your own app

The kit distributes through a shadcn registry hosted on GitHub Pages — no npm
package. Point your app's `components.json` at the registry once:

```jsonc
// components.json
"registries": {
  "@kraken": "https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json"
}
```

Then bootstrap the theme and pull whatever you need:

```bash
npx shadcn add @kraken/theme     # tokens + theme CSS (pulls the tokens item automatically)
npx shadcn add @kraken/button    # any component — arrives tokenized and brand-switchable
```

Internal dependencies are namespaced (`@kraken/*`), so installing `dialog`
brings its dependencies along. What lands in your app contains **zero hex or px
literals** — everything resolves through `--ds-*` custom properties.

## 4. Use the components

### APIs follow shadcn verbatim

Names, props, and variant enums match shadcn, so shadcn muscle memory (and
shadcn-trained AI models) work unchanged. The deliberate divergences are
documented in `manifests/foundations.json → shadcnDivergences`; the two you'll
hit first:

- Button variants are `primary | secondary | tonal | ghost | destructive | destructive-secondary | destructive-ghost`.
  There is **no `outline`** — `secondary` is the outline style. shadcn's `default` maps to `primary`.
- Alert takes `type`, not `variant`.

### The four usage rules

1. **Never hardcode a color, spacing, radius, or font value.** Everything is a
   `--ds-*` token (see §5). If a value seems missing, it lives at another layer.
2. **State is CSS, never a prop.** Hover, focus, and active are pseudo-classes;
   the only state prop is `disabled`.
3. **Form inputs go through `*Field` wrappers** — `InputField`, `TextareaField`,
   `SelectField`, `RadioGroupField` add `label` / `description` / `errorMessage`
   / `mandatory` around the bare control.
4. **Icons are lucide-react components passed as props** — `leftIcon`,
   `rightIcon`, `icon` (or children). Never baked into a component.

```tsx
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

<Button variant="destructive" leftIcon={Trash2}>Delete</Button>
<InputField label="Email" mandatory errorMessage="Required" />
```

### Looking up a component's exact API

Three equivalent sources, all generated from the same code:

- **Storybook** — interactive, mirrors the Figma property panel 1:1.
- **`docs/components/<name>.md`** — human-readable prop/variant/token tables.
- **`manifests/components/<name>.json`** — the machine-readable truth: variant
  enums, defaults, props, consumed tokens, a11y notes, usage do/don't.

## 5. Design tokens

Every visual value is a `--ds-*` custom property in a strict 3-layer cascade.
Each layer only references the layer below:

```
L3 component   --ds-button-primary-fill   →   L2 semantic   --ds-color-primary   →   L1 global   --ds-color-jit-400
(per-component knobs)                         (shadcn names, varies per brand)       (raw primitive ramps)
```

- **L1 global** — primitive ramps and scales (`--ds-color-jit-400`,
  `--ds-spacing-16`). Never bind component styles here.
- **L2 semantic** — shadcn-named roles (`--ds-color-primary`,
  `--ds-color-border-focus`). **The only layer that changes per brand.**
- **L3 component** — per-component knobs (`--ds-button-primary-fillhover`).
  What components actually consume.

shadcn's own variables (`--primary`, `--background`, …) are re-pointed at the
`--ds-*` layer in the theme CSS, so plain Tailwind classes like `bg-primary`
theme correctly too.

Naming rule: `--ds-` + the Figma token path, slashes → dashes, lowercased
(`button/primary/fill` → `--ds-button-primary-fill`). Scales and roles are
listed in `manifests/tokens.json` and `manifests/foundations.json`.

## 6. Brand switching

Set one attribute; the whole tree re-resolves. No component or app code
changes, ever:

```html
<html>
  <!-- jit (default): yellow #FFD242, rounded, Moderat JIT -->
  <html data-theme="brand">
    <!-- brand: blue #298EE5, sharp corners, Noto Sans -->
  </html>
</html>
```

Because only the semantic layer varies per brand, `data-theme` works on any
ancestor — you can theme a single subtree. Font behavior per brand (and the
fallback stack for consumers without Moderat JIT) is documented in
[`docs/font-strategy.md`](../font-strategy.md).

## 7. The token pipeline (Figma → JSON → CSS)

Tokens flow one way. You never hand-edit token CSS.

| Step | What happens                                                            | Command / tool                          | Needs Figma? |
| ---- | ----------------------------------------------------------------------- | --------------------------------------- | ------------ |
| 1    | Export Figma variables → `tokens/tokens.dtcg.json` (+ `tokens.raw.css`) | `token-sync` skill (Claude + Figma MCP) | yes          |
| 2    | Build the final cascade-correct stylesheet → `src/styles/tokens.css`    | `npm run tokens:build`                  | no           |

The canonical token file is **W3C DTCG format** — the industry-standard token
JSON (the same open format tools like Tokens Studio speak), with alias chains
preserved. Full guide: [`docs/token-pipeline.md`](../token-pipeline.md).

## 8. Add a new brand

Themes are authored **in Figma, not in code**. The `add-brand` skill runs the
whole ritual end-to-end:

1. Add a mode to the `semantic` variable collection in the Figma file and
   design the brand there (only semantic values — primitives and component
   tokens don't change).
2. Run the `token-sync` skill, then `npm run tokens:build`.
3. The brand is live as `<html data-theme="<mode>">`. Verify with the brand
   toggle in the showcase or Storybook.

## 9. The AI layer

The kit is built to be consumed by AI agents as a first-class audience.

### Machine-readable manifests

`manifests/` is the ground truth an agent should answer from instead of
guessing:

- `foundations.json` — token architecture, brand contract, core principles,
  install info, shadcn divergences. Read this first, once per session.
- `components/<name>.json` — one manifest per component: exact variant enums,
  defaults, props, consumed `--ds-*` tokens, a11y, usage do/don't.
- `index.json` — aliases and keywords → components; duplicate Figma names
  resolve by node ID.
- `overrides/<name>.json` — the **only** hand-edited JSON: the human judgment
  layer (aliases, usage guidance) merged into generated manifests at build time.

Everything else under `manifests/` is generated and byte-diffed in CI.

### MCP server

`@kraken-ui/mcp` serves the manifests to any MCP-capable agent. Local-only by
design (never published to npm):

```bash
npm run mcp:build
claude mcp add kraken-ui -- node <abs-path-to-clone>/mcp/dist/index.js
```

Six tools: `list_components`, `search_components`, `get_component`,
`get_foundations`, `get_tokens`, `get_usage_rules`. Inspect interactively with
`npm run mcp:dev`.

### Skills (executable runbooks)

| Skill                       | What it does                                                                  |
| --------------------------- | ----------------------------------------------------------------------------- |
| `using-kraken-ui-kit`       | Pre-loads everything an agent needs to consume the kit correctly              |
| `token-sync`                | Figma variables → `tokens.dtcg.json` → CSS, one ritual                        |
| `add-brand`                 | Onboard a new brand theme (Figma mode → working `data-theme`)                 |
| `add-component`             | Scaffold a new component: tokenized `.tsx` + story + MAPPING entry + registry |
| `implement-figma-component` | Build a component 1:1 from its Figma set, with a visual validation loop       |
| `mapping-doctor`            | Verify/regenerate `MAPPING.md` against the live Figma file and the code       |
| `drift-audit`               | Read-only 3-way governance check: Figma ⇄ tokens.json ⇄ code                  |

### Agents

- `figma-binder` — audits MAPPING.md ⇄ code node-ID consistency.
- `parity-reviewer` — PASS/FAIL report of one component vs its Figma variant
  matrix and shadcn props.
- `release` — cuts a versioned release (rebuild artefacts, bump, changelog, tag).

### Other AI entry points

- `llms.txt` (root + published on Pages) — the kit's map for any LLM.
- `CLAUDE.md` — agent operating rules for working _on_ the kit.
- `design.md` — the design system itself written as a Claude skill.

### Vibecoding with the kit

To have an agent build UI for you: connect the MCP server (or install the
`using-kraken-ui-kit` skill), then prompt normally — "build a destructive
confirm dialog". The agent looks up the real component API (`get_component`),
uses the exact variant enums, and produces on-brand, fully tokenized UI. This
flow is proven end-to-end: a scratch app + registry install + local MCP
produced a correct `variant="destructive"` dialog with zero hex values.

## 10. Figma ↔ code map

[`MAPPING.md`](../../MAPPING.md) is the bridge: every Figma component set →
node ID → `.tsx` file → prop map, with deep links into the Figma file. Node ID
is the identity — duplicate Figma layer names are disambiguated by ID. Keep it
honest with the `mapping-doctor` skill or the `figma-binder` agent
(`npm run figma:binder`).

## 11. Governance — what defends the kit

- **Provenance rule.** Generated files (`manifests/**` except `overrides/`,
  `docs/components/**`, `registry.json`, `src/styles/tokens.css`, the README
  status block) are never hand-edited. Edit the source, then regenerate.
- **`npm run manifests:check`** — JSON-schema validation + byte-level drift
  diff + cross-checks. CI runs it on every push, plus a full drift gate that
  regenerates everything and fails on any diff.
- **CI (`.github/workflows/ci.yml`)** — typecheck, manifests:check, drift
  gate, lint, format, build, Storybook build (all blocking) + browser-mode
  story tests.
- **`drift-audit` skill** — the periodic 3-way Figma ⇄ tokens ⇄ code check.
- **Releases** — `npm run release` (dry-run by default) or the `release` agent.

## 12. Command reference

```bash
npm run dev               # showcase app
npm run storybook         # component explorer
npm run tokens:build      # tokens/ → src/styles/tokens.css
npm run registry:bundle   # registry:build + manifests:build + shadcn build
npm run manifests:build   # regenerate manifests/ from sources
npm run manifests:check   # schemas + drift + cross-checks (the CI gate)
npm run docs:build        # regenerate docs/components/ + README status block
npm run mcp:build         # build the MCP server package
npm run mcp:dev           # inspect the MCP server interactively
npm run figma:binder      # MAPPING.md ⇄ code consistency audit
npm test                  # Storybook browser-mode story tests
npm run release           # cut a release (dry-run by default)
```
