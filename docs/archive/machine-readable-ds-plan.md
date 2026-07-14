# Machine-Readable Design System Layer for kraken-ui-kit

## Context

The goal (from the Southleft "machine-readable, not machine-governed" essay, Indeed's design-system MCP writeup, and Meta's Astryx launch) is to make the kit consumable by AI agents in **downstream repos**: publish a dual surface — the existing human docs stay, plus a dense, contractual per-component JSON layer served on demand by an MCP server. Key evidence adopted: pure JSON beat Markdown by ~80% in token cost at equal/better accuracy (Indeed); foundations rules should be an always-on layer separate from on-demand component queries (Indeed); dense-by-default output and a self-contained component-query server (Astryx). Humans keep the judgment layer: everything generated comes from human-maintained sources.

Decisions made with the user: **MCP server only** (no CLI manifest command), **structured keyword/alias lookup** (no RAG/vector DB), primary consumer is **agents in other repos** installing `@kraken/*` via the shadcn registry — so the layer ships with the published artifacts.

Verified ground truth:
- Root `package.json` is `private: true` → the MCP server must be a **separate publishable package**.
- `scripts/build-docs.mjs` already has the extraction core to reuse: `extractExports`, `extractVariants` (CVA axes), `extractDefaults`, `extractTokens` (`var(--ds-*)` scan), `extractBoolProps`, `extractStringProps`, and a hand-authored `A11Y` map (lines 17–221). Note: duplicate `accordion` key at lines 18 and 30 — dedupe while extracting.
- `scripts/build-registry.mjs` derives npm deps + `registryDependencies` from imports — reuse for manifest `install` blocks.
- `MAPPING.md` is deterministic to parse (Part 1 prop tables, Parts 2/3 table rows with `node-id=(\d+-\d+)`, conventions + shadcn-divergence blocks).
- `tokens/tokens.dtcg.json` has layer-3 `component` groups for 13 components; brand overrides live in `$extensions["figma-console-mcp"].modes.brand`.
- `scripts/release.mjs` runs tokens:build + registry:build and stages a fixed file list (~line 131) — both need extending.

## Phase 1 — Shared extraction lib + manifest generator (~1.5 d)

**1a. Factor extraction into `scripts/lib/`**
- `scripts/lib/extract.mjs`: move the extract* helpers + `tokenLayer` from `build-docs.mjs`; add `extractCompoundVariants(src)` and `extractLeadingComment(src)` (rationale comment above the cva call, e.g. button.tsx:6–10); lift `parseImports` from `build-registry.mjs`.
- `scripts/lib/mapping-parser.mjs`: deterministic MAPPING.md parser → per-component `{ figmaNodeId, description, propTable[], subParts[], notes }` + global `conventions` and `divergences`. **Fail loudly (exit 1)** when a component file has no MAPPING entry.
- `scripts/data/a11y-notes.mjs`: the `A11Y` map moved out of build-docs.mjs (dedupe `accordion`), imported by both docs and manifest generators so surfaces can't diverge.
- Refactor `build-docs.mjs` / `build-registry.mjs` to import from `scripts/lib/` — behavior-preserving; diff regenerated docs/registry output before/after to prove it.

**1b. Human-authored overlay (the judgment layer)**
- `manifests/overrides/<name>.json` (optional per component) + `_template.json`: `aliases`, `keywords`, `usage.do[]`, `usage.dont[]`, `boundaries[]`, `whenToUseInstead`. The **only** hand-edited files under `manifests/`; schema-validated; merged last by the generator.
- Seed ~15 high-traffic components (button, input, select, dialog, badge, alert, tabs, checkbox, card, combobox, link, table, tooltip, drawer, dropdown-menu) from MAPPING.md prose + the shadcn divergence table.

**1c. `scripts/build-manifests.mjs`** — merges tsx extraction, MAPPING.md, registry.json, tokens.dtcg.json, a11y notes, overrides, design.md. Outputs are committed, deterministic (key-sorted, no timestamps) so CI can byte-diff:

- `manifests/components/<name>.json` (56 files). Shape (button example): `name/title/description/rationale`; `install` (`npx shadcn add @kraken/button`, deps, registryDependencies); `source`/`story`; `figma { nodeId: "1854:52960", fileKey: "es0hWOiLEplsUrpR3EkBOK" }`; `exports`; `variants` (axes with exact values + defaults, incl. compoundVariants notes); `props` (with notes like "disabled is the ONLY state prop; hover/focus/active are CSS"); `slots` (sub-parts like DialogHeader from MAPPING + exports); `tokens { layer3: [...], other: [...] }`; `a11y[]`; `usage { do[], dont[] }`; `aliases[]`; `keywords[]`.
- `manifests/foundations.json` — the always-on layer distilled from design.md + MAPPING conventions: 3-layer token architecture + naming patterns, brand-switching contract (`data-theme`, jit/brand, only semantic layer changes), core principles, state-is-CSS rule, Field-wrapper rule, icon convention (lucide via leftIcon/rightIcon/icon), shadcn divergence table, scales, install bootstrap. Target < 3 KB.
- `manifests/tokens.json` — compact index from tokens.dtcg.json: per layer `{ cssVar, type, value, brandValue?, description? }`, layer-3 grouped by component; `$extensions` noise stripped (keep optional `figmaVariableId`).
- `manifests/index.json` — lookup table for MCP search: `[{ name, title, description, aliases, keywords, exports, file }]`.
- npm script `"manifests:build"`.

## Phase 2 — JSON Schemas + validation (~0.5 d)

