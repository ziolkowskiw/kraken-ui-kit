"use client"

import * as React from "react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { GripVerticalIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Mirrors the Figma `resizable` set (2:2): Orientation=horizontal|vertical. Built
// on react-resizable-panels v4 (Group / Panel / Separator); the handle binds
// `--ds-color-border`.
const ResizableOrientationContext = React.createContext<"horizontal" | "vertical">("horizontal")

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <ResizableOrientationContext.Provider value={orientation}>
      <Group
        data-slot="resizable-panel-group"
        orientation={orientation}
        className={cn("flex h-full w-full", orientation === "vertical" && "flex-col", className)}
        {...props}
      />
    </ResizableOrientationContext.Provider>
  )
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  const orientation = React.useContext(ResizableOrientationContext)
  const isVertical = orientation === "vertical"
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex items-center justify-center [background-color:var(--ds-color-border)] outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1",
        isVertical ? "h-px w-full" : "w-px self-stretch",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border [border-color:var(--ds-color-border)] [background-color:var(--ds-color-background)]">
          <GripVerticalIcon className={cn("size-2.5 [color:var(--ds-color-content-tertiary)]", isVertical && "rotate-90")} />
        </div>
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
