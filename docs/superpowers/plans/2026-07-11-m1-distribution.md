# M1 Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the kit's two headline install commands work for a stranger's repo — a hosted shadcn registry with correctly-namespaced cross-item dependencies, and a publishable `@kraken-ui/mcp` package — then release it as v0.1.0.

**Architecture:** Phase A is reversible local prep executed autonomously (registry dep-namespacing fix, a GitHub Pages CI workflow, consumer-config docs, a release-script publish step, a local MCP pack smoke test). Phase B is the irreversible outward ship (npm publish, enabling Pages, the end-to-end proof, and the version tag) — each step user-gated, never auto-run. This plan makes Phase A executable and documents Phase B as a gated checklist.

**Tech Stack:** Node ESM build scripts (`scripts/*.mjs`), shadcn CLI (`shadcn build`), GitHub Actions (`upload-pages-artifact` + `deploy-pages`), npm publish, `@modelcontextprotocol/sdk`.

## Global Constraints

- **Provenance rule:** never hand-edit generated files — `manifests/**` (except `overrides/`), `registry.json`, `docs/components/**`, `src/styles/tokens.css`, `public/r/*.json`. Edit the source script and regenerate. (CLAUDE.md)
- **Registry host URL base (locked):** `https://ziolkowskiw.github.io/kraken-ui-kit/` — registry served at `https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json`.
- **npm package name (locked):** `@kraken-ui/mcp` (scoped). Fallback `kraken-ui-mcp` only if the scope is unclaimable — a Phase B decision, not assumed here.
- **Namespace token in consumer config / deps:** `@kraken` (e.g. `@kraken/dialog`). The scoped npm name `@kraken-ui/mcp` is unrelated to the `@kraken` registry namespace — do not conflate them.
- **Banned name:** never introduce "randstadt". The second brand is `brand`.
- **Irreversible / outward-facing steps are user-gated:** `npm publish`, enabling GitHub Pages, and the `v0.1.0` git tag each require an explicit user confirm. Phase A never triggers any of them.
- **shadcn-standard primitive kept bare:** `utils` (shadcn resolves it against its own default registry; our copy is byte-identical clsx+tailwind-merge with no token dependency).
- One `cva()` per component, `defaultVariants` present, rationale comment directly above — do not disturb (extractors depend on it). This plan touches no component `.tsx`.

---

### Task 1: Namespace cross-registry dependencies (A1)

Registry items reference sibling items by **bare** name (`registryDependencies: ["theme","utils"]`). From a consumer, shadcn resolves bare names against ui.shadcn.com, not `@kraken` — so `theme`/`tokens` 404 and `button`/`dialog`/etc. silently resolve to shadcn's un-tokenized base. Fix: `@kraken/`-prefix every dep that is a Kraken registry item, except the shadcn-standard `utils`.

**Files:**
- Modify: `scripts/build-registry.mjs` (the source — `registry.json` and `public/r/*.json` are generated)
- Regenerated (do not hand-edit): `registry.json`, `public/r/*.json`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `registry.json` / `public/r/*.json` whose internal `registryDependencies` are `@kraken/`-prefixed (except `utils`). Task 2 (Pages workflow) ships these files; Task 6 (B3 proof) is their arbiter.

- [ ] **Step 1: Capture the failing "before" state**

Run:
```bash
node -e "console.log(require('./public/r/button.json').registryDependencies)"
node -e "console.log(require('./public/r/theme.json').registryDependencies)"
```
Expected (current, wrong): `[ 'theme', 'utils' ]` and `[ 'tokens' ]` — bare names. This is the bug.

- [ ] **Step 2: Add the namespacing pass to the build script**

In `scripts/build-registry.mjs`, the `base` array is defined at lines 49–80 and the `registry` object at lines 82–87. Insert the namespacing pass between them — after `const base = [ … ];` (line 80) and before `const registry = {` (line 82):

