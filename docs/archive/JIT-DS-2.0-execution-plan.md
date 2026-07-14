> **⚠️ Superseded (2026-07-14):** Phase 8 (the visual semantic-layer theme
> editor) shipped 2026-06-28 as described below, but was **later removed** —
> themes are now authored as Figma semantic modes + `token-sync`, never an
> in-code builder. See `docs/token-pipeline.md` and the `add-brand` skill for
> the current ritual. This document is preserved for historical record only;
> do not treat any "✅ complete" marker below as describing the current
> system.

---

# JIT DS 2.0 / Kraken UI Kit — Execution Plan (go-live)

A shadcn-based company UI kit with four pillars:

1. **3-layer token architecture** — global (primitives) → semantic (meaning) → component (per-component knobs). Theme-switching = changing only the semantic layer.
2. **shadcn parity** — every component mirrors a real shadcn component + props, so AI agents and the shadcn ecosystem understand it natively.
3. **AI-native bridge** — Figma↔code mapping (which Figma component = which `.tsx` file + prop), a shadcn registry so anyone/any agent installs the *tokenized* version, and project skills/agents that keep design and code in sync.
4. **Live semantic-layer theme editor** — a non-technical person edits Layer 2 with color pickers and the whole kit (code + Figma) restyles.

**Repo (home for all code, tokens, docs):** `github.com/ziolkowskiw/kraken-ui-kit`
*(Confirmed 2026-06-13: public, default branch `main`, empty except a one-line README — clean slate, ready to scaffold. "Kraken" is the kit's codename; the old stale-`.figma.tsx` kraken repo is retired — this is the fresh one.)*

**Source-of-truth model:** Figma is the source of truth for design **decisions**; `tokens.json` in the repo is the canonical **machine-readable** artifact. The two stay in sync via the MCP export ritual (Phase 4) and the drift audit (Phase 9).

**Status legend:** ✅ done · 🟡 in progress / needs rework · ⬜ not started

---

## How this plan runs — model & agent orchestration

The operating model: **Opus plans, orchestrates, and does the hard work; Sonnet does the high-volume work.** (Fable 5 isn't available right now, so Opus wears both the art-director and senior-engineer hats; if Fable comes back, lift the orchestrator role to it.) Think of it like a studio — Opus is the senior who breaks the brief into jobs, handles the get-it-right-first-time ones, and reviews everything; Sonnet is the fast hands who does the repetitive jobs.

| Model | Role | Use it for |
|---|---|---|
| **Opus 4.8** | **Planner + orchestrator + deep-reasoning execution** (the main session) | Decomposing each phase into tasks, sequencing, choosing which model runs each, reviewing outputs against this plan + the convention/parity docs, and keeping this plan current — **plus** the get-it-right-once work: the Style Dictionary config + CSS-variable name rule, `MAPPING.md` conventions, the shadcn `registry.json` schema, the theme-editor "push-to-Figma" logic, authoring the Claude Skill, any code where correctness/accessibility matters on the first pass, and the go/no-go parity reviews. |
| **Sonnet 4.6** | **High-volume mechanical execution** | Repetitive, well-specified work: scaffolding, generating component `.tsx` from the shadcn CLI and retargeting them to Layer-3 vars, batch Figma variable binding over the MCP, per-component docs, Storybook stories, re-running the CSS build, screenshot QA passes. |

**How you actually run it (plain language):**
- Keep the main Claude Code session on **Opus** (the model picker). That session owns this plan and acts as orchestrator.
- Opus spins up **subagents** for the bulk jobs with the model set to **Sonnet** (in Claude Code, a subagent is a fresh helper given one scoped task and a chosen model). You review what comes back; Opus folds it in. For the hard jobs Opus just does them in-session.
- Rule of thumb: **if a task is "decide the right shape," Opus does it; if it's "apply the known shape 40 times," hand it to Sonnet; Opus always reviews.** Every task below carries a `[model]` tag as the default — Opus can override per run.

---

## Project skills & agents that live in the repo

Part of the goal is a kit that is *self-maintaining* via AI. These ship inside the repo under `.claude/` and become reusable on every future session (yours or a teammate's). Build them in Phase 7, but they're listed here so the earlier phases produce the right hooks.

**`.claude/` layout (in the repo):**
- `CLAUDE.md` — project context (the verification-handoff CLAUDE.md is the seed: token names, conventions, parity rules, the orchestration model above).
- `.claude/skills/` — repeatable playbooks Claude can invoke by name:
  - `token-sync` — Figma variables → `tokens.json` → regenerate CSS, in one ritual. `[Opus to author, Sonnet to run]`
  - `add-component` — scaffold a new shadcn component, wire it to Layer-3 tokens, add its story + doc + mapping entry. `[Opus to author]`
  - `mapping-doctor` — regenerate/verify `MAPPING.md` against the live Figma (node IDs, prop maps, duplicate-name disambiguation). `[Opus to author, Sonnet to run]`
  - `drift-audit` — the monthly 3-way check: Figma vars ⇄ `tokens.json` ⇄ `MAPPING.md`; reports mismatches. `[Opus to author, Sonnet to run]`
  - `theme-apply` / `theme-push` — apply a Layer-2 theme to Storybook and (extension) push edited semantic values back to the Figma semantic collection. `[Opus to author]`
- `.claude/agents/` — named subagents with a pinned model:
  - `figma-binder` `[Sonnet]` — batch-binds Figma nodes to variables over the Console MCP.
  - `parity-reviewer` `[Opus]` — checks a component's code variants vs its Figma variant matrix vs shadcn props; produces a PASS/FAIL.
  - `release` `[Opus]` — version bump, changelog, registry publish.

**Done when:** a fresh session can run `add-component`, `token-sync`, and `drift-audit` end-to-end with no re-explanation.

---

## Where things stand (snapshot)

| Phase | What | Status |
|---|---|---|
| 0 | Decisions & setup | ✅ v1 list frozen, repo confirmed |
| 1 | Token architecture on paper | ✅ (dark mode deferred to v1.1 — semantic modes are brands `jit`/`brand`) |
| 2 | Variable system built in Figma | ✅ 3 clean layers, 100% alias chains, +6 shadcn tokens, sidebar added |
| 3 | Component sets mirror shadcn | ✅ All open items resolved (button-size 1:1, outline/link confirmed, zero-hardcoded sweep done via parity review) |
| 4 | Token pipeline: Figma → JSON → CSS | ✅ (2026-06-13 — 827 tokens, jit⇄brand verified, committed to repo) |
| 5 | React kit + Storybook | ✅ (2026-06-14 all 12 rebuilt; visual QA pass COMPLETE 2026-06-23 — all 53 components PASS/FIXED) |
| 6 | Figma ↔ code mapping (`MAPPING.md`) | ✅ (2026-06-17 — 40 parents mapped, v1-12 full prop maps, conventions + dup-by-nodeID locked) |
| 7 | AI-native layer (registry + skills/agents) | ✅ (2026-06-28 — registry, using-kraken-ui-kit skill, all 4 skills + 3 agents complete) |
| 8 | Visual semantic-layer theme editor | ✅ (2026-06-28 — 249-token editor, import/export round-trip, push-to-Figma, per-mode jit/brand) |
| **9** | **Governance (ongoing)** | **🟡 infrastructure in place; first release not yet cut** |

**All four pillars are live.** The kit ships: theme editor restyles real components, registry installs tokenized components, MAPPING.md maps every Figma node to code, skills/agents maintain it. Phase 9 is ongoing governance — run `npm run release -- --yes` to cut the first tagged version.

---

## Phase 0 — Decisions & setup  ✅

1. ✅ Tooling: Claude + Figma Console MCP + Dev Mode MCP.
2. ✅ Naming convention doc (`JIT-DS-2.0-naming-conventions.md`) + parity audit (`JIT-DS-2.0-shadcn-parity-audit.md`).
3. ✅ **`kraken-ui-kit` confirmed** (2026-06-13: public, `main`, empty + README) — everything below pushes there.
4. ✅ **v1 list frozen** (12 core, 1:1-with-shadcn): `button, input, textarea, select, checkbox, radio-group, switch, badge, card, alert, dialog, tabs`. Everything else is v1.1+.
5. ✅ Figma plan = **Professional** → mapping is via `MAPPING.md`, not Code Connect `.figma.tsx`.

---

## Phase 1 — Token architecture on paper  ✅

Complete. 3-layer map exists; OKLCH primitives; semantic uses shadcn names verbatim + documented `success`/`warning` extensions; `content`→`foreground` export mapping documented. Dark mode **deferred to v1.1** (current semantic modes are brands `jit`/`brand`; matrix `brand×light/dark` modes come later).

---

## Phase 2 — Variable system built in Figma  ✅

Complete & verified 2026-06-10: three collections (`global`, `semantic`, `component`), zero raw values in Layers 2–3, 100% alias chains, +6 missing shadcn tokens added, `sidebar-*` family added and applied (175 bindings, zero visual change), `card/*` Layer-3 set added. Dark-mode caveat per Phase 1.

---

## Phase 3 — Component sets mirror shadcn  ✅

Done: Button folded 512→244 variants (Danger boolean → `destructive*` variants, double-encoded `Focused` removed); all 86 sets renamed to lowercase-kebab shadcn names; typography bound 4,924/5,782 text nodes (85%), stray fonts corrected, off-scale hidden button labels resolved.

All open items resolved:
1. ✅ Button-size: Figma `xs/sm/md/lg` already match code 1:1 — no mapping table needed. (Resolved P6.)
2. ✅ `Outline`/`Link`: `secondary` *is* outline; `link` is a separate component. (Confirmed P6.)
3. ✅ Zero-hardcoded sweep (v1 12): completed via the full parity review (see `audit/parity-checklist.md`). All hardcoded `bg-white`, radius literals, etc. replaced with `--ds-*` tokens. `rounded-full` on circular controls (radio, switch track) is intentional structural geometry.
4. `[v1.1]` Pages (Charts, Collapsible, Button group, Form table) — deferred.

**Done when:** ~~the v1 12 each pass the 6-point per-component checklist.~~ ✅ Met (parity-checklist.md COMPLETE 2026-06-23, 53/53).

---

## Phase 4 — Token pipeline: Figma → JSON → CSS  ✅ (2026-06-13)

**Goal:** the code twin of the variable system, *generated*, never hand-written.

Built in `kraken-ui-kit` (commit `b295cac`). Decision: the figma-console-mcp export replaces Style Dictionary — it understands this token system's brand-mode + reference format natively; a tiny committed Node script does the deterministic selector-shaping (CI-safe, no Figma needed). Result:

1. ✅ `tokens/tokens.dtcg.json` — 827 tokens (global 302 / semantic 249 / component 276), W3C DTCG, **aliases + `jit`/`brand` brand splits preserved**, `_preview-labels` excluded. Via `figma_export_tokens`.
2. ✅ `tokens/tokens.raw.css` — css-vars export, `--ds-` prefix, aliases kept as `var()` chains. Name rule from the conventions doc applied automatically.
3. ✅ `scripts/build-tokens.mjs` → `src/styles/tokens.css`: remaps the per-collection-mode blocks to the correct cascade — primitives + component tokens → `:root`; semantic brands → `:root,[data-theme="jit"]` (default) + `[data-theme="brand"]`.
4. ✅ One command (`npm run tokens:build`); the Figma→files sync ritual is documented in `docs/token-pipeline.md` (becomes the `token-sync` skill in Phase 7).

**Verified:** flipping `data-theme="brand"` restyles the kit through the cascade — `--ds-button-primary-fill` `#FFD242`→`#298EE5`, `--ds-radius-md` `6px`→`0px` — with component tokens untouched.

**Open follow-ups (non-blocking):** color format is hex (oklch requested but tool kept hex — fine for Tailwind v4; revisit if charts need oklch); `chart/color/N`→`chart-N` and `content`→`foreground` shadcn renames not yet applied (do as an export name-map when wiring components in Phase 5).

---

## Phase 5 — React kit + Storybook  ✅ (2026-06-14, all 12 rebuilt)

**Goal:** the working, visually-verifiable code kit.

Built in `kraken-ui-kit`. Stack: Next.js 16 / React 19 / Tailwind v4 / shadcn (Base UI variant, v4.11).

1. ✅ Scaffolded; `shadcn add` the v1 12 (button, input, textarea, select, checkbox, radio-group, switch, badge, card, alert, dialog, tabs).
2. ✅ `globals.css` imports `tokens.css` and re-points shadcn's semantic vars (`--primary`, `--background`, …) at our `--ds-*` tokens — 1:1 because the semantic layer already uses shadcn names. Brand switch cascades from the token layer (no per-brand overrides in the app).
3. ✅ Showcase page (`src/app/page.tsx`) with a live jit/brand toggle; Storybook 10 (`nextjs-vite`) with a **brand toolbar** toggle.
4. ✅ **Verified:** `next build` passes; dev server serves the page; compiled CSS (Next + Storybook) carries `--primary→--ds-color-primary` and the `[data-theme="brand"]` override (`#298ee5`).

**Component API parity (Phase 5.1) — ✅ ALL 12 REBUILT (2026-06-14).**
Every v1 component has been rebuilt from the stock shadcn version to mirror its Figma component API, with Layer-3 token bindings and full Storybook controls matching Figma properties.

| Component | Code API (key props) | Figma-parity controls in Storybook | Token layer |
|---|---|---|---|
| **badge** | `color` (8 colors) × `appearance` (filled/outlined/ghost) × `size` (sm/md/lg) × `shape` (round/square) + `leftIcon`/`rightIcon` | All props + full lucide icon picker (1,715 icons) | `--ds-badge-*` |
| **button** | `variant` (primary/secondary/tonal/ghost/destructive/destructive-secondary/destructive-ghost) × `size` (xs/sm/md/lg) + `iconOnly` + `leftIcon`/`rightIcon` | All props + full lucide icon picker + disabled | `--ds-button-*` |
| **input** | `InputField` wrapper: `size` (sm/md/lg) + `label`/`description`/`errorMessage`/`mandatory` + `leftDecoration`/`rightDecoration` | State (rest/error/disabled), size, label, description, error message, mandatory, full lucide icon pickers for L/R decorations | `--ds-input-*` |
| **textarea** | `TextareaField` wrapper: `label`/`description`/`errorMessage`/`mandatory`/`showCounter`/`maxLength` | State (rest/error/disabled), label, help text, error message, mandatory, show counter, max length | `--ds-input-*` (shared) |
| **select** | `SelectField` wrapper: `size` (sm/md/lg) + `label`/`description`/`errorMessage`/`mandatory`/`placeholder` | State (rest/error/disabled), size, label, description, error message, placeholder, mandatory | `--ds-select-*` |
| **checkbox** | `error` + `indeterminate` | checkedState (false/true/indeterminate), error, disabled, label | `--ds-checkbox-*` |
| **radio-group** | `RadioGroupField` wrapper: `direction` (vertical/horizontal) + `label`/`description`/`errorMessage`/`mandatory` | State (default/error), direction, label, help text, error message, mandatory | `--ds-radio-*` |
| **switch** | `size` (default/compact) + `leftLabel`/`rightLabel`/`error` | Size (compact toggle), active (defaultChecked), disabled, error, left/right labels | `--ds-color-primary` (semantic) |
| **card** | `filled` (true/false) | filled toggle | `--ds-card-*` |
| **alert** | `type` (neutral/error/success/informational/warning) + `icon`/`onClose`/`action` | Type, title, description, hasIcon, hasDescription, close icon, show button + action button variant/size | `--ds-alert-*`, `--ds-color-status-*` |
| **dialog** | `DialogContent` with `showCloseButton`; composed: `DialogHeader`/`DialogFooter`/`DialogTitle`/`DialogDescription` | Title text, subtitle text, hasTitle, hasSubtitle, showClose | `--ds-color-popover*`, `--ds-radius-*` |
| **tabs** | `TabsList` with `variant` (default/line); `Tabs` with `orientation` (horizontal/vertical) | Orientation, variant (shown via separate stories: Badge/Line/Vertical/WithDisabledTab/AllVariants) | `--ds-color-muted*`, `--ds-radius-*` |

- ✅ Brand fonts wired (Moderat JIT / Noto Sans); Moderat JIT not bundled (proprietary, public repo).
- ✅ Side-by-side Figma QA via `parity-reviewer`: all 53 components PASS/FIXED (2026-06-23). See `audit/parity-checklist.md`.

**Done when:** ~~all v1 components render in Storybook, brand toggles instantly, visuals match Figma.~~ ✅ Met.

---

## Phase 6 — Figma ↔ code mapping  ✅ (2026-06-17)

**Goal:** inspecting a Figma component yields the real `.tsx` + prop map, for humans and AI.

Authored `MAPPING.md` at the repo root (Professional-plan route — no Code Connect).
- ✅ All **40 parent components** mapped `set name + node ID → src/components/ui/<file>.tsx`. v1-12 carry **full prop-map tables** (Figma property → code prop → values); the other 28 + extensions get file + key props + compose notes.
- ✅ Conventions locked once at the top (apply to all): `State` axis → CSS, no prop except `disabled`; `iconOnly=true` ↔ icon semantics; Figma variant values = exact lowercase code enums (1:1); icons = lucide via `leftIcon`/`rightIcon`; brand/theme cascades from `[data-theme]`, never a prop.
- ✅ Sub-parts (`dialog/footer`, `select/item`, `sidebar/item`, …) documented as composing into the parent file — no standalone `.tsx`.
- ✅ Duplicate-name resolution by node ID: "Select"(dropdown-menu page)`1292:5274`→`combobox`; "Dropdown"(Select page)`1637:17676`→`select`; both `Sorting icons`.
- Resolved the open button-size decision inline: Figma `xs/sm/md/lg` already match code 1:1 — **no mapping table needed**.
- This becomes the `mapping-doctor` skill (Phase 7).

**Done when:** ~~every v1 component is mapped; an agent inspecting a Figma node reconstructs the correct snippet.~~ ✅ Met.

---

## Phase 7 — AI-native layer  ✅ (2026-06-28 — all items complete)

**Goal:** the kit is discoverable, installable, and explainable to AI agents — and it maintains itself.

1. ✅ **shadcn registry** (`registry.json`): a generator (`scripts/build-registry.mjs`, `npm run registry:build`) derives all **58 items** from source — 55 components + base `utils`/`tokens`/`theme` — parsing imports for npm deps + sibling registryDependencies (no drift, no dangling refs). Every component depends on `theme`→`tokens`, so `npx shadcn add @kraken/<name>` installs **tokenized**. Compiles via `shadcn build` → `public/r/*.json` (verified). Theming made portable: extracted shadcn-vars→`--ds-*` map into shippable `src/styles/kraken-theme.css` (globals.css now imports it; `next build` passes). `[Opus]`
2. ✅ **Claude Skill** `using-kraken-ui-kit` — packages stack, the 3-layer token contract, brand switching, shadcn-parity prop conventions, registry install, MAPPING reference. The "fresh session pre-loaded" deliverable. `[Opus]`
3. ✅ Project **skills + agents**: `token-sync`, `add-component`, `mapping-doctor`, `drift-audit`, `theme-apply` skills + `parity-reviewer`, `figma-binder`, `release` agents — all authored under `.claude/`. Scripts: `scripts/figma-binder.mjs` (audit bindings), `scripts/release.mjs` (version bump + changelog + tag). `[Opus authors, Sonnet wires]`
4. ✅ Per-component docs (anatomy, props, token map, a11y) — `docs/components/*.md` for all 53 components. `[Sonnet]`

**Done when:** ~~a fresh AI session installs a component from the registry and uses correct tokens with no re-explanation.~~ ✅ Met.

---

## Phase 8 — Visual semantic-layer theme editor  ✅ (2026-06-28 — complete including import/export and push-to-Figma)

**Goal:** a non-technical person restyles the whole kit by editing only Layer 2, live.

**Decision: built a custom in-app editor instead of tweakcn.** The user's requirements
(a single **spacing multiplier** + **radius multiplier**, and a live **dashboard mock of
our own components**) go past tweakcn, which edits shadcn colors/radius only and previews
generic components. The custom editor previews real Kraken components and matches the
exact control surface. Lives at the `/theme-editor` route in the Next app.

Reframed again (2026-06-21) per user → a **semantic-layer editor (variables studio)**:
"control over the semantic layer of the DS." Earlier passes (brand tweaker, then a
colors+fonts style builder) exposed only a curated slice and edited primitives; the
user wants the *actual semantic layer*. Decisions: **re-point each semantic token to a
Layer-1 primitive** (keep the alias contract), **full 249-token semantic layer**,
**token-table + live preview** layout.

1. ✅ **Semantic-layer editor** (`src/app/theme-editor/page.tsx` + `src/lib/theme-editor.ts`
   + generated `src/lib/semantic-tokens.json` + `scripts/build-semantic-editor-data.mjs`,
   `npm run editor:data`):
   - **Data sourced from `tokens.dtcg.json`** (never drifts): all **249 semantic tokens**
     (their CSS var, type, current primitive alias, and which primitive family they may
     re-point to) + all **302 primitives** grouped by ramp.
   - **Re-point model:** every semantic token row shows its current alias (e.g.
     `primary → color/jit/500`); colors get a **ramp swatch popover** (22 ramps × 11),
     dimensions/typography get a **primitive dropdown** of the right family. Keeps the
     contract: semantic = alias to primitive.
   - **Full coverage, grouped + searchable:** color (content/border/status/label/core),
     typography (per text style), spacing, radius, borderWidth, chart — collapsible
     `<details>` per major group, live search across all 249.
   - **Live preview:** real-component dashboard beside the table; overrides inject as
     `<style>` at **`:root`** (`--ds-color-primary: var(--ds-color-blue-500)`) so the
     alias chains re-resolve.
   - **A11y:** live WCAG contrast panel (6 pairs).
   - **Save & switch:** named styles in `localStorage`; **Export** the authored semantic
     layer as a DTCG-ish alias-map JSON (Copy + Download).
   - Verified: `tsc` clean, `next build` prerenders. (Run: `npm run dev` → `/theme-editor`.)
2. ✅ Live preview wired to the component dashboard (part of #1).
3. ✅ **Import-JSON box** — `ImportPanel` in `theme-editor/page.tsx`; paste a previously exported `kraken-semantic@1` JSON to reload a saved style.
4. ✅ **Per-mode (jit/brand) editing** — the push-to-Figma panel lets you select the target Figma semantic mode before pushing; the editor table edits whichever style is active (brand-agnostic overrides that can be pushed to either mode).
5. ✅ **Push-to-Figma** — `PushToFigmaPanel` in the editor sidebar + `src/app/api/push-to-figma/route.ts`; writes the re-pointed semantic aliases back into the Figma `semantic` collection via the REST API. PAT stored in `localStorage`. Part C of `theme-apply` skill.

**Done when:** ~~a user creates a theme visually, it restyles the live preview, and (if extended) syncs to Figma.~~ ✅ Met.

---

## Phase 9 — Governance  🟡 (infrastructure ready; first release pending)

All governance infrastructure is in place. Run the rituals:

1. ✅ Change flow: `token-sync` skill — tokens change in Figma first → export → `npm run tokens:build`.
2. ✅ Monthly drift audit: `drift-audit` skill — Figma vars ⇄ `tokens.json` ⇄ `MAPPING.md`.
3. 🟡 **First release**: `npm run release -- --yes` → creates `CHANGELOG.md`, bumps version, commits + tags. Then `git push && git push --tags`.
4. ✅ Guard rails documented in `parity-reviewer` agent (shadcn naming fidelity) and `figma-binder` agent (MAPPING ↔ code consistency).

---

## Critical path to "live" (the milestone that proves the whole idea)

All four pillars demonstrated end-to-end:

1. ✅ **P0.4** v1 list frozen (12 core); repo confirmed.
2. ✅ **P4** `tokens.dtcg.json` → CSS pipeline. `npm run tokens:build`.
3. ✅ **P5** All 12 v1 components rebuilt with Figma-parity APIs, Layer-3 tokens, full Storybook controls.
4. ✅ **P6** `MAPPING.md` (40 parents, v1-12 full prop maps).
5. ✅ **P8** Custom semantic-layer editor — a designer re-points semantic tokens to primitives and watches real Kraken components restyle live. Export JSON, import it back, or push straight to Figma. `[npm run dev → /theme-editor]`

**The proof is live.** All four pillars work end-to-end. Remaining work = Phase 9 governance (cut first release).

---

## Immediate next actions

All phases complete. Only Phase 9 governance remains:

1. **`[human]`** Cut the first release: `npm run release -- --yes` (dry-run first without `--yes`). Then `git push && git push --tags`.
2. **`[ongoing]`** Monthly drift audit: run `drift-audit` skill — Figma vars ⇄ `tokens.json` ⇄ `MAPPING.md`.
3. **`[v1.1 planning]`** Next scope: dark mode (add `brand×light/dark` mode matrix to Figma semantic collection + `tokens.build`), additional components beyond v1-12, Chart tokens in oklch.

---

## Resolved decisions

- **Button sizes:** Figma `xs/sm/md/lg` already match code 1:1 — no mapping table needed. ✅
- **Theme-editor scope:** Custom semantic-layer editor built (not tweakcn); push-to-Figma included. ✅
- **Registry namespace:** `@kraken/*` — matches repo codename. ✅
- **Figma plan tier:** Professional — mapping via `MAPPING.md`, not Code Connect. ✅
