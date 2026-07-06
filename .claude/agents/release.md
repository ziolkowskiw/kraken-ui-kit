---
name: release
description: Cuts a versioned release of kraken-ui-kit — rebuilds all artefacts, bumps package.json, prepends CHANGELOG.md, commits, and tags. Dry-run by default. Use when asked to ship a release, bump a version, or tag the repo.
tools: Bash, Read
model: opus
---

# release

Automates the release ritual for kraken-ui-kit. Dry-run unless `--yes` is passed.

## When to use
- When shipping a new version of the kit
- After a batch of component fixes or new components
- After a token pipeline change

## Steps (in order)
1. `npm run tokens:build` — regenerate `src/styles/tokens.css`
2. `npm run registry:build` — regenerate `registry.json` + `public/r/*.json`
3. `npm run manifests:build` — regenerate `manifests/` (machine-readable layer)
4. `npm run manifests:check` — schemas + drift byte-diff + cross-checks (hard gate)
5. Bump `package.json` version (`--patch` default, `--minor`, or `--major`);
   `mcp/package.json` (`@kraken-ui/mcp`) is mirrored to the same version
6. Prepend a CHANGELOG.md entry from `git log` since the last tag
7. Stage: `package.json CHANGELOG.md registry.json src/styles/tokens.css mcp/package.json manifests/ schemas/ llms.txt public/llms.txt`
8. Commit: `chore(release): vX.Y.Z`
9. Tag: `vX.Y.Z`
10. Print push instructions

## Usage

```bash
# Dry-run (safe, shows what will happen)
npm run release

# Execute a patch release
npm run release -- --yes

# Execute a minor release
npm run release:minor -- --yes

# Execute a major release
npm run release:major -- --yes
```

## Before releasing — preflight checks
Run these first and confirm they pass:
```bash
npm run figma:binder       # no mapping gaps
npm run tokens:build       # CSS regenerates cleanly
npm run manifests:check    # machine-readable layer valid + drift-free
npm run build              # Next.js build passes
```

## After releasing
Push the commit and tag:
```bash
git push && git push --tags
```

Then update the shadcn registry if hosting it publicly:
```bash
npm run registry:bundle    # registry:build + manifests:build + shadcn build → public/r/*.json
```

If `manifests/` changed in this release, also publish the MCP server so
downstream agents get the new contracts (its version already mirrors the root):
```bash
npm run mcp:build
cd mcp && npm publish      # @kraken-ui/mcp — prepack re-bundles manifests + compiles
```

## Notes
- The release script is safe to run dry-run at any time — it exits after printing the plan.
- `CHANGELOG.md` is created automatically if it doesn't exist yet.
- Never force-push the tag to main once shared — cut a new patch instead.
