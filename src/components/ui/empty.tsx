import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Mirrors the Figma `Empty state` component (1686:7468): a centered empty/zero
// state — optional media (icon), title, body, and an action slot that composes
// real <Button>s (primary / secondary / ghost). Built as compound parts so the
// action row is the single source of truth (the actual Button component).
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-6 text-center [padding-block:var(--ds-spacing-component-2xl)] [padding-inline:var(--ds-spacing-component-xl)]",
        className,
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-md flex-col items-center gap-2", className)}
      {...props}
    />
  );
}

const emptyMediaVariants = cva("flex shrink-0 items-center justify-center", {
  variants: {
    variant: {
      icon: "size-12 [border-radius:var(--ds-radius-lg)] [background-color:var(--ds-color-muted)] [color:var(--ds-color-icon-default)] [&_svg]:size-6",
      default: "[color:var(--ds-color-icon-muted)] [&_svg]:size-8",
    },
  },
  defaultVariants: { variant: "icon" },
});

function EmptyMedia({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-media"
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "[color:var(--ds-color-content-primary)] [font-family:var(--ds-typography-headingmd-fontfamily)] [font-size:var(--ds-typography-headingmd-fontsize)] [font-weight:var(--ds-typography-headingmd-fontweight)] [line-height:var(--ds-typography-headingmd-lineheight)]",
        className,
      )}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "[color:var(--ds-color-content-secondary)] [font-family:var(--ds-typography-bodymd-fontfamily)] [font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-bodymd-lineheight)]",
        className,
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex flex-wrap items-center justify-center gap-3", className)}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  emptyMediaVariants,
};
