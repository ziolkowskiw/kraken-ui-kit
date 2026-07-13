import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const alertVariants = cva(
  [
    "group/alert relative flex w-full items-center border",
    "[border-width:var(--ds-alert-borderwidth)] [border-radius:var(--ds-alert-radius)] [padding:var(--ds-alert-padding)]",
    "gap-[var(--ds-spacing-component-sm)]",
  ].join(" "),
  {
    variants: {
      type: {
        neutral:
          "[background-color:var(--ds-color-status-neutral-bg)] [border-color:var(--ds-color-status-neutral-border)]",
        error:
          "[background-color:var(--ds-color-status-error-bg)] [border-color:var(--ds-color-status-error-border)]",
        success:
          "[background-color:var(--ds-color-status-success-bg)] [border-color:var(--ds-color-status-success-border)]",
        informational:
          "[background-color:var(--ds-color-status-info-bg)] [border-color:var(--ds-color-status-info-border)]",
        warning:
          "[background-color:var(--ds-color-status-warning-bg)] [border-color:var(--ds-color-status-warning-border)]",
      },
    },
    defaultVariants: { type: "neutral" },
  },
);

const alertTitleColorMap = {
  neutral: "[color:var(--ds-color-status-neutral-foreground)]",
  error: "[color:var(--ds-color-status-error-foreground)]",
  success: "[color:var(--ds-color-status-success-foreground)]",
  informational: "[color:var(--ds-color-status-info-foreground)]",
  warning: "[color:var(--ds-color-status-warning-foreground)]",
} as const;

const alertIconColorMap = {
  neutral: "[color:var(--ds-color-status-neutral-icon)]",
  error: "[color:var(--ds-color-status-error-icon)]",
  success: "[color:var(--ds-color-status-success-icon)]",
  informational: "[color:var(--ds-color-status-info-icon)]",
  warning: "[color:var(--ds-color-status-warning-icon)]",
} as const;

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    icon?: React.ReactNode;
    closeIcon?: React.ReactNode;
    onClose?: () => void;
    action?: React.ReactNode;
  };

function Alert({
  className,
  type = "neutral",
  icon,
  closeIcon,
  onClose,
  action,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ type }), className)}
      {...props}
    >
      <div className="flex flex-1 items-start gap-[var(--ds-spacing-component-md)] min-w-0">
        {icon && (
          <div
            className={cn(
              "flex shrink-0 items-center pt-0.5 [&_svg]:size-4",
              alertIconColorMap[type ?? "neutral"],
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-[var(--ds-spacing-component-sm)] items-start min-w-0 pt-0.5">
          {children}
        </div>
      </div>
      {action && (
        <div data-slot="alert-action" className="flex shrink-0 items-center">
          {action}
        </div>
      )}
      {onClose && (
        <Button variant="ghost" size="xs" iconOnly onClick={onClose} aria-label="Dismiss">
          {closeIcon}
        </Button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-title"
      className={cn(
        "[font-size:var(--ds-typography-labellg-fontsize)] [line-height:var(--ds-typography-labellg-lineheight)] [font-weight:var(--ds-typography-labellg-fontweight)]",
        "w-full group-data-[slot=alert]/alert:[color:inherit]",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-description"
      className={cn(
        "[font-size:var(--ds-typography-bodysm-fontsize)] [line-height:var(--ds-typography-bodysm-lineheight)] [color:var(--ds-color-content-primary)] w-full",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