- `schemas/`: `component-manifest.schema.json` (draft 2020-12, `additionalProperties: false`, pattern checks `^--ds-[a-z0-9-]+$`, nodeId `^\d+:\d+$`), plus schemas for foundations, tokens manifest, index, and **overrides** (catches typos in the judgment layer).
- `scripts/validate-manifests.mjs` (`"manifests:check"`), using `ajv` (devDependency, build-time only): (1) validate all manifests; (2) regenerate into tmpdir and byte-diff against committed `manifests/` — exit 1 on drift; (3) cross-checks: every ui/*.tsx has a manifest, every `install.registryItem` exists in registry.json, every layer-3 token exists in generated tokens.css.

## Phase 3 — MCP server package (~1.5 d)

Separate publishable package at `mcp/` — name `@kraken-ui/mcp`, bin `kraken-ui-mcp`. Deps: `@modelcontextprotocol/sdk`, `zod`. `prepack` copies `../manifests/**` (excluding `overrides/`) into `mcp/manifests/` (gitignored) + `tsc` → published tarball is self-contained: no repo, no Figma, no network at runtime.

Files: `src/index.ts` (stdio bootstrap), `src/tools.ts`, `src/store.ts` (sync-loads bundled manifests at startup), `src/search.ts`.

Tools (raw JSON, dense by default per Astryx):

| Tool | Params | Returns |
|---|---|---|
| `list_components` | — | index entries (name, title, one-liner) |
| `search_components` | `query` | top-5 ranked matches with scores |
| `get_component` | `name`, `dense?=true` | full manifest; `dense:false` adds rationale + prose |
| `get_foundations` | — | foundations.json (call once per session) |
| `get_tokens` | `layer?`, `component?`, `brand?` | filtered tokens slice; `brand` resolves brandValue |
| `get_usage_rules` | `name?` | foundations rules + per-component do/don't |

Search scorer (zero deps, deterministic): normalize → exact name (100) > alias (90) > export name (80) > keyword (60) > title/description token overlap (10/term); alphabetical tie-break. Encode the "Select vs Dropdown/Combobox" disambiguation (MAPPING Part 4) in aliases.

Downstream install: `claude mcp add kraken-ui -- npx -y @kraken-ui/mcp`. Root scripts: `"mcp:build"`, `"mcp:dev"` (via `@modelcontextprotocol/inspector`).

⚠️ Needs an npm publish decision (`@kraken-ui` scope vs unscoped `kraken-ui-mcp`) before this phase lands — will confirm at that point.

## Phase 4 — Agent entry points (~0.5 d, parallel with 3)

1. `llms.txt` at repo root + `public/llms.txt`: description + links to foundations, manifest index, per-component manifest URL pattern, registry, MCP one-liner, MAPPING.md, design.md.
2. `CLAUDE.md` at repo root: read foundations.json first; answer component questions from manifests, never guess; manifests are generated — edit sources (tsx / MAPPING.md / overrides), never output; regeneration commands.
3. Update `.claude/skills/using-kraken-ui-kit/SKILL.md`: new section 0 "Prefer the MCP server / manifests" with the install line + tool cheat-sheet.
4. Add one registry item `ai-foundations` in `build-registry.mjs` exposing `manifests/foundations.json` (target `ai/kraken-foundations.json`) so shadcn-only consumers still get the always-on rules.

## Phase 5 — Governance wiring (~0.5 d, parallel with 3)

- Provenance rule documented in CLAUDE.md + a generated `manifests/README.md` header: generator consumes only human-maintained sources; overrides are the only authored JSON, schema-validated. Agents propose; humans direct.
- Extend `.claude/skills/drift-audit/SKILL.md` with a "manifests" phase: run `manifests:check`; report schema failures, regeneration diffs, and (informational) components missing usage overlays.
- `scripts/release.mjs`: insert `manifests:build` + `manifests:check` between registry step and version bump; extend the `git add` list (~line 131) with `manifests/ schemas/ llms.txt public/llms.txt`; update dry-run step list. Update `.claude/agents/release.md` to mention new artifacts and publishing `@kraken-ui/mcp` when manifests changed. `@kraken-ui/mcp` version mirrors root version.
- `registry:bundle` becomes `registry:build && manifests:build && shadcn build` (manifests read registry.json).
- Committed: `manifests/**`, `schemas/**`, `llms.txt`, `CLAUDE.md`, `mcp/src`, `mcp/package.json`. Ignored: `mcp/dist`, `mcp/manifests`.

## Verification (~0.5 d)

1. `npm run manifests:check` green; then hand-edit a manifest value → check must fail (proves drift detection).
2. `npx @modelcontextprotocol/inspector node mcp/dist/index.js` — exercise all 6 tools; `search_components("dropdown")` must rank dropdown-menu over select/combobox; `search_components("outline button")` must return button (alias test).
3. End-to-end: in a scratch repo, add the MCP from a local `npm pack` tarball, then prompt an agent: "Add a destructive confirm dialog with a secondary cancel button using @kraken components" — assert correct `npx shadcn add`, `variant="destructive"`, correct exports, no hardcoded hex.
4. Token-cost sanity check: compare ~chars/4 of `manifests/components/button.json` (dense) vs `docs/components/button.md` + MAPPING button section; record numbers.
5. Docs/registry regeneration diff after the Phase-1 refactor is empty; `npm run build` and Storybook unaffected (manifests are metadata only).

## Effort & ordering

Phases 1→2→3 sequential; 4 and 5 parallel to 3. Total ≈ 5 days.

## Risks

- **MAPPING.md parsing fragility** — main risk; mitigated by the fail-loud parser + existing mapping-doctor contract; anything unparseable becomes a required overlay field, never a silent gap.
- Regex-based CVA extraction is convention-bound ("one cva call, defaultVariants present") — proven on the current codebase; document the convention in CLAUDE.md; ts-morph is a later upgrade option.
