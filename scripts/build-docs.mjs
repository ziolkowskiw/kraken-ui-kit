#!/usr/bin/env node
/* Generates per-component docs under docs/components/<name>.md
 * Extracts anatomy, props, and token map from source — docs never drift.
 * A11y notes are authored inline below.
 *
 *   Run: npm run docs:build
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "src/components/ui");
const OUT_DIR = join(ROOT, "docs/components");
mkdirSync(OUT_DIR, { recursive: true });

// ── Authored a11y notes per component ──────────────────────────────────────
const A11Y = {
  accordion: `- Built on Base UI \`Accordion\`; each trigger is a \`<button>\` with \`aria-expanded\`.
- Keyboard: \`Space\`/\`Enter\` toggles; \`Tab\` moves between triggers.
- Content panel has \`aria-hidden\` when collapsed.`,

  alert: `- Use \`role="alert"\` for live, assertive announcements (errors). For non-urgent info prefer \`role="status"\`.
- Include both an icon and text — never color alone to convey type.
- Dismissible alerts: the close button needs an accessible label (\`aria-label="Dismiss"\`).`,

  "alert-dialog": `- Built on Base UI \`AlertDialog\`; focus is trapped inside while open.
- Required: \`DialogTitle\` (visible or visually-hidden) for \`aria-labelledby\`.
- Destructive confirmations: place the Cancel button before the destructive one in DOM order.`,

  accordion: `- Triggers are \`<button>\` elements with \`aria-expanded\` and \`aria-controls\`.
- Keyboard: \`Space\`/\`Enter\` toggles, \`Tab\` moves focus between triggers.
- Content panel is linked to its trigger via \`id\`/\`aria-labelledby\`.`,

  avatar: `- Provide meaningful \`alt\` on the image; use \`aria-label\` on the fallback when it shows initials.
- Decorative avatars (no semantic identity): \`alt=""\` and \`aria-hidden="true"\`.`,

  "avatar-stack": `- The group needs an accessible count: wrap in an element with \`aria-label="5 participants"\`.
- Individual avatars inside the stack should carry \`title\` or \`aria-label\`.`,

  badge: `- Purely visual in most cases; add \`aria-label\` when the badge conveys information not in surrounding text (e.g. "3 unread").
- Avoid using color alone — pair with text or icon for all eight color variants.`,

  breadcrumb: `- Wrapped in a \`<nav aria-label="Breadcrumb">\`; current page marked with \`aria-current="page"\`.
- Keyboard: all links are natively focusable.`,

  button: `- Native \`<button>\` (via Base UI) — keyboard and screen-reader accessible by default.
- \`iconOnly\` buttons: **always** provide \`aria-label\` (or \`title\`) with a text equivalent.
- Avoid \`div\`/\`span\` click handlers — use \`<button>\` or \`<a>\` as appropriate.`,

  "button-group": `- Wrap in a \`<div role="group" aria-label="…">\` to announce the grouping to screen readers.
- Ensure each child button still has its own accessible label.`,

  calendar: `- The date grid is navigable with arrow keys (react-day-picker behavior).
- Selected date is announced via \`aria-selected="true"\`; today is \`aria-label\`-annotated.
- Provide an accessible month/year heading so the grid context is always announced.`,

  card: `- A card is a presentational container — it needs no role by default.
- If the card is interactive as a unit (clickable), use \`role="article"\` or a wrapping \`<a>\`; never add \`onClick\` to a plain \`<div>\`.
- Ensure \`CardTitle\` uses an appropriate heading level (\`as="h2"\` etc.) in document context.`,

  carousel: `- Add \`aria-label\` to the \`<Carousel>\` (e.g. "Product images").
- Previous/Next buttons need accessible labels; current slide position should be announced (e.g. "Slide 2 of 5").
- Pause auto-play (if used) on focus/hover; provide a manual play/pause control.`,

  checkbox: `- Native \`<input type="checkbox">\` via Base UI — keyboard and screen-reader accessible.
- Indeterminate state: set the DOM \`indeterminate\` property (not an HTML attribute); assistive technology announces "mixed".
- Always pair with a visible \`<label>\` or \`aria-label\`.`,

  "checkbox-button": `- Same rules as Checkbox. The labeled variant puts the label in the DOM — no extra \`aria-label\` needed.
- Error state: the \`error\` prop should companion with a visible \`errorMessage\` for non-color feedback.`,

  combobox: `- Built on Base UI \`Combobox\`; the input has \`role="combobox"\`, \`aria-expanded\`, \`aria-autocomplete\`.
- Keyboard: \`ArrowDown\`/\`ArrowUp\` navigates options; \`Escape\` closes; \`Enter\` selects.
- Option list should have \`role="listbox"\` with each item as \`role="option"\`.`,

  command: `- Operates like a \`role="combobox"\` with \`aria-haspopup="listbox"\`.
- Keyboard: same as combobox; \`Escape\` closes the palette.
- Ensure the command input has a visible or visually-hidden label.`,

  "context-menu": `- Triggered by right-click; add a keyboard alternative (e.g. \`Shift+F10\` or a toolbar button) for keyboard-only users.
- Menu items use \`role="menuitem"\`; checkable items \`role="menuitemcheckbox"\`.
- Keyboard: \`ArrowUp\`/\`ArrowDown\` moves focus; \`Escape\` closes.`,

  "data-table": `- Use \`<th scope="col">\` for column headers and \`<th scope="row">\` for row headers.
- Sortable columns: the sort button inside \`<th>\` needs \`aria-sort="ascending|descending|none"\`.
- Interactive rows: prefer row-level action buttons over whole-row click targets.`,

  "data-table-cell": `- Must be a descendant of a \`<table>\` element to preserve semantic meaning.
- Provide \`headers\` attribute when complex column/row spanning is used.`,

  "data-table-header": `- \`<th>\` with \`scope="col"\`; sortable headers need \`aria-sort\`.
- Avoid placing interactive controls inside \`<th>\` other than sort buttons.`,

  "date-picker": `- Composes Calendar + Popover + Button; see individual a11y notes for each.
- The trigger button should announce the current selection: \`aria-label="Choose date, 21 June 2026"\`.
- The calendar popover traps focus when open; \`Escape\` closes and returns focus to the trigger.`,

  dialog: `- Built on Base UI \`Dialog\`; focus is trapped inside while open.
- Required: \`DialogTitle\` (visible or \`visually-hidden\`) linked via \`aria-labelledby\`.
- Optional: \`DialogDescription\` linked via \`aria-describedby\`.
- Restore focus to the trigger element on close.`,

  drawer: `- Same focus-trap and labelling rules as Dialog.
- Add \`aria-label\` describing the drawer's purpose (e.g. "Filters").
- Ensure the close affordance is keyboard reachable as the first focusable element.`,

  "dropdown-menu": `- The trigger has \`aria-haspopup="menu"\` and \`aria-expanded\`.
- Keyboard: \`ArrowUp\`/\`ArrowDown\` moves between items; \`Escape\` closes; \`Enter\`/\`Space\` activates.
- Checkable items use \`aria-checked\`; radio items use \`aria-checked\` within \`role="radiogroup"\`.`,

  empty: `- Use a heading + description + action pattern so screen readers get full context.
- The action button in an empty state must have an accessible label, not just an icon.`,

  "form-table-cell": `- Must be inside a \`<table>\`; include \`headers\` referencing the column and/or row header.`,

  "hover-card": `- Content is supplementary — never put required information only in a hover card.
- Must also open on keyboard focus (not just \`mouseenter\`); Base UI handles this.
- Add \`role="tooltip"\` or \`role="dialog"\` depending on whether it's interactive.`,

  input: `- Native \`<input>\` — keyboard accessible by default.
- Always use \`InputField\` wrapper to get a visible \`<label>\` properly associated via \`htmlFor\`.
- Error state: \`errorMessage\` renders as an associated description — prefer \`aria-describedby\` over \`aria-invalid\` alone.
- Mandatory: \`mandatory\` prop adds a visual asterisk; also add \`aria-required="true"\` on the input.`,

  "input-otp": `- Each digit slot should be individually focusable with a logical tab order.
- The group needs an overall \`aria-label="Enter your one-time password"\`.
- Announce completion state to screen readers (e.g. via a live region).`,

  item: `- When used in a list, wrap in \`<ul>\`/\`<li>\` or use \`role="list"\`/\`role="listitem"\`.
- If the item is a navigation link, use \`<a>\`; if a button, use \`<button>\`.`,

  kbd: `- Use \`<kbd>\` semantically to mark keyboard shortcuts; screen readers already handle this element.`,

  link: `- Renders as \`<a>\` — inherently keyboard and screen-reader accessible.
- Use \`link\` for navigation; use \`button\` for actions (do not style a \`<button>\` as a link for navigation).
- External links: add \`aria-label\` or visually-hidden text to warn users ("opens in new tab").`,

  menubar: `- The root element has \`role="menubar"\`; each trigger \`role="menuitem"\`.
- Keyboard: \`ArrowLeft\`/\`ArrowRight\` moves between top-level items; \`ArrowDown\` opens a menu.
- Focus returns to the triggering menubar item on close.`,

  "navigation-menu": `- Wrap in \`<nav aria-label="Main"\>\` to give the landmark a name.
- Keyboard: \`Tab\` / \`Shift+Tab\` navigates top-level items; submenus open on \`Enter\`/\`Space\`/\`ArrowDown\`.`,

  pagination: `- Wrap in \`<nav aria-label="Pagination">\`.
- Current page link: \`aria-current="page"\`.
- Previous/Next links need accessible text (not icon-only).`,

  popover: `- Focus moves into the popover on open (Base UI behavior); \`Escape\` closes and returns focus to the trigger.
- If the popover is complex (a form, etc.) use \`role="dialog"\` with \`aria-modal="true"\`.
- For purely informational hover-cards prefer \`role="tooltip"\`.`,

  progress: `- Use \`<progress>\` or a \`<div role="progressbar">\` with \`aria-valuemin\`, \`aria-valuemax\`, \`aria-valuenow\`.
- For indeterminate state omit \`aria-valuenow\`.
- Include an \`aria-label\` or \`aria-labelledby\` describing what is progressing.`,

  "radio-button": `- Same rules as RadioGroup. The labeled variant puts the label in DOM — no extra \`aria-label\` needed.`,

  "radio-group": `- Group has \`role="radiogroup"\` with \`aria-labelledby\` pointing at the group label.
- Keyboard: \`ArrowUp\`/\`ArrowDown\` moves between options (roving tabindex).
- Error state: pair \`errorMessage\` with \`aria-describedby\` on the group.`,

  resizable: `- Each resize handle needs \`aria-label\` (e.g. "Resize panel") and keyboard support (\`ArrowLeft\`/\`ArrowRight\`).
- \`react-resizable-panels\` provides this by default.`,

  "scroll-area": `- The scrollable region should have \`tabindex="0"\` when it contains non-interactive content, so keyboard users can scroll.
- \`overflow: auto\` is preferred over \`overflow: hidden\` for native keyboard scrollability.`,

  search: `- Input has \`type="search"\` — screen readers announce it as a search field.
- Add \`aria-label="Search"\` or associate with a visible label.
- Results: use a live region (\`aria-live="polite"\`) to announce the number of results.`,

  select: `- Built on Base UI \`Select\`; the trigger has \`aria-haspopup="listbox"\` and \`aria-expanded\`.
- Always use \`SelectField\` wrapper to get a visible \`<label>\` correctly linked.
- Keyboard: \`ArrowUp\`/\`ArrowDown\` navigates options; \`Enter\`/\`Space\` selects.`,

  separator: `- Use \`role="separator"\` (default). For decorative separators: \`role="none"\` or \`aria-hidden="true"\`.`,

  sidebar: `- Wrap in \`<nav aria-label="Primary"\>\` or use \`role="navigation"\`.
- Collapsible sidebar: the toggle button needs \`aria-expanded\` and \`aria-controls\`.`,

  skeleton: `- Hide skeletons from screen readers: \`aria-hidden="true"\` on all skeleton elements.
- Announce loading state via a live region outside the skeleton area.`,

  slider: `- Built on Base UI — the thumb has \`role="slider"\` with \`aria-valuemin\`, \`aria-valuemax\`, \`aria-valuenow\`, \`aria-label\`.
- Keyboard: \`ArrowLeft\`/\`ArrowRight\` (or \`Up\`/\`Down\`) adjust value; \`Home\`/\`End\` go to min/max.`,

  sonner: `- Toasts are delivered to an \`aria-live="polite"\` region (Sonner default). Use \`aria-live="assertive"\` for critical errors.
- Auto-dismissing toasts: pause the timer on hover/focus; offer a manual close.
- Don't put required user decisions in a toast — use a Dialog instead.`,

  switch: `- Built on Base UI — the element has \`role="switch"\` and \`aria-checked\`.
- Always provide a visible label or \`aria-label\` describing what the switch controls.
- Keyboard: \`Space\` toggles the switch.`,

  table: `- Use semantic \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<th scope="col">\` for full screen-reader support.
- For complex tables add \`<caption>\` or \`aria-label\` on the table.`,

  tabs: `- \`TabsList\` has \`role="tablist"\`; each \`TabsTrigger\` has \`role="tab"\` with \`aria-selected\` and \`aria-controls\`.
- Keyboard: \`ArrowLeft\`/\`ArrowRight\` moves between tabs (automatic activation).
- The active \`TabsContent\` has \`role="tabpanel"\` with \`aria-labelledby\`.`,

  textarea: `- Native \`<textarea>\` — keyboard accessible by default.
- Always use \`TextareaField\` wrapper for a visible, associated \`<label>\`.
- Character counter: expose count via \`aria-describedby\` so screen readers announce it on change.`,

  "time-input": `- Native \`type="time"\` — screen readers announce it as a time input with h/m/s segments.
- Always pair with a visible label via \`TextareaField\`-style wrapper or \`<label for>\`.`,

  toggle: `- Element has \`aria-pressed\` (not \`aria-checked\`); toggled-on state is announced.
- Provide a descriptive \`aria-label\` for icon-only toggles.`,

  "toggle-group": `- The group has \`role="group"\` with \`aria-label\` describing the option set.
- Each \`ToggleGroupItem\` has \`aria-pressed\` (single/multiple).
- Keyboard: \`Tab\` enters the group; \`ArrowLeft\`/\`ArrowRight\` moves between items (roving tabindex).`,

  tooltip: `- Tooltip content should be supplementary — never the only source of required info.
- Must appear on both hover **and** keyboard focus of the trigger.
- Use \`role="tooltip"\` on the content element; trigger has \`aria-describedby\` pointing at it.
- \`TooltipIcon\` trigger includes these semantics by default.`,
};

// ── Extraction helpers ──────────────────────────────────────────────────────
function extractExports(src) {
  const m = src.match(/export\s*\{([^}]+)\}/g);
  if (!m) return [];
  return m
    .flatMap((b) => b.replace(/export\s*\{/, "").replace("}", "").split(","))
    .map((s) => s.trim().split(/\s+as\s+/)[0].trim())
    .filter((s) => s && /^[A-Z]/.test(s))
    .filter((v, i, a) => a.indexOf(v) === i);
}

function extractVariants(src) {
  const result = {};
  // find every `variants: { ... defaultVariants/compoundVariants` block
  const blocksRe = /variants:\s*\{([\s\S]*?)\n[ \t]*\},?\s*\n[ \t]*(defaultVariants|compoundVariants)/g;
  let bm;
  while ((bm = blocksRe.exec(src))) {
    const block = bm[1];
    // each axis key: { ... } — key may be bare word or "quoted"
    const kvRe = /(?:["'](\w[\w-]*)["']|(\w+)):\s*\{([\s\S]*?)\n[ \t]*\}/g;
    let km;
    while ((km = kvRe.exec(block))) {
      const key = km[1] || km[2];
      if (key === "class" || key === "className") continue;
      const inner = km[3];
      // value keys: bare identifiers OR quoted (may contain hyphens)
      const vals = [
        ...[...inner.matchAll(/["']([\w-]+)["']\s*:/g)].map((m) => m[1]),
        ...[...inner.matchAll(/^[ \t]+(\w+)\s*:/gm)].map((m) => m[1])
          .filter((v) => !["class","className","true","false"].includes(v)),
      ];
      const unique = [...new Set(vals)];
      if (unique.length) {
        result[key] = result[key]
          ? [...new Set([...result[key], ...unique])]
          : unique;
      }
    }
  }
  return result;
}

function extractDefaults(src) {
  const m = src.match(/defaultVariants:\s*\{([^}]+)\}/);
  if (!m) return {};
  const obj = {};
  for (const pair of m[1].matchAll(/(\w+):\s*"([^"]+)"/g)) obj[pair[1]] = pair[2];
  return obj;
}

function extractTokens(src) {
  const matches = [...src.matchAll(/var\(--ds-([a-z0-9-]+)\)/g)].map((m) => m[1]);
  return [...new Set(matches)].sort();
}

function extractBoolProps(src) {
  const props = [];
  for (const m of src.matchAll(/(\w+)\?:\s*bool(?:ean)?/g)) props.push(m[1]);
  return props;
}

function extractStringProps(src) {
  const props = [];
  for (const m of src.matchAll(/(\w+)\?:\s*(?:React\.ReactNode|string|LucideIcon)/g)) props.push(m[1]);
  return props;
}

// ── Category for grouping tokens ───────────────────────────────────────────
function tokenLayer(name) {
  if (name.startsWith("button-") || name.startsWith("input-") || name.startsWith("badge-") ||
      name.startsWith("card-") || name.startsWith("alert-") || name.startsWith("select-") ||
      name.startsWith("checkbox-") || name.startsWith("radio-") || name.startsWith("switch-") ||
      name.startsWith("tabs-") || name.startsWith("sidebar-token") || name.startsWith("toggle-")) {
    return "L3 Component";
  }
  if (name.startsWith("color-") || name.startsWith("radius-") || name.startsWith("spacing-") ||
      name.startsWith("typography-") || name.startsWith("shadow-")) return "L2 Semantic";
  return "L1 Primitive / Shared";
}

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
  const anatomy =
    exports.length
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
    (p) => !Object.keys(variants).includes(p) && !boolProps.includes(p)
  ))
    rows.push(`| \`${p}\` | string / node | — | — |`);

  const propsSection =
    rows.length
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
  name === "button" ? "Displays a button or a component that looks like a button. Use for primary actions, form submits, and dialog/menu triggers. For navigation styled as a button, use `link-button`." :
  name === "badge" ? "Displays a badge or a component that looks like a badge. Use to label or categorize an item, or to show counts/status." :
  name === "input" ? "Displays a form input field. Use for single-line text entry in forms. Always map to the `InputField` wrapper to get label/description/error/mandatory." :
  name === "textarea" ? "Displays a form textarea. Use for multi-line text entry (comments, notes). Map to `TextareaField`." :
  name === "select" ? "Displays a list of options to pick from, triggered by a button. Use for single-choice selection. Map to `SelectField`." :
  name === "checkbox" ? "A control that toggles between checked and not checked. Use for opt-in/agree flows or multi-select lists." :
  name === "radio-group" ? "A set of checkable buttons where only one can be checked at a time. Use to choose one option from a small visible set." :
  name === "switch" ? "A control that toggles between on and off. Use for instant settings that take effect without a submit step." :
  name === "card" ? "Displays a card with header, content, and footer. Use to group related content and actions into a surface." :
  name === "alert" ? "Displays a callout for user attention. Use for inline, non-blocking messages (info, success, warning, error)." :
  name === "dialog" ? "A window overlaid on the primary window, rendering content underneath inert. Use for focused tasks or confirmations." :
  name === "tabs" ? "Layered sections of content displayed one at a time. Use to switch between related views in the same space." :
  `${title} component. See MAPPING.md for the full shadcn-aligned description.`
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
