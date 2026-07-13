/* Deterministic MAPPING.md parser — the single bridge between the Figma file
 * and the generated agent surfaces (docs, manifests).
 *
 * Parses:
 *   - Part 1  (### <name> — <description> sections with full prop tables)
 *   - Parts 2/3 (table rows: Component | Figma node | Source | Description)
 *   - Part 4  (duplicate-name disambiguation rows)
 *   - the global conventions list and the shadcn divergence table
 *
 * Fails loudly (exit 1 via assertCoverage) when a component file has no
 * MAPPING entry — an unmapped component is a governance bug, never a silent gap.
 */

const NODE_ID_RE = /node-id=(\d+)-(\d+)/;

const flattenLinks = (s) =>
  s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/🎨|💻/g, "")
    .replace(/\s+/g, " ")
    .trim();

const toNodeId = (text) => {
  const m = text.match(NODE_ID_RE);
  return m ? `${m[1]}:${m[2]}` : null;
};

/* Backticked sub-part mentions: `dialog/header` or the shorthand `/footer`
 * (expanded against the entry name). */
function extractSubParts(text, entryName) {
  const parts = new Set();
  for (const m of text.matchAll(/`([a-z0-9-]+\/[a-z0-9-]+)`/g)) parts.add(m[1]);
  for (const m of text.matchAll(/`\/([a-z0-9-]+)`/g)) parts.add(`${entryName}/${m[1]}`);
  return [...parts].sort();
}

function splitRow(line) {
  // "| a | b | c |" -> ["a","b","c"] — cells never contain escaped pipes except
  // literal "\|" enum separators, which we preserve.
  return line
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim());
}

const isSeparatorRow = (line) => /^\s*\|[\s|:-]+\|\s*$/.test(line);

function section(md, startRe, endRe) {
  const start = md.search(startRe);
  if (start === -1) return "";
  const rest = md.slice(start);
  const end = rest.slice(1).search(endRe);
  return end === -1 ? rest : rest.slice(0, end + 1);
}

