#!/usr/bin/env node
/* Generates per-component docs under docs/components/<name>.md
 * Extracts anatomy, props, and token map from source — docs never drift.
 * A11y notes are authored in scripts/data/a11y-notes.mjs (shared with the
 * manifest generator); extraction helpers live in scripts/lib/extract.mjs.
 *
 *   Run: npm run docs:build
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import {
  extractExports,
  extractVariants,
  extractDefaults,
  extractTokens,
  extractBoolProps,
  extractStringProps,
  tokenLayer,
} from "./lib/extract.mjs";
import { A11Y } from "./data/a11y-notes.mjs";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "src/components/ui");
const OUT_DIR = join(ROOT, "docs/components");
mkdirSync(OUT_DIR, { recursive: true });

// ── Main ───────────────────────────────────────────────────────────────────
const files = readdirSync(UI_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .sort();

let count = 0;
for (const file of files) {
  const name = basename(file, ".tsx");
  const src = readFileSync(join(UI_DIR, file), "utf8");
  const title = name.replace(/(^|-)(\w)/g, (_, d, c) => (d ? " " : "") + c.toUpperCase()).trim();
  const exports = extractExports(src);
  const variants = extractVariants(src);
  const defaults = extractDefaults(src);
  const tokens = extractTokens(src);
  const boolProps = [...new Set(extractBoolProps(src))];
  const strProps = [...new Set(extractStringProps(src))];

  const figmaNodeLine = (() => {
    // We can reference MAPPING.md lookup — easier to just note it's in MAPPING.md
    return `See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.`;
  })();

  // ── Anatomy ──────────────────────────────────────────────────────────────
  const anatomy = exports.length
    ? exports.map((e) => `- \`${e}\``).join("\n")
    : `- \`${title.replace(/ /g, "")}\` (default export)`;

  // ── Props table ──────────────────────────────────────────────────────────
  const rows = [];
  for (const [key, vals] of Object.entries(variants)) {
    const def = defaults[key] ? `\`"${defaults[key]}"\`` : "—";
    rows.push(`| \`${key}\` | enum | \`"${vals.join('" \\| "')}"\` | ${def} |`);
  }
  for (const p of boolProps.filter((p) => !Object.keys(variants).includes(p)))
    rows.push(`| \`${p}\` | bool | \`true \\| false\` | \`false\` |`);
  for (const p of strProps.filter(
    (p) => !Object.keys(variants).includes(p) && !boolProps.includes(p),
  ))
    rows.push(`| \`${p}\` | string / node | — | — |`);

  const propsSection = rows.length
    ? `| Prop | Type | Values | Default |\n|---|---|---|---|\n${rows.join("\n")}`
    : `All props are passed through to the underlying Base UI / HTML element.`;

  // ── Token map ────────────────────────────────────────────────────────────
  const byLayer = {};
  for (const t of tokens) {
    const l = tokenLayer(t);
    (byLayer[l] = byLayer[l] || []).push(t);
  }
  const tokenSection = Object.entries(byLayer)
    .map(([layer, ts]) => `**${layer}**\n${ts.map((t) => `- \`--ds-${t}\``).join("\n")}`)
    .join("\n\n");

  // ── A11y ─────────────────────────────────────────────────────────────────
  const a11y =
    A11Y[name] ||
    `- No special a11y requirements beyond standard HTML semantics.\n- Ensure interactive elements have accessible labels.`;

  // ── Write ─────────────────────────────────────────────────────────────────
  const doc = `# ${title}

> ${figmaNodeLine}

## What it is

${
  name === "button"
    ? "Displays a button or a component that looks like a button. Use for primary actions, form submits, and dialog/menu triggers. For navigation styled as a button, use `link-button`."
    : name === "badge"
      ? "Displays a badge or a component that looks like a badge. Use to label or categorize an item, or to show counts/status."
      : name === "input"
        ? "Displays a form input field. Use for single-line text entry in forms. Always map to the `InputField` wrapper to get label/description/error/mandatory."
        : name === "textarea"
          ? "Displays a form textarea. Use for multi-line text entry (comments, notes). Map to `TextareaField`."
          : name === "select"
            ? "Displays a list of options to pick from, triggered by a button. Use for single-choice selection. Map to `SelectField`."
            : name === "checkbox"
              ? "A control that toggles between checked and not checked. Use for opt-in/agree flows or multi-select lists."
              : name === "radio-group"
                ? "A set of checkable buttons where only one can be checked at a time. Use to choose one option from a small visible set."
                : name === "switch"
                  ? "A control that toggles between on and off. Use for instant settings that take effect without a submit step."
                  : name === "card"
                    ? "Displays a card with header, content, and footer. Use to group related content and actions into a surface."
                    : name === "alert"
                      ? "Displays a callout for user attention. Use for inline, non-blocking messages (info, success, warning, error)."
                      : name === "dialog"
                        ? "A window overlaid on the primary window, rendering content underneath inert. Use for focused tasks or confirmations."
                        : name === "tabs"
                          ? "Layered sections of content displayed one at a time. Use to switch between related views in the same space."
                          : `${title} component. See MAPPING.md for the full shadcn-aligned description.`
}

## Anatomy

${anatomy}

## Props

${propsSection}
${
  Object.keys(variants).length
    ? `\n> **State note:** \`hover\`, \`focus\`, \`active\` states are handled by CSS pseudo-classes — there is no state prop. \`disabled\` is the only state prop.`
    : ""
}

## Token map

${tokens.length ? tokenSection : "_No `--ds-*` tokens used directly — relies on Tailwind/shadcn semantic classes._"}

## Accessibility

${a11y}
`;

  writeFileSync(join(OUT_DIR, `${name}.md`), doc);
  count++;
}

console.log(`✅  Generated ${count} component docs in docs/components/`);
