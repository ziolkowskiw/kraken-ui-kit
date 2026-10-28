// Shared helpers for the a11y-audit scripts. Runs against a live Storybook
// (default http://localhost:6006). `playwright` and `axe-core` resolve from the
// repo's node_modules by walking up from this directory.
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
export const AXE_PATH = require.resolve("axe-core/axe.min.js");

// Theme matrix — must match globalTypes in .storybook/preview.tsx.
export const BRANDS = ["jit", "brand", "acme"];
// Dark is opt-in (--schemes light,dark): it is deferred in polish-plan.md and
// .dark does not reach --ds-* yet, so it would bury every run in noise.
export const SCHEMES = ["light"];

// WCAG 2.2 A + AA (EN 301 549 v4.1.1). best-practice rules are deliberately left out.
export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export function parseArgs(argv = process.argv.slice(2)) {
  const a = {
    base: "http://localhost:6006",
    only: null, // component file names, e.g. "button,dialog"
    stories: "all", // "all" | "playground"
    brands: BRANDS,
    schemes: SCHEMES,
    out: path.join(os.tmpdir(), "kraken-a11y"),
    concurrency: 4,
  };
  for (let i = 0; i < argv.length; i++) {
    const [k, v] = argv[i].includes("=") ? argv[i].split("=") : [argv[i], argv[i + 1]];
    const take = () => (argv[i].includes("=") ? v : (i++, v));
    if (k === "--base") a.base = take();
    else if (k === "--only") a.only = take().split(",");
    else if (k === "--stories") a.stories = take();
    else if (k === "--brands") a.brands = take().split(",");
    else if (k === "--schemes") a.schemes = take().split(",");
    else if (k === "--out") a.out = take();
    else if (k === "--concurrency") a.concurrency = Number(take());
  }
  fs.mkdirSync(a.out, { recursive: true });
  return a;
}

// "./src/components/ui/date-picker.tsx" -> "date-picker" (the manifest name).
export const componentOf = (entry) =>
  path.basename(entry.componentPath || entry.importPath, ".tsx").replace(/\.stories$/, "");

export async function getStories(args) {
  const res = await fetch(`${args.base}/index.json`).catch(() => null);
  if (!res?.ok)
    throw new Error(`Storybook not reachable at ${args.base} — start it with: npm run storybook`);
  const entries = Object.values((await res.json()).entries).filter((e) => e.type === "story");
  return entries
    .map((e) => ({ id: e.id, title: e.title, name: e.name, component: componentOf(e) }))
    .filter((s) => !args.only || args.only.includes(s.component))
    .filter((s) => args.stories !== "playground" || /--playground$/.test(s.id));
}

export const storyUrl = (base, id, brand = "jit", scheme = "light") =>
  `${base}/iframe.html?viewMode=story&id=${id}&globals=brand:${brand};colorScheme:${scheme}`;

// Navigate, wait for render, and prove the theme globals actually applied —
// a silently-ignored URL global would make the whole matrix a jit-light rerun.
export async function openStory(page, base, id, brand, scheme) {
  await page.goto(storyUrl(base, id, brand, scheme), { waitUntil: "load", timeout: 30000 });
  await page.waitForSelector("#storybook-root > *", { timeout: 10000 }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(250);
  const applied = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme || "jit",
    dark: document.documentElement.classList.contains("dark"),
  }));
  if (applied.theme !== brand || applied.dark !== (scheme === "dark"))
    throw new Error(`theme not applied: wanted ${brand}/${scheme}, got ${JSON.stringify(applied)}`);
}

// Overlays render nothing until opened. Generic opener keyed on the kit's
// data-slot="*-trigger" convention so new components are covered automatically.
export const OVERLAYS = [
  "alert-dialog",
  "combobox",
  "context-menu",
  "date-picker",
  "dialog",
  "drawer",
  "dropdown-menu",
  "hover-card",
  "menubar",
  "navigation-menu",
  "popover",
  "select",
  "sheet",
  "tooltip",
];

// Prefer the component's own trigger: a field label can hold a tooltip-trigger
// that sits before the select/combobox trigger in the DOM.
export async function findTrigger(page, component) {
  const own = page.locator(`#storybook-root [data-slot="${component}-trigger"]`).first();
  if (await own.count()) return own;
  const any = page.locator('#storybook-root [data-slot$="-trigger"]').first();
  return (await any.count()) ? any : null;
}

export async function openOverlay(page, component) {
  if (!OVERLAYS.includes(component)) return false;
  const trigger = await findTrigger(page, component);
  if (!trigger || (await trigger.isDisabled())) return false;
  const opts = { timeout: 3000 };
  if (["tooltip", "hover-card"].includes(component)) await trigger.hover(opts);
  else if (component === "context-menu") await trigger.click({ ...opts, button: "right" });
  else await trigger.click(opts);
  await page.waitForTimeout(500);
  return true;
}

export async function pool(items, n, fn) {
  const queue = [...items];
  let done = 0;
  const workers = Array.from({ length: n }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await fn(item);
      if (++done % 25 === 0) process.stderr.write(`  …${done}/${items.length}\n`);
    }
  });
  await Promise.all(workers);
}

export function write(out, name, data) {
  const p = path.join(out, name);
  fs.writeFileSync(p, typeof data === "string" ? data : JSON.stringify(data, null, 2));
  return p;
}
