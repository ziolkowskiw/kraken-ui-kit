import * as React from "react";

import { cn } from "@/lib/utils";

// Mirrors the Figma `Kbd` component (1719:48975) and its "⌘ + K" example group.
// A compact keycap: muted fill, subtle border, secondary content. `KbdGroup`
// lays out a chord (e.g. ⌘ + K) with a muted separator slot between caps.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 px-1 select-none",
        "border [border-color:var(--ds-color-border)] [border-radius:var(--ds-radius-sm)]",
        "[background-color:var(--ds-color-muted)] [color:var(--ds-color-content-secondary)]",
        "[font-family:var(--ds-typography-bodyxs-fontfamily)] [font-size:var(--ds-typography-bodyxs-fontsize)] [font-weight:var(--ds-typography-bodyxs-fontweight)]",
        "[&_svg]:size-3 [&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kbd-group"
      className={cn(
        "inline-flex items-center gap-1 [color:var(--ds-color-content-tertiary)] [font-size:var(--ds-typography-bodyxs-fontsize)]",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
