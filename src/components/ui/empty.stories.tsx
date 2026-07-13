import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { icons, Inbox } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "./empty";
import { Button } from "./button";

type IconName = keyof typeof icons;
const ICON_OPTIONS: IconName[] = Object.keys(icons) as IconName[];
const renderIcon = (name: IconName): React.ReactNode => {
  const Icon = icons[name];
  return Icon ? <Icon /> : null;
};

type StoryProps = {
  iconName: IconName;
  showIcon: boolean;
  showTitle: boolean;
  title: string;
  showBody: boolean;
  description: string;
  showPrimary: boolean;
  showSecondary: boolean;
  showGhost: boolean;
};

const meta = {
  title: "Components/Empty",
  component: Empty,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A centred empty/zero-state — optional media, title, body, and action slot. Compound (shadcn-faithful):",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    // ── Slot: Media ── (the Icon picker only applies when the media slot is shown)
    showIcon: { control: "boolean", name: "Show icon", table: { category: "Slot: Media" } },
    iconName: {
      control: "select",
      options: ICON_OPTIONS,
      name: "Icon",
      table: { category: "Slot: Media" },
      if: { arg: "showIcon" },
    },
    // ── Slot: Title / Body ── (text controls gate on their Show toggle)
    showTitle: { control: "boolean", name: "Show title", table: { category: "Slot: Title" } },
    title: {
      control: "text",
      name: "Title",
      table: { category: "Slot: Title" },
      if: { arg: "showTitle" },
    },
    showBody: { control: "boolean", name: "Show body", table: { category: "Slot: Body" } },
    description: {
      control: "text",
      name: "Body",
      table: { category: "Slot: Body" },
      if: { arg: "showBody" },
    },
    // ── Slot: Actions ── (EmptyContent composes real Buttons)
    showPrimary: {
      control: "boolean",
      name: "Primary button",
      table: { category: "Slot: Actions" },
    },
    showSecondary: {
      control: "boolean",
      name: "Secondary button",
      table: { category: "Slot: Actions" },
    },
    showGhost: { control: "boolean", name: "Ghost button", table: { category: "Slot: Actions" } },
  },
  args: {
    iconName: "Inbox",
    showIcon: true,
    showTitle: true,
    title: "No messages yet",
    showBody: true,
    description: "When you receive messages they will show up here.",
    showPrimary: true,
    showSecondary: true,
    showGhost: false,
  },
  render: (args: StoryProps) => (
    <div className="mx-auto max-w-md rounded-lg border [border-color:var(--ds-color-border)]">
      <Empty>
        <EmptyHeader>
          {args.showIcon && <EmptyMedia>{renderIcon(args.iconName)}</EmptyMedia>}
          {args.showTitle && <EmptyTitle>{args.title}</EmptyTitle>}
          {args.showBody && <EmptyDescription>{args.description}</EmptyDescription>}
        </EmptyHeader>
        <EmptyContent>
          {args.showPrimary && <Button variant="primary">Get started</Button>}
          {args.showSecondary && <Button variant="secondary">Import</Button>}
          {args.showGhost && <Button variant="ghost">Learn more</Button>}
        </EmptyContent>
      </Empty>
    </div>
  ),
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Minimal: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>Nothing here</EmptyTitle>
        <EmptyDescription>Your inbox is empty.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
