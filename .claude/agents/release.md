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
3. Bump `package.json` version (`--patch` default, `--minor`, or `--major`)
4. Prepend a CHANGELOG.md entry from `git log` since the last tag
5. Stage: `package.json CHANGELOG.md registry.json src/styles/tokens.css`
6. Commit: `chore(release): vX.Y.Z`
7. Tag: `vX.Y.Z`
8. Print push instructions

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
npm run build              # Next.js build passes
```

## After releasing
Push the commit and tag:
```bash
git push && git push --tags
```

Then update the shadcn registry if hosting it publicly:
```bash
npm run registry:bundle    # shadcn build → public/r/*.json
```

## Notes
- The release script is safe to run dry-run at any time — it exits after printing the plan.
- `CHANGELOG.md` is created automatically if it doesn't exist yet.
- Never force-push the tag to main once shared — cut a new patch instead.
