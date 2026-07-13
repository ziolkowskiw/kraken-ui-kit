# Kraken UI Kit — Polish Plan (audit + roadmap to a shippable v0.1)

Audited 2026-07-11 against the repo state on `main` (post PR #7, machine-readable
layer merged). Method: read `manifests/foundations.json`, both plan docs, the two
`audit/` reports, ran `npm run manifests:check` (green), and verified the
distribution, CI, and test surfaces directly.

**Status legend:** ✅ done & verified · 🟡 built but not operational · ⬜ not started

---

## Part 1 — What has been done (verified, not self-reported)

| Pillar | State | Evidence |
|---|---|---|
| 3-layer token architecture | ✅ | 827 tokens (302 global / 249 semantic / 276 component) in `tokens/tokens.dtcg.json`; `tokens:build` produces cascade-correct CSS; jit⇄brand switch verified end-to-end |
| Component kit | ✅ | 56 tokenized components + 57 stories; 53/53 visual parity QA (2026-06-23); shadcn base-nova consistency audit run **and applied in two sweeps** (36/45 exact-match, remainder is the documented divergence contract in MAPPING.md) |
| Figma ↔ code mapping | ✅ | MAPPING.md — 40 parents, node-ID disambiguation, conventions block; `figma-binder` + `mapping-doctor` keep it honest |
| Machine-readable layer | ✅ | 56 component manifests + foundations/tokens/index, 5 JSON schemas, overrides judgment layer; `manifests:check` (schemas + byte-drift + cross-checks) passes today |
| MCP server | ✅ | `@kraken-ui/mcp` package complete (6 tools, self-contained bundle) — **local-only by design** (run from a clone; deliberately not published to npm); install docs point at `node <clone>/mcp/dist/index.js`, `mcp/package.json` is `private` |
| shadcn registry | 🟡 | `registry.json` (58 items) + compiled `public/r/*.json`, internal deps namespaced to `@kraken/*`; **GitHub Pages workflow ready, hosting not yet enabled**; consumer `registries` config now documented (README, foundations.json, llms.txt, skill) |
| AI entry points | ✅ | `llms.txt` (root + public), `CLAUDE.md`, 7 skills, 3 agents, Storybook addon-mcp installed |
| Governance | 🟡 | Release script works, `v0.0.1` tagged (2026-06-28) — but everything since (storybook quality, consistency sweeps, machine-readable layer) is unreleased, and **no CI exists** despite CLAUDE.md promising "CI byte-diffs them" |
| Figma-first theming | ⬜ | Direction locked (theme editor removed 2026-07; themes = Figma semantic modes + token-sync) but the "add a new brand" runbook/skill doesn't exist yet |

## Part 2 — Gap analysis (why it isn't "polished" yet)

**A. Distribution isn't real (from a public GitHub repo — no npm).** This is a
UI/UX design-system **case study**, not a shipped product, so distribution is
deliberately GitHub-only: components install via a **GitHub Pages** shadcn
registry (`npx shadcn add @kraken/button`), and the MCP runs **local-only** from
a clone (`claude mcp add kraken-ui -- node <clone>/mcp/dist/index.js`) — never
npm. Today the registry has no hosted URL (Pages not yet enabled) and the docs
still needed the consumer `registries` config. Closing this makes the two
install flows real for anyone who clones the public repo.

