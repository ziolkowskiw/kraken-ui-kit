# Milestone 2 — Make the invariants self-defending (CI + tests)

**Date:** 2026-07-13
**Branch:** `feat/m2-ci-tests`
**Source of truth for scope:** `polish-plan.md` Part 3, Milestone 2
**Context:** M1 shipped (v0.1.0) — registry live on GitHub Pages, MCP local-only.
This is a portfolio / design-system case study (see memory/`project-purpose-portfolio`).

## Problem

The kit's invariants are enforced by good intentions. `CLAUDE.md` promises "CI
byte-diffs them" for generated files, but **no CI exists** — only `pages.yml`.
`manifests:check`, `tsc`, `next build`, and a dormant Storybook test rig all
exist but run only when a human remembers. There is no lint/format. A
contributor (or an agent) can hand-edit a generated file, break a type, or
regress a story and nothing catches it.

Two carry-forwards from M1 also land here:

- `scripts/release.mjs` stages `registry:build` (not `registry:bundle`) and its
  `git add` omits `public/r/`, so a release can leave committed `public/r/*.json`
  stale until the next Pages CI run.
- `pages.yml` uses Node-20 actions now flagged deprecated (forced onto Node 24).

## Locked decisions

| Decision              | Choice                             | Rationale                                                                                                                                                                                                              |
| --------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test ambition         | **Pragmatic gate**                 | Blocking: tsc, manifests:check, drift gate, next build, build-storybook, lint, format. Story browser tests + a11y wired but **non-blocking** first (stabilize before promoting). Best value-to-effort for a portfolio. |
| Storybook host        | **Same Pages site, `/storybook/`** | Zero new infra, GitHub-only, one deploy alongside the registry.                                                                                                                                                        |
| Lint strictness       | **Match current style**            | ESLint 9 flat (Next + typescript-eslint recommended, lightly relaxed) + Prettier so existing code passes with minimal churn; one format sweep, then both block.                                                        |
| `scripts/sb-test.mjs` | **Retire (delete)**                | The addon-vitest story rig supersedes its render-smoke role; one test path.                                                                                                                                            |
| Node version          | **Node 22 LTS**                    | Matches Next 16 / React 19; clears the Node-20 deprecation.                                                                                                                                                            |

## Current state (verified 2026-07-13)

- No `.github/workflows/ci.yml`; only `pages.yml`. No `test` script. No ESLint/Prettier.
- Test rig wired but dormant: `vitest.config.ts` runs Storybook stories in headless
  chromium via `@vitest/browser-playwright`; `@storybook/addon-vitest`,
  `@storybook/addon-a11y`, `@vitest/coverage-v8`, `playwright` all in devDeps.
- `.storybook/main.ts` + `preview.tsx` present; `@chromatic-com/storybook` installed but unconfigured.
- The repo's single GitHub Pages site serves the registry (`/r/`, `/registry.json`, `/llms.txt`, `/manifests/`, `/docs/components/`).
- Generators: `tokens:build`, `registry:build`, `registry:bundle` (= registry:build + manifests:build + `shadcn build` → `public/r/`), `manifests:build`, `manifests:check`, `docs:build`.

## Architecture

Two workflows plus repo config. Each unit is independently testable.

### 1. `.github/workflows/ci.yml` (new)

- **Triggers:** `pull_request` (into any branch) + `push` to `main`.
- **Concurrency:** group per ref, `cancel-in-progress: true`.
- **Permissions:** `contents: read` (least privilege).
- **Setup (shared):** `actions/checkout@v5`, `actions/setup-node@v5` (node 22, `cache: npm`), `npm ci`.

**Job `verify` (blocking):**

1. `npm run tokens:build` — needed before drift diff / build.
2. `tsc --noEmit` (via `npx tsc --noEmit`).
3. `npm run manifests:check` (schemas + existing manifest byte-drift + cross-checks).
4. **Drift gate:** `npm run registry:bundle && npm run manifests:build && npm run docs:build` then `git diff --exit-code`. Fails if any regenerated artifact (`tokens.css`, `registry.json`, `public/r/*`, `manifests/**`, `docs/components/**`) differs from what's committed. This is the core "generated == source" guarantee.
5. `npm run lint`.
6. `npm run format:check`.
7. `npm run build` (`next build`).
8. `npm run build-storybook`.

