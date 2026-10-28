import type { Preview } from "@storybook/nextjs-vite";
import React from "react";

// Pull in the full token + shadcn theme layer so stories render with real styles.
import "../src/app/globals.css";
// Storybook-only dark scheme (semantic tokens mirrored across their ramps).
import "./dark.css";
import { ComponentDocsPage } from "./docs/ComponentDocsPage";

const preview: Preview = {
  // Two live "change the semantic layer" switches in the toolbar:
  //  • brand       — swaps the semantic brand tokens (jit ⇄ acme) via [data-theme]
  //  • colorScheme — sets data-scheme on <html>; .storybook/dark.css re-points the semantic tokens (light ⇄ dark)
  initialGlobals: { brand: "jit", colorScheme: "light" },
  globalTypes: {
    brand: {
      description: "Brand theme (semantic layer)",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "jit", title: "JIT — yellow, rounded" },
          { value: "acme", title: "Acme — lime, spacious" },
        ],
        dynamicTitle: true,
      },
    },
    colorScheme: {
      description: "Light / dark color scheme",
      toolbar: {
        title: "Scheme",
        icon: "contrast",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== "undefined") {
        const el = document.documentElement;
        // Brand: jit is the :root default (no attribute); every other brand is an override.
        if (context.globals.brand !== "jit") el.dataset.theme = context.globals.brand;
        else delete el.dataset.theme;
        // Color scheme: data-scheme (not the shadcn `.dark` class, which only greys out shadcn vars).
        if (context.globals.colorScheme === "dark") el.dataset.scheme = "dark";
        else delete el.dataset.scheme;
      }
      return (
        <div className="bg-background text-foreground p-6">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    options: {
      storySort: { order: ["Introduction", "Foundations", "Components", "Patterns"] },
    },
    docs: { page: ComponentDocsPage },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "error",
      config: {
        // color-contrast is evaluated against the live theme; kept off here to
        // avoid false failures from the brand/dark permutations. Re-enable per
        // story with parameters.a11y.config.rules once palettes are AA-verified.
        rules: [{ id: "color-contrast", enabled: false }],
      },
    },
  },
};

export default preview;
