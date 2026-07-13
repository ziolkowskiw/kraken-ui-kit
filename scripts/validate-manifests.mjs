#!/usr/bin/env node
/* Validates the machine-readable layer — run in CI and before every release.
 *
 *   1. Schema-validate everything under manifests/ (components, foundations,
 *      tokens, index, and the hand-edited overrides).
 *   2. Regenerate into a tmpdir and byte-diff against the committed manifests/
 *      — exits 1 on drift ("generated files are never hand-edited").
 *   3. Cross-checks: every ui/*.tsx has a manifest and vice versa; every
 *      install.registryItem exists in registry.json; every layer-3 token
 *      referenced by a manifest exists in the generated src/styles/tokens.css.
 *
 *   Run: npm run manifests:check
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { tmpdir } from "node:os";
import Ajv2020 from "ajv/dist/2020.js";

const ROOT = process.cwd();
const MANIFESTS = join(ROOT, "manifests");
const SCHEMAS = join(ROOT, "schemas");
const UI_DIR = join(ROOT, "src/components/ui");

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`✖ ${msg}`);
};

const ajv = new Ajv2020.default({ allErrors: true, strict: true, allowUnionTypes: true });
const loadSchema = (file) => ajv.compile(JSON.parse(readFileSync(join(SCHEMAS, file), "utf8")));

const validators = {
  component: loadSchema("component-manifest.schema.json"),
  override: loadSchema("override.schema.json"),
  foundations: loadSchema("foundations.schema.json"),
  tokens: loadSchema("tokens-manifest.schema.json"),
  index: loadSchema("index.schema.json"),
};

const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const validate = (kind, path) => {
  const v = validators[kind];
  if (!v(json(path))) {
    for (const err of v.errors)
      fail(`${path.replace(ROOT + "/", "")}${err.instancePath} ${err.message}`);
  }
};

// ── 1. Schema validation ─────────────────────────────────────────────────────
const componentFiles = readdirSync(join(MANIFESTS, "components")).filter((f) =>
  f.endsWith(".json"),
);
for (const f of componentFiles) validate("component", join(MANIFESTS, "components", f));
validate("foundations", join(MANIFESTS, "foundations.json"));
validate("tokens", join(MANIFESTS, "tokens.json"));
validate("index", join(MANIFESTS, "index.json"));
for (const f of readdirSync(join(MANIFESTS, "overrides")).filter((f) => f.endsWith(".json")))
  validate("override", join(MANIFESTS, "overrides", f));
console.log(
  `• schemas: ${componentFiles.length} component manifests + foundations/tokens/index + overrides validated`,
);

// ── 2. Drift check: regenerate and byte-diff ─────────────────────────────────
const tmp = mkdtempSync(join(tmpdir(), "kraken-manifests-"));
try {
  execFileSync("node", [join(ROOT, "scripts/build-manifests.mjs"), "--out", tmp], {
    cwd: ROOT,
    stdio: ["ignore", "ignore", "inherit"],
  });
  const compare = (rel) => {
    const committed = join(MANIFESTS, rel);
    const fresh = join(tmp, rel);
    if (!existsSync(committed))
      return fail(`manifests/${rel} missing — run npm run manifests:build`);
    if (readFileSync(committed, "utf8") !== readFileSync(fresh, "utf8"))
      fail(
        `manifests/${rel} drifted from generated output — run npm run manifests:build (never hand-edit)`,
      );
  };
  for (const f of readdirSync(join(tmp, "components"))) compare(`components/${f}`);
  for (const f of ["foundations.json", "tokens.json", "index.json", "README.md"]) compare(f);
  for (const f of componentFiles)
    if (!existsSync(join(tmp, "components", f)))
      fail(
        `manifests/components/${f} is stale — no source generates it; run npm run manifests:build`,
      );
  if (!failures) console.log("• drift: committed manifests byte-match regenerated output");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// ── 3. Cross-checks ──────────────────────────────────────────────────────────
const uiNames = readdirSync(UI_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .map((f) => basename(f, ".tsx"));
const manifestNames = componentFiles.map((f) => basename(f, ".json"));

for (const n of uiNames)
  if (!manifestNames.includes(n)) fail(`src/components/ui/${n}.tsx has no manifest`);
for (const n of manifestNames)
  if (!uiNames.includes(n)) fail(`manifests/components/${n}.json has no source file`);

const registry = json(join(ROOT, "registry.json"));
const registryNames = new Set(registry.items.map((i) => i.name));
const tokensCss = readFileSync(join(ROOT, "src/styles/tokens.css"), "utf8");

for (const f of componentFiles) {
  const m = json(join(MANIFESTS, "components", f));
  if (!registryNames.has(m.install.registryItem))
    fail(`${f}: install.registryItem "${m.install.registryItem}" not in registry.json`);
  for (const t of m.tokens.layer3)
    if (!tokensCss.includes(`${t}:`))
      fail(`${f}: layer-3 token ${t} not found in src/styles/tokens.css`);
}
console.log(
  `• cross-checks: ${uiNames.length} sources ⇄ manifests, registry items, layer-3 tokens vs tokens.css`,
);

if (failures) {
  console.error(`\n✖ manifests:check failed with ${failures} error(s).`);
  process.exit(1);
}
console.log("\n✅  manifests:check passed.");
