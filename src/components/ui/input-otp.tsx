"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma `input-otp-elements` set (84 variants): Size xs|sm|md|lg ×
// Position left|middle|right × State (empty/placeholder/value/focus/error/disabled).
// Position is handled by the group's shared-seam geometry. Built on the `input-otp`
// library; slots bind the `--ds-input-*` field tokens.
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center [&>[data-slot=input-otp-slot]:not(:first-child)]:-ml-px [&>[data-slot=input-otp-slot]:first-child]:rounded-l-md [&>[data-slot=input-otp-slot]:last-child]:rounded-r-md",
        className
      )}
      {...props}
    />
  )
}

const otpSlotVariants = cva(
  [
    "relative flex items-center justify-center border-y border-r transition-all outline-none first:border-l",
    "[border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)] [color:var(--ds-input-value)]",
    "data-[active=true]:z-10 data-[active=true]:[border-color:var(--ds-input-borderfocus)] data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-8 text-sm",
        sm: "size-9 text-sm",
        md: "size-10 text-base",
        lg: "size-12 text-lg",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function InputOTPSlot({
  index,
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof otpSlotVariants> & { index: number }) {
  const context = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = context?.slots?.[index] ?? {}
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(otpSlotVariants({ size }), className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink [background-color:var(--ds-input-value)] duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon className="size-4 [color:var(--ds-color-content-tertiary)]" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, otpSlotVariants }
