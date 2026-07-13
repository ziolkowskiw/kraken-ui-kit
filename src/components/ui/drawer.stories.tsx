import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer";
import { Button } from "./button";
import { InputField } from "./input";
import { BUTTON_VARIANTS, type ButtonVariant } from "@/lib/story-helpers";

type StoryProps = {
  side: "top" | "right" | "bottom" | "left";
  title: string;
  description: string;
  triggerLabel: string;
  triggerVariant: ButtonVariant;
  cancelLabel: string;
  confirmLabel: string;
  confirmVariant: ButtonVariant;
};

const meta = {
  title: "Components/Drawer",
  // docs-only association; the playground args are story-level props
  component: Drawer as React.ComponentType<StoryProps>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A panel that slides in from an edge of the screen; mobile sheets, filters, side forms.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      name: "Side",
      table: { category: "Layout" },
    },
    title: { control: "text", name: "Title", table: { category: "Content" } },
    description: { control: "text", name: "Description", table: { category: "Content" } },
    triggerLabel: { control: "text", name: "Label", table: { category: "Nested: Trigger" } },
    triggerVariant: {
      control: "select",
      options: BUTTON_VARIANTS,
      name: "Variant",
      table: { category: "Nested: Trigger" },
    },
    cancelLabel: { control: "text", name: "Cancel label", table: { category: "Nested: Footer" } },
    confirmLabel: { control: "text", name: "Confirm label", table: { category: "Nested: Footer" } },
    confirmVariant: {
      control: "select",
      options: BUTTON_VARIANTS,
      name: "Confirm variant",
      table: { category: "Nested: Footer" },
    },
  },
  args: {
    side: "right",
    title: "Edit profile",
    description: "Make changes to your profile here. Click save when you're done.",
    triggerLabel: "Open drawer",
    triggerVariant: "secondary",
    cancelLabel: "Cancel",
    confirmLabel: "Save changes",
    confirmVariant: "primary",
  },
  render: ({
    side,
    title,
    description,
    triggerLabel,
    triggerVariant,
    cancelLabel,
    confirmLabel,
    confirmVariant,
  }) => (
    <Drawer>
      <DrawerTrigger render={<Button variant={triggerVariant}>{triggerLabel}</Button>} />
      <DrawerContent side={side}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 py-4">
          <InputField label="Name" defaultValue="Kraken" />
          <InputField label="Username" defaultValue="@kraken" />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost">{cancelLabel}</Button>} />
          <DrawerClose render={<Button variant={confirmVariant}>{confirmLabel}</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Bottom: Story = { args: { side: "bottom" } };
export const Left: Story = { args: { side: "left" } };
