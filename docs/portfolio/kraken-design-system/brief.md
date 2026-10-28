# Kraken design system: case study brief

Case study file: kraken-design-system.html (this folder) · Updated: 2026-10-23 · Additions 2026-10-27 (interview redo, additive; new-format page goes to kraken-design-system-v2.html, the current page stays untouched)

## Target
- Role and company type: Design systems designer, at a product company (SaaS)
- Skills to showcase:
  - Systems thinking (VALUES.md: Systems thinking): three token layers where a new brand edits only the middle (meaning) layer. The acme test brand was created with the add-brand skill from a written brief (lime primary, spacious and minimal, sharper corners, Darker Grotesque headings, Helvetica Neue body): the skill added a new semantic mode in Figma starting from jit's values, I refined it in Figma, the sync skill carried it into the token files, and a check confirmed no component token moved. Rechecked 2026-10-26: acme now differs from jit in 102 of 255 meaning values and none of the 277 component tokens changed. The first acme pass touched no component file. Refining it later led to one new semantic control token and a rebind of the switch, slider and resize handle (page color used where a control color was needed).
  - Deciding over making (VALUES.md: Deciding over making, Building to think): I built a visual theme editor in about an hour, tested it and dropped it. It gave less control over values than Figma, could not compare brands side by side, and added one more tool to the flow. It was replaced by a skill that turns a plain-language brand description into a meaning layer in Figma, which is edited in Figma and synced to code by a second skill.
  - Technical awareness (VALUES.md: Technical awareness, not technical takeover): built on shadcn because the newer JIT apps already used it and developers knew it across JIT and client projects; kept Figma's choices where they differ (seven button styles, no "outline"). Code Connect was not in JIT's Figma plan, so I made a map that ties each Figma component to its code by its Figma ID.
  - AI-native approach (VALUES.md: How AI work is credibly shown, Being the quality gatekeeper): the redesign workflow (old app in Chrome, into Figma, the agent redesigns it with Kraken components, I fix it, then code). What I fix by hand: wrong components, layout shifts, broken proximity, sometimes copy. AI is strong on states, but I control them, "because some states can be prevented by design". AI review also caught real problems: white typed in by hand in the radio dot and switch knob.

## The story
- Reframe 2026-10-23 (user): the v4 page read junior. Tell it at system level: Kraken both consolidates existing internal tools and is the foundation for future internal apps and client projects. Name Timeports and WeJit only inside image slots, never in body text. Richer design-systems vocabulary, no diary tone. Product fixes (bulk bar, date above tabs) are interview material; the bulk bar appears only as one pattern composed from existing parts.
- Core problem and its cost: JIT's internal apps were built over years on different technologies, from an old custom codebase to newer shadcn apps. Every update meant developers learning a new setup for each app, and employees had to relearn how things look and behave in each app. Employees complained to me directly and in corridor talk, e.g. reporting work time in Timeports had no way to report many days at once.
- Decisions (1 to 3), each with what was rejected and what it cost:
  1. Only the middle layer changes per brand. Rejected: the visual theme editor (built in an hour, tested, dropped). Cost: anything a brand needs beyond look (client-specific bigger parts) stays in the project, not in the kit; the kit stays at small parts (atoms and molecules).
  2. shadcn names and code, but Figma wins where they differ. Chosen because developers and newer apps already used shadcn. Cost: seven button styles instead of shadcn's six, "outline" does not exist ("secondary" is the outline), and a list of differences that has to stay current.
  3. A map instead of Code Connect. Code Connect was not in JIT's Figma plan, so a mapping file ties each Figma component to its code by Figma ID, and a skill checks it. Cost: the map has to be kept current, which the skill checks.
- Ownership moment: JIT asked for one system for the internal apps. Making it themeable for fixed-term client projects with no design system (a new brand by editing one layer, set up from a plain-language description) was my own initiative.
- Impact, and the decision that caused it:
  - New screens are much faster for me (no number): the redesign workflow works because the agent can look up Kraken's components (decisions 2 and 3).
  - Timeports redesign adds a bulk option to report many days at once, built with Kraken's table select, answering the employee complaint.
  - A third test brand (acme) changed 93 of 252 meaning values with no component file touched (decision 1).
  - Status: Kraken is built in Figma and in code (built with agents). The redesigned Timeports and WeJit screens are not in the apps yet. Never say "not live", which reads as if the kit itself is unbuilt.
  - Added 2026-10-27 (user): the impact is shown through refreshed internal apps, as snapshots of single screens, not whole pages. Apps: Timeports (time reporting) and WeJit (internal social network, "internal Facebook"); names only in image slots. WeJit now has a cleaner layout and better visual hierarchy (user will send snapshots later). Timeports got bulk time reporting on top of the redesign.
  - Added 2026-10-27 (user), the agent redraft workflow stays as the way existing screens are refreshed with Kraken. The agent finds the proper components well, but it placed the date selection in the wrong place and I fixed it: I am still in the loop. (Same moment as the Oct 22 note: date above the tabs.)

