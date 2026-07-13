import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { RadioButton, RadioButtonGroup } from "./radio-button";

type StoryProps = React.ComponentProps<typeof RadioButtonGroup> & {
  hasTooltip?: boolean;
  tooltipText?: string;
};

const meta = {
  title: "Components/RadioButton",
  component: RadioButtonGroup,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "A labeled radio control; when the radio needs an inline label/description.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    direction: { control: "inline-radio", options: ["horizontal", "vertical"] },
    label: { control: "text" },
    description: { control: "text", name: "Help text" },
    errorMessage: { control: "text" },
    mandatory: { control: "boolean" },
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
    label: "Delivery speed",
    description: "Choose how fast you need it.",
    size: "lg",
    direction: "horizontal",
    mandatory: false,
    hasTooltip: false,
    tooltipText: "Affects shipping cost.",
  },
  render: ({ hasTooltip, tooltipText, ...args }: StoryProps) => (
    <div className="w-[480px]">
      <RadioButtonGroup
        {...args}
        tooltip={hasTooltip ? tooltipText : undefined}
        defaultValue="standard"
      >
        <RadioButton
          value="standard"
          size={args.size}
          label="Standard"
          secondLineLabel="3–5 days"
        />
        <RadioButton value="express" size={args.size} label="Express" secondLineLabel="1–2 days" />
        <RadioButton
          value="overnight"
          size={args.size}
          label="Overnight"
          secondLineLabel="Next day"
        />
      </RadioButtonGroup>
    </div>
  ),
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Standalone: Story = {
  render: () => (
    <RadioButtonGroup label="Pick one" defaultValue="a">
      <RadioButton variant="standalone" value="a" label="Option A" />
      <RadioButton variant="standalone" value="b" label="Option B" />
    </RadioButtonGroup>
  ),
};

export const ErrorState: Story = {
  args: { errorMessage: "Please choose a delivery speed.", error: true },
};
