import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextareaField } from "./textarea";

const STATES = ["rest", "error", "disabled"] as const;

type TextareaFieldStoryProps = React.ComponentProps<typeof TextareaField> & {
  state: "rest" | "error" | "disabled";
  hasTooltip?: boolean;
  tooltipText?: string;
};

const meta = {
  title: "Components/Textarea",
  component: TextareaField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "displays a form textarea; multi-line text entry (comments, notes)",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    state: { control: "select", options: STATES, name: "State" },
    label: { control: "text", name: "Label" },
    description: { control: "text", name: "Help text" },
    errorMessage: { control: "text", name: "Error message" },
    placeholder: { control: "text", name: "Placeholder" },
    mandatory: { control: "boolean", name: "Mandatory field" },
    hasTooltip: { control: "boolean", name: "hasTooltip", table: { category: "Nested: Tooltip" } },
    tooltipText: {
      control: "text",
      name: "Tooltip content",
      table: { category: "Nested: Tooltip" },
      if: { arg: "hasTooltip" },
    },
    tooltip: { table: { disable: true } },
    showCounter: { control: "boolean", name: "Show counter" },
    maxLength: { control: "number", name: "Max length", if: { arg: "showCounter" } },
    error: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  args: {
    state: "rest",
    label: "Label",
    description: "Help text",
    errorMessage: "Error message",
    placeholder: "Placeholder",
    mandatory: false,
    hasTooltip: true,
    tooltipText: "Extra context for this field.",
    showCounter: true,
    maxLength: 200,
  },
  render: ({ state, errorMessage, hasTooltip, tooltipText, ...args }: TextareaFieldStoryProps) => (
    <TextareaField
      {...args}
      tooltip={hasTooltip ? tooltipText : undefined}
      error={state === "error"}
      errorMessage={state === "error" ? errorMessage : undefined}
      disabled={state === "disabled"}
      className="w-72"
    />
  ),
} satisfies Meta<TextareaFieldStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {};

export const Default: Story = {};

export const WithError: Story = {
  args: { state: "error" },
};

export const Disabled: Story = {
  args: { state: "disabled" },
};

export const Mandatory: Story = {
  args: { mandatory: true },
};

export const WithCounter: Story = {
  args: { showCounter: true, maxLength: 100 },
};

export const NoLabel: Story = {
  args: { label: undefined },
};