export function parseMapping(md) {
  const fileKey = md.match(/Figma file `(\w+)`/)?.[1] ?? null;

  // ── Conventions ──────────────────────────────────────────────────────────
  const convSection = section(md, /^## How to read this file/m, /^---$/m);
  const conventions = [];
  // Numbered items run until the next numbered item or a blank line.
  for (const chunk of convSection.split(/^\d+\.\s+/m).slice(1)) {
    const body = chunk.split(/\n[ \t]*\n/)[0];
    conventions.push(body.replace(/\s+/g, " ").trim());
  }
  const brandNote =
    convSection
      .match(/Brand\/theme[\s\S]*?(?=\n[ \t]*\n|$(?![\s\S]))/)?.[0]
      ?.replace(/\s+/g, " ")
      .trim() ?? null;
  if (brandNote) conventions.push(brandNote);

  // ── shadcn divergence contract ───────────────────────────────────────────
  const divSection = section(md, /^## shadcn divergence contract/m, /^---$/m);
  const divergences = [];
  for (const line of divSection.split("\n")) {
    if (!line.trim().startsWith("|") || isSeparatorRow(line)) continue;
    const cells = splitRow(line);
    if (cells.length < 3 || cells[0] === "Area") continue;
    divergences.push({ area: cells[0], kit: cells[1], shadcn: cells[2] });
  }
  const divergenceNote =
    divSection
      .match(/Formerly-backlogged[\s\S]*?(?=\n[ \t]*\n|$(?![\s\S]))/)?.[0]
      ?.replace(/\s+/g, " ")
      .trim() ?? null;

  const entries = {};

  // ── Part 1: ### <name> — <description> sections ─────────────────────────
  const part1 = section(md, /^## Part 1 /m, /^## Part 2 /m);
  const headingRe = /^### ([a-z0-9-]+) — (.+)$/gm;
  const headings = [...part1.matchAll(headingRe)];
  headings.forEach((h, i) => {
    const name = h[1];
    const body = part1.slice(
      h.index + h[0].length,
      i + 1 < headings.length ? headings[i + 1].index : undefined,
    );
    const propTable = [];
    const tableLines = body.split("\n").filter((l) => l.trim().startsWith("|"));
    let header = null;
    for (const line of tableLines) {
      if (isSeparatorRow(line)) continue;
      const cells = splitRow(line);
      if (!header) {
        header = cells.map((c) => c.toLowerCase());
        continue;
      }
      const get = (label) => {
        const idx = header.findIndex((c) => c.includes(label));
        return idx === -1 ? null : (cells[idx] ?? null);
      };
      propTable.push({
        figmaProperty: flattenLinks(get("figma property") ?? ""),
        ...(get("type") != null && header.some((c) => c === "type") ? { type: get("type") } : {}),
        codeProp: flattenLinks(get("code prop") ?? ""),
        values: flattenLinks((get("values") ?? "").replace(/\\\|/g, "|")),
      });
    }
    const notes = [...body.matchAll(/^> (.+)$/gm)].map((m) => m[1].trim());
    entries[name] = {
      name,
      figmaNodeId: toNodeId(body),
      description: flattenLinks(h[2]),
      propTable,
      subParts: extractSubParts(body, name),
      notes: notes.length ? [notes.join(" ")] : [],
      raw: h[0] + body,
    };
  });

  // ── Parts 2 & 3: table rows ──────────────────────────────────────────────
  for (const partRe of [/^## Part 2 /m, /^## Part 3 /m]) {
    const part = section(md, partRe, /^## Part |^---$/m);
    for (const line of part.split("\n")) {
      if (!line.trim().startsWith("|") || isSeparatorRow(line)) continue;
      const cells = splitRow(line);
      if (cells.length < 4 || cells[0] === "Component") continue;
      const [nameCell, nodeCell, sourceCell, descCell] = cells;
      const name = nameCell.replace(/`/g, "").trim();
      entries[name] = {
        name,
        figmaNodeId: toNodeId(nodeCell),
        description: flattenLinks(descCell.replace(/\\\|/g, "|")),
        propTable: [],
        subParts: extractSubParts(descCell, name),
        notes: [],
        sourceFile: sourceCell.match(/\/ui\/([a-z0-9-]+)\.tsx/)?.[1] ?? null,
        raw: line,
      };
    }
  }

  // ── Part 4: duplicate-name disambiguation ────────────────────────────────
  const part4 = section(md, /^## Part 4 /m, /^---$/m);
  const disambiguations = [];
  for (const line of part4.split("\n")) {
    if (!line.trim().startsWith("|") || isSeparatorRow(line)) continue;
    const cells = splitRow(line);
    if (cells.length < 3 || cells[0].startsWith("Display-name")) continue;
    disambiguations.push({
      collision: flattenLinks(cells[0]),
      nodeId: toNodeId(cells[1]) ?? flattenLinks(cells[1]).replace(/`/g, ""),
      resolvesTo: flattenLinks(cells[2]).replace(/^→\s*/, ""),
    });
  }

  return { fileKey, conventions, brandNote, divergences, divergenceNote, entries, disambiguations };
}

/* Resolve a ui/<name>.tsx file to its MAPPING entry.
 * 1. exact entry name;
 * 2. an entry whose Source column points at this file (form-table → form-table-cell.tsx);
 * 3. an entry that mentions `<name>.tsx` in its text (avatar → avatar-stack.tsx),
 *    using a node-id adjacent to the mention when present.
 */
export function resolveComponent(mapping, name) {
  const direct = mapping.entries[name];
  if (direct) return direct;

  for (const entry of Object.values(mapping.entries)) {
    if (entry.sourceFile === name) return { ...entry, viaEntry: entry.name };
  }

  for (const entry of Object.values(mapping.entries)) {
    const idx = entry.raw.indexOf(`${name}.tsx`);
    if (idx === -1) continue;
    const after = entry.raw.slice(idx, idx + 160);
    return {
      ...entry,
      figmaNodeId: toNodeId(after) ?? entry.figmaNodeId,
      viaEntry: entry.name,
    };
  }
  return null;
}

/* Exit 1 when any component file lacks a MAPPING entry. */
export function assertCoverage(mapping, fileNames) {
  const missing = fileNames.filter((n) => !resolveComponent(mapping, n));
  if (missing.length) {
    console.error(
      `✖ MAPPING.md coverage failure — no entry resolves for: ${missing.join(", ")}\n` +
        `  Every src/components/ui/*.tsx must be reachable from MAPPING.md ` +
        `(by name, Source link, or a \`<file>.tsx\` mention).`,
    );
    process.exit(1);
  }
}
