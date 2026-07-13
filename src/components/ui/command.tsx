"use client";

import * as React from "react";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { menuItemClasses } from "./dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

// Mirrors the Figma `command` set (1134:17063): Variant=collapsed|expanded — a
// search box over a filtered list. Built on Base UI's Autocomplete (mode="list")
// rendered inline as a bordered command panel on the `--ds-color-popover` surface.
function Command({
  className,
  children,
  ...props
}: AutocompletePrimitive.Root.Props<unknown> & { className?: string; children?: React.ReactNode }) {
  return (
    <AutocompletePrimitive.Root {...props}>
      <div
        data-slot="command"
        className={cn(
          "flex w-full flex-col overflow-hidden [border-radius:var(--ds-radius-lg)] border [border-color:var(--ds-color-border)] [background-color:var(--ds-color-popover)] [color:var(--ds-color-popover-foreground)]",
          className,
        )}
      >
        {children}
      </div>
    </AutocompletePrimitive.Root>
  );
}

function CommandInput({ className, ...props }: AutocompletePrimitive.Input.Props) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center gap-2 border-b [border-color:var(--ds-color-border)] px-3"
    >
      <SearchIcon className="size-4 shrink-0 [color:var(--ds-color-icon-muted)]" />
      <AutocompletePrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-11 w-full bg-transparent text-sm outline-none [color:var(--ds-input-value)] placeholder:[color:var(--ds-input-placeholder)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
        aria-label={
          (props as { "aria-label"?: string })["aria-label"] ?? props.placeholder ?? "Search"
        }
      />
    </div>
  );
}

function CommandList({ className, ...props }: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="command-list"
      aria-label="Commands"
      tabIndex={0}
      className={cn("max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto p-1", className)}
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm [color:var(--ds-color-content-tertiary)]", className)}
      {...props}
    />
  );
}

function CommandGroup({ className, ...props }: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="command-group"
      className={cn("p-1", className)}
      {...props}
    />
  );
}

function CommandGroupLabel({ className, ...props }: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="command-group-label"
      className={cn(
        "px-2 py-1.5 [color:var(--ds-color-muted-foreground)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium",
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({ className, ...props }: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="command-item"
      className={cn(menuItemClasses, className)}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px [background-color:var(--ds-color-border)]", className)}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest [color:var(--ds-color-content-tertiary)]",
        className,
      )}
      {...props}
    />
  );
}

// The ⌘K pattern: a Command palette inside a Dialog. Title/description are
// visually hidden but keep the dialog labelled for screen readers.
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run…",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn("top-1/3 translate-y-0 overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
