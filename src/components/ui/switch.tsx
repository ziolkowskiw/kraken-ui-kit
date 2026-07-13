"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TooltipIcon, TooltipProvider } from "./tooltip";

const switchVariants = cva(
  [
    "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none cursor-pointer",
    "data-unchecked:[background-color:var(--ds-input-bordercolor)]",
    "data-checked:[background-color:var(--ds-color-primary)]",
    "data-checked:hover:[background-color:var(--ds-color-primary-hover)]",
    "focus-visible:shadow-[0px_0px_0px_3px_var(--ds-color-border-focus)]",
    "aria-invalid:shadow-[0px_0px_0px_3px_var(--ds-color-status-error-border)]",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      size: {
        default: "h-6 w-[42px]",
        compact: "h-4 w-7",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full [background-color:var(--ds-color-white)] ring-0 transition-transform",
  {
    variants: {
      size: {
        default: "size-5 data-checked:translate-x-[18px] data-unchecked:translate-x-0.5",
        compact: "size-3 data-checked:translate-x-[12px] data-unchecked:translate-x-0.5",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type SwitchProps = SwitchPrimitive.Root.Props &
  VariantProps<typeof switchVariants> & {
    leftLabel?: string;
    rightLabel?: string;
    error?: boolean;
    /** When provided, shows the ⓘ info tooltip-icon trigger after the label row. */
    tooltip?: React.ReactNode;
  };

function Switch({ className, size, leftLabel, rightLabel, error, tooltip, ...props }: SwitchProps) {
  const switchEl = (
    <SwitchPrimitive.Root
      data-slot="switch"
      aria-invalid={error || undefined}
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className={thumbVariants({ size })} />
    </SwitchPrimitive.Root>
  );

  if (!leftLabel && !rightLabel && !tooltip) return switchEl;

  // The <label> wraps the toggle so clicking the text flips it. The info ⓘ is a
  // sibling OUTSIDE the label, so hovering/clicking it never toggles the switch.
  const row = (
    <label className="flex items-center gap-2 text-sm [color:var(--ds-color-content-primary)]">
      {leftLabel && <span>{leftLabel}</span>}
      {switchEl}
      {rightLabel && <span>{rightLabel}</span>}
    </label>
  );

  if (!tooltip) return row;

  return (
    <div className="flex items-center gap-1.5">
      {row}
      <TooltipProvider>
        <TooltipIcon content={tooltip} />
      </TooltipProvider>
    </div>
  );
}

export { Switch, switchVariants };
