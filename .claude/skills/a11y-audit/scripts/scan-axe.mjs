// Layer 2 — axe-core over every story × brand × scheme, WCAG 2.2 A/AA tags,
// color-contrast ON (preview.tsx disables it globally), whole document so
// portalled overlays are included, plus a second pass with the overlay opened.
//
//   node .claude/skills/a11y-audit/scripts/scan-axe.mjs [--only button,dialog]
//        [--stories playground] [--brands jit,acme] [--schemes light] [--out DIR]
import { chromium } from "playwright";
import {
  AXE_PATH,
  WCAG_TAGS,
  parseArgs,
  getStories,
  openStory,
  openOverlay,
  pool,
  write,
} from "./lib.mjs";

const args = parseArgs();
const stories = await getStories(args);
const jobs = stories.flatMap((s) =>
  args.brands.flatMap((brand) => args.schemes.map((scheme) => ({ ...s, brand, scheme }))),
);
console.error(
  `axe: ${stories.length} stories × ${args.brands.length * args.schemes.length} themes = ${jobs.length} runs`,
);

// Page-level rules are properties of the Storybook iframe, not the component.
const HARNESS_RULES = ["bypass", "document-title", "html-has-lang", "html-lang-valid"];

// addon-a11y runs its own axe in the same window on load; wait it out.
async function runAxe(page) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await axeOnce(page);
    } catch (e) {
      if (attempt > 20 || !/already running/.test(e.message)) throw e;
      await page.waitForTimeout(300);
    }
  }
}

const axeOnce = (page) =>
  page.evaluate(
    async ({ tags, off }) => {
      const r = await window.axe.run(document, {
        runOnly: { type: "tag", values: tags },
        rules: {
          "color-contrast": { enabled: true },
          ...Object.fromEntries(off.map((id) => [id, { enabled: false }])),
        },
        resultTypes: ["violations", "incomplete"],
      });
      const slim = (v) => ({
        rule: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        sc: v.tags.filter((t) => /^wcag\d{3,}$/.test(t)),
        nodes: v.nodes.slice(0, 5).map((n) => ({
          target: n.target.join(" "),
          html: n.html.slice(0, 160),
          why: (n.failureSummary || "").split("\n").slice(1).join(" ").slice(0, 240),
        })),
        count: v.nodes.length,
      });
      return { violations: r.violations.map(slim), incomplete: r.incomplete.map(slim) };
    },
    { tags: WCAG_TAGS, off: HARNESS_RULES },
  );

const browser = await chromium.launch();
const results = [];
const errors = [];
await pool(jobs, args.concurrency, async (job) => {
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  try {
    await openStory(page, args.base, job.id, job.brand, job.scheme);
    await page.addScriptTag({ path: AXE_PATH });
    results.push({ ...job, state: "default", ...(await runAxe(page)) });
    if (await openOverlay(page, job.component))
      results.push({ ...job, state: "open", ...(await runAxe(page)) });
  } catch (e) {
    errors.push({
      id: job.id,
      brand: job.brand,
      scheme: job.scheme,
      error: String(e.message || e).slice(0, 200),
    });
  }
  await page.close();
});
await browser.close();

// Collapse identical findings across themes: one row per component+rule+target,
// listing the permutations it fails in. "all 6" = structural; a subset = palette.
const rows = new Map();
let vendor = 0;
for (const r of results)
  for (const v of r.violations)
    for (const n of v.nodes) {
      // Base UI focus guards are aria-hidden + tabindex=0 on purpose (they
      // bounce focus back into the popup) — vendor pattern, not a kit defect.
      if (v.rule === "aria-hidden-focus" && n.html.includes("data-base-ui-focus-guard")) {
        vendor++;
        continue;
      }
      const key = `${r.component}|${v.rule}|${n.target}`;
      const row = rows.get(key) || {
        component: r.component,
        rule: v.rule,
        impact: v.impact,
        sc: v.sc,
        help: v.help,
        helpUrl: v.helpUrl,
        target: n.target,
        html: n.html,
        why: n.why,
        stories: new Set(),
        themes: new Set(),
        states: new Set(),
      };
      row.stories.add(r.id);
      row.themes.add(`${r.brand}/${r.scheme}`);
      row.states.add(r.state);
      rows.set(key, row);
    }
const findings = [...rows.values()].map((r) => ({
  ...r,
  stories: [...r.stories],
  themes: [...r.themes].sort(),
  states: [...r.states],
}));
const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
findings.sort(
  (a, b) => order[a.impact] - order[b.impact] || a.component.localeCompare(b.component),
);

const incomplete = {};
for (const r of results)
  for (const v of r.incomplete)
    incomplete[`${r.component}|${v.rule}`] =
      (incomplete[`${r.component}|${v.rule}`] || 0) + v.count;

const totalThemes = args.brands.length * args.schemes.length;
const md = [
  `# axe scan — WCAG 2.2 A/AA, contrast on`,
  ``,
  `${results.length} scans (${stories.length} stories × ${totalThemes} themes, + open-overlay passes). ${errors.length} load errors.`,
  `${findings.length} distinct violations. ${vendor} Base UI focus-guard hits filtered (aria-hidden-focus on data-base-ui-focus-guard).`,
  ``,
  `| impact | component | rule | SC | themes | target | why |`,
  `|---|---|---|---|---|---|---|`,
  ...findings.map(
    (f) =>
      `| ${f.impact} | ${f.component} | ${f.rule} | ${f.sc.join(" ")} | ${f.themes.length === totalThemes ? `all ${totalThemes}` : f.themes.join(", ")} | \`${f.target.replace(/\|/g, "\\|")}\` | ${f.why.replace(/\|/g, "/")} |`,
  ),
  ``,
  `## Needs manual review (axe "incomplete")`,
  ...Object.entries(incomplete).map(([k, n]) => `- ${k.replace("|", " · ")} — ${n} nodes`),
  ``,
  ...(errors.length
    ? [`## Load errors`, ...errors.map((e) => `- ${e.id} ${e.brand}/${e.scheme}: ${e.error}`)]
    : []),
].join("\n");

write(args.out, "axe.json", { findings, incomplete, errors });
console.log(
  `${write(args.out, "axe.md", md)}\n${findings.length} violations, ${errors.length} errors`,
);
