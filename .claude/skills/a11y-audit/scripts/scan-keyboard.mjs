// Layer 4 — what axe cannot see. Per story (Playground by default):
//   tab walk + focus-indicator pixel diff (2.4.7), same under forced colors,
//   reachability / positive tabindex / trap (2.1.1, 2.4.3, 2.1.2),
//   overlay open-by-keyboard → focus in → Escape → focus back (2.1.1, 2.4.3),
//   reflow at 320 CSS px (1.4.10), text-spacing clipping (1.4.12),
//   long animations under prefers-reduced-motion (2.3.3, advisory),
//   and an ARIA snapshot per story for the manifest-claims check.
//
//   node .claude/skills/a11y-audit/scripts/scan-keyboard.mjs [--only tabs] [--stories all]
//        [--brands jit] [--out DIR]
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { parseArgs, getStories, openStory, findTrigger, OVERLAYS, pool, write } from "./lib.mjs";

const argv = process.argv.slice(2);
const args = parseArgs([
  ...(argv.some((a) => a.startsWith("--stories")) ? [] : ["--stories", "playground"]),
  ...(argv.some((a) => a.startsWith("--brands")) ? [] : ["--brands", "jit"]),
  ...argv,
]);
const stories = await getStories(args);
const ariaDir = path.join(args.out, "aria");
fs.mkdirSync(ariaDir, { recursive: true });
console.error(`keyboard: ${stories.length} stories × ${args.brands.join(",")}`);

const ROVING =
  '[role="radiogroup"],[role="tablist"],[role="menu"],[role="menubar"],[role="listbox"],[role="toolbar"],[role="grid"],[role="tree"],[role="group"]';
const INTERACTIVE =
  'button,a[href],input:not([type="hidden"]),select,textarea,[role="button"],[role="tab"],[role="checkbox"],[role="radio"],[role="switch"],[role="menuitem"],[role="option"],[role="slider"],[role="combobox"],[tabindex]:not([tabindex="-1"])';
const POPUP =
  '[role="dialog"],[role="alertdialog"],[role="menu"],[role="listbox"],[role="tooltip"],[data-slot$="-content"][data-open],[data-slot$="-popup"][data-open]';
const TEXT_SPACING = `*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}`;

// Describe the focused element in a stable, human-readable way.
const describeActive = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const r = el.getBoundingClientRect();
  return {
    slot: el.dataset.slot || el.tagName.toLowerCase(),
    role: el.getAttribute("role") || el.tagName.toLowerCase(),
    name: (el.getAttribute("aria-label") || el.textContent || el.getAttribute("title") || "")
      .trim()
      .slice(0, 40),
    tabIndex: el.tabIndex,
    box: { x: r.x, y: r.y, width: r.width, height: r.height },
  };
};

async function focusShows(page, box) {
  const pad = 6;
  const vp = page.viewportSize();
  const clip = {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: Math.min(vp.width, box.width + pad * 2),
    height: Math.min(vp.height, box.height + pad * 2),
  };
  if (clip.width < 1 || clip.height < 1) return null;
  await page.waitForTimeout(160); // let focus transitions settle
  const focused = await page.screenshot({ clip });
  await page.evaluate(() => {
    window.__f = document.activeElement;
    document.activeElement.blur();
  });
  await page.waitForTimeout(160);
  const blurred = await page.screenshot({ clip });
  await page.evaluate(() => window.__f?.focus());
  return !focused.equals(blurred);
}

async function tabWalk(page, forced, checkFocus = true) {
  const stops = [];
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const d = await page.evaluate(describeActive);
    if (!d) break;
    const key = `${d.slot}|${d.name}|${Math.round(d.box.x)},${Math.round(d.box.y)}`;
    if (stops.length && stops[0].key === key) break; // cycled
    // Segmented inputs (time-input) legitimately take a few Tabs in one element;
    // 6 in a row with no exit is a trap.
    if (stops.length >= 5 && stops.slice(-5).every((st) => st.key === key)) {
      stops.push({ ...d, key, trap: true });
      break;
    }
    stops.push({ ...d, key, visible: checkFocus ? await focusShows(page, d.box) : null, forced });
  }
  return stops;
}

