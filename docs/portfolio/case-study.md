# Kraken UI Kit: a design system AI assistants get right on the first try

**How do you keep a brand consistent when more and more of its screens are built by AI?**

Self-initiated system, built to prove one claim: that a single designer directing AI assistants can stand up a production-grade design system in weeks, not quarters. System design, architecture decisions and quality direction by me; AI assistants did most of the hands-on building. Five weeks, June to July 2026.

## Context

The starting point was a familiar gap: no shared UI kit. Every screen started from a blank page, colors got copied by eye out of Figma, and a rebrand would have meant repainting every screen by hand.

Then a newer problem arrived on top of the old one. AI assistants were starting to write real screens, fast, and an AI without a design system simply invents one. It makes up styles, hardcodes colors, and produces good-looking pages that belong to no brand.

So the brief I gave myself was double. Build the missing kit, and build it so a machine can use it as reliably as a person can. The audience of a design system now includes machines.

## The problem

A design system that lives as pictures in Figma and prose in a wiki is invisible to the tools that now do the building. Whatever I made had to be readable by software, checkable by software, and hard to quietly drift away from. Otherwise AI speed would multiply the inconsistency instead of fixing it.

## What I learned before building

Three observations shaped everything that followed:

- A design decision is only **real** when it lives in exactly one place. Two editable copies of a color means the color has no owner.
- An AI is most **confident** exactly when it is guessing. It will state an invented button style with the same certainty as a true one, so the fix is not better prose, it is giving it a place to look things up.
- Documentation is only **honest** if it can fail. A wiki page goes stale silently; a step-by-step playbook that a machine actually runs either works or breaks loudly.

## Decision one: speak the language the AI already knows

I anchored the kit to shadcn, the open source collection of interface parts that most of the industry, and every AI model's training data, already knows. Names, options and behaviors match it exactly, and the few deliberate differences are published as a short machine-readable list.

The trade-off: I gave up naming freedom. Where our Figma design genuinely disagreed with the convention, for example our buttons come in seven styles rather than six, I kept the Figma truth and documented the difference instead of pretending it was not there.

The payoff is that an AI assistant arrives with correct instincts and only needs to learn the differences, not the whole system.

## Decision two: one place where truth lives, even when it cost the demo

Every color, size and font in the kit is a design token, stored in the open industry format (the same one tools like Tokens Studio speak) and organized in three layers. Only the middle layer changes per brand. Switching the entire product from the yellow brand to the blue one, different colors, corner rounding and fonts, is a single attribute: no screen changes, no component changes.

[IMAGE: the same screen in both brands side by side, caption: "One attribute switches the whole product: colors, corner rounding, and fonts."]

To show off that power, I built a visual theme editor: pick colors, watch the whole kit restyle live, save the result back to Figma. It worked. It demoed beautifully. I iterated on it for two weeks.

Then I deleted it.

The editor had quietly created a second place where design decisions happen. Two sources of truth is the exact disease a design system exists to cure, and I had reintroduced it through a side door because it looked good in a demo. Designers already have a place to author themes with real review built in: Figma itself. So theming moved fully into Figma, flowing through the same one-way pipeline as everything else, and two weeks of working, demoable work went in the bin.

That deletion is the decision I would defend hardest. The boring architecture protects the promise; the impressive feature undermined it.

## Decision three: let the kit answer questions instead of hoping to be read

Instead of writing documentation and hoping an AI reads it, I made the kit queryable. Every component publishes a machine-readable fact sheet: its exact options, defaults, tokens and usage rules, generated straight from the code so it cannot lie. A small connector (built on the Model Context Protocol, a standard way to plug tools into AI assistants) lets any assistant look those facts up mid-task.

Around that I wrote seven playbooks for the recurring rituals, things like syncing tokens from Figma or onboarding a new brand, that an assistant executes step by step rather than reinvents. And automatic checks run on every change: anything generated is rebuilt and compared byte by byte, so a single drifted value turns the whole project red until a human resolves it.

Those checks earned their keep early. One automated cleanup pass silently corrupted the generated fact sheets, and the byte comparison caught it before it shipped. The fix was structural, not a one-off: the tools that generate content are now fenced off from the tools that format it.

## The outcome

The test that mattered: a fresh empty project, an AI assistant connected to the kit, and one casual prompt, "build me a delete confirmation dialog". The assistant looked up the real component, used the correct destructive style, and produced a dialog that was on-brand in both brands, with not a single hardcoded color in it. What people call vibecoding, chatting a screen into existence, now lands inside the brand instead of outside it.

[VIDEO: screen recording of the prompt-to-dialog flow, caption: "From one sentence to an on-brand dialog, with every color resolved through the token system."]

The kit shipped with 56 components, 835 design tokens and two live brands, built solo in five weeks. The consistency it promises is not a policy anyone has to remember; it is checked automatically on every single change, and the one time something slipped, the check caught it before any person did.

## Reflection

The project changed how I think about the word "quality" in an AI-heavy workflow. The assistants produced enormous volume; my actual job turned out to be deciding what was worth keeping, where truth was allowed to live, and what to delete. The best thing I built was a system that no longer needs me to stand guard over it. The second best thing I built was the theme editor, and the most important thing I did was throw it away.

---

_The full detail behind this story lives next to it: the [user guide](user-guide.md) covers everything the kit contains and how to use it, and the [design decisions record](design-decisions.md) walks through every choice with its trade-off._
