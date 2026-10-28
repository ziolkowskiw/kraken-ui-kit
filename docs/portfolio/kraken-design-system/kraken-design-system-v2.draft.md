# Kraken design system

How do you make a family of internal apps feel like one product, when AI is writing a growing share of the screens?

[IMAGE: one screen in jit and acme side by side, caption: "Same components, two brands, and only the meaning layer changes."]

## Problem

JIT's internal apps look and behave differently from each other, client projects start without a design system, and AI agents build screens from guesses.

## Solution

Kraken is a design system that designers, developers and AI assistants can all read: internal apps share one set of components, a client brand changes one layer, and AI looks components up instead of guessing.

## Context

### JIT's apps grew on different technologies, so every update started from scratch
JIT's internal apps were built over years on different technologies, from an old custom codebase to newer shadcn apps. Kraken is one shared set of parts, built in Figma and in code, for those apps, for new ones and for client projects. The goal is that developers learn one setup instead of one per app.

## The problem

### Employees relearned every app, and some jobs had no good way to be done
Employees had to relearn how things look and behave in each app, and they told me so, for example that reporting work time had no way to report many days at once. JIT asked for one system for the internal apps, and on my own initiative I also made it themeable for client projects that start with no design system. A client brand is now set up by editing one layer, which I proved with a test brand, though no client project has used it yet.

## Insights

A design system for several brands is **layered**: the brand lives in one layer, so nothing else moves.

A design system for several tools is **familiar**: it speaks shadcn, so developers and agents already know its names.

A design system for AI agents is **readable**: every part has a fact sheet, so the agent looks things up instead of guessing.

## The process

### One layer carries the brand, and acme showed me where it leaked
A new brand should not mean rewriting every part. Kraken has three layers of tokens (315 base values, 255 meaning values and 277 component values), and a brand only edits the middle layer, the one that says what each color is for. Acme, a test brand, changes 102 of the 255 meaning values and none of the 277 component values, and when I refined it the switch, slider and resize handle still used a page color where they needed a control color, so I added one control token that fixed them for every brand.

### I dropped the theme editor because Figma gives more control
Setting a brand up by hand is slow, so I built a browser theme editor in about an hour. It gave less control than Figma, could not compare brands side by side and added one more tool, so I replaced it with a skill, which is written instructions an agent follows, that turns a brand brief into a meaning layer in Figma, and a second skill that syncs it into the token files. Acme went from a written brief to rendered components with no component edit on the first pass, at the cost that a new brand now needs someone who works in Figma.

[IMAGE: four steps, brief, acme mode in Figma, synced token files, components in acme, caption: "Acme went from a written brief to rendered components, and it passes the same accessibility check as jit."]

[IMAGE: the browser theme editor screenshot, caption: "The theme editor I built in an hour, tested and dropped."]

### Kraken keeps shadcn's names, and Figma wins where they disagree
Developers and the newer JIT apps already used shadcn, but Figma and shadcn disagree in places. I built on shadcn names and kept Figma's choices where they differ, so buttons have seven styles and no "outline", and every Button property in Figma has a Storybook control with the same name and values, checked by hand and with an agent scan. Designers and developers read one vocabulary, at the cost of a list of differences that has to stay current.

[IMAGE: Button properties in Figma next to Button controls in Storybook, caption: "Same properties, same names, same values."]

### A map and a fact sheet per part let agents look components up
An agent building from a Figma screen has to guess which code part it is looking at, and Code Connect was not in JIT's Figma plan. I made a map from every Figma component to its code and a fact sheet per component for the agent to read, plus a check that fails when either drifts from its source. Asked for a delete dialog, an agent without them typed in 14 colors and 37 pixel values, and with them it typed in none and followed each brand, from one run each.

[IMAGE: the dialog without Kraken, with Kraken in jit and with Kraken in acme, caption: "Only the agent without Kraken was told the font, so I would repeat this test before calling it a result."]

### Agents redraft existing screens, and I stay in the loop
Refreshing an existing internal screen by hand is slow. An agent brings the old screen into Figma and redrafts it from Kraken parts, then I fix what it got wrong, such as broken grouping and copy, and once the date selection, which it put in the wrong place. Screens come together faster, and none leaves without my check.

[IMAGE: the date selection where the agent placed it and where I moved it, caption: "The agent found the right components and put the date in the wrong place."]

[VIDEO: 30 to 45 seconds, an old internal screen into Figma, redrafted by an agent from Kraken parts, then refined by hand, caption: "From an old screen to a Kraken screen, with my fixes on camera."]

## The outcome

### Two refreshed screens show the same parts working in two different tools
Two internal tools built years apart looked like strangers. The refreshed time reporting screen now reports many days at once, which answers the employee complaint, and the refreshed social network screen has a cleaner layout and a clearer hierarchy. They are not in the apps yet, and no one else has built with Kraken or asked it for a change, so the next test is a second developer.

[IMAGE: old and refreshed screens side by side, a time reporting screen with bulk reporting and a Timeports label, a WeJit screen, caption: "Two tools built years apart, refreshed from the same components."]

## Reflection

### A common context beats polishing each app on its own
Each JIT app had its own patterns, so each one had its own learning curve. Kraken gives them one common context, and its skills let an agent build a screen from it without making design decisions each time. Next I would have agents do more of the work through skills, because new tools arrive every few weeks.

---

## Notes to you

- Reviewers' fixes applied: one spine (apps, brands and agents all read one system), Process cut from 8 paragraphs to 5 under 3 decisions, cost named in The problem, future-tense promises removed, "skill" explained once, "AI-native" label dropped, h3 titles rewritten as claims.
- Moved out of the page into interview material: the accessibility paragraph (kept as a clause in one caption), Storybook parity as its own paragraph (kept inside the shadcn paragraph with the Button image), atoms and molecules rule, new component edge case.
- Still need from you: refreshed screen snapshots, the Button controls image, the date-fix crop, the redraft video, a side-by-side of the acme steps.
