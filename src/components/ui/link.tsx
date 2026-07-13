import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Mirrors two Figma sets on the Link page:
//  • `link` (372:4599): an inline text link. State axis (default/hover/active/
//    visited/focused/disabled) → CSS; `destructive` is a real variant.
//  • `link-button` (492:2073): a text+icon button styled as a link, Size lg/md/sm/xs.
// Colors bind the `--ds-color-content-link*` semantic tokens (blue ramp).
const linkVariants = cva(
  [
    "inline-flex items-center gap-1 underline underline-offset-2 outline-none transition-colors cursor-pointer [border-radius:var(--ds-radius-xs)]",
    "[font-family:var(--ds-typography-bodymd-fontfamily)] [font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-bodymd-lineheight)]",
    "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1",
    "aria-disabled:pointer-events-none aria-disabled:no-underline aria-disabled:[color:var(--ds-color-content-disabled)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "[color:var(--ds-color-content-link)] visited:[color:var(--ds-color-content-link-visited)] hover:[color:var(--ds-color-content-link-hover)] active:[color:var(--ds-color-content-link-active)]",
        destructive:
          "[color:var(--ds-color-destructive)] hover:[color:var(--ds-color-destructive-hover)] active:[color:var(--ds-color-destructive-active)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Link({
  className,
  variant,
  ...props
}: React.ComponentProps<"a"> & VariantProps<typeof linkVariants>) {
  return <a data-slot="link" className={cn(linkVariants({ variant }), className)} {...props} />;
}

const linkButtonVariants = cva(
  [
    "inline-flex w-fit items-center gap-1 outline-none transition-colors cursor-pointer [border-radius:var(--ds-radius-xs)]",
    "[color:var(--ds-color-content-link)] hover:[color:var(--ds-color-content-link-hover)] hover:underline underline-offset-2 active:[color:var(--ds-color-content-link-active)]",
    "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:[color:var(--ds-color-content-disabled)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "[font-size:var(--ds-typography-linkxs-fontsize)] [line-height:var(--ds-typography-linkxs-lineheight)] [font-weight:var(--ds-typography-linkxs-fontweight)] [&_svg]:size-3",
        sm: "[font-size:var(--ds-typography-linksm-fontsize)] [line-height:var(--ds-typography-linksm-lineheight)] [font-weight:var(--ds-typography-linksm-fontweight)] [&_svg]:size-3.5",
        md: "[font-size:var(--ds-typography-linkmd-fontsize)] [line-height:var(--ds-typography-linkmd-lineheight)] [font-weight:var(--ds-typography-linkmd-fontweight)] [&_svg]:size-4",
        lg: "[font-size:var(--ds-typography-linklg-fontsize)] [line-height:var(--ds-typography-linklg-lineheight)] [font-weight:var(--ds-typography-linklg-fontweight)] [&_svg]:size-5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type LinkButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof linkButtonVariants> & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

function LinkButton({
  className,
  size,
  leftIcon,
  rightIcon,
  children,
  type = "button",
  ...props
}: LinkButtonProps) {
  return (
    <button
      type={type}
      data-slot="link-button"
      className={cn(linkButtonVariants({ size }), className)}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

export { Link, LinkButton, linkVariants, linkButtonVariants };
