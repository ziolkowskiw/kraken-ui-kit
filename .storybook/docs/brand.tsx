import * as React from "react";
import { addons } from "storybook/preview-api";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import foundations from "../../manifests/foundations.json";

// Docs show values for the brand and scheme picked in the toolbar, never every brand at once.

export type Brand = "jit" | "acme";
export type Scheme = "light" | "dark";
type Selected = { brand: Brand; scheme: Scheme };

const read = (globals: Record<string, unknown> | undefined): Selected => ({
  brand: globals?.brand === "acme" ? "acme" : "jit",
  scheme: globals?.colorScheme === "dark" ? "dark" : "light",
});

type PreviewWindow = Window & {
  __STORYBOOK_PREVIEW__?: {
    storyStoreValue?: { userGlobals?: { get?: () => Record<string, unknown> } };
  };
};

export function useSelected(): Selected {
  const [selected, setSelected] = React.useState<Selected>(() =>
    read((window as PreviewWindow).__STORYBOOK_PREVIEW__?.storyStoreValue?.userGlobals?.get?.()),
  );
  React.useEffect(() => {
    const channel = addons.getChannel();
    const onUpdate = ({ userGlobals }: { userGlobals?: Record<string, unknown> }) =>
      setSelected(read(userGlobals));
    channel.on(GLOBALS_UPDATED, onUpdate);
    return () => channel.off(GLOBALS_UPDATED, onUpdate);
  }, []);
  return selected;
}

// Applies the selected brand and scheme to <html>, the same way the preview decorator does.
// Pages with no story on them (MDX) never run the decorator, and component (layer 3) tokens are
// resolved at :root, so a nested wrapper could not re-theme them.
function useApplyTheme({ brand, scheme }: Selected) {
  React.useLayoutEffect(() => {
    const el = document.documentElement;
    if (brand !== "jit") el.dataset.theme = brand;
    else delete el.dataset.theme;
    if (scheme === "dark") el.dataset.scheme = "dark";
    else delete el.dataset.scheme;
  }, [brand, scheme]);
}

const swatchBorder = "1px solid color-mix(in srgb, currentColor 25%, transparent)";

export function ResolvedTokens({
  tokens,
  columns = 1,
}: {
  tokens: readonly (string | readonly [string, string])[];
  columns?: number;
}) {
  const selected = useSelected();
  const { brand, scheme } = selected;
  useApplyTheme(selected);
  const [values, setValues] = React.useState<Record<string, string>>({});

  React.useLayoutEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const token of tokens) {
      const name = typeof token === "string" ? token : token[0];
      next[name] = style.getPropertyValue(name).trim();
    }
    setValues(next);
  }, [tokens, brand, scheme]);

  return (
    <>
      <ul style={{ columns, paddingLeft: 0, listStyle: "none", fontSize: 12 }}>
        {tokens.map((token) => {
          const [name, label] = typeof token === "string" ? [token, token] : token;
          const value = values[name] ?? "";
          const isColor = value !== "" && CSS.supports("color", value);
          return (
            <li
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                breakInside: "avoid",
                padding: "2px 0",
              }}
            >
              {isColor ? (
                <span
                  aria-hidden
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    border: swatchBorder,
                    background: value,
                  }}
                />
              ) : (
                <span aria-hidden style={{ width: 14 }} />
              )}
              <code>{label}</code>
              <span style={{ opacity: 0.7 }}>{value || "—"}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// The one-line description of the selected brand, from manifests/foundations.json.
export function BrandSummary() {
  const { brand, scheme } = useSelected();
  return (
    <p>
      <strong>
        <code>data-theme=&quot;{brand}&quot;</code>, {scheme}
      </strong>
      <br />
      {/* the manifest line points at a scales table that the docs no longer show */}
      {foundations.brands.values[brand].replace(" (see scales.spacing)", "")}
    </p>
  );
}

// Values that differ per brand: shape, density, type and the main brand color.
export const BRAND_SCALE_TOKENS = [
  ["--ds-color-primary", "primary color"],
  ["--ds-radius-md", "radius md"],
  ["--ds-radius-lg", "radius lg"],
  ["--ds-spacing-component-md", "component spacing md"],
  ["--ds-spacing-component-height-md", "component height md"],
  ["--ds-spacing-layout-md", "layout spacing md"],
  ["--ds-typography-headinglg-fontfamily", "heading font"],
  ["--ds-typography-bodymd-fontfamily", "body font"],
  ["--ds-typography-bodymd-fontsize", "body size"],
] as const;
