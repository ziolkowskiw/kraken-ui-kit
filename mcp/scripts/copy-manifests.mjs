#!/usr/bin/env node
/* Bundles the repo's generated manifests into the package (mcp/manifests/,
 * gitignored) so the published tarball is self-contained: no repo checkout,
 * no Figma access, no network at runtime. overrides/ stays out — it is a
 * build input of the generator, already merged into the component manifests.
 */
import { cpSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, "../../manifests");
const dest = path.resolve(here, "../manifests");

if (!existsSync(path.join(src, "index.json"))) {
  console.error(
    "✖ ../manifests/index.json not found — run `npm run manifests:build` at the repo root first.",
  );
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, {
  recursive: true,
  filter: (p) => !p.includes(`${path.sep}overrides`),
});
console.log("✓ bundled manifests/ into mcp/manifests/ (overrides excluded)");
