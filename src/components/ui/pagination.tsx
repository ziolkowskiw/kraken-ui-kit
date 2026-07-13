import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

// Mirrors the Figma `pagination` set (1760:679). Page controls reuse the real
// button styling (`buttonVariants`) so they stay in lockstep with <Button>: the
// active page is the bordered `secondary` look, the rest are `ghost`.
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
      className={cn("flex flex-row items-center gap-1", className)}
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
        buttonVariants({
          variant: isActive ? "secondary" : "ghost",
          size: "sm",
          iconOnly: true,
        }),
        "cursor-pointer",
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
        buttonVariants({ variant: "ghost", size: "sm" }),
        "cursor-pointer gap-1 px-2.5",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:inline">Previous</span>
    </a>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      aria-label="Go to next page"
      data-slot="pagination-next"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "cursor-pointer gap-1 px-2.5",
        className
      )}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRightIcon />
    </a>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center [color:var(--ds-color-content-tertiary)]", className)}
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
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
