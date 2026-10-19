"use client"

import * as React from "react"
import { Toast } from "@base-ui/react/toast"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Mirrors the Figma `sonner` set (1813:16630): a stacked toast notification with
// Variant=success|error|warning|info. Built on Base UI's Toast (no extra dep);
// each type tints the whole surface (badge fill/border tokens; info stays on the
// background with the neutral status border) — no icon, 16px message, as in Figma.
// `toast.*` adds toasts from anywhere; render <Toaster /> once near the app root.
const toastManager = Toast.createToastManager()

const TYPE_META = {
  success: { fill: "var(--ds-badge-green-fill)", border: "var(--ds-badge-green-border)" },
  error: { fill: "var(--ds-badge-red-fill)", border: "var(--ds-badge-red-border)" },
  warning: { fill: "var(--ds-badge-orange-fill)", border: "var(--ds-badge-orange-border)" },
  info: { fill: "var(--ds-color-background)", border: "var(--ds-color-status-neutral-border)" },
} as const

type ToastType = keyof typeof TYPE_META

function ToastList() {
  const { toasts } = Toast.useToastManager()
  return toasts.map((item) => {
    const meta = TYPE_META[(item.type as ToastType) ?? "info"] ?? TYPE_META.info
    return (
      <Toast.Root
        key={item.id}
        toast={item}
        className={cn(
          "flex w-full items-start gap-[var(--ds-spacing-8)] border [padding:var(--ds-alert-padding)]",
          "[border-radius:var(--ds-alert-radius)] [border-color:var(--toast-border)] [background-color:var(--toast-fill)]",
          "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full transition-transform duration-300",
        )}
        style={{ "--toast-fill": meta.fill, "--toast-border": meta.border } as React.CSSProperties}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Toast.Title className="[color:var(--ds-color-content-primary)] [font-family:var(--ds-typography-bodymd-fontfamily)] [font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-labellg-lineheight)]" />
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
