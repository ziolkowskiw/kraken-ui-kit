# Milestone 3 — Complete the theming story

**Date:** 2026-07-13
**Branch:** `feat/m3-theming`
**Source of truth for scope:** `polish-plan.md` Part 3, Milestone 3
**Context:** M1 (distribution) and M2 (CI + tests) shipped. This is a portfolio /
design-system case study (see memory/`project-purpose-portfolio`).

## Problem

The kit's theming story is half-proven. `jit` and `brand` already exist as real
semantic modes in Figma and switch correctly in code — but that was authored
directly, not through a documented, repeatable ritual. Nothing proves a third
brand can be onboarded the same way. Nine components still bind raw Tailwind
`shadow-sm/md/lg` classes instead of `--ds-*` tokens, so a brand cannot theme
elevation — a real gap against the "every value is a token" rule in
`CLAUDE.md`. And there's no documented answer for what a consumer without the
proprietary Moderat JIT font actually gets.

**Scope note:** the original Milestone 3 in `polish-plan.md` included a fourth
item — a dark-mode mode-matrix plan. Descoped for MVP (2026-07-13): this spec
covers elevation tokens, the add-brand runbook, and the font strategy doc only.
`polish-plan.md` and the M5 backlog line referencing a dark-mode plan get
updated to reflect this when M3 ships.

## Locked decisions

| Decision                 | Choice                            | Rationale                                                                                                                                                                                                                                      |
| ------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add-brand proof          | **Live demo, then delete**        | Add a real third mode (`acme`) to the live semantic collection, run the full pipeline, verify it renders, then delete it from Figma. Real proof, zero permanent trace in the shared team file — same throwaway pattern as M1's registry proof. |
| Elevation semantic roles | **control / overlay / modal**     | Names the role by UI pattern rather than raw size, so a future component binding a shadow knows _when_ to use which without a legend.                                                                                                          |
| Dark-mode plan           | **Dropped from M3 (MVP descope)** | Not needed for the portfolio MVP; deferred entirely, not just deprioritized — no shape decision recorded.                                                                                                                                      |

## Current state (verified 2026-07-13)

- Figma access this session is via the general Figma MCP (`use_figma`,
  `get_metadata`, `get_variable_defs`, …), confirmed live against JIT DS 2.1
  (`Y3gNgjmXe1t67fPlDjM2iH`): `getLocalVariableCollectionsAsync()` returns
  `global` (mode `global`), `semantic` (modes `jit`, `brand`), `component`
  (mode `component`), `_preview-labels` (mode `Mode 1`) — matches
  `docs/token-pipeline.md` exactly. No `shadow`/`elevation`-named variables
  exist yet (checked all 249 semantic variables).
- The project's own `token-sync` skill (`.claude/skills/token-sync/SKILL.md`)
  assumes the `figma-console` MCP (`figma_get_status`, `figma_export_tokens`).
  Those tools are not in this session's toolset (only certain subagents like
  `parity-reviewer` carry a narrow slice, and it doesn't include
  `figma_export_tokens`). This spec's live proof uses `use_figma` to write
  variables directly, then hand-mirrors the exact DTCG/CSS shape already
  committed — verified against `manifests:check` rather than trusted blindly.
  **The written runbook still documents the canonical `token-sync` skill**
  (figma-console-based) as the sanctioned path for future humans/agents that
  do have that bridge — this session's workaround is not promoted into the
  skill docs.
- `scripts/build-tokens.mjs` reads `tokens/tokens.raw.css` only (a flat CSS
  export, one block per Figma collection-mode) and rewrites `[data-theme="…"]`
  selectors into the real cascade (`global`/`component` → `:root`; default
  brand `jit` → `:root, [data-theme="jit"]`; other brands → `[data-theme="…"]`).
  It does **not** read `tokens/tokens.dtcg.json`.
- `scripts/build-manifests.mjs` **does** read `tokens/tokens.dtcg.json` (for
  token counts / the machine-readable layer) — so both files must be updated
  together and stay in sync, or `manifests:check`'s drift gate fails.
- Existing arbitrary-value token-binding pattern (e.g. `popover.tsx`):
  `[border-radius:var(--ds-radius-lg)]`, `[background-color:var(--ds-color-popover)]`.
  Shadow binding follows the same shape: `[box-shadow:var(--ds-shadow-overlay)]`.
