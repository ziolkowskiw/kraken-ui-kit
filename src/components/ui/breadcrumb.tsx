import * as React from "react"
import { ChevronRight, Ellipsis } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="breadcrumb"
      aria-label="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="breadcrumb-link"
      className={cn(
        [
          "inline-flex items-center justify-center overflow-clip",
          "[height:var(--ds-button-size-xs-height)]",
          "[padding-inline:var(--ds-button-ghost-size-xs-paddingx)]",
          "[padding-block:var(--ds-button-size-xs-paddingy)]",
          "[border-radius:var(--ds-button-size-xs-radius)]",
          "[font-size:var(--ds-typography-labelsm-fontsize)]",
          "[font-weight:var(--ds-typography-labelsm-fontweight)]",
          "[line-height:var(--ds-typography-labelsm-lineheight)]",
          "[color:var(--ds-color-content-tertiary)]",
          "hover:[background-color:var(--ds-button-ghost-fillhover)]",
          "transition-colors",
        ].join(" "),
        className
      )}
      {...props}
    >
      <span
        className="inline-flex items-center justify-center [padding-inline:var(--ds-button-size-xs-labelwrapperpaddingx)]"
      >
        {props.children}
      </span>
    </a>
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        [
          "inline-flex items-center justify-center overflow-clip",
          "[height:var(--ds-button-size-xs-height)]",
          "[padding-inline:var(--ds-button-ghost-size-xs-paddingx)]",
          "[padding-block:var(--ds-button-size-xs-paddingy)]",
          "[border-radius:var(--ds-button-size-xs-radius)]",
          "[font-size:var(--ds-typography-overline-fontsize)]",
          "[font-weight:var(--ds-typography-overline-fontweight)]",
          "[line-height:var(--ds-typography-overline-lineheight)]",
          "[color:var(--ds-color-content-primary)]",
        ].join(" "),
        className
      )}
      {...props}
    >
      <span
        className="inline-flex items-center justify-center [padding-inline:var(--ds-button-size-xs-labelwrapperpaddingx)]"
      >
        {props.children}
      </span>
    </span>
  )
}

function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("inline-flex items-center [color:var(--ds-color-content-tertiary)]", className)}
      {...props}
    >
      {props.children ?? <ChevronRight className="size-4" />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="breadcrumb-ellipsis"
      type="button"
      aria-label="Toggle collapsed breadcrumbs"
      className={cn(
        [
          "inline-flex items-center justify-center",
          "[width:var(--ds-button-size-xs-height)] [height:var(--ds-button-size-xs-height)]",
          "[padding:var(--ds-button-size-xs-icononlypadding)]",
          "[border-radius:var(--ds-button-size-xs-radius)]",
          "[color:var(--ds-color-content-tertiary)]",
          "hover:[background-color:var(--ds-button-ghost-fillhover)]",
          "transition-colors",
        ].join(" "),
        className
      )}
      {...props}
    >
      <Ellipsis className="size-4" />
      <span className="sr-only">More</span>
    </button>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
