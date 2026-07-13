import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { User, CreditCard, Settings, LogOut, Plus, Cloud } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";
import { Button } from "./button";
import { BUTTON_VARIANTS, type ButtonVariant } from "@/lib/story-helpers";

type StoryProps = {
  triggerLabel: string;
  triggerVariant: ButtonVariant;
  showIcons: boolean;
  showShortcuts: boolean;
  showCheckbox: boolean;
  showRadioGroup: boolean;
  showSubmenu: boolean;
  destructiveLast: boolean;
};

const meta = {
  title: "Components/DropdownMenu",
  // docs-only association; the playground args are story-level props
  component: DropdownMenu as React.ComponentType<StoryProps>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays a menu of actions or functions, triggered by a button; action/overflow menus. Full",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // ── Nested: Trigger (a real Button) ──
    triggerLabel: { control: "text", name: "Label", table: { category: "Nested: Trigger" } },
    triggerVariant: {
      control: "select",
      options: BUTTON_VARIANTS,
      name: "Variant",
      table: { category: "Nested: Trigger" },
    },
    // ── Content slots ──
    showIcons: { control: "boolean", name: "Item icons", table: { category: "Content" } },
    showShortcuts: { control: "boolean", name: "Shortcut hints", table: { category: "Content" } },
    showCheckbox: { control: "boolean", name: "Checkbox item", table: { category: "Content" } },
    showRadioGroup: { control: "boolean", name: "Radio group", table: { category: "Content" } },
    showSubmenu: { control: "boolean", name: "Submenu", table: { category: "Content" } },
    destructiveLast: {
      control: "boolean",
      name: "Destructive item",
      table: { category: "Content" },
    },
  },
  args: {
    triggerLabel: "Open menu",
    triggerVariant: "secondary",
    showIcons: true,
    showShortcuts: true,
    showCheckbox: true,
    showRadioGroup: true,
    showSubmenu: true,
    destructiveLast: true,
  },
  render: ({
    triggerLabel,
    triggerVariant,
    showIcons,
    showShortcuts,
    showCheckbox,
    showRadioGroup,
    showSubmenu,
    destructiveLast,
  }) => {
    const [bookmarks, setBookmarks] = React.useState(true);
    const [position, setPosition] = React.useState("top");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant={triggerVariant}>{triggerLabel}</Button>} />
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {showIcons && <User />} Profile
              {showShortcuts && <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>}
            </DropdownMenuItem>
            <DropdownMenuItem>{showIcons && <CreditCard />} Billing</DropdownMenuItem>
            <DropdownMenuItem>{showIcons && <Settings />} Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          {showCheckbox && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
                Show bookmarks
              </DropdownMenuCheckboxItem>
            </>
          )}
          {showRadioGroup && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel inset>Panel position</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </>
          )}
          {showSubmenu && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{showIcons && <Plus />} New</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>{showIcons && <Cloud />} Project</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          )}
          {destructiveLast && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                {showIcons && <LogOut />} Log out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {};

// Minimal action menu — no checkbox/radio/submenu.
export const Simple: Story = {
  args: {
    showCheckbox: false,
    showRadioGroup: false,
    showSubmenu: false,
    destructiveLast: false,
  },
};

// Labels only, no nested icon instances.
export const NoIcons: Story = { args: { showIcons: false } };
