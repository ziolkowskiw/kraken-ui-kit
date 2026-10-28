// Layer 3 — semantic token pairs, resolved live per brand × scheme and measured
// with the WCAG 2.x relative-luminance formula. Catches a palette failure once
// instead of once per story. Colors are resolved by painting them on a canvas,
// so oklch(), hex, and alpha (composited over the pair's background) all work.
//
//   node .claude/skills/a11y-audit/scripts/contrast-tokens.mjs [--brands …] [--schemes …] [--out DIR]
import { chromium } from "playwright";
import { parseArgs, getStories, openStory, write } from "./lib.mjs";

// [background, foreground, min ratio, SC]. 4.5 = text (1.4.3); 3 = UI parts,
// icons, focus ring, input borders (1.4.11). Disabled tokens are exempt by
// WCAG and intentionally absent.
const T = 4.5,
  U = 3;
const STATUS = ["error", "warning", "success", "info", "neutral"];
const LABELS = ["brand", "slate", "red", "orange", "amber", "green", "blue", "purple"];
const PAIRS = [
  ["background", "foreground", T],
  ["background", "content-primary", T],
  ["background", "content-secondary", T],
  ["background", "content-tertiary", T],
  ["background", "content-placeholder", T],
  ["background", "content-link", T],
  ["background", "content-link-visited", T],
  ["background", "muted-foreground", T],
  ["card", "card-foreground", T],
  ["popover", "popover-foreground", T],
  ["surface", "surface-foreground", T],
  ["muted", "muted-foreground", T],
  ["primary", "primary-foreground", T],
  ["primary-hover", "primary-foreground", T],
  ["primary", "content-on-brand", T],
  ["primary-muted", "primary-muted-foreground", T],
  ["secondary", "secondary-foreground", T],
  ["accent", "accent-foreground", T],
  ["destructive", "destructive-foreground", T],
  ["destructive-hover", "destructive-foreground", T],
  ["destructive-muted", "destructive-muted-foreground", T],
  ["inverse", "inverse-foreground", T],
  ["sidebar", "sidebar-foreground", T],
  ["sidebar-primary", "sidebar-primary-foreground", T],
  ...STATUS.map((s) => [`status-${s}-bg`, `status-${s}-foreground`, T]),
  ...STATUS.map((s) => [`status-${s}-bg`, `status-${s}-icon`, U]),
  ...LABELS.map((l) => [`label-${l}-default`, `label-${l}-on`, T]),
  ...LABELS.map((l) => [`label-${l}-subtle`, `label-${l}-strong`, T]),
  ["background", "border-input", U],
  ["background", "border-strong", U],
  ["background", "border-focus", U],
  ["background", "ring", U],
  ["background", "icon-default", U],
  ["background", "icon-muted", U],
  ["background", "icon-brand", U],
];
// Pairings are inferred from token names — a failing pair is an early warning;
// scan-axe.mjs confirms whether a component actually renders that combination.

const args = parseArgs();
const [probe] = await getStories({ ...args, only: null, stories: "all" });
const browser = await chromium.launch();
const page = await browser.newPage();
const rows = [];
for (const brand of args.brands)
  for (const scheme of args.schemes) {
    await openStory(page, args.base, probe.id, brand, scheme);
    const measured = await page.evaluate((pairs) => {
      const cs = getComputedStyle(document.documentElement);
      const ctx = Object.assign(document.createElement("canvas"), {
        width: 1,
        height: 1,
      }).getContext("2d", { willReadFrequently: true });
      const paint = (...colors) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 1, 1); // page backdrop for translucent bgs
        for (const c of colors) {
          ctx.fillStyle = c;
          ctx.fillRect(0, 0, 1, 1);
        }
        return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const lum = (rgb) => {
        const [r, g, b] = rgb.map((v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const hex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
      return pairs.map(([bg, fg, min]) => {
        const b = cs.getPropertyValue(`--ds-color-${bg}`).trim();
        const f = cs.getPropertyValue(`--ds-color-${fg}`).trim();
        if (!b || !f) return { bg, fg, min, missing: !b ? bg : fg };
        const bRgb = paint(b),
          fRgb = paint(b, f);
        const [hi, lo] = [lum(bRgb), lum(fRgb)].sort((x, y) => y - x);
        return {
          bg,
          fg,
          min,
          ratio: Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100,
          bgHex: hex(bRgb),
          fgHex: hex(fRgb),
        };
      });
    }, PAIRS);
    for (const m of measured)
      rows.push({ brand, scheme, ...m, pass: m.missing ? null : m.ratio >= m.min });
  }
await browser.close();

const fails = rows
  .filter((r) => r.pass === false)
  .sort((a, b) => a.ratio / a.min - b.ratio / b.min);
// A scheme whose every value equals light means that scheme never reaches --ds-*.
const sig = (b, sc) =>
  rows
    .filter((r) => r.brand === b && r.scheme === sc)
    .map((r) => r.bgHex + r.fgHex)
    .join();
const inert = args.schemes.filter(
  (sc) => sc !== "light" && args.brands.every((b) => sig(b, sc) === sig(b, "light")),
);
const missing = [...new Set(rows.filter((r) => r.missing).map((r) => r.missing))];
const md = [
  `# Token-pair contrast — ${args.brands.join(", ")} × ${args.schemes.join(", ")}`,
  ``,
  `${rows.length} pairs measured, ${fails.length} below minimum. 4.5 = text (SC 1.4.3), 3 = UI/focus (SC 1.4.11).`,
  ``,
  ...inert.map(
    (sc) =>
      `> **"${sc}" scheme is inert:** every --ds-* pair is identical to light in all brands — the .${sc} class does not reach the --ds-* layer. Components bound to --ds-* tokens render light colors in ${sc} mode.\n`,
  ),
  `| brand/scheme | background | foreground | ratio | needs | colors |`,
  `|---|---|---|---|---|---|`,
  ...fails.map(
    (r) =>
      `| ${r.brand}/${r.scheme} | ${r.bg} | ${r.fg} | **${r.ratio}** | ${r.min} | ${r.fgHex} on ${r.bgHex} |`,
  ),
  ``,
  ...(missing.length
    ? [`Tokens not defined (pair skipped — check the pair list is current): ${missing.join(", ")}`]
    : []),
].join("\n");
write(args.out, "contrast.json", rows);
console.log(
  `${write(args.out, "contrast.md", md)}\n${fails.length} failing pairs of ${rows.length}`,
);
