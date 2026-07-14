# Milestone 4 — Truth pass on the docs

**Date:** 2026-07-14
**Branch:** `feat/m4-doc-truth`
**Source of truth for scope:** `polish-plan.md` Part 3, Milestone 4
**Context:** M1 (distribution), M2 (CI + tests), M3 (theming) shipped or in
final review. This is a portfolio / design-system case study (see
memory/`project-purpose-portfolio`).

## Problem

`polish-plan.md`'s own audit flagged doc rot: README hardcodes counts that
silently drift, a fully-executed plan (`JIT-DS-2.0-execution-plan.md`) still
records a feature (the visual theme editor) as shipped when it was later
removed, and the roadmap living in `polish-plan.md` isn't discoverable from
the README front door. This milestone closes those gaps — and, for the
count-drift problem specifically, closes it in a way that can't recur.

**Confirmed, not hypothetical:** the registry count is already wrong today
(`README.md` says 58 items; `registry.json` actually has 60 — drifted since
M1 added base items). The parent-component count is also wrong (`README.md`
says 40; `MAPPING.md`'s own "Coverage" section says 47). The token count
(827) happens to still be accurate as of `main` pre-M3, but M3 adds 8 more
(5 global + 3 semantic shadow tokens) — once M3 merges this becomes stale
too unless the count is generated.

## Locked decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Count-drift fix | **Auto-generate the block** (not a one-time manual fix) | A manual fix resets the clock but doesn't close the gap — the exact same drift recurs at the next component/token change. Matches this project's existing "generated, never hand-edited" philosophy for everything else that can drift. |
| Sequencing vs. M3 | **Start now, based on `main`** (M3 not yet merged) | User's explicit choice. The generated README counts will reflect pre-M3 numbers (827 tokens, no shadow tokens) until M3 merges, at which point a re-run of the generator (not a plan change) picks up the new numbers automatically — this is the generator working as intended, not a gap in this milestone. |
| Stale Phase-8 record | **Superseded banner, not a rewrite** | Preserves the historical record (the theme editor genuinely shipped 2026-06-28, then was later removed per the Figma-first theming direction) rather than silently erasing what happened. |

## Current state (verified 2026-07-14, against `main`)

- `README.md`'s Status section (bottom of file) hand-states: "827 tokens (3
  layers)", "56 components", "40 parent components", "58 items" (registry),
  plus two ⬜ lines (Figma-first theming, Governance).
- Real counts, verified directly:
  - `manifests/tokens.json`: `.layers.global` = 302, `.layers.semantic` = 249,
    `.layers.component` (summed across all component sub-objects) = 276.
    Total 827 — matches README today, but only because M3 hasn't merged.
  - `manifests/index.json`: 56 entries — matches README.
  - `registry.json`: `.items | length` = **60**, not 58 — README is wrong now.
  - `MAPPING.md`'s own "## Coverage" section states "**47 parent components
    mapped**" — README's "40" is wrong now. `MAPPING.md` structures parent
    entries two different ways (Part 1: `### ` headers, one per component;
    Parts 2–3: markdown table rows) — no single mechanical parse pattern
    covers both cleanly, so the generator trusts `MAPPING.md`'s own stated
    count (extracted via a stable regex against the Coverage section) rather
    than re-deriving it independently. Keeping that count accurate is
    `mapping-doctor`'s job (this milestone's Task 3), not README generation's.
- `.github/workflows/ci.yml`'s drift gate currently regenerates and diffs
  `src/styles/tokens.css`, `registry.json`, `public/r`, `manifests`,
  `docs/components` — **not** `README.md`. Making README's counts generated
  without adding it to this list would mean a future drift goes uncaught,
  defeating the purpose.
- `CLAUDE.md`'s provenance table (the "Generated vs authored" section) lists
  `manifests/**`, `docs/components/**`, `registry.json`, `src/styles/tokens.css`
  as generated/never-hand-edited. It does not yet mention README's status
  block.
