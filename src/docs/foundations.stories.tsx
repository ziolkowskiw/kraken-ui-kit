import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import foundations from "../../manifests/foundations.json";

// Semantic tokens that carry a brand's identity; every swatch is a live var(), never a literal.
const SWATCHES = [
  ["--ds-color-primary", "primary"],
  ["--ds-color-primary-foreground", "primary-foreground"],
  ["--ds-color-primary-muted", "primary-muted"],
  ["--ds-color-secondary", "secondary"],
  ["--ds-color-destructive", "destructive"],
  ["--ds-color-background", "background"],
] as const;

const meta = {
  title: "Foundations/Brands & theming",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A brand is a set of semantic token values, selected with `data-theme` on `<html>` or any ancestor. `jit` is the default and sets no attribute.",
          "Components never carry brand code: switching swaps only the semantic layer, and the shadcn variables (`--primary`, `--background`, …) are re-pointed at `--ds-*` in `kraken-theme.css`, so Tailwind classes follow too. Never hard-code a brand value.",
          "`jit` is the default brand: yellow primary, rounded 6px corners and Moderat JIT type. The swatches below show the brand and scheme selected in the toolbar.",
          "To add another brand, see **Foundations / Creating a brand**.",
        ].join("\n\n"),
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// The preview decorator already applies the selected brand and scheme to <html>,
// so the swatches below follow the toolbar.
export const SelectedBrand: Story = {
  render: (_args, { globals }) => {
    const brand = globals.brand === "acme" ? "acme" : "jit";
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-1">
          <code className="text-sm font-semibold">
            data-theme=&quot;{brand}&quot;, {globals.colorScheme === "dark" ? "dark" : "light"}
          </code>
          {brand === "jit" && (
            <p className="text-sm" style={{ color: "var(--ds-color-muted-foreground)" }}>
              {foundations.brands.values.jit}
            </p>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SWATCHES.map(([cssVar, label]) => (
            <div key={cssVar} className="flex flex-col gap-1">
              <div
                className="h-10 rounded-sm border"
                style={{ background: `var(${cssVar})`, borderColor: "var(--ds-color-border)" }}
              />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
