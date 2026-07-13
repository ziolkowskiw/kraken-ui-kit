#!/usr/bin/env node
/* Validates the Figma ↔ code binding for all UI components.
 *
 * Checks:
 *   1. Every src/components/ui/*.tsx with a Figma node ID comment is in MAPPING.md
 *   2. Every node ID in MAPPING.md has a matching .tsx file
 *   3. Components with no Figma node ID in either place
 *
 * Flags:
 *   --validate   Hit the Figma REST API to verify node IDs resolve (needs FIGMA_PAT)
 *
 * Exit code: 0 = clean, 1 = gaps found
 *
 * Usage:
 *   npm run figma:binder
 *   npm run figma:binder:validate
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "src/components/ui");
const MAPPING_PATH = join(ROOT, "MAPPING.md");
const FILE_KEY = "Y3gNgjmXe1t67fPlDjM2iH";
const VALIDATE = process.argv.includes("--validate");

// ── 1. Scan .tsx files for Figma node IDs ────────────────────────────────────
// Looks for patterns like "Figma `Name` (1234:5678)" or "Figma node (1234:5678)"
const CODE_NODE_RE = /[Ff]igma[^(]*\((\d+:\d+)\)/g;

const codeFiles = readdirSync(UI_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .sort();

/** Map from component-name (filename stem) → Set of node IDs found in its source */
const codeMap = new Map(); // stem → Set<string>

for (const file of codeFiles) {
  const stem = file.replace(/\.tsx$/, "");
  const src = readFileSync(join(UI_DIR, file), "utf8");
  const ids = new Set();
  for (const m of src.matchAll(CODE_NODE_RE)) ids.add(m[1]);
  codeMap.set(stem, ids);
}

// ── 2. Parse MAPPING.md for node IDs ────────────────────────────────────────
// URLs contain node-id=1234-5678 (dashes), convert to 1234:5678 (colons)
const NODE_URL_RE = /node-id=(\d+)-(\d+)/g;

const mappingText = readFileSync(MAPPING_PATH, "utf8");
const mappingIds = new Set();
for (const m of mappingText.matchAll(NODE_URL_RE)) {
  mappingIds.add(`${m[1]}:${m[2]}`);
}

// Also collect which .tsx source files are referenced in MAPPING.md
const MAPPING_SRC_RE = /src\/components\/ui\/([^./")\s]+)\.tsx/g;
const mappedStems = new Set();
for (const m of mappingText.matchAll(MAPPING_SRC_RE)) {
  // handle references like avatar-stack (the source of truth is avatar.tsx)
  mappedStems.add(m[1]);
}
// avatar-stack is inside avatar.tsx — add alias
if (mappingText.includes("avatar-stack.tsx") || mappingText.includes("avatar.tsx")) {
  mappedStems.add("avatar-stack");
}

// ── 3. Build reports ─────────────────────────────────────────────────────────
const inCodeNotMapped = []; // has node ID in code, missing from MAPPING.md
const mappedNoFile = []; // in MAPPING.md but no .tsx file in ui/
const noIdAnywhere = []; // no Figma node ID in code AND not in MAPPING.md

for (const [stem, ids] of codeMap) {
  const inMapping = mappedStems.has(stem);
  if (ids.size === 0 && !inMapping) {
    noIdAnywhere.push(stem);
  } else if (ids.size > 0) {
    const anyMapped = [...ids].some((id) => mappingIds.has(id));
    if (!anyMapped && !inMapping) inCodeNotMapped.push({ stem, ids: [...ids] });
  }
}

// Check MAPPING.md source references for missing files
for (const stem of mappedStems) {
  if (!codeMap.has(stem)) {
    // Allow avatar-stack (lives inside avatar.tsx)
    if (stem === "avatar-stack") continue;
    mappedNoFile.push(stem);
  }
}

// ── 4. All unique node IDs from code, for optional API validation ─────────────
const allCodeIds = new Set();
for (const ids of codeMap.values()) for (const id of ids) allCodeIds.add(id);

// ── 5. Optional: validate node IDs against Figma REST API ────────────────────
let apiResults = null;
if (VALIDATE) {
  const pat = process.env.FIGMA_PAT;
  if (!pat) {
    console.error("Error: --validate requires FIGMA_PAT env var");
    process.exit(1);
  }
  const ids = [...allCodeIds].join(",");
  try {
    const res = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`,
      { headers: { "X-Figma-Token": pat } },
    );
    if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
    const body = await res.json();
    apiResults = body.nodes ?? {};
  } catch (err) {
    console.error("Figma API error:", err.message);
    process.exit(1);
  }
}

// ── 6. Print report ───────────────────────────────────────────────────────────
const col = (s, w) => String(s).padEnd(w);
const W = 32;
let hasGaps = false;

console.log("\n── Figma Binder Audit ──────────────────────────────────────────");
console.log(
  `  Scanned: ${codeFiles.length} component files  |  MAPPING.md node IDs: ${mappingIds.size}`,
);
if (VALIDATE && apiResults) {
  const total = allCodeIds.size;
  const resolved = Object.values(apiResults).filter(Boolean).length;
  console.log(`  Figma API: ${resolved}/${total} node IDs resolved`);
}
console.log();

if (inCodeNotMapped.length) {
  hasGaps = true;
  console.log("🟠  In code, not in MAPPING.md:");
  console.log(`  ${col("Component", W)} Node IDs`);
  for (const { stem, ids } of inCodeNotMapped) {
    console.log(`  ${col(stem, W)} ${ids.join(", ")}`);
  }
  console.log();
}

if (mappedNoFile.length) {
  hasGaps = true;
  console.log("🔴  In MAPPING.md, no matching .tsx file:");
  for (const stem of mappedNoFile) console.log(`  ${stem}`);
  console.log();
}

if (noIdAnywhere.length) {
  hasGaps = true;
  console.log("⚪  No Figma node ID (code or MAPPING.md):");
  for (const stem of noIdAnywhere) console.log(`  ${stem}`);
  console.log();
}

if (VALIDATE && apiResults) {
  const dead = [...allCodeIds].filter((id) => !apiResults[id]);
  if (dead.length) {
    hasGaps = true;
    console.log("❌  Node IDs that don't resolve in Figma:");
    for (const id of dead) {
      const stem = [...codeMap.entries()].find(([, s]) => s.has(id))?.[0] ?? "?";
      console.log(`  ${col(stem, W)} ${id}`);
    }
    console.log();
  }
}

if (!hasGaps) {
  console.log("✅  All bindings look good.");
  console.log();
}

process.exit(hasGaps ? 1 : 0);