- `debug-storybook.log` (repo root, 28KB): untracked, and already matched by
  an existing `.gitignore` pattern (`*storybook.log`, line 40) — the
  "gitignore *.log" half of the polish-plan item is already done; only the
  physical file deletion remains.
- `docs/archive/` does not exist yet.
- `JIT-DS-2.0-execution-plan.md` (repo root, 24KB): confirmed stale — line 8
  still lists "Live semantic-layer theme editor" as a planned pillar; line 68
  and line 193 mark "Phase 8 — Visual semantic-layer theme editor" as
  "✅ (2026-06-28 — complete including import/export and push-to-Figma)".
  Per memory/`figma-first-theming`, this was later **removed** (July 2026;
  themes are now Figma semantic modes + token-sync, never in-code builders).
  The doc never recorded the removal.
- `machine-readable-ds-plan.md` (repo root, 11KB): fully executed (the
  machine-readable manifest layer it planned is live and has been for
  several milestones) — a pure archive candidate, no stale-content fix needed.
- `.claude/skills/mapping-doctor/SKILL.md` exists and defines exactly the
  checks this milestone's Task 3 needs (node IDs resolve, every `.tsx`
  mapped, prop tables current, GitHub links valid, duplicate-name
  disambiguation intact). Figma access is confirmed working this session via
  the general Figma MCP (`use_figma`, used extensively during M3).
- The "release agent" README's Governance line references is real (the
  `release` subagent type exists and cuts versioned releases) — the ⬜ is
  stale in one respect (v0.1.0 was already tagged in M1) but accurate in
  another (monthly `drift-audit` is not yet a scheduled ritual — that's M5
  backlog). This line needs a wording fix, not a full generation treatment.

## Architecture

Four independent deliverables.

### 1. Auto-generated README status counts

**New file:** `scripts/build-readme-status.mjs`. Reads:
- `manifests/tokens.json` → global/semantic/component counts, summed for the
  total.
- `manifests/index.json` → component count.
- `registry.json` → `.items.length`.
- `MAPPING.md` → parent-component count, extracted via a regex against the
  literal "**N parent components mapped**" sentence in its "## Coverage"
  section.

**`README.md` change:** wrap the Status section's count-bearing lines in
marker comments:
```markdown
<!-- STATUS:START -->
...existing prose, with {{TOKEN_COUNT}}, {{COMPONENT_COUNT}},
{{PARENT_COUNT}}, {{REGISTRY_COUNT}} placeholders where numbers appear...
<!-- STATUS:END -->
```
The script replaces only the content between the markers with the template's
placeholders substituted — hand-curated prose and the ✅/⬜ checkmarks outside
the numbers survive every regen untouched. The Governance line's ⬜ gets a
one-time hand fix as part of this task (wording, not generation — see
"Current state" above) since it's a narrative correctness issue, not a count.

**Wiring:** add a `readme:build` npm script (`node scripts/build-readme-status.mjs`)
to `package.json`, then call `npm run readme:build` as an additional line
inside the existing `docs:build` npm script (`package.json`'s `scripts.docs:build`
becomes `node scripts/build-docs.mjs && npm run readme:build`) — this way
every existing caller of `docs:build` (the drift gate, `release.mjs`) picks
up the README regeneration automatically with no separate wiring elsewhere.

**CI change:** `.github/workflows/ci.yml`'s drift gate step adds `README.md`
to both the regeneration chain and the `git diff --exit-code` path list —
this is the change that actually closes the drift gap going forward.

**`CLAUDE.md` change:** add `README.md` (status block only) as a row in the
"Generated vs authored" provenance table, pointing at
`scripts/build-readme-status.mjs` as the source to edit instead.

### 2. Archive + fix stale docs

- Create `docs/archive/`.
- Move `machine-readable-ds-plan.md` → `docs/archive/machine-readable-ds-plan.md`
  (`git mv`, preserving history).
