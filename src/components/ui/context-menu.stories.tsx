import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { ArrowLeft, ArrowRight, RotateCw, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "./context-menu";

type StoryProps = {
  triggerLabel: string;
  showIcons: boolean;
  showShortcuts: boolean;
  showSubmenu: boolean;
  showCheckbox: boolean;
  showRadioGroup: boolean;
  destructiveLast: boolean;
};

const meta = {
  title: "Components/ContextMenu",
  // docs-only association; the playground args are story-level props
  component: ContextMenu as React.ComponentType<StoryProps>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays a menu of actions triggered by a right click; contextual actions on an item/row. Full surface",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    triggerLabel: {
      control: "text",
      name: "Trigger label",
      table: { category: "Nested: Trigger" },
    },
    showIcons: { control: "boolean", name: "Item icons", table: { category: "Content" } },
    showShortcuts: { control: "boolean", name: "Shortcut hints", table: { category: "Content" } },
    showSubmenu: { control: "boolean", name: "Submenu", table: { category: "Content" } },
    showCheckbox: { control: "boolean", name: "Checkbox items", table: { category: "Content" } },
    showRadioGroup: { control: "boolean", name: "Radio group", table: { category: "Content" } },
    destructiveLast: {
      control: "boolean",
      name: "Destructive item",
      table: { category: "Content" },
    },
  },
  args: {
    triggerLabel: "Right-click here",
    showIcons: true,
    showShortcuts: true,
    showSubmenu: true,
    showCheckbox: true,
    showRadioGroup: true,
    destructiveLast: true,
  },
  render: ({
    triggerLabel,
    showIcons,
    showShortcuts,
    showSubmenu,
    showCheckbox,
    showRadioGroup,
    destructiveLast,
  }) => {
    const [showBookmarks, setShowBookmarks] = React.useState(true);
    const [showFullUrls, setShowFullUrls] = React.useState(false);
    const [person, setPerson] = React.useState("pedro");
    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-md border border-dashed [border-color:var(--ds-color-border)] text-sm [color:var(--ds-color-content-secondary)]">
          {triggerLabel}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              {showIcons && <ArrowLeft />} Back
              {showShortcuts && <ContextMenuShortcut>⌘[</ContextMenuShortcut>}
            </ContextMenuItem>
            <ContextMenuItem>
              {showIcons && <ArrowRight />} Forward
              {showShortcuts && <ContextMenuShortcut>⌘]</ContextMenuShortcut>}
            </ContextMenuItem>
            <ContextMenuItem>
              {showIcons && <RotateCw />} Reload
              {showShortcuts && <ContextMenuShortcut>⌘R</ContextMenuShortcut>}
            </ContextMenuItem>
          </ContextMenuGroup>
          {showSubmenu && (
            <>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-44">
                  <ContextMenuItem>Save page…</ContextMenuItem>
                  <ContextMenuItem>Create shortcut…</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>Developer tools</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </>
          )}
          {showCheckbox && (
            <>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
                Show bookmarks
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem checked={showFullUrls} onCheckedChange={setShowFullUrls}>
                Show full URLs
              </ContextMenuCheckboxItem>
            </>
          )}
          {showRadioGroup && (
            <>
              <ContextMenuSeparator />
              <ContextMenuLabel inset>People</ContextMenuLabel>
              <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
                <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
                <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </>
          )}
          {destructiveLast && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">
                {showIcons && <Trash2 />} Delete
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );
  },
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Simple: Story = {
  args: { showSubmenu: false, showCheckbox: false, showRadioGroup: false, destructiveLast: false },
};