```js
// shadcn ships `utils` (cn helper) as a built-in; keep it bare so a consumer's
// default registry resolves it. Every other item we own is Kraken-only and must
// carry the @kraken namespace, or bare deps resolve against ui.shadcn.com and
// either 404 (theme/tokens) or silently pull shadcn's un-tokenized base.
const SHADCN_PRIMITIVES = new Set(["utils"]);
const krakenNames = new Set([...base, ...items].map((i) => i.name));
const nsDep = (d) =>
  krakenNames.has(d) && !SHADCN_PRIMITIVES.has(d) ? `@kraken/${d}` : d;
for (const item of [...base, ...items]) {
  if (item.registryDependencies) {
    item.registryDependencies = item.registryDependencies.map(nsDep);
  }
}
```

- [ ] **Step 3: Regenerate the registry and manifests**

Run:
```bash
npm run registry:bundle
```
Expected: `registry.json written: 60 items (56 components + 4 base).` followed by the shadcn build compiling `public/r/*.json`, no errors.

- [ ] **Step 4: Verify the deps are now namespaced (the passing state)**

Run:
```bash
node -e "console.log(require('./public/r/button.json').registryDependencies)"
node -e "console.log(require('./public/r/theme.json').registryDependencies)"
```
Expected: `[ '@kraken/theme', 'utils' ]` and `[ '@kraken/tokens' ]`.

- [ ] **Step 5: Assert no bare Kraken deps remain anywhere, and `utils` stayed bare**

Run:
```bash
node -e '
const fs=require("fs");
const names=new Set(require("./registry.json").items.map(i=>i.name));
const prim=new Set(["utils"]);
let bad=[];
for (const f of fs.readdirSync("public/r").filter(f=>f.endsWith(".json"))) {
  const j=JSON.parse(fs.readFileSync("public/r/"+f,"utf8"));
  for (const d of j.registryDependencies||[]) {
    if (names.has(d) && !prim.has(d)) bad.push(f+" -> "+d);        // bare Kraken dep = bug
    if (d.startsWith("@kraken/utils")) bad.push(f+" -> "+d);       // utils must stay bare
  }
}
console.log(bad.length ? "FAIL:\n"+bad.join("\n") : "OK: all internal deps namespaced, utils bare");
process.exit(bad.length?1:0);
'
```
Expected: `OK: all internal deps namespaced, utils bare`.

- [ ] **Step 6: Confirm the drift gate is green**

Run:
```bash
npm run manifests:check
```
Expected: passes (schemas + drift byte-diff + cross-checks). If it reports drift, a generated file was left stale — re-run `npm run registry:bundle && npm run manifests:build`.

- [ ] **Step 7: Sanity-check the diff is deps-only**

Run:
```bash
git diff --stat registry.json public/r/ scripts/build-registry.mjs
git diff registry.json | grep -E '^[+-]' | grep -i 'registrydependenc\|@kraken\|"theme"\|"tokens"\|"utils"' | head -40
```
Expected: changes are limited to the build script and `@kraken/` prefixes on internal deps (`utils` unchanged). No titles/descriptions/file paths changed.

- [ ] **Step 8: Commit**

