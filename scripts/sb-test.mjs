// Render-test every Storybook story against the running dev server (port 6006).
// Captures console.error + uncaught pageerror, hovers any tooltip trigger, and
// screenshots each story to /tmp/sb-shots. Run from the kraken-ui-kit dir so
// `playwright` resolves from node_modules.
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:6006";
const OUT = "/tmp/sb-shots";
fs.mkdirSync(OUT, { recursive: true });

const idx = await (await fetch(BASE + "/index.json")).json();
const entries = Object.values(idx.entries || idx.stories || {});
const stories = entries.filter((e) => e.type === "story");

const IGNORE = [/Download the React DevTools/i, /A11y/i, /Lit is in dev mode/i];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1000, height: 720 } });
const results = [];

for (const s of stories) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (IGNORE.some((re) => re.test(t))) return;
    errors.push("console: " + t.replace(/\s+/g, " ").slice(0, 280));
  });
  page.on("pageerror", (e) =>
    errors.push("pageerror: " + (e.message || String(e)).replace(/\s+/g, " ").slice(0, 280)),
  );
  const url = `${BASE}/iframe.html?viewMode=story&id=${s.id}`;
  try {
    await page.goto(url, { waitUntil: "load", timeout: 20000 });
    await page.waitForSelector("#storybook-root", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);
    // exercise field tooltips (the ⓘ trigger) — catches hover-time crashes
    const tip = await page.$('[data-slot="tooltip-trigger"]');
    if (tip) {
      await tip.hover().catch(() => {});
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: `${OUT}/${s.id}.png` }).catch(() => {});
  } catch (e) {
    errors.push("nav: " + String(e.message || e).slice(0, 200));
  }
  if (errors.length)
    results.push({ id: s.id, title: s.title, name: s.name, errors: [...new Set(errors)] });
  await page.close();
}
await browser.close();

fs.writeFileSync("/tmp/sb-report.json", JSON.stringify(results, null, 2));
console.log(`TESTED ${stories.length} stories — ${results.length} with errors\n`);
for (const r of results) {
  console.log(`■ ${r.id}`);
  r.errors.slice(0, 4).forEach((e) => console.log("   - " + e));
}