## Domain lens: design system, multi-brand starter kit, AI workflow for design and code
- Why it was needed now, and who it serves: internal apps on different technologies (developers and employees); client projects with no design system (my initiative); AI agents that build screens.
- Adoption, and how it was won: not covered. Nobody outside me has built with it yet; it is waiting to go live.
- Governance and contribution: partly. New parts go in through the add-component skill; a drift audit and a check that runs on every change catch Figma, token files and code drifting apart.
- Tokens and theming across brands: covered (decision 1, three brands: jit, brand, acme).
- Accessibility built into the parts: every component checked in Storybook for WCAG with no errors; an a11y-audit skill runs the check for new or changed components and after brand changes.
- Migration without stopping work: partly. Redesigned Timeports and WeJit screens exist locally and in Figma; going live is pending.
- Documentation and Figma-to-code parity (added 2026-10-27, user): covered on Button. Every Figma property maps 1:1 to a Storybook control, same names and values. Drift is caught by a manual check plus an agent scan. The Storybook documentation shown is the controls panel only. Research (community practice, no formal standard): parity matters most for small, frequently used parts like Button; matching names help agents match components; start with one component. Sources: https://designsystemdiaries.substack.com/p/how-close-should-figma-be-to-code, https://builder.io/c/docs/fusion-design-system-intelligence-best-practices, https://designproject.io/figma-to-storybook-guide/, https://flambe.notion.site/Airkit-Design-System-8e8b81c62fb747ceaadb97875861ff9d, https://jepo.notion.site/Design-System-at-Templafy-3d5130f16a6640ff9d20cace4abc11b2
- Requests from others (added 2026-10-27, user): nobody besides the designer has asked for a change or a missing part yet.
- AI in the loop, and where the designer overrules it: covered (redesign workflow, what I fix, states).
- A July 2026 survey found MCP servers in 19 of 20 design systems, so AI tooling alone is not a differentiator; the judgment is. (Context for the critique, not for the page.)
- Sources: https://intodesignsystems.substack.com/p/ai-design-system-mcp-example, https://intodesignsystems.substack.com/p/miro-ai-design-system, https://intodesignsystems.substack.com/p/spotify-ai-design-system, https://www.drweb.de/design-systeme-ki-agenten-studie/, https://www.headway.io/blog/design-systems-for-ai-agents, https://clearleft.com/thinking/designing-with-tokens-for-a-flexible-multi-brand-design-system, https://hike.one/work/signify-multi-branded-design-system, https://www.portfoliobox.com/magazine/design-system-portfolio-design

## Edge cases
- On the page (the 1 or 2 strongest, as evidence):
  - Creating acme with the add-brand skill: brief, new semantic mode in Figma, synced token files, components in acme, with no component edit.
  - When the kit did not have a part, I built a new component from Kraken's parts and tokens, through the add-component skill. (Moved to the interview back-pocket 2026-10-27, swapped for the date-selection fix below.)
  - Added 2026-10-27 (approved): in the agent redraft the agent placed the date selection in the wrong place and I moved it, so I stay in the loop. This is now the second on-the-page edge case, with acme.
- Interview back-pocket (all the rest):
  - The acme test brand made everything roomier except dialogs: their spacing was typed in as fixed numbers. Fixed to tokens, so dialogs follow every brand. (Cut from the page 2026-10-23: the user found the leak story unclear.)
  - AI review found white typed in by hand in the radio button dot and switch knob, which would break in another brand.
  - The alert dialog did not connect its description text, so a screen reader would skip it; fixed.
  - Client-specific bigger parts (organisms) are built in the project, rarely in the kit.
  - AI suggests every state; I decide which states the design should prevent instead.
  - The Figma token export was out of date and did not list the new brand; values were written from live Figma instead.
  - Code Connect not in the Figma plan (the map is the workaround).
  - Figma options built so designers do not need to detach components.

