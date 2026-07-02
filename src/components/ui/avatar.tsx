import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-clip",
  {
    variants: {
      size: {
        xs: "[width:var(--ds-avatar-size-xs)] [height:var(--ds-avatar-size-xs)]",
        sm: "[width:var(--ds-avatar-size-sm)] [height:var(--ds-avatar-size-sm)]",
        md: "[width:var(--ds-avatar-size-md)] [height:var(--ds-avatar-size-md)]",
        lg: "[width:var(--ds-avatar-size-lg)] [height:var(--ds-avatar-size-lg)]",
        xl: "[width:var(--ds-avatar-size-xl)] [height:var(--ds-avatar-size-xl)]",
        "2xl":
          "[width:var(--ds-avatar-size-2xl)] [height:var(--ds-avatar-size-2xl)]",
      },
      roundness: {
        round: "[border-radius:var(--ds-radius-full)]",
        square: "",
      },
    },
    defaultVariants: { size: "md", roundness: "round" },
  }
)

const fallbackTypography: Record<string, string> = {
  xs: "[font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] [font-weight:var(--ds-typography-labelsm-fontweight)]",
  sm: "[font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] [font-weight:var(--ds-typography-labelsm-fontweight)]",
  md: "[font-size:var(--ds-typography-labelmd-fontsize)] [line-height:var(--ds-typography-labelmd-lineheight)] [font-weight:var(--ds-typography-labelmd-fontweight)]",
  lg: "[font-size:var(--ds-typography-labellg-fontsize)] [line-height:var(--ds-typography-labellg-lineheight)] [font-weight:var(--ds-typography-labellg-fontweight)]",
  xl: "[font-size:var(--ds-typography-labellg-fontsize)] [line-height:var(--ds-typography-labellg-lineheight)] [font-weight:var(--ds-typography-labellg-fontweight)]",
  "2xl":
    "[font-size:var(--ds-typography-labellg-fontsize)] [line-height:var(--ds-typography-labellg-lineheight)] [font-weight:var(--ds-typography-labellg-fontweight)]",
}

type AvatarProps = React.ComponentProps<"span"> &
  VariantProps<typeof avatarVariants> & {
    src?: string
    alt?: string
    fallback?: string
  }

function Avatar({
  className,
  size = "md",
  roundness = "round",
  src,
  alt = "",
  fallback,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)
  const showImage = src && !imgError

  return (
    <span
      data-slot="avatar"
      className={cn(
        avatarVariants({ size, roundness }),
        showImage
          ? "[background-color:var(--ds-color-background)]"
          : "[background-color:var(--ds-badge-slate-fill)]",
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span
          className={cn(
            "select-none [color:var(--ds-badge-slate-content)]",
            fallbackTypography[size ?? "md"]
          )}
        >
          {fallback}
        </span>
      )}
    </span>
  )
}

type AvatarStackProps = React.ComponentProps<"div"> &
  VariantProps<typeof avatarVariants> & {
    max?: number
  }

function AvatarStack({
  className,
  size = "sm",
  roundness = "round",
  max,
  children,
  ...props
}: AvatarStackProps) {
  const items = React.Children.toArray(children)
  const visible = max && max < items.length ? items.slice(0, max) : items
  const overflow = max && max < items.length ? items.length - max : 0

  return (
    <div
      data-slot="avatar-stack"
      className={cn("flex items-center -space-x-1.5", className)}
      {...props}
    >
      {visible.map((child, i) => (
        <span
          key={i}
          className={cn(
            "relative inline-flex shrink-0 ring-2 ring-background",
            roundness === "round" && "[border-radius:var(--ds-radius-full)]"
          )}
        >
          {React.isValidElement<AvatarProps>(child)
            ? React.cloneElement(child, { size, roundness })
            : child}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            avatarVariants({ size, roundness }),
            "relative ring-2 ring-background [background-color:var(--ds-badge-slate-fill)]"
          )}
        >
          <span
            className={cn(
              "select-none [color:var(--ds-badge-slate-content)]",
              fallbackTypography[size ?? "sm"]
            )}
          >
            +{overflow}
          </span>
        </span>
      )}
    </div>
  )
}

export { Avatar, AvatarStack, avatarVariants }