- Move `JIT-DS-2.0-execution-plan.md` → `docs/archive/JIT-DS-2.0-execution-plan.md`
  (`git mv`), and before moving, prepend a banner:
  ```markdown
  > **⚠️ Superseded (2026-07-14):** Phase 8 (the visual semantic-layer theme
  > editor) shipped 2026-06-28 as described below, but was **later removed**
  > — themes are now authored as Figma semantic modes + `token-sync`, never
  > an in-code builder. See `docs/token-pipeline.md` and the `add-brand`
  > skill for the current ritual. This document is preserved for historical
  > record only; do not treat any "✅ complete" marker below as describing
  > the current system.
  ```
- Delete `debug-storybook.log` (`rm`, not `git rm` — it's untracked).
- Check for any other repo files/docs linking to either archived file's old
  path (`grep -rl` for both filenames across `*.md`) and update those links
  to the new `docs/archive/` path.

### 3. MAPPING.md sweep

Run the `mapping-doctor` skill's checks (via the Figma MCP already proven
working this session) against the live JIT DS 2.1 file:
1. Every node ID in `MAPPING.md` resolves.
2. Every `src/components/ui/*.tsx` (excluding `*.stories.tsx`) has a
   `MAPPING.md` entry, and every entry points at a file that exists.
3. Prop tables (Part 1's 12 full tables) match current exported props/CVA
   variants.
4. Every GitHub source link resolves to an existing file at
   `…/blob/main/src/components/ui/<file>`.
5. Duplicate-name disambiguations (Part 4) still hold.

Fix whatever drift is found. If nothing is found, the sweep still counts as
done — the milestone's value is the verification, not manufacturing fixes.

### 4. Roadmap visibility

Add one line to README's Status section (inside or immediately after the
generated block, hand-authored since it's not a count):
```markdown
Full roadmap: [`polish-plan.md`](polish-plan.md) Part 3.
```

## Testing strategy

- **README generation:** run `node scripts/build-readme-status.mjs`, confirm
  the Status block's numbers match the verified real counts above (60
  registry items, 47 parent components, current token/component totals).
  Run it twice in a row — the second run must produce zero diff (idempotent).
  Manually corrupt one number in README, re-run, confirm it's corrected.
- **CI drift gate:** locally simulate what CI will do —
  `npm run tokens:build && npm run registry:bundle && npm run manifests:build
&& npm run docs:build` (whatever the final wiring calls) then
  `git diff --exit-code -- README.md <other existing drift-gate paths>` —
  must be clean on the committed tree.
- **Archive:** confirm `git log --follow` on both moved files still shows
  their pre-move history. Confirm no remaining repo file links to the old
  root-level paths.
- **MAPPING.md sweep:** each of the 5 checks reports PASS/FAIL explicitly;
  any FAIL gets fixed and re-verified.

## Definition of done

1. README's Status section numbers are generated, verified correct against
   real sources, and protected by CI's drift gate (extended to cover
   `README.md`).
2. `docs/archive/` exists with both stale docs moved (history preserved via
   `git mv`); the Phase-8 record carries a superseded banner instead of a
   silent rewrite; `debug-storybook.log` is gone; no dangling links to the
   old paths remain.
3. `mapping-doctor`'s 5 checks all report PASS (after fixes, if any were
   needed).
4. README's Status section links to `polish-plan.md`'s roadmap.

## Out of scope (deferred)

- Scheduling `drift-audit` as an actual monthly ritual (calendar/cron) —
  M5 backlog; this milestone only fixes the Governance line's stale wording,
  it doesn't implement scheduling.
- Re-running the README generator after M3 merges to pick up the +8 token
  count and the Figma-first theming ⬜→✅ flip — this happens naturally the
  next time the generator runs (e.g., the next release or CI run on `main`
  post-merge), not as a task in this milestone.
- Any content changes to `MAPPING.md` beyond what the mapping-doctor sweep's
  5 checks find as actual drift — no speculative restructuring.
