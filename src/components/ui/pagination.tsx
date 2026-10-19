import * as React from "react"
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

// Mirrors the Figma `pagination` set (1760:679). Page controls reuse the real
// button styling (`buttonVariants`) so they stay in lockstep with <Button>: every
// control is a `ghost` xs button; the active page carries the ghost fillActive
// fill. First/previous/next/last are icon-only (chevron-first/left/right/last).
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"a">

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: "ghost", size: "xs" }),
        "cursor-pointer [min-width:var(--ds-button-size-xs-height)]",
        "data-[active=true]:[background-color:var(--ds-button-ghost-fillactive)]",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      aria-label="Go to previous page"
      data-slot="pagination-previous"
      className={cn(
        buttonVariants({ variant: "ghost", size: "xs", iconOnly: true }),
        "cursor-pointer",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon />
    </a>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      aria-label="Go to next page"
      data-slot="pagination-next"
      className={cn(
        buttonVariants({ variant: "ghost", size: "xs", iconOnly: true }),
        "cursor-pointer",
        className
      )}
      {...props}
    >
      <ChevronRightIcon />
    </a>
  )
}

function PaginationFirst({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      aria-label="Go to first page"
      data-slot="pagination-first"
      className={cn(buttonVariants({ variant: "ghost", size: "xs", iconOnly: true }), "cursor-pointer", className)}
      {...props}
    >
      <ChevronFirstIcon />
    </a>
  )
}

function PaginationLast({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      aria-label="Go to last page"
      data-slot="pagination-last"
      className={cn(buttonVariants({ variant: "ghost", size: "xs", iconOnly: true }), "cursor-pointer", className)}
      {...props}
    >
      <ChevronLastIcon />
    </a>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex [height:var(--ds-button-size-xs-height)] [min-width:var(--ds-button-size-xs-height)] items-center justify-center [color:var(--ds-button-ghost-content)]", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
}
