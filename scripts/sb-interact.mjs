// Open each interactive component (click/hover/right-click/type) on the running
// Storybook and capture open-time console/page errors + a screenshot of the open
// state to /tmp/sb-open. Run from kraken-ui-kit so `playwright` resolves.
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:6006";
const OUT = "/tmp/sb-open";
fs.mkdirSync(OUT, { recursive: true });
const IGNORE = [/React DevTools/i, /Lit is in dev mode/i];
const txt = (p, t) => p.getByText(t, { exact: false }).first();

const cases = [
  { id: "components-dropdownmenu--playground", act: (p) => txt(p, "Open menu").click() },
  {
    id: "components-contextmenu--playground",
    act: (p) => txt(p, "Right-click here").click({ button: "right" }),
  },
  { id: "components-popover--playground", act: (p) => txt(p, "Open popover").click() },
  { id: "components-hovercard--playground", act: (p) => txt(p, "@kraken").hover() },
  { id: "components-menubar--playground", act: (p) => txt(p, "File").click() },
  { id: "components-navigationmenu--playground", act: (p) => txt(p, "Getting started").click() },
  { id: "components-drawer--playground", act: (p) => txt(p, "Open drawer").click() },
  { id: "components-sonner--playground", act: (p) => txt(p, "Success").click() },
  {
    id: "components-combobox--playground",
    act: async (p) => {
      const i = p.locator("input").first();
      await i.click();
      await i.pressSequentially("a", { delay: 40 });
    },
  },
  {
    id: "components-command--playground",
    act: async (p) => {
      const i = p.locator("input").first();
      await i.click();
      await i.pressSequentially("ca", { delay: 40 });
    },
  },
  {
    id: "components-select--playground",
    act: async (p) => {
      await p.locator('[data-slot="select-trigger"]').first().click();
    },
  },
  {
    id: "components-dialog--playground",
    act: async (p) => {
      await p.locator('[data-slot="dialog-trigger"]').first().click();
    },
  },
  {
    id: "components-carousel--playground",
    act: async (p) => {
      await p.locator('[data-slot="carousel-next"]').first().click();
    },
  },
  {
    id: "components-tooltip--tooltip-icon-playground",
    act: async (p) => {
      await p.locator('[data-slot="tooltip-trigger"]').first().hover();
    },
  },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1000, height: 720 } });
const results = [];
for (const c of cases) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") {
      const t = m.text();
      if (!IGNORE.some((re) => re.test(t)))
        errors.push("console: " + t.replace(/\s+/g, " ").slice(0, 280));
    }
  });
  page.on("pageerror", (e) =>
    errors.push("pageerror: " + (e.message || String(e)).replace(/\s+/g, " ").slice(0, 280)),
  );
  try {
    await page.goto(`${BASE}/iframe.html?viewMode=story&id=${c.id}`, {
      waitUntil: "load",
      timeout: 20000,
    });
    await page.waitForSelector("#storybook-root", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(400);
    await c.act(page);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${c.id}.png` }).catch(() => {});
  } catch (e) {
    errors.push(
      "interaction: " +
        String(e.message || e)
          .replace(/\s+/g, " ")
          .slice(0, 200),
    );
  }
  results.push({ id: c.id, errors: [...new Set(errors)] });
  await page.close();
}
await browser.close();

const bad = results.filter((r) => r.errors.length);
console.log(`OPENED ${results.length} components — ${bad.length} with errors\n`);
for (const r of bad) {
  console.log(`■ ${r.id}`);
  r.errors.slice(0, 4).forEach((e) => console.log("   - " + e));
}
if (!bad.length) console.log("(all interactive opens clean)");