Ordering: cheap/fast checks (types, drift, lint) before the expensive builds so
failures surface quickly.

**Job `story-tests` (non-blocking):** `continue-on-error: true` at job level so
its status is visible on the PR but never fails the required check.

- `npx playwright install --with-deps chromium`
- `npm test` — vitest Storybook browser project (renders every story headless;
  `@storybook/addon-a11y` assertions surface as part of the run).

### 2. `.github/workflows/pages.yml` (modify)

- Add `npm run build-storybook` to the build job; in "Assemble the static site",
  `cp -r storybook-static/. _site/storybook/` so Storybook serves at
  `…/kraken-ui-kit/storybook/` beside the registry. (Storybook static assets use
  relative URLs, so the subpath needs no base-path config; verify in the deploy.)
- Bump `actions/checkout@v4`→`@v5`, `actions/setup-node@v4`→`@v5`, `node-version: 20`→`22`.
  Leave `upload-pages-artifact` / `deploy-pages` at their current latest majors.

### 3. Lint + format config (new)

- `eslint.config.mjs` — flat config: `eslint-config-next` (core-web-vitals) +
  `typescript-eslint` recommended, plus `eslint-config-prettier` last to disable
  formatting rules. Relax the minimal set of rules needed for the existing code
  to pass (documented inline). Ignore generated dirs (`public/`, `docs/components/`,
  `manifests/`, `mcp/dist/`, `.next/`, `storybook-static/`, `src/styles/tokens.css`).
- `.prettierrc.json` — style matching the current code (single quotes + semicolons,
  per `vitest.config.ts`); `.prettierignore` mirrors the generated-file ignores.
- **One-time format sweep:** run `prettier --write .` once, commit as its own
  mechanical commit, so `format:check` is green from the first CI run.
- `package.json` scripts: `lint` (`eslint .`), `format` (`prettier --write .`),
  `format:check` (`prettier --check .`), `test` (`vitest --run`).
- devDeps: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-config-next`,
  `eslint-config-prettier`, `prettier`.

### 4. Carry-forwards

- `scripts/release.mjs`: `registry:build` → `registry:bundle` in the execute path
  and the dry-run step list; add `public/r/` (and `docs/components/`) to the
  `git add` list so a release commits fresh compiled output. Keep the release
  dry-run default and the no-npm-publish behavior from M1.
- `scripts/sb-test.mjs`: delete. Remove any references (none expected in package.json).

## Testing strategy

- **The CI _is_ the test deliverable.** Verify by: (a) opening the M2 PR and
  confirming the `verify` job passes on the clean tree; (b) a deliberate local
  drift (edit one generated file, e.g. a `public/r/*.json`) makes the drift-gate
  step fail with a non-empty `git diff` — then revert; (c) `story-tests` runs and
  reports without gating.
- **Local pre-flight before the PR:** run each gate locally (`tsc --noEmit`,
  `manifests:check`, the regenerate+`git diff`, `lint`, `format:check`,
  `next build`, `build-storybook`, `npm test`) so CI is green on first push.
- Story-test flake is expected initially; that's why the job is non-blocking.

## Definition of done

1. `ci.yml` runs on the M2 PR; the `verify` job is green on the clean tree and
   **red** when a generated file is hand-edited (drift gate proven).
2. `npm test`, `lint`, `format:check` all exist and pass locally; format:check is green.
3. `pages.yml` deploys the registry **and** a working Storybook at `…/storybook/`,
   with the Node-20 deprecation warnings gone.
4. `release.mjs` regenerates + stages `public/r/` (no post-release drift); `sb-test.mjs` removed.

## Out of scope (deferred)

- Promoting story/a11y tests to blocking (after stabilization) — later.
- Chromatic visual-regression — M5 backlog.
- Dark-mode / brand-matrix tests — depends on M3 theming.
- README status-block generation, plan archival, MAPPING sweep — Milestone 4.