## Evidence inventory
- Redesign walkthrough video (to record): old app in Chrome, into Figma, agent redesigns with Kraken, my edits. Planned use: walkthrough, near the top.
- Timeports and WeJit before/after (to provide): planned use: before/after, with a zoom-in on the Timeports bulk option.
- Creating acme with the add-brand skill, four steps (to make): brief, acme mode in Figma, synced token files, components in acme. Planned use: decision 1.
- Same screen in jit vs acme (a dialog version exists in the repo): planned use: side by side right after the four steps, decision 1.
- Figma vs Storybook side by side (to make): planned use: zoom-in for decisions 2 and 3.
- New component built with the add-component skill (to provide): planned use: edge case.
- Storybook accessibility panel with no errors, plus the a11y-audit skill (to provide): planned use: small supporting image.
- Added 2026-10-27: Button in Figma (property panel) next to Button in Storybook (controls panel), same properties, same values (to make): planned use: zoom-in with the why, decision 2. Documentation is shown as the controls only.
- Added 2026-10-27: refreshed screen snapshots, not whole pages (user will provide): Timeports screen with bulk time reporting; WeJit screen with cleaner layout and better hierarchy; each old next to new. Planned use: before/after in the outcome. Names stay in the image slots only.
- Added 2026-10-27: a moment of the agent redraft where the date selection landed in the wrong place and I moved it (to provide, a before/after crop). Planned use: inside the redraft decision, as proof I stay in the loop.
- Facts rechecked 2026-10-26: 56 components, 315 + 255 + 277 tokens in three layers, 8 skills, 3 brands. The README still says 827 tokens (stale).
- Same prompt with and without Kraken's fact sheets (MADE 2026-10-26, one run each, Sonnet subagents, prompt "build me a delete confirmation dialog for deleting a variant"): dialog-without-kit.png, dialog-with-kit-jit/brand/acme.png in this folder. Honest notes: the without-kit result looks richer (trash icon, detail row) and defined its own private palette (14 hand-typed colors, 37 px values, no brand switch); the with-kit agent chose AlertDialog because the dialog manifest says not to use Dialog for destructive confirmations, used seven variants correctly (secondary, not outline), typed in no hex or px, and the result changes with each brand. The without-kit agent was told the font Moderat JIT, the with-kit agent was not.

## Cut from the story (interview material)
- Atoms and molecules scope as its own decision (it appears only as the cost of decision 1).
- Developer docs per component (description, anatomy, props, states, tokens, accessibility, usage, code example).
- The same prompt reused for every component review, polished each time something drifted.
- Token Studio as the starting point for importing tokens into Figma.
- Nested components in Storybook stories.
- Added 2026-10-27 (user): the dry run as a new developer (an agent playing a developer new to the kit, building a time-off request form) is dropped from the page. Interview material only; the time-off dry run frame stays out of v2.

## Open gaps
- 2026-10-26 simplification (user): page cut from about 2,250 to about 1,600 words and 8 slots (7 images, 1 video), focused on design plus AI-native. Three decisions kept, JIT redesign is one before/after image in the outcome. Modeled on public design system case studies (short, problem first, one layers diagram, each decision names the rejected option, honest outcome).
- [NEEDS DETAIL: Timeports and WeJit before/after screens, the user will provide]
- [NEEDS DETAIL: the redesign walkthrough recording]
- Resolved 2026-10-22: new component is the floating bulk actions bar (Timeports bulk reporting). All three brands passed the accessibility check. Timeports: the OLD app had the report tabs above the date, so the date looked per-tab; the redesign moves the date above the tabs (user screenshots: before = old app, after = Kraken). Speed number: none, stays qualitative. Reflection (user's words, 2026-10-22): common context for all JIT apps, same patterns give brand consistency and a lower learning curve; new app screens can be built by prompting an agent without the AI making design decisions each time; learned DS creation and making it AI-native through skills; would make it more AI-native, but new tools arrive every few weeks and Kraken is not their only project.
- [NEEDS DETAIL: adoption, one person outside the designer building with Kraken; skipped for now]
- [NEEDS DETAIL: the acme brief on the page (lime, spacious and minimal, sharper corners, Darker Grotesque, Helvetica Neue) was read from commits and token files; confirm it matches the brief actually given to the skill]
- [NEEDS DETAIL: timed new brand from start to finish; skipped for now]
- [NEEDS DETAIL: how much faster screens are, only if a real number exists; otherwise stays qualitative]
- Added 2026-10-27 (stale facts to fix in v2, not edited above): the brief still counts three brands and gives two acme numbers (93 of 252 in the Impact section, 102 of 255 in Skills). The page shows two brands (jit and acme) and uses 102 of 255 semantic values and 0 of 277 component tokens.
- Added 2026-10-27: [NEEDS DETAIL: Timeports (with bulk reporting) and WeJit refreshed snapshots, the user will send later]
- Added 2026-10-27: [NEEDS DETAIL: Button Figma-vs-Storybook controls image, to make]