```bash
git add scripts/build-registry.mjs registry.json public/r/ manifests/
git commit -m "fix(registry): namespace cross-item deps as @kraken/* so consumers resolve them

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: GitHub Pages deploy workflow (A2)

Add a CI workflow that regenerates the registry (doubling as a drift guard) and publishes `r/*.json` plus the AI-facing files to GitHub Pages. Enabling Pages in repo Settings is deferred to Phase B; this task only lands the workflow file.

**Files:**
- Create: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: the namespaced `public/r/*.json` from Task 1 (regenerated fresh in CI).
- Produces: a Pages deployment serving `https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json`, `.../registry.json`, `.../llms.txt`, `.../MAPPING.md`, `.../manifests/**`. Task 6 (B2/B3) consumes these URLs.

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy registry to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

# Least-privilege for Pages deploy via OIDC.
permissions:
  contents: read
  pages: write
  id-token: write

# One in-flight deploy at a time; let a newer push supersede an older run.
concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      # Regenerate from source in CI — a drift guard: if a generated file was
      # hand-edited, the assembled artifact won't match what's committed.
      - run: npm run registry:bundle
      - name: Assemble the static site
        run: |
          rm -rf _site
          mkdir -p _site/r
          cp -r public/r/. _site/r/
          cp registry.json _site/registry.json
          cp llms.txt _site/llms.txt
          cp MAPPING.md _site/MAPPING.md
          cp -r manifests _site/manifests
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Validate the YAML parses**

Run:
```bash
node -e "const fs=require('fs');const s=fs.readFileSync('.github/workflows/pages.yml','utf8');require('child_process');console.log('bytes:',s.length)"
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/pages.yml')); print('YAML OK')"
```
Expected: `YAML OK` (if PyYAML is unavailable, skip — the `actionlint` check below is the real gate).

- [ ] **Step 3: Lint the workflow if actionlint is available (optional)**

Run:
```bash
command -v actionlint >/dev/null && actionlint .github/workflows/pages.yml || echo "actionlint not installed — skipping (CI will surface errors on first push)"
```
Expected: `actionlint` passes, or the skip message. Do not install actionlint just for this.

- [ ] **Step 4: Dry-run the artifact assembly locally**

Run:
```bash
rm -rf /tmp/_site_check && mkdir -p /tmp/_site_check/r \
  && cp -r public/r/. /tmp/_site_check/r/ \
  && cp registry.json llms.txt MAPPING.md /tmp/_site_check/ \
  && cp -r manifests /tmp/_site_check/manifests \
  && test -f /tmp/_site_check/r/button.json \
  && node -e "console.log('button deps served:', require('/tmp/_site_check/r/button.json').registryDependencies)" \
  && rm -rf /tmp/_site_check
```
Expected: `button deps served: [ '@kraken/theme', 'utils' ]` — proving the assembled site carries the Task-1 fix.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/pages.yml
git commit -m "ci(pages): deploy the shadcn registry + AI files to GitHub Pages

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Consumer-side registries config docs (A3)

A consumer needs a `registries` block in their `components.json` before `npx shadcn add @kraken/*` can resolve. Document it everywhere the install line appears: README (authored), `llms.txt` + `public/llms.txt` (authored duplicates), and the generated `foundations.json` install block (edit its source in `build-manifests.mjs`).

**Files:**
- Modify: `README.md:93-97` (Quick-start consume block)
- Modify: `llms.txt:17-19` (Install section)
- Modify: `public/llms.txt` (identical duplicate of `llms.txt` — same edit)
- Modify: `scripts/build-manifests.mjs:293-298` (source of `foundations.json` `install`)
- Regenerated (do not hand-edit): `manifests/foundations.json`

**Interfaces:**
- Consumes: the locked URL base from Global Constraints.
- Produces: a copy-paste `registries` snippet in all four surfaces. No later task depends on the text; Task 6 (B3) uses the same snippet in the scratch repo.

- [ ] **Step 1: Update the README consume block**

In `README.md`, replace the block at lines 93–97:

```markdown
To consume the kit from another app:

```bash
npx shadcn add @kraken/button    # installs tokenized, brand-switchable
```
```

with:

```markdown
To consume the kit from another app, add the Kraken registry to your
`components.json`, then install any component:

```jsonc
// components.json
"registries": {
  "@kraken": "https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json"
}
```

```bash
npx shadcn add @kraken/button    # installs tokenized, brand-switchable
```
```

- [ ] **Step 2: Update the `llms.txt` Install section**

In `llms.txt`, replace the Install section (lines 17–19):

```markdown
## Install

- [Registry](registry.json): shadcn registry, namespace @kraken — `npx shadcn add @kraken/<name>`; the `ai-foundations` item installs foundations.json into your repo.
```

with:

```markdown
## Install

- Configure the registry once in your `components.json`: `"registries": { "@kraken": "https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json" }`.
- [Registry](registry.json): shadcn registry, namespace @kraken — then `npx shadcn add @kraken/<name>`; the `ai-foundations` item installs foundations.json into your repo.
```

- [ ] **Step 3: Mirror the same edit into `public/llms.txt`**

`public/llms.txt` is a byte-identical duplicate of `llms.txt` (release.mjs stages both). Apply the exact same Install-section replacement from Step 2 to `public/llms.txt`, then verify they match:

```bash
diff -q llms.txt public/llms.txt && echo "IDENTICAL (good)"
```
Expected: `IDENTICAL (good)`.

- [ ] **Step 4: Add the registries URL to the generated foundations install block (source edit)**

In `scripts/build-manifests.mjs`, the `install` object is at lines 293–298:

```js
  install: {
    registryNamespace: "@kraken",
    component: "npx shadcn add @kraken/<name>",
    bootstrap: "npx shadcn add @kraken/theme (pulls the tokens item automatically)",
    mcp: "claude mcp add kraken-ui -- npx -y @kraken-ui/mcp",
  },
```

Add the `registriesConfig` field so agents reading `foundations.json` get the consumer prerequisite:

```js
  install: {
    registryNamespace: "@kraken",
    registriesConfig:
      'Add to consumer components.json before installing: "registries": { "@kraken": "https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json" }',
    component: "npx shadcn add @kraken/<name>",
    bootstrap: "npx shadcn add @kraken/theme (pulls the tokens item automatically)",
    mcp: "claude mcp add kraken-ui -- npx -y @kraken-ui/mcp",
  },
```

- [ ] **Step 5: Regenerate and verify foundations.json picked it up**

Run:
```bash
npm run manifests:build
node -e "console.log(require('./manifests/foundations.json').install)"
```
Expected: the printed object includes `registriesConfig` with the Pages URL.

- [ ] **Step 6: Confirm the drift gate is green**

Run:
```bash
npm run manifests:check
```
Expected: passes. (If the `install` object is schema-validated and rejects the new key, add `registriesConfig` to the foundations schema under `schemas/` — search `grep -rl "registryNamespace" schemas/` — then re-run. Only touch the schema if the check fails.)

- [ ] **Step 7: Commit**

```bash
git add README.md llms.txt public/llms.txt scripts/build-manifests.mjs manifests/foundations.json schemas/
git commit -m "docs: document the consumer registries config for @kraken installs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Publish the MCP package from the release script (A4)

`scripts/release.mjs` already version-bumps `mcp/package.json` in lockstep (lines 133–140) but never publishes it. Add a guarded `npm publish ./mcp` after the git tag, preserving the dry-run default (publish only under `--yes`). **Note:** use `npm publish ./mcp`, NOT `npm --prefix mcp publish` — `--prefix` only sets config/node_modules resolution and packs the ROOT package (`kraken-ui-kit`, which is `private:true`), so `--prefix` would fail to publish the MCP. `npm publish ./mcp` packs the folder's own `@kraken-ui/mcp` package. (Corrected during execution after the Task 5 smoke test caught it.)

**Files:**
- Modify: `scripts/release.mjs` — dry-run summary (around lines 97–107) and the execute path (after line 156, the `git tag` step)

**Interfaces:**
- Consumes: the `run()` helper (line 43) which already no-ops unless `--yes` is passed.
- Produces: on `--yes`, `@kraken-ui/mcp@<version>` published to npm as the last release step. Task 6 (B4) invokes this via `npm run release:minor -- --yes`.

- [ ] **Step 1: Add the publish step to the dry-run summary**

In `scripts/release.mjs`, the dry-run step list ends at line 107 with `console.log(\`   10. (print push instructions)\`);`. Insert a step before it:

```js
  console.log(`   10. npm publish ./mcp  (publishes @kraken-ui/mcp@${nextVersion})`);
  console.log(`   11. (print push instructions)`);
```
and delete the old line 107 (`   10. (print push instructions)`).

- [ ] **Step 2: Add the publish step to the execute path**

The execute path ends (lines 155–160) with the tag step and push instructions:

```js
console.log("\n9. Tag");
run(`git tag v${nextVersion}`);

console.log(`\n✅  Release v${nextVersion} committed and tagged.\n`);
console.log(`   Push with:\n`);
console.log(`     git push && git push --tags\n`);
```

Insert the publish step between the tag and the success banner:

```js
console.log("\n9. Tag");
run(`git tag v${nextVersion}`);

console.log("\n10. Publish @kraken-ui/mcp to npm");
// `npm publish ./mcp` packs the folder's own package (NOT `--prefix`, which
// packs the private root). mcp/package.json has prepack -> build, so it rebuilds
// dist + bundled manifests. publishConfig.access is "public".
run(`npm publish ./mcp`);

console.log(`\n✅  Release v${nextVersion} committed, tagged, and @kraken-ui/mcp published.\n`);
console.log(`   Push with:\n`);
console.log(`     git push && git push --tags\n`);
```

- [ ] **Step 3: Verify dry-run shows the publish step and does NOT execute it**

Run:
```bash
npm run release -- --minor
```
Expected: dry-run summary lists `npm publish ./mcp (publishes @kraken-ui/mcp@0.1.0)` under step 10, every command prefixed `[dry-run]`, and exits without publishing or tagging. Confirm nothing was published:
```bash
npm view @kraken-ui/mcp version 2>&1 | head -1
```
Expected: a 404 / "not found" (still unpublished) — the dry-run must not have shipped anything.

- [ ] **Step 4: Commit**

```bash
git add scripts/release.mjs
git commit -m "chore(release): publish @kraken-ui/mcp alongside the version tag

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Local MCP pack smoke test (A5)

Before any publish, prove `@kraken-ui/mcp` packs the right files and boots. Fully local and reversible — no network writes.

**Files:**
- None modified. Verification only. (If a gap is found, fix `mcp/package.json` `files`, `mcp/scripts/copy-manifests.mjs`, or `mcp/src/**` and re-run — but do not pre-emptively change anything.)

**Interfaces:**
- Consumes: `mcp/package.json` (`prepack` → build) and the built `mcp/dist/*`.
- Produces: confidence that Task 6 (B1) publishes a working tarball. No artifact committed.

- [ ] **Step 1: Build the MCP package**

Run:
```bash
npm run mcp:build
```
Expected: installs mcp deps, runs `bundle-manifests` + `tsc`, leaves `mcp/dist/index.js` present.

- [ ] **Step 2: Pack and inspect the tarball contents (dry-run pack)**

Run:
```bash
npm pack ./mcp --dry-run 2>&1 | tail -40
```
Use `npm pack ./mcp` (or `cd mcp && npm pack`), NOT `npm --prefix mcp pack` — `--prefix` packs the ROOT package (`kraken-ui-kit`), not `@kraken-ui/mcp`. Expected: the file list includes `dist/index.js`, `dist/tools.js`, `dist/store.js`, `dist/search.js`, a bundled `manifests/` tree (foundations + components + index + tokens), and `README.md`. It must NOT include `src/`, `node_modules/`, or `package-lock.json`.

- [ ] **Step 3: Assert the required files are actually in the pack**

Run:
```bash
npm pack ./mcp --dry-run --json 2>/dev/null \
  | node -e '
    let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
      // prepack prints a "✓ bundled…" line to stdout ahead of the JSON — slice from the first "["
      const files=JSON.parse(s.slice(s.indexOf("[")))[0].files.map(f=>f.path);
      const need=["dist/index.js","README.md"];
      const hasManifests=files.some(f=>f.startsWith("manifests/"));
      const missing=need.filter(n=>!files.includes(n));
      const leaked=files.filter(f=>f.startsWith("src/")||f.startsWith("node_modules/"));
      console.log("files:",files.length,"| manifests bundled:",hasManifests);
      if(missing.length) console.log("MISSING:",missing);
      if(leaked.length) console.log("LEAKED:",leaked.slice(0,5));
      process.exit(missing.length||leaked.length||!hasManifests?1:0);
    });'
```
Expected: `manifests bundled: true`, no MISSING, no LEAKED, exit 0.

- [ ] **Step 4: Boot the built server and confirm it starts**

Run (10s timeout; the server speaks stdio JSON-RPC and will wait for input, so we just prove it starts without crashing):
```bash
node -e '
const {spawn}=require("child_process");
const p=spawn("node",["mcp/dist/index.js"],{stdio:["pipe","pipe","pipe"]});
let err="";p.stderr.on("data",d=>err+=d);
setTimeout(()=>{
  const crashed=p.exitCode!==null && p.exitCode!==0;
  console.log(crashed?("CRASHED exit="+p.exitCode+" "+err):"OK: server booted and is listening on stdio");
  p.kill();process.exit(crashed?1:0);
},2500);
'
```
Expected: `OK: server booted and is listening on stdio`. (A clean MCP stdio server prints nothing to stdout until it gets a request; a nonzero early exit or a stack trace on stderr is the failure signal.)

- [ ] **Step 5: No commit**

Nothing changed — this task is verification only. If Steps 2–4 revealed a packaging gap, fix the specific file, re-run, then commit that fix with its own message. Otherwise proceed to Task 6.

---

### Task 6: Gated ship — Phase B (USER-DRIVEN, do not auto-run)

Every step here is irreversible or outward-facing. Do **not** execute any of it autonomously. Present each sub-step, get the user's explicit go, then assist. This task has no code to write — it is the release runbook.

**Files:** none (operational).

**Interfaces:**
- Consumes: everything from Tasks 1–5 (namespaced registry, Pages workflow, docs, publish-capable release script, verified pack).
- Produces: the live v0.1.0 release — published MCP, hosted registry, passing e2e proof, git tag.

- [ ] **Step 1 (B1) — Publish the MCP.** GATE: ask the user to run `! npm login` (claims the `@kraken-ui` scope). If the scope is unclaimable, STOP and resurface the fallback decision (`kraken-ui-mcp`) — that would require re-doing the `@kraken-ui/mcp` references in Task 3 docs + `mcp/package.json` before proceeding. Once logged in and the user OKs the packed contents from Task 5, run `npm publish ./mcp` (NOT `--prefix` — that targets the private root). Verify: `npm view @kraken-ui/mcp version` returns the published version.

- [ ] **Step 2 (B2) — Enable Pages.** GATE: ask the user to set repo Settings → Pages → Source: **GitHub Actions**, then push `main` (or trigger `workflow_dispatch`) to fire the Task-2 workflow. Verify: `curl -fsSL https://ziolkowskiw.github.io/kraken-ui-kit/r/button.json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).registryDependencies))"` returns `[ '@kraken/theme', 'utils' ]` (200 + namespaced deps).

- [ ] **Step 3 (B3) — End-to-end proof.** In a scratch repo (outside this tree):
  - Create `components.json` carrying `"registries": { "@kraken": "https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json" }`.
  - Run `npx shadcn add @kraken/dialog`. Assert: it installs Kraken's tokenized dialog, pulls `@kraken/button` + `@kraken/theme` + `@kraken/tokens`, the installed CSS carries `--ds-*` tokens, and there are **no hex literals**. If any component instead resolved to shadcn's un-tokenized base, that is the A1 over-prefixing risk realized — carve the exception in `build-registry.mjs` (`SHADCN_PRIMITIVES`) and re-ship Task 1.
  - Run `claude mcp add kraken-ui -- npx -y @kraken-ui/mcp`, then prompt an agent to build a destructive confirmation dialog. Assert: `variant="destructive"`, correct `--ds-*` tokens, no hex.

- [ ] **Step 4 (B4) — Cut v0.1.0.** GATE: with B1–B3 green, run `npm run release:minor -- --yes` (0.0.1 → 0.1.0). This rebuilds artefacts, bumps root + `mcp/package.json`, prepends CHANGELOG, commits, tags `v0.1.0`, and (Task 4) publishes `@kraken-ui/mcp@0.1.0`. Then, on the user's go: `git push && git push --tags`. Verify: `git tag | grep v0.1.0` and `npm view @kraken-ui/mcp version` both show `0.1.0`.

- [ ] **Step 5 — Update the roadmap.** Mark Milestone 1 complete in `polish-plan.md` (Part 3 → M1) and update the memory `polish-plan-roadmap` to point at M2 as the next active milestone. Commit.

---

## Definition of done

1. A stranger's repo installs a Kraken component **and** the MCP server using only what README says — the B3 proof passes.
2. `registry.json` / `public/r/*` internal deps resolve to `@kraken/*` for consumers (`utils` bare).
3. `@kraken-ui/mcp` is published; the GitHub Pages registry serves `/r/*.json`.
4. `v0.1.0` is tagged and both artifacts released together.

## Out of scope (deferred)

- CI beyond the Pages job (tsc/manifests-drift/lint/tests) — Milestone 2.
- Publishing Storybook — Milestone 2.
- The Figma "randstadt" name flagged by the background token-drift task — Figma-side rename, tracked separately.
- README `## Status` count refresh (`56 components / 58 items / 827 tokens`) and the `llms.txt` "JIT DS 2.0" header — doc-rot, Milestone 4.
