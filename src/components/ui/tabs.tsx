"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type TabsVariant = "line" | "default"
type TabsDepth = 1 | 2

// TabsList tells each TabsTrigger which visual variant and depth to render, so
// triggers can style themselves directly (cleaner than deep group-data chains).
const TabsListContext = React.createContext<{ variant: TabsVariant; depth: TabsDepth }>({
  variant: "line",
  depth: 1,
})

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center gap-0 group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        line: [
          "bg-transparent",
          // full-width divider (Figma `card/border`) 2px above the bottom edge, so the 3px active
          // indicator overlaps it; triggers are positioned later, so they paint over it
          "group-data-horizontal/tabs:relative group-data-horizontal/tabs:w-full",
          "group-data-horizontal/tabs:before:absolute group-data-horizontal/tabs:before:inset-x-0 group-data-horizontal/tabs:before:bottom-[var(--ds-spacing-2)] group-data-horizontal/tabs:before:h-px group-data-horizontal/tabs:before:[background-color:var(--ds-card-border)] group-data-horizontal/tabs:before:content-['']",
        ].join(" "),
        // segmented "default" control: bordered white container, active tab is a filled pill
        default:
          "[background-color:var(--ds-color-background)] border [border-color:var(--ds-color-border)] [border-radius:var(--ds-card-radius)] p-[var(--ds-spacing-component-xs)]",
      },
    },
    defaultVariants: { variant: "line" },
  }
)

function TabsList({
  className,
  variant = "line",
  depth = 1,
  ...props
}: TabsPrimitive.List.Props &
  VariantProps<typeof tabsListVariants> & { depth?: TabsDepth }) {
  return (
    <TabsListContext.Provider value={{ variant: variant ?? "line", depth }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        data-depth={depth}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsListContext.Provider>
  )
}

const tabsTriggerVariants = cva(
  [
    "group/tab relative inline-flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer transition-colors outline-none px-3",
    "[color:var(--ds-color-muted-foreground)] hover:[color:var(--ds-color-foreground)] data-active:[color:var(--ds-color-foreground)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-2 focus-visible:outline-[var(--ds-color-primary)] focus-visible:-outline-offset-2",
    "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        line: [
          "px-[var(--ds-spacing-component-sm)] py-1",
          // horizontal: 20px label box + 10px below it (8px clear gap to the bar, which is 2px up + 1px thick /
          // 3px active); top padding depends on depth (compoundVariants), giving a 36px (depth 1) / 34px
          // (depth 2) tab — Figma's 35/29 snapped to the spacing grid (no 5px/3px steps)
          "group-data-horizontal/tabs:pb-[var(--ds-spacing-10)]",
          // underline (1px → 3px active), inset to match the label width (Figma)
          "after:absolute after:inset-x-[var(--ds-spacing-component-sm)] after:bottom-0 after:h-px after:[background-color:var(--ds-color-border)] after:transition-all after:content-['']",
          "data-active:after:h-[3px] data-active:after:[background-color:var(--ds-color-foreground)]",
          // horizontal: the list divider is the baseline, so rest shows no mark, hover draws a 1px mark on
          // the divider row (2px up), and the active indicator sits flush at the bottom, top edge on the divider
          "group-data-horizontal/tabs:after:bottom-[var(--ds-spacing-2)] group-data-horizontal/tabs:after:[background-color:var(--ds-color-foreground)] group-data-horizontal/tabs:after:opacity-0 group-data-horizontal/tabs:hover:after:opacity-100",
          "group-data-horizontal/tabs:data-active:after:bottom-0 group-data-horizontal/tabs:data-active:after:opacity-100",
          // vertical: indicator runs down the right edge instead
          "group-data-vertical/tabs:after:inset-x-auto group-data-vertical/tabs:after:inset-y-1 group-data-vertical/tabs:after:right-0 group-data-vertical/tabs:after:left-auto group-data-vertical/tabs:after:h-auto group-data-vertical/tabs:after:w-px",
          "group-data-vertical/tabs:data-active:after:h-auto group-data-vertical/tabs:data-active:after:w-[3px]",
        ].join(" "),
        default: [
          "h-8 py-2 [border-radius:var(--ds-radius-lg)] border border-transparent",
          "data-active:[background-color:var(--ds-color-status-neutral-bg)] data-active:[border-color:var(--ds-color-status-neutral-border)]",
        ].join(" "),
      },
      depth: {
        1: "[font-size:var(--ds-typography-labellg-fontsize)] [line-height:var(--ds-typography-labellg-lineheight)] [font-weight:var(--ds-typography-labellg-fontweight)]",
        2: "[font-size:var(--ds-typography-labelmd-fontsize)] [line-height:var(--ds-typography-labelmd-lineheight)] [font-weight:var(--ds-typography-labelmd-fontweight)]",
      },
    },
    compoundVariants: [
      { variant: "line", depth: 1, class: "group-data-horizontal/tabs:pt-[var(--ds-spacing-6)]" },
      { variant: "line", depth: 2, class: "group-data-horizontal/tabs:pt-[var(--ds-spacing-4)]" },
    ],
    defaultVariants: { variant: "line", depth: 1 },
  }
)

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const { variant, depth } = React.useContext(TabsListContext)
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, depth }), className)}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants }
