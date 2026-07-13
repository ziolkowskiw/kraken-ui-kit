"use client"

import * as React from "react"
import { Toast } from "@base-ui/react/toast"
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from "lucide-react"

import { cn } from "@/lib/utils"

// Mirrors the Figma `sonner` set (1813:16630): a stacked toast notification with
// Variant=success|error|warning|info. Built on Base UI's Toast (no extra dep);
// each type drives an accent icon + status tokens. `toast.*` adds toasts from
// anywhere; render <Toaster /> once near the app root.
const toastManager = Toast.createToastManager()

const TYPE_META = {
  success: { Icon: CheckCircle2, accent: "var(--ds-color-status-success-icon)", bar: "var(--ds-color-status-success-border)" },
  error: { Icon: CircleAlert, accent: "var(--ds-color-status-error-icon)", bar: "var(--ds-color-status-error-border)" },
  warning: { Icon: TriangleAlert, accent: "var(--ds-color-status-warning-icon)", bar: "var(--ds-color-status-warning-border)" },
  info: { Icon: Info, accent: "var(--ds-color-status-info-icon)", bar: "var(--ds-color-status-info-border)" },
} as const

type ToastType = keyof typeof TYPE_META

function ToastList() {
  const { toasts } = Toast.useToastManager()
  return toasts.map((item) => {
    const meta = TYPE_META[(item.type as ToastType) ?? "info"] ?? TYPE_META.info
    const Icon = meta.Icon
    return (
      <Toast.Root
        key={item.id}
        toast={item}
        className={cn(
          "flex w-full items-start gap-3 border p-4",
          "[border-radius:var(--ds-radius-lg)] [border-color:var(--ds-color-border)] [background-color:var(--ds-color-popover)]",
          "shadow-md ring-1 ring-foreground/5",
          "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full transition-transform duration-300",
        )}
        style={{ "--accent": meta.accent } as React.CSSProperties}
      >
        <Icon className="mt-0.5 size-5 shrink-0 [color:var(--accent)]" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Toast.Title className="[color:var(--ds-color-content-primary)] [font-family:var(--ds-typography-labelmd-fontfamily)] [font-size:var(--ds-typography-labelmd-fontsize)] [font-weight:var(--ds-typography-labelmd-fontweight)] [line-height:var(--ds-typography-labelmd-lineheight)]" />
          <Toast.Description className="[color:var(--ds-color-content-secondary)] [font-family:var(--ds-typography-bodysm-fontfamily)] [font-size:var(--ds-typography-bodysm-fontsize)] [line-height:var(--ds-typography-bodysm-lineheight)]" />
        </div>
        <Toast.Close
          aria-label="Close"
          className="shrink-0 [color:var(--ds-color-content-tertiary)] hover:[color:var(--ds-color-content-primary)] outline-none"
        >
          <X className="size-4" />
        </Toast.Close>
      </Toast.Root>
    )
  })
}

function Toaster({
  toastManager: managerProp = toastManager,
  ...props
}: React.ComponentProps<typeof Toast.Provider>) {
  return (
    <Toast.Provider toastManager={managerProp} {...props}>
      <Toast.Portal>
        <Toast.Viewport className="fixed right-4 bottom-4 z-[100] flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}

type ToastOptions = { description?: React.ReactNode; timeout?: number }

function make(type: ToastType) {
  return (title: React.ReactNode, opts?: ToastOptions) =>
    toastManager.add({ title, type, ...opts })
}

const toast = {
  success: make("success"),
  error: make("error"),
  warning: make("warning"),
  info: make("info"),
}

export { Toaster, toast, toastManager }
