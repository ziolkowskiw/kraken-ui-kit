#!/usr/bin/env node
/* Generates the machine-readable design-system layer under manifests/:
 *
 *   manifests/components/<name>.json   dense per-component contract (56 files)
 *   manifests/foundations.json         always-on rules (token architecture,
 *                                      brands, conventions, divergences, scales)
 *   manifests/tokens.json              compact index of tokens.dtcg.json
 *   manifests/index.json               lookup table for MCP search
 *   manifests/README.md                provenance note
 *
 * Sources consumed — all human-maintained; nothing under manifests/ except
 * overrides/ is ever hand-edited:
 *   src/components/ui/*.tsx      (cva axes, defaults, props, tokens, rationale)
 *   MAPPING.md                   (Figma node IDs, descriptions, prop maps,
 *                                 conventions, shadcn divergences)
 *   registry.json                (install deps — run registry:build first)
 *   tokens/tokens.dtcg.json      (token index + brand overrides)
 *   scripts/data/a11y-notes.mjs  (authored a11y, shared with docs:build)
 *   manifests/overrides/*.json   (the human judgment layer: aliases, keywords,
 *                                 usage do/don't, boundaries, whenToUseInstead)
 *
 * Output is deterministic: keys sorted at every level, set-like arrays sorted,
 * no timestamps — CI byte-diffs regenerated output against the committed tree
 * (npm run manifests:check).
 *
 *   Run: npm run manifests:build
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import {
  extractExports,
  extractVariants,
  extractDefaults,
  extractCompoundVariants,
  extractTokens,
  extractBoolProps,
  extractStringProps,
  extractLeadingComment,
  tokenLayer,
} from "./lib/extract.mjs";
import { parseMapping, resolveComponent, assertCoverage } from "./lib/mapping-parser.mjs";
import { A11Y } from "./data/a11y-notes.mjs";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "src/components/ui");
const OUT_DIR = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : join(ROOT, "manifests");
const OVERRIDES_DIR = join(ROOT, "manifests/overrides");

// ── Deterministic serialization ─────────────────────────────────────────────
function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, sortKeysDeep(value[k])])
    );
  }
  return value;
}
const emit = (relPath, data) => {
  const file = join(OUT_DIR, relPath);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, JSON.stringify(sortKeysDeep(data), null, 2) + "\n");
};

// Strip markdown decoration from MAPPING-derived prose (dense output).
const clean = (s) =>
  s == null ? s : s.replace(/`/g, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

const titleCase = (name) =>
  name.replace(/(^|-)(\w)/g, (_, d, c) => (d ? " " : "") + c.toUpperCase()).trim();

// ── Load sources ─────────────────────────────────────────────────────────────
const mapping = parseMapping(readFileSync(join(ROOT, "MAPPING.md"), "utf8"));
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));
const registryByName = Object.fromEntries(registry.items.map((i) => [i.name, i]));
const dtcg = JSON.parse(readFileSync(join(ROOT, "tokens/tokens.dtcg.json"), "utf8"));

const files = readdirSync(UI_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .sort();
const names = files.map((f) => basename(f, ".tsx"));

assertCoverage(mapping, names);

const overrides = {};
if (existsSync(OVERRIDES_DIR)) {
  for (const f of readdirSync(OVERRIDES_DIR)) {
    if (!f.endsWith(".json") || f.startsWith("_")) continue;
    const name = basename(f, ".json");
    if (!names.includes(name)) {
      console.error(`✖ manifests/overrides/${f} does not match any component file.`);
      process.exit(1);
    }
    overrides[name] = JSON.parse(readFileSync(join(OVERRIDES_DIR, f), "utf8"));
  }
}

// ── Per-component manifests ──────────────────────────────────────────────────
// Wipe stale generated component manifests (renamed/removed components).
rmSync(join(OUT_DIR, "components"), { recursive: true, force: true });

const indexEntries = [];

for (const file of files) {
  const name = basename(file, ".tsx");
  const src = readFileSync(join(UI_DIR, file), "utf8");
  const entry = resolveComponent(mapping, name);
  const item = registryByName[name];
  if (!item) {
    console.error(`✖ ${name} has no registry.json item — run npm run registry:build first.`);
    process.exit(1);
  }
  const ov = overrides[name] ?? {};

  const exports = extractExports(src);
  const axes = extractVariants(src);
  const defaults = extractDefaults(src);
  const compound = extractCompoundVariants(src);
  const tokens = extractTokens(src);
  const boolProps = [...new Set(extractBoolProps(src))].filter((p) => !(p in axes));
  const strProps = [...new Set(extractStringProps(src))].filter(
    (p) => !(p in axes) && !boolProps.includes(p)
  );

  // Props: extracted surface first, then Figma prop-map info from MAPPING.
  const props = [
    ...Object.entries(axes).map(([prop, values]) => ({
      name: prop,
      kind: "enum",
      values,
      ...(defaults[prop] !== undefined ? { default: defaults[prop] } : {}),
    })),
    ...boolProps.map((p) => ({ name: p, kind: "boolean" })),
    ...strProps.map((p) => ({ name: p, kind: "string|node" })),
  ];
  for (const row of entry?.propTable ?? []) {
    const codeProps = [...row.codeProp.matchAll(/`(\w[\w-]*)`/g)].map((m) => m[1]);
    const target = props.find((p) => codeProps.includes(p.name));
    const figmaInfo = {
      figmaProperty: clean(row.figmaProperty),
      figmaValues: clean(row.values),
    };
    if (target) Object.assign(target, figmaInfo);
    // Only add unmatched rows that name a real code prop (lowercase identifier
    // lead) — sub-part/composition rows ("→ SelectItem …", "— (CSS)") are not props.
    else if (/^`?[a-z]/.test(row.codeProp))
      props.push({ name: clean(row.codeProp), kind: "mapped", ...figmaInfo });
  }

  const layer3 = tokens.filter((t) => tokenLayer(t) === "L3 Component");
  const other = tokens.filter((t) => tokenLayer(t) !== "L3 Component");

  const partExports = exports.filter(
    (e) => e !== titleCase(name).replace(/ /g, "") && !/Variants$|^use[A-Z]/.test(e)
  );

  const notes = [];
  if (entry?.notes?.length) notes.push(...entry.notes.map(clean));
  if (Object.keys(axes).length)
    notes.push(
      "hover/focus/active states are CSS pseudo-classes, not props; disabled is the only state prop."
    );
  if (entry?.viaEntry && entry.viaEntry !== name)
    notes.push(`Mapped via the '${entry.viaEntry}' entry in MAPPING.md.`);

  const manifest = {
    name,
    title: titleCase(name),
    description: clean(entry?.description) ?? item.description,
    ...(extractLeadingComment(src) ? { rationale: extractLeadingComment(src) } : {}),
    install: {
      command: `npx shadcn add @kraken/${name}`,
      registryItem: name,
      dependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
    },
    source: `src/components/ui/${file}`,
    ...(existsSync(join(UI_DIR, `${name}.stories.tsx`))
      ? { story: `src/components/ui/${name}.stories.tsx` }
      : {}),
    figma: entry?.figmaNodeId
      ? { nodeId: entry.figmaNodeId, fileKey: mapping.fileKey }
      : null,
    exports,
    variants: {
      axes: Object.fromEntries(
        Object.entries(axes).map(([prop, values]) => [
          prop,
          { values, ...(defaults[prop] !== undefined ? { default: defaults[prop] } : {}) },
        ])
      ),
      ...(compound.length ? { compound } : {}),
    },
    props,
    slots: {
      exports: partExports,
      figmaParts: entry?.subParts ?? [],
    },
    tokens: {
      layer3: layer3.map((t) => `--ds-${t}`),
      other: other.map((t) => `--ds-${t}`),
    },
    a11y: (A11Y[name] ?? "")
      .split("\n")
      .map((l) => clean(l.replace(/^- /, "")))
      .filter(Boolean),
    usage: { do: ov.usage?.do ?? [], dont: ov.usage?.dont ?? [] },
    boundaries: ov.boundaries ?? [],
    whenToUseInstead: ov.whenToUseInstead ?? [],
    aliases: [...(ov.aliases ?? [])].sort(),
    keywords: [...(ov.keywords ?? [])].sort(),
    notes,
  };

  emit(`components/${name}.json`, manifest);
  indexEntries.push({
    name,
    title: manifest.title,
    description: manifest.description,
    aliases: manifest.aliases,
    keywords: manifest.keywords,
    exports,
    file: `components/${name}.json`,
  });
}

emit("index.json", indexEntries);

// ── foundations.json — the always-on layer ───────────────────────────────────
const foundations = {
  system: "Kraken UI Kit (JIT DS 2.1) — shadcn-based, Figma-first, 3-layer --ds-* tokens, 2 brands.",
  sources: ["design.md", "MAPPING.md"],
  tokenArchitecture: {
    layers: [
      "L1 global: primitive ramps/scales (--ds-color-jit-400, --ds-spacing-16) — never bind component colors here.",
      "L2 semantic: shadcn-named roles (--ds-color-primary, --ds-color-border-focus) — the ONLY per-brand layer.",
      "L3 component: per-component knobs (--ds-button-primary-fillhover) referencing L2 — what components consume.",
    ],
    naming: {
      colorPrimitive: "--ds-color-{ramp}-{shade}",
      colorSemantic: "--ds-color-{role}[-{state}]",
      status: "--ds-color-status-{kind}-{part}",
      contentBorder: "--ds-color-{content|border}-{role}",
      component: "--ds-{component}-{variant}-{property}",
      spacing: "--ds-spacing-{px} | --ds-spacing-{context}-{size}",
      radius: "--ds-radius-{size}",
      typography: "--ds-typography-{role}{size}-{prop}",
    },
  },
  brands: {
    attribute: "data-theme on <html> (or any ancestor)",
    default: "jit",
    values: {
      jit: "primary #FFD242 (yellow, --ds-color-jit-400), rounded 6px, Moderat JIT",
      brand: "primary #298EE5 (blue, --ds-color-brand-500), sharp 0px, Noto Sans",
    },
    contract:
      "Switching swaps only [data-theme] semantic values; components/apps need zero per-brand code. shadcn vars (--primary, --background, …) are re-pointed at --ds-* in kraken-theme.css, so Tailwind classes theme too. Never hard-code brand values.",
  },
  corePrinciples: [
    "Every color/spacing/radius/typography value uses a --ds-* token — no hex/px literals in components, ever.",
    "Bind at the right layer: component colors via L3 (or semantic); never a primitive when an L3 token exists.",
    "State is CSS, never a prop: hover/focus/active are pseudo-classes; the only state prop is disabled.",
    "shadcn parity: names/props follow shadcn verbatim; variant values are the exact lowercase Figma enum strings.",
    "Form inputs ship as *Field wrappers (InputField, TextareaField, SelectField, RadioGroupField) adding label/description/errorMessage/mandatory.",
    "Icons are lucide-react components passed as leftIcon/rightIcon/icon (or children) — never baked in; Figma icon-picker value = lucide name.",
    "WCAG 2.1 AA: 4.5:1 text / 3:1 UI contrast, visible focus ring (--ds-color-border-focus), full keyboard support.",
    "Generated files (tokens.css, registry.json, docs/, manifests/ except overrides/) are never hand-edited.",
  ],
  // Lead sentence of each MAPPING.md convention — the rule without the exposition.
  figmaCodeConventions: mapping.conventions.map((c) => {
    const cleaned = clean(c);
    const m = cleaned.match(/^.*?[.!?](?=\s|$)/);
    return m ? m[0] : cleaned;
  }),
  shadcnDivergences: mapping.divergences.map((d) => ({
    area: clean(d.area),
    kit: clean(d.kit),
    shadcn: clean(d.shadcn),
  })),
  scales: {
    spacing:
      "px steps 0-256 (0 1 2 3 4 5 6 7 8 10 12 16 20 24 28 32 36 40 44 48 56 64 80 96 128 160 192 256); aliases component-xs…2xl (6→32px), layout-xs…2xl (16→96px)",
    radius: "none xs sm md lg xl 2xl 3xl full = 0 2 4 6 8 12 16 24 9999px",
    fontSizes: "xs sm md lg xl 2xl…6xl = 12 14 16 20 24 32 40 48 56 72px",
    typographyRoles:
      "display{md,lg,xl,2xl} heading{sm,md,lg,xl} body{xs,sm,md,lg} label{sm,md,lg} link{xs,sm,md,lg} overline",
  },
  install: {
    registryNamespace: "@kraken",
    component: "npx shadcn add @kraken/<name>",
    bootstrap: "npx shadcn add @kraken/theme (pulls the tokens item automatically)",
    mcp: "claude mcp add kraken-ui -- npx -y @kraken-ui/mcp",
  },
};
emit("foundations.json", foundations);

// ── tokens.json — compact index of tokens.dtcg.json ─────────────────────────
// CSS var derivation mirrors the Figma export feeding tokens.css:
// drop the layer key, join the path with "-", lowercase (fillHover → fillhover).
const cssVar = (path) => `--ds-${path.join("-").toLowerCase()}`;

function collectTokens(group, path, out) {
  for (const [key, node] of Object.entries(group)) {
    if (key.startsWith("$")) continue;
    if (node && typeof node === "object" && node.$value !== undefined) {
      const t = {
        cssVar: cssVar([...path, key]),
        type: node.$type,
        value: node.$value,
      };
      if (node.$description) t.description = node.$description;
      const brand = node.$extensions?.modes?.brand;
      if (brand !== undefined) t.brandValue = brand;
      const varId = node.$extensions?.["figma-console-mcp"]?.variableId;
      if (varId) t.figmaVariableId = varId;
      out.push(t);
    } else if (node && typeof node === "object") {
      collectTokens(node, [...path, key], out);
    }
  }
  return out;
}

const componentTokens = {};
for (const [comp, group] of Object.entries(dtcg.component)) {
  if (comp.startsWith("$")) continue;
  componentTokens[comp] = collectTokens(group, [comp], []);
}
const tokensManifest = {
  source: "tokens/tokens.dtcg.json",
  brandNote:
    "value is the default (jit) resolution; brandValue, when present, is the 'brand' mode override. {a.b} strings are references to other tokens.",
  layers: {
    global: collectTokens(dtcg.global, [], []),
    semantic: collectTokens(dtcg.semantic, [], []),
    component: componentTokens,
  },
};
emit("tokens.json", tokensManifest);

// ── README — provenance ──────────────────────────────────────────────────────
writeFileSync(
  join(OUT_DIR, "README.md"),
  `# manifests/ — machine-readable design-system layer

**Generated — do not edit** (\`npm run manifests:build\`). The only hand-edited
files here are \`overrides/*.json\` — the human judgment layer (aliases,
keywords, usage do/don't, boundaries), schema-validated by
\`npm run manifests:check\`.

Everything else is derived from human-maintained sources: the component
sources under \`src/components/ui/\`, \`MAPPING.md\`, \`registry.json\`,
\`tokens/tokens.dtcg.json\`, \`scripts/data/a11y-notes.mjs\`, and \`design.md\`.
Agents propose; humans direct. To change a manifest, change its source.

Served to agents by the \`@kraken-ui/mcp\` server (see \`mcp/\`).
`
);

console.log(
  `✅  Generated ${indexEntries.length} component manifests + foundations.json, tokens.json, index.json in ${OUT_DIR.replace(ROOT + "/", "")}/`
);
