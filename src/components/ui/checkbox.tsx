"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CheckboxProps = CheckboxPrimitive.Root.Props & {
  error?: boolean;
  /**
   * Where the box's hover styling comes from:
   * - "self"  (default): the box reacts to its own :hover — used for a bare checkbox.
   * - "group": the box reacts when an ancestor `.group/cb` is hovered — used inside
   *   CheckboxButton so hovering anywhere on the label/button highlights the box.
   * - "none":  no hover styling.
   */
  hoverScope?: "self" | "group" | "none";
};

// Literal class lists (Tailwind must see them statically — no string interpolation).
const hoverSelf = [
  "hover:[background-color:var(--ds-checkbox-fillhover)] hover:[border-color:var(--ds-checkbox-borderhover)]",
  "data-checked:hover:[background-color:var(--ds-checkbox-checkedhover)] data-indeterminate:hover:[background-color:var(--ds-checkbox-checkedhover)]",
  "data-[error]:hover:[border-color:var(--ds-checkbox-bordererrorhover)]",
  "data-[error]:data-checked:hover:[background-color:var(--ds-checkbox-bordererrorhover)] data-[error]:data-indeterminate:hover:[background-color:var(--ds-checkbox-bordererrorhover)]",
];
const hoverGroup = [
  "group-hover/cb:[background-color:var(--ds-checkbox-fillhover)] group-hover/cb:[border-color:var(--ds-checkbox-borderhover)]",
  "data-checked:group-hover/cb:[background-color:var(--ds-checkbox-checkedhover)] data-indeterminate:group-hover/cb:[background-color:var(--ds-checkbox-checkedhover)]",
  "data-[error]:group-hover/cb:[border-color:var(--ds-checkbox-bordererrorhover)]",
  "data-[error]:data-checked:group-hover/cb:[background-color:var(--ds-checkbox-bordererrorhover)] data-[error]:data-indeterminate:group-hover/cb:[background-color:var(--ds-checkbox-bordererrorhover)]",
];

function Checkbox({ className, error, hoverScope = "self", ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-error={error || undefined}
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center transition-colors outline-none",
        "[border-width:var(--ds-checkbox-borderwidth)] [border-radius:var(--ds-checkbox-cornerradius)] border-solid shadow-sm",
        "[background-color:var(--ds-checkbox-fill)] [border-color:var(--ds-checkbox-bordercolor)]",
        "focus-visible:shadow-[0px_0px_0px_3px_var(--ds-color-border-focus)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:[background-color:var(--ds-checkbox-filldisabled)]",
        // checked AND indeterminate share the brand fill/border (matches Figma)
        "data-checked:[background-color:var(--ds-checkbox-checked)] data-checked:[border-color:var(--ds-checkbox-checkedborder)] data-checked:text-[var(--ds-color-primary-foreground)]",
        "data-indeterminate:[background-color:var(--ds-checkbox-checked)] data-indeterminate:[border-color:var(--ds-checkbox-checkedborder)] data-indeterminate:text-[var(--ds-color-primary-foreground)]",
        "data-checked:disabled:[background-color:var(--ds-checkbox-checkeddisabled)] data-indeterminate:disabled:[background-color:var(--ds-checkbox-checkeddisabled)]",
        "data-[error]:[border-color:var(--ds-checkbox-bordererror)]",
        "data-[error]:data-checked:[background-color:var(--ds-checkbox-bordererror)] data-[error]:data-checked:[border-color:var(--ds-checkbox-bordererror)]",
        "data-[error]:data-indeterminate:[background-color:var(--ds-checkbox-bordererror)] data-[error]:data-indeterminate:[border-color:var(--ds-checkbox-bordererror)]",
        "data-[error]:focus-visible:shadow-[0px_0px_0px_3px_var(--ds-color-border-focus)]",
        // hover styling — own :hover, or driven by an ancestor .group/cb
        hoverScope === "self" && hoverSelf,
        hoverScope === "group" && hoverGroup,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current [&>svg]:size-3.5"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>{state.indeterminate ? <MinusIcon /> : <CheckIcon />}</span>
        )}
      />
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
