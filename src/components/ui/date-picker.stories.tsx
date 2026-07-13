import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { DatePickerField } from "./date-picker";

type DatePickerStoryProps = React.ComponentProps<typeof DatePickerField> & {
  hasTooltip?: boolean;
  tooltipText?: string;
};

const meta = {
  title: "Components/DatePicker",
  component: DatePickerField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "A date picker component; pick a single date or range in forms. Composes",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "inline-radio", options: ["single", "range"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text", name: "Help text" },
    errorMessage: { control: "text" },
    mandatory: { control: "boolean" },
    disabled: { control: "boolean" },
    hasTooltip: { control: "boolean", name: "Show info tooltip", table: { category: "Tooltip" } },
    tooltipText: {
      control: "text",
      name: "Tooltip content",
      table: { category: "Tooltip" },
      if: { arg: "hasTooltip" },
    },
    tooltip: { table: { disable: true } },
    // Date / function props are set in code, not via the controls panel.
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    format: { table: { disable: true } },
  },
  args: {
    mode: "single",
    label: "Date of birth",
    placeholder: "Pick a date",
    description: "Used to verify your age.",
    size: "md",
    mandatory: false,
    disabled: false,
    hasTooltip: false,
    tooltipText: "We never share your birth date.",
  },
  render: ({ hasTooltip, tooltipText, ...args }: DatePickerStoryProps) => (
    <div className="w-72">
      <DatePickerField {...args} tooltip={hasTooltip ? tooltipText : undefined} />
    </div>
  ),
} satisfies Meta<DatePickerStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Opens with a date already chosen, so the trigger shows the formatted value
 *  (not the placeholder). */
export const WithValue: Story = {
  args: {
    label: "Start date",
    description: undefined,
    defaultValue: new Date(2026, 5, 23),
  },
};

/** Range selection: the trigger shows "from – to" and the popover stays open
 *  until both ends are picked. */
export const RangeSelection: Story = {
  args: {
    mode: "range",
    label: "Stay dates",
    placeholder: "Pick a date range",
    description: "Check-in to check-out.",
    defaultValue: { from: new Date(2026, 5, 23), to: new Date(2026, 5, 27) },
  },
};

export const ErrorState: Story = {
  args: { errorMessage: "Please select a date." },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Date", placeholder: "Pick a date" },
};