**B. Nothing defends the invariants.** No `.github/workflows`, no `npm test`, no
lint. `manifests:check`, `tsc`, `next build`, and the story render-tester
(`scripts/sb-test.mjs`) all exist but only run when a human remembers.
The provenance rule ("generated files are never hand-edited, CI byte-diffs
them") is currently enforced by good intentions.

**C. Test infra is installed but dormant.** vitest + `@storybook/addon-vitest` +
playwright + `@storybook/addon-a11y` are all in devDependencies and
`vitest.config.ts` is wired for browser-mode story tests — but there is no
`test` script and nothing has ever run them in anger.

**D. Doc rot contradicts the machine-readable ethos.** `JIT-DS-2.0-execution-plan.md`
still records Phase 8 (theme editor) as ✅ shipped — it was removed; README
hardcodes counts (56 components / 58 items / 827 tokens) that will silently
drift; `machine-readable-ds-plan.md` is fully executed and should be archived;
`debug-storybook.log` sits untracked at root.

**E. Token story has two known holes.** No elevation/shadow tokens (components
use Tailwind `shadow-sm/md/lg` — a brand cannot theme elevation; audit §P3.14),
and dark mode is deferred (needs the `brand × light/dark` semantic-mode matrix).

**F. Smaller backlog.** Sidebar mobile sheet mode; chart tokens in oklch;
Moderat JIT font not distributable (consumers need a documented fallback);
no hosted Storybook (Chromatic addon installed but unconfigured).

## Part 3 — The plan

### Milestone 1 — Make distribution real, GitHub-only (the v0.1.0 tag) · ~1.5 d

> **Scope pivot (2026-07-13):** this is a portfolio case study, not a product.
> **No npm publish.** Components install from a GitHub Pages registry; the MCP
> runs local-only from a clone. See memory/`project-purpose-portfolio` +
> `mcp-publish-decision-open`.

1. **Host the registry on GitHub Pages.** ✅ `.github/workflows/pages.yml` added
   (regenerates + serves `r/*.json`, `registry.json`, `llms.txt`, `manifests/`);
   internal registry deps namespaced to `@kraken/*`; consumer `registries: {
   "@kraken": "https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json" }` block
   documented (README, foundations.json `install`, llms.txt, skill). **Remaining:
   enable Pages in repo Settings (Source: GitHub Actions).**
2. **Keep `@kraken-ui/mcp` local-only.** ✅ No npm publish. Install docs point at
   `claude mcp add kraken-ui -- node <clone>/mcp/dist/index.js`; `scripts/release.mjs`
   no longer publishes; `mcp/package.json` marked `private` as a guard.
3. **Run the end-to-end proof** (never executed): in a scratch repo, `npx shadcn
   add @kraken/dialog` from the hosted registry (assert tokenized install, no hex),
   add the local MCP, prompt an agent for a destructive confirm dialog, assert
   `variant="destructive"`, tokens, no hex.
4. **Cut v0.1.0** — a **local/GitHub tag only** (never npm), first release
   containing the machine-readable layer.

### Milestone 2 — Make the invariants self-defending (CI + tests) · ~1.5 d

1. **GitHub Actions `ci.yml`**: `npm ci` → `tsc --noEmit` → `manifests:check`
   (the byte-drift gate CLAUDE.md already promises) → `registry:build` +
   `tokens:build` drift check (regenerate, `git diff --exit-code`) →
   `next build` → `build-storybook`.
2. **Wire the dormant test rig**: add `"test": "vitest"` (storybook browser-mode
   project already configured); enable a11y assertions per story via
   addon-a11y's test integration; run headless in CI. Promote
   `scripts/sb-test.mjs` (console-error catcher) into the suite or retire it.
3. **Lint/format**: ESLint 9 flat config + Prettier, matching current style,
   `lint` script in CI. Cheap now, expensive later.
4. **Publish Storybook** (GitHub Pages job or Chromatic — Chromatic also gives
   visual regression, replacing the manual parity QA pass for future changes).

### Milestone 3 — Complete the theming story (the actual product promise) · ~1 d

1. **`add-brand` runbook/skill**: the Figma-first path end-to-end — add a mode to
   the `semantic` collection in Figma → `token-sync` → `tokens:build` → verify
   with the brand toggle. This closes the README's last ⬜ and proves the
   "style the kit for a new client in Figma" pitch with a repeatable ritual.
2. **Elevation tokens**: add a `--ds-shadow-*` family (L1 ramp + semantic roles)
   to Figma + pipeline; rebind the 10 files using Tailwind shadows.
3. **Font strategy doc**: what consumers without Moderat JIT get (fallback
   stack), and how a client brand supplies its own font via one semantic token.
4. **Dark mode**: *plan only* in this milestone — decide the
   `brand × light/dark` mode-matrix shape in Figma before any code. Ship as v0.2.

### Milestone 4 — Truth pass on the docs · ~0.5 d

1. README: derive the status section from reality (counts from `manifests/index.json`,
   registry item count from `registry.json`) — or generate that block.
2. Archive completed plans (`machine-readable-ds-plan.md`, execution plan → `docs/archive/`),
   fix the stale Phase-8 record, delete `debug-storybook.log` (+ gitignore `*.log`).
3. MAPPING.md sweep via `mapping-doctor` against the live Figma file.
4. Add this file's Part 3 to the README status block as the visible roadmap.

### Milestone 5 — Backlog (post-v0.2, order by demand)

- Sidebar mobile sheet mode (last real P2 from the consistency audit).
- Chart tokens in oklch.
- Dark mode implementation (per M3.4 plan).
- `get_examples` MCP tool (per-component copy-paste snippets sourced from stories).
- Monthly `drift-audit` as a scheduled ritual (calendar/cron, not memory).

### Sequencing & effort

M1 → M2 are the polish-critical path (~3 days) and independent of Figma access.
M3 needs the Figma file. M4 is a half-day anytime after M1. Total to "polished
v0.2": **~4.5 days** of focused work.

### Definition of "polished"

1. A stranger's repo can install a component **and** the MCP server using only
   what README says — no tribal knowledge.
2. CI is red when any generated artifact drifts from its source.
3. A new brand can be authored in Figma and land in code via one documented ritual.
4. Every status claim in README is either generated or dated.
