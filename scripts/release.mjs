#!/usr/bin/env node
/* Release automation for kraken-ui-kit.
 *
 * Dry-run by default. Pass --yes to execute.
 *
 * Flags:
 *   --patch   bump patch version (default)
 *   --minor   bump minor version
 *   --major   bump major version
 *   --yes     execute (no flag = dry-run)
 *
 * Steps (in order):
 *   1. npm run tokens:build
 *   2. npm run registry:build
 *   3. Bump version in package.json
 *   4. Prepend CHANGELOG.md entry from git log
 *   5. git add (changed artefacts)
 *   6. git commit: chore(release): vX.Y.Z
 *   7. git tag vX.Y.Z
 *   8. Print push instructions
 *
 * Usage:
 *   npm run release               # dry-run patch
 *   npm run release -- --minor --yes
 *   npm run release:minor -- --yes
 */
import { execSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PKG_PATH = join(ROOT, "package.json");
const CHANGELOG_PATH = join(ROOT, "CHANGELOG.md");

const YES = process.argv.includes("--yes");
const MINOR = process.argv.includes("--minor");
const MAJOR = process.argv.includes("--major");
// PATCH is the default

// ── Helpers ──────────────────────────────────────────────────────────────────
function run(cmd, opts = {}) {
  if (!YES && !opts.readOnly) {
    console.log(`  [dry-run] ${cmd}`);
    return "";
  }
  console.log(`  $ ${cmd}`);
  try {
    return execSync(cmd, { cwd: ROOT, stdio: opts.quiet ? "pipe" : "inherit", encoding: "utf8" });
  } catch (err) {
    console.error(`\nFailed: ${cmd}`);
    process.exit(1);
  }
}

function readCmd(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();
}

// ── Version bump ─────────────────────────────────────────────────────────────
const pkg = JSON.parse(readFileSync(PKG_PATH, "utf8"));
const [maj, min, pat] = pkg.version.split(".").map(Number);
let nextVersion;
if (MAJOR) nextVersion = `${maj + 1}.0.0`;
else if (MINOR) nextVersion = `${maj}.${min + 1}.0`;
else nextVersion = `${maj}.${min}.${pat + 1}`;

// ── Git log since last tag ────────────────────────────────────────────────────
let lastTag = "";
try {
  lastTag = readCmd("git describe --tags --abbrev=0");
} catch {
  // no tags yet — use the whole history
}
const logRange = lastTag ? `${lastTag}..HEAD` : "HEAD";
const logOutput = readCmd(
  `git log ${logRange} --pretty=format:"%s" --no-merges`,
);
const bullets = logOutput
  .split("\n")
  .filter(Boolean)
  .map((s) => `- ${s}`)
  .join("\n");

const today = new Date().toISOString().slice(0, 10);
const changelogEntry = `## v${nextVersion} — ${today}\n\n${bullets || "- (no commits since last tag)"}\n`;

// ── Dry-run summary ──────────────────────────────────────────────────────────
console.log(`\n── Kraken UI Kit Release ───────────────────────────────────────`);
console.log(`  Current version : ${pkg.version}`);
console.log(`  Next version    : ${nextVersion}`);
console.log(`  Last tag        : ${lastTag || "(none)"}`);
console.log(`  Commits in log  : ${logOutput ? logOutput.split("\n").filter(Boolean).length : 0}`);
if (!YES) {
  console.log(`\n  Dry-run mode — pass --yes to execute.\n`);
  console.log(`  Steps that will run:`);
  console.log(`    1. npm run tokens:build`);
  console.log(`    2. npm run registry:build`);
  console.log(`    3. Bump package.json: ${pkg.version} → ${nextVersion}`);
  console.log(`    4. Prepend CHANGELOG.md entry`);
  console.log(`    5. git add package.json CHANGELOG.md registry.json src/styles/tokens.css`);
  console.log(`    6. git commit -m "chore(release): v${nextVersion}"`);
  console.log(`    7. git tag v${nextVersion}`);
  console.log(`    8. (print push instructions)`);
  console.log(`\n  Changelog entry that will be prepended:`);
  console.log(`  ─────────────────────────────────────────`);
  console.log(changelogEntry.split("\n").map((l) => `  ${l}`).join("\n"));
  process.exit(0);
}

// ── Execute ──────────────────────────────────────────────────────────────────
console.log(`\n  Executing release v${nextVersion}…\n`);

console.log("1. Rebuild tokens CSS");
run("npm run tokens:build");

console.log("\n2. Rebuild registry");
run("npm run registry:build");

console.log("\n3. Bump package.json");
pkg.version = nextVersion;
writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + "\n");
console.log(`   package.json → ${nextVersion}`);

console.log("\n4. Prepend CHANGELOG.md");
const existing = existsSync(CHANGELOG_PATH) ? readFileSync(CHANGELOG_PATH, "utf8") : "";
writeFileSync(CHANGELOG_PATH, changelogEntry + "\n" + existing);
console.log(`   CHANGELOG.md prepended`);

console.log("\n5. Stage artefacts");
run(
  "git add package.json CHANGELOG.md registry.json src/styles/tokens.css",
);

console.log("\n6. Commit");
run(`git commit -m "chore(release): v${nextVersion}"`);

console.log("\n7. Tag");
run(`git tag v${nextVersion}`);

console.log(`\n✅  Release v${nextVersion} committed and tagged.\n`);
console.log(`   Push with:\n`);
console.log(`     git push && git push --tags\n`);