- Global primitive families use raw numeric or literal scales (radius:
  `2,4,6,8,12,16,24,none,full`; spacing: numeric steps); semantic/component
  layers expose t-shirt names (`--ds-radius-sm/md/lg/xl/2xl/3xl`). The new
  `--ds-shadow-*` global ramp follows the t-shirt convention directly (no
  natural "raw numeric" unit for a composite shadow value), matching how
  color's global layer already works.
- Current raw-Tailwind shadow usage (9 files, 3 distinct levels — the
  elevation rebind is a 1:1 swap, not a redesign):
  - `shadow-sm`: `checkbox.tsx`
  - `shadow-md`: `dropdown-menu.tsx`, `hover-card.tsx`, `navigation-menu.tsx`,
    `popover.tsx`, `select.tsx`, `sonner.tsx`
  - `shadow-lg`: `alert-dialog.tsx`, `drawer.tsx`
- `--font-sans` already resolves through a real fallback chain:
  `var(--ds-typography-bodymd-fontfamily), ui-sans-serif, system-ui,
-apple-system, sans-serif` (`src/styles/kraken-theme.css:58`). `brand`'s Noto
  Sans loads via a Google Fonts `<link>` in `layout.tsx`. `jit`'s Moderat JIT
  is proprietary — `globals.css:17-19` already notes it "renders from the OS
  if installed" with no bundled webfont, and no doc currently expands on this
  for a consumer.
- `src/app/globals.css:23-55` has a leftover shadcn-scaffold `.dark { … }`
  block with hardcoded `oklch(...)` literals, fully disconnected from the
  `--ds-*` token system and not wired to any toggle. Out of scope for this
  milestone (dark mode is dropped) — noted here only so a future session
  doesn't mistake it for load-bearing code.

## Architecture

Three independent deliverables. Each is separately testable and separately
committable.

### 1. Elevation tokens

**Figma (via `use_figma`):**

- Add a `--ds-shadow-*` global ramp to the `global` collection: `xs`, `sm`,
  `md`, `lg`, `xl` — composite box-shadow values copied verbatim from the
  installed Tailwind v4.3.1 default scale (`node_modules/tailwindcss/theme.css:406-411`),
  so they match what `shadow-sm/md/lg` already render exactly, giving true
  zero-diff parity:
  - `xs`: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
  - `sm`: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
  - `md`: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
  - `lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
  - `xl`: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
- Add 3 semantic roles to the `semantic` collection, present in both `jit`
  and `brand` modes, aliasing the global ramp: `--ds-shadow-control` → `sm`,
  `--ds-shadow-overlay` → `md`, `--ds-shadow-modal` → `lg`.

**Repo (hand-mirrored from the live Figma values, since `figma_export_tokens`
isn't available this session):**

- Append the new global + semantic entries to `tokens/tokens.dtcg.json`,
  matching the existing DTCG shape for a comparable token family.
- Append the corresponding flat custom-property blocks to
  `tokens/tokens.raw.css` (one entry under each of the `global`, `jit`,
  `brand` `[data-theme="…"]` blocks, matching the file's existing format).
- `npm run tokens:build` — regenerates `src/styles/tokens.css`.
- Rebind the 9 files: replace `shadow-{sm,md,lg}` Tailwind classes with the
  matching `[box-shadow:var(--ds-shadow-{control,overlay,modal})]` arbitrary
  value, per the mapping in "Current state" above.
- `npm run manifests:build && npm run manifests:check` — confirms the DTCG
  JSON and generated manifests agree (schema + drift + cross-checks).

**Verification:** visual diff (Storybook or the showcase app) on all 9
components before/after — the shadow must render pixel-identical, since this
is a token _rebind_, not a redesign. `manifests:check` green.

### 2. Add-brand runbook

**New file:** `.claude/skills/add-brand/SKILL.md`, structured like
`.claude/skills/token-sync/SKILL.md` (frontmatter with `name`/`description`,
numbered steps, a "Done when" section). Content:

1. **Add a mode in Figma** — add a new mode to the `semantic` variable
   collection in JIT DS 2.1, name it after the brand (kebab-case), and give
   every semantic variable a value for that mode (Figma requires a value per
   mode per variable — copying from an existing mode as a starting point is
   fine).
2. **Sync** — run the `token-sync` skill (canonical path: `figma-console`'s
   `figma_export_tokens`, Steps 1–2 of that skill) to pull the new mode into
   `tokens/tokens.dtcg.json` + `tokens/tokens.raw.css`.
3. **Build** — `npm run tokens:build`.
4. **Verify** — set `data-theme="<new-brand>"` on `<html>` (or use the
   Storybook/showcase brand toggle) and confirm the kit re-skins with zero
   component-code changes.
5. **Done when** — the new mode renders correctly and `manifests:check`
   passes (component tokens must not have changed — only semantic values
   differ per brand, matching the existing brand-flip verification in
   `token-sync`'s own Step 3).

**Live proof (this session, throwaway):**

- Add a mode named `acme` to the live `semantic` collection via `use_figma`,
  giving every variable a visibly-different placeholder value (e.g. a shifted
  hue) so the flip is unmistakable.
- Produce the `tokens.dtcg.json`/`tokens.raw.css`/`tokens.css` diff for the
  `acme` mode by hand-mirroring the live Figma values (same mechanism as
  elevation tokens above).
- Verify: `data-theme="acme"` visibly re-skins the showcase app or a
  Storybook story, with zero hex literals and zero component-file changes.
- **Delete the `acme` mode from Figma** via `use_figma` afterward, and revert
  the throwaway token/CSS diff from the repo (this proof does not ship — only
  the runbook and the elevation/font deliverables ship).

**Verification:** the live `acme` flip **is** the test. No permanent Figma or
repo artifact from the proof survives past this task.

### 3. Font strategy doc

**New file:** `docs/font-strategy.md`, linked from README's "Creating a new
theme" section. Content:

- What `jit` consumers get: Moderat JIT if installed on the OS, else the
  existing fallback chain (`ui-sans-serif, system-ui, -apple-system,
