import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Switch } from "./switch";

type SwitchStoryProps = React.ComponentProps<typeof Switch> & {
  hasTooltip?: boolean;
  tooltipText?: string;
};

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "a control that toggles between checked and not checked; instant on/off settings (no submit)",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["default", "compact"], name: "Compact" },
    defaultChecked: { control: "boolean", name: "Active" },
    disabled: { control: "boolean" },
    error: { control: "boolean", name: "Error" },
    rightLabel: { control: "text", name: "Right label" },
    leftLabel: { control: "text", name: "Left label" },
    hasTooltip: { control: "boolean", name: "Show info tooltip", table: { category: "Tooltip" } },
    tooltipText: {
      control: "text",
      name: "Tooltip content",
      table: { category: "Tooltip" },
      if: { arg: "hasTooltip" },
    },
    tooltip: { table: { disable: true } },
  },
  args: {
    size: "default",
    defaultChecked: false,
    disabled: false,
    error: false,
    rightLabel: "Label",
    leftLabel: "",
    hasTooltip: false,
    tooltipText: "Turning this on enables email notifications.",
  },
  render: ({ hasTooltip, tooltipText, ...args }: SwitchStoryProps) => (
    <Switch {...args} tooltip={hasTooltip ? tooltipText : undefined} />
  ),
} satisfies Meta<SwitchStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {};

export const Rest: Story = {};

export const Active: Story = {
  args: { defaultChecked: true },
};

export const Compact: Story = {
  args: { size: "compact" },
};

export const CompactActive: Story = {
  args: { size: "compact", defaultChecked: true },
};

export const WithLeftLabel: Story = {
  args: { leftLabel: "Off", rightLabel: "On" },
};

export const WithTooltip: Story = {
  args: { hasTooltip: true, rightLabel: "Email notifications" },
};

export const Error: Story = {
  args: { error: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledActive: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch rightLabel="Default off" />
      <Switch rightLabel="Default on" defaultChecked />
      <Switch rightLabel="Compact off" size="compact" />
      <Switch rightLabel="Compact on" size="compact" defaultChecked />
      <Switch rightLabel="Error" error />
      <Switch rightLabel="Disabled" disabled />
      <Switch rightLabel="Disabled on" disabled defaultChecked />
      <Switch leftLabel="Left" rightLabel="Right" defaultChecked />
    </div>
  ),
};
