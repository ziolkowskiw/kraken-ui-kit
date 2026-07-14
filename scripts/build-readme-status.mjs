// Regenerate README.md's Status section from real sources.
//
// Never hand-edit the content between <!-- STATUS:START --> and
// <!-- STATUS:END --> in README.md — this script owns it.
// Run: npm run readme:build (also runs as part of npm run docs:build).

import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const tokensManifest = JSON.parse(
  await readFile(path.join(root, "manifests", "tokens.json"), "utf8"),
);
const globalCount = tokensManifest.layers.global.length;
const semanticCount = tokensManifest.layers.semantic.length;
const componentTokenCount = Object.values(tokensManifest.layers.component).reduce(
  (sum, list) => sum + list.length,
  0,
);
const tokenCount = globalCount + semanticCount + componentTokenCount;

const index = JSON.parse(await readFile(path.join(root, "manifests", "index.json"), "utf8"));
const componentFileCount = index.length;

const registry = JSON.parse(await readFile(path.join(root, "registry.json"), "utf8"));
const registryItemCount = registry.items.length;

const mapping = await readFile(path.join(root, "MAPPING.md"), "utf8");
const parentMatch = mapping.match(/\*\*(\d+) parent components mapped\*\*/);
if (!parentMatch) {
  throw new Error(
    "Could not find '**N parent components mapped**' in MAPPING.md — did the Coverage section wording change?",
  );
}
const parentCount = parentMatch[1];

// Figma-first theming ships as "done" when the add-brand runbook exists —
// that skill is the M3 deliverable that closes this line.
const addBrandSkillPath = path.join(root, ".claude", "skills", "add-brand", "SKILL.md");
let themingShipped = false;
try {
  await access(addBrandSkillPath);
  themingShipped = true;
} catch {
  themingShipped = false;
}
const themingLine = themingShipped
  ? "- ✅ **Figma-first theming**: author themes as semantic modes in Figma; export via `token-sync`, onboard a new brand via the `add-brand` skill."
  : "- ⬜ **Figma-first theming**: author themes as semantic modes in Figma; export via `token-sync` (supporting skills planned).";

const block = `- ✅ **Token pipeline**: ${tokenCount} tokens (3 layers) export from Figma; brand-switchable CSS verified (jit ⇄ brand).
- ✅ **React kit + Storybook**: ${componentFileCount} components wired to tokens; live brand toggle in showcase and Storybook.
- ✅ **Figma↔code mapping**: \`MAPPING.md\` — ${parentCount} parent components, node IDs + source links.
- ✅ **Registry + AI layer**: shadcn registry (${registryItemCount} items), workflow skills, per-component docs, \`design.md\`.
${themingLine}
- ⬜ **Governance** (ongoing): monthly \`drift-audit\` scheduling pending; \`v0.1.0\` already released 2026-07-13 via the release agent.`;

const readmePath = path.join(root, "README.md");
const readme = await readFile(readmePath, "utf8");

const START = "<!-- STATUS:START -->";
const END = "<!-- STATUS:END -->";
const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END);
if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
  throw new Error(
    `README.md is missing ${START} / ${END} markers — cannot regenerate the Status section.`,
  );
}

const before = readme.slice(0, startIdx + START.length);
const after = readme.slice(endIdx);
// Blank lines around the block (not a single \n) are required so the output
// matches this repo's Prettier markdown rules for content around HTML
// comments — otherwise `npm run format:check` flags every regenerated README.
const updated = `${before}\n\n${block}\n\n${after}`;

await writeFile(readmePath, updated);
console.log(
  `✓ Regenerated README.md Status section: ${tokenCount} tokens, ${componentFileCount} components, ${parentCount} parent components, ${registryItemCount} registry items, theming ${themingShipped ? "shipped" : "pending"}`,
);