sans-serif`) — stated plainly as "most consumers outside JIT will see the
  fallback stack, not Moderat JIT" (proprietary font, not distributable).
- What `brand` consumers get: Noto Sans, loaded via Google Fonts — works for
  every consumer, no fallback needed in practice.
- How a new client brand supplies its own font: set that mode's
  `--ds-typography-bodymd-fontfamily` (and other typography variables sharing
  the family) in Figma to the new font name, same ritual as any other
  semantic token — no code change. If the font needs to be loaded (not
  OS-resident), add its `<link>`/`@font-face` the same way `brand`'s Noto Sans
  is loaded in `layout.tsx` — one documented example, not a new mechanism.

**Verification:** doc review only — no code changes, so no build/test gate.
Cross-check against the actual `layout.tsx`/`kraken-theme.css` values cited so
nothing in the doc is invented.

## Testing strategy

- **Elevation tokens:** before/after visual diff on all 9 rebound components
  (Storybook preferred — every component already has a story); `manifests:check`
  green; `npm run build` passes (confirms the arbitrary-value Tailwind syntax
  compiles).
- **Add-brand runbook:** the live `acme` proof described above is the
  end-to-end test. No unit tests apply — this is a documentation + live
  Figma-round-trip deliverable.
- **Font strategy doc:** no automated test; verify every claim in the doc
  against the actual source file it describes.

## Definition of done

1. `--ds-shadow-{xs,sm,md,lg,xl}` global + `--ds-shadow-{control,overlay,modal}`
   semantic tokens exist in Figma, `tokens.dtcg.json`, `tokens.raw.css`, and
   `tokens.css`; all 9 files rebound; visual diff shows zero regression;
   `manifests:check` green.
2. `.claude/skills/add-brand/SKILL.md` exists, follows the `token-sync`
   format, and was proven end-to-end via the live `acme` mode (added, synced,
   verified, deleted — no trace left in Figma or the repo).
3. `docs/font-strategy.md` exists, linked from README, and every fact in it
   is verified against the actual code it describes.
4. README's "Figma-first theming" line flips from ⬜ to ✅.

## Out of scope (deferred)

- Dark mode (plan or implementation) — dropped entirely from M3 per the MVP
  descope; `polish-plan.md` M5's "Dark mode implementation (per M3.4 plan)"
  line is stale and gets corrected when M3 ships.
- The leftover shadcn-scaffold `.dark { … }` block in `globals.css` — noted
  for awareness, not touched.
- Promoting this session's `use_figma`-based export mechanism into the
  `token-sync` skill itself — the skill continues to document the
  `figma-console` path only.
- Chart tokens in oklch, sidebar mobile sheet — M5 backlog, unrelated.