const browser = await chromium.launch();
const results = [];
await pool(
  stories.flatMap((s) => args.brands.map((brand) => ({ ...s, brand }))),
  args.concurrency,
  async (s) => {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 800 } });
    const page = await ctx.newPage();
    const f = []; // findings for this story
    const add = (sc, check, detail) => f.push({ sc, check, detail });
    try {
      // A. tab walk, normal + forced colors
      await openStory(page, args.base, s.id, s.brand, "light");
      const stops = await tabWalk(page, false);
      fs.writeFileSync(
        path.join(ariaDir, `${s.id}.yml`),
        await page
          .locator("#storybook-root")
          .ariaSnapshot()
          .catch(() => ""),
      );
      for (const st of stops) {
        // focusShows() blurs + refocuses, which resets segmented inputs — confirm
        // a suspected trap with a plain Tab-only walk before reporting it.
        if (st.trap) {
          await openStory(page, args.base, s.id, s.brand, "light");
          if ((await tabWalk(page, false, false)).some((x) => x.trap))
            add("2.1.2", "keyboard trap", `focus stuck on ${st.slot} "${st.name}"`);
        } else if (st.visible === false)
          add("2.4.7", "no visible focus", `${st.slot} "${st.name}"`);
        if (st.tabIndex > 0)
          add("2.4.3", "positive tabindex", `${st.slot} tabindex=${st.tabIndex}`);
      }
      await page.emulateMedia({ forcedColors: "active" });
      await openStory(page, args.base, s.id, s.brand, "light");
      for (const st of await tabWalk(page, true))
        if (st.visible === false)
          add(
            "2.4.7",
            "focus invisible in forced colors (box-shadow ring?)",
            `${st.slot} "${st.name}"`,
          );
      await page.emulateMedia({ forcedColors: "none" });

      // B. reachability — anything interactive the tab walk never landed on,
      // unless it sits in a roving-tabindex composite whose sibling was reached.
      await openStory(page, args.base, s.id, s.brand, "light");
      const unreached = await page.evaluate(
        ({ INTERACTIVE, ROVING, reached }) => {
          const els = [...document.querySelectorAll(`#storybook-root :is(${INTERACTIVE})`)].filter(
            (el) =>
              !el.disabled &&
              el.tabIndex >= 0 &&
              !el.closest('[aria-hidden="true"]') &&
              el.getAttribute("aria-disabled") !== "true" &&
              el.getClientRects().length &&
              getComputedStyle(el).visibility !== "hidden",
          );
          const label = (el) =>
            `${el.dataset.slot || el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40)}"`;
          const hit = (el) => reached.includes(label(el));
          return els
            .filter((el) => !hit(el))
            .filter((el) => {
              const g = el.closest(ROVING);
              return !(g && [...g.querySelectorAll("*")].some(hit));
            })
            .filter((el) => !el.parentElement?.closest(INTERACTIVE)) // nested inside a reached control
            .map(label);
        },
        { INTERACTIVE, ROVING, reached: stops.map((st) => `${st.slot} "${st.name}"`) },
      );
      if (stops.length < 25) for (const u of unreached) add("2.1.1", "not reachable by Tab", u);

      // C. overlay by keyboard — reach the trigger with Tab (focus-visible matters
      // for tooltips), then try the APG opening keys in order.
      const trigger =
        OVERLAYS.includes(s.component) && s.component !== "context-menu"
          ? await findTrigger(page, s.component)
          : null;
      if (trigger) {
        const hover = ["tooltip", "hover-card"].includes(s.component);
        const keys = hover ? [null] : ["Enter", "Space", "ArrowDown"];
        // aria-expanded on the trigger is the source of truth; visible-popup count
        // is the fallback (tooltips, and popups that stay mounted while closed).
        const visiblePopups = () =>
          page.evaluate(
            (P) =>
              [...document.querySelectorAll(P)].filter(
                (e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden",
              ).length,
            POPUP,
          );
        let before = 0;
        // Open = either signal; a mismatch between them is itself a 4.1.2 bug.
        const isOpen = async () =>
          (await trigger.getAttribute("aria-expanded")) === "true" ||
          (await visiblePopups()) > before;
        let openedWith = null;
        for (const key of keys) {
          await openStory(page, args.base, s.id, s.brand, "light");
          before = await visiblePopups();
          for (
            let i = 0;
            i < 25 && !(await trigger.evaluate((t) => t === document.activeElement));
            i++
          )
            await page.keyboard.press("Tab");
          if (key) await page.keyboard.press(key);
          await page.waitForTimeout(hover ? 1200 : 600); // Base UI tooltip open delay ≈ 600ms
          if (await isOpen()) {
            openedWith = key || "focus";
            break;
          }
        }
        if (!openedWith && before > 0)
          add(
            "info",
            "story renders the overlay already open — keyboard open not testable here; use a closed story",
            s.component,
          );
        else if (!openedWith)
          add(
            "2.1.1",
            "overlay does not open from keyboard",
            `tried ${keys.map((k) => k || "focus").join("/")} on ${s.component}-trigger`,
          );
        else {
          const ae = await trigger.getAttribute("aria-expanded");
          if (ae !== null && ae !== "true")
            add(
              "4.1.2",
              `trigger aria-expanded="${ae}" while the popup is open`,
              `${s.component}-trigger`,
            );
          if (keys[0] && openedWith !== keys[0])
            add(
              "info",
              `opens with ${openedWith}, not ${keys[0]} — check APG pattern`,
              s.component,
            );
          fs.writeFileSync(
            path.join(ariaDir, `${s.id}.open.yml`),
            await page
              .locator("body")
              .ariaSnapshot()
              .catch(() => ""),
          );
          const inside = await page.evaluate((P) => !!document.activeElement?.closest(P), POPUP);
          if (
            [
              "dialog",
              "alert-dialog",
              "drawer",
              "dropdown-menu",
              "menubar",
              "sheet",
              "select",
            ].includes(s.component) &&
            !inside
          )
            add("2.4.3", "focus not moved into overlay", s.component);
          await page.keyboard.press("Escape");
          await page.waitForTimeout(700);
          if (await isOpen()) add("2.1.2", "Escape does not close overlay", s.component);
          else if (
            !hover &&
            !(await trigger.evaluate(
              (t) => t === document.activeElement || t.contains(document.activeElement),
            ))
          )
            add("2.4.3", "focus not returned to trigger after Escape", s.component);
        }
      }

      // D. reflow at 320 CSS px — single-instance stories only; matrix stories
      // (Variants, Sizes, Sides) lay instances side by side on purpose.
      const single = /--(playground|default)$/.test(s.id);
      if (single) await page.setViewportSize({ width: 320, height: 640 });
      if (single) await openStory(page, args.base, s.id, s.brand, "light");
      // Name the outermost overflowing data-slot element; if only the story's own
      // wrapper overflows, the story has a fixed width — not a component defect.
      const reflow = !single
        ? { over: 0 }
        : await page.evaluate(() => {
            const w = document.documentElement.clientWidth;
            const over = document.documentElement.scrollWidth - w;
            const slots = [...document.querySelectorAll("#storybook-root [data-slot]")].filter(
              (e) => e.getBoundingClientRect().right > w + 1,
            );
            const top = slots.filter((e) => !slots.some((o) => o !== e && o.contains(e)));
            return {
              over,
              culprits: top
                .slice(0, 3)
                .map((e) => `${e.dataset.slot} (${Math.round(e.getBoundingClientRect().width)}px)`),
            };
          });
      if (single && reflow.over > 1) {
        const table = [
          "table",
          "data-table",
          "data-table-cell",
          "data-table-header",
          "form-table-cell",
        ].includes(s.component);
        if (!reflow.culprits.length)
          add(
            "info",
            "story wrapper wider than 320px (story layout, not the component)",
            `${reflow.over}px`,
          );
        else
          add(
            "1.4.10",
            table
              ? "horizontal scroll at 320px (2-D table exception candidate)"
              : "horizontal scroll at 320px",
            `${reflow.over}px — ${reflow.culprits.join(", ")}`,
          );
      }

      // E. text spacing
      await page.setViewportSize({ width: 1100, height: 800 });
      await openStory(page, args.base, s.id, s.brand, "light");
      await page.addStyleTag({ content: TEXT_SPACING });
      await page.waitForTimeout(150);
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll("#storybook-root *")]
          .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
          .filter((el) => {
            const c = getComputedStyle(el);
            return (
              /hidden|clip/.test(c.overflow + c.overflowX + c.overflowY) &&
              (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) &&
              c.textOverflow !== "ellipsis"
            );
          })
          .map(
            (el) =>
              `${el.dataset.slot || el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}"`,
          ),
      );
      for (const c of clipped) add("1.4.12", "text clipped with WCAG text spacing", c);

      // F. reduced motion (advisory)
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openStory(page, args.base, s.id, s.brand, "light");
      const motionTrigger = OVERLAYS.includes(s.component)
        ? await findTrigger(page, s.component)
        : null;
      if (motionTrigger) {
        await motionTrigger.click().catch(() => {});
        await page.waitForTimeout(100);
      }
      const longAnims = await page.evaluate(
        () =>
          document.getAnimations().filter((a) => (a.effect?.getTiming().duration || 0) > 250)
            .length,
      );
      if (longAnims)
        add(
          "2.3.3",
          "animations > 250ms still run under prefers-reduced-motion (advisory)",
          `${longAnims} animations`,
        );
    } catch (e) {
      add("—", "script error", String(e.message || e).slice(0, 200));
    }
    results.push({ id: s.id, component: s.component, brand: s.brand, findings: f });
    await ctx.close();
  },
);
await browser.close();

results.sort((a, b) => a.id.localeCompare(b.id));
const flat = results.flatMap((r) =>
  r.findings.map((x) => ({ ...x, id: r.id, component: r.component, brand: r.brand })),
);
const md = [
  `# Keyboard / focus / reflow scan`,
  ``,
  `${results.length} stories, ${flat.length} findings. ARIA snapshots: ${ariaDir}`,
  ``,
  `| SC | check | component | story | detail |`,
  `|---|---|---|---|---|`,
  ...flat
    .sort((a, b) => a.sc.localeCompare(b.sc))
    .map(
      (x) =>
        `| ${x.sc} | ${x.check} | ${x.component} | ${x.id.split("--")[1]} | ${x.detail.replace(/\|/g, "/")} |`,
    ),
  ``,
  `Clean: ${
    results
      .filter((r) => !r.findings.length)
      .map((r) => r.component)
      .join(", ") || "none"
  }`,
].join("\n");
write(args.out, "keyboard.json", results);
console.log(
  `${write(args.out, "keyboard.md", md)}\n${flat.length} findings across ${results.length} stories`,
);
