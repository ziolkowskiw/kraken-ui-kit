import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./calendar";

// Figma variants: "only month" | "1 month" | "2 months" | "3 months" | "month and year" | "only year"
// "only month" / "1 month" = single month view (mode="single")
// "2 months" / "3 months"  = numberOfMonths=2/3 (mode="range")
// "month and year" / "only year" = navigation-only display, not directly mapped to react-day-picker props

type StoryProps = {
  mode: "single" | "range";
  numberOfMonths: number;
  showOutsideDays: boolean;
};

function CalendarDemo({ mode, numberOfMonths, showOutsideDays }: StoryProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>();
  const common = {
    numberOfMonths,
    showOutsideDays,
    className: "rounded-lg border [border-color:var(--ds-color-border)]",
  };
  return mode === "range" ? (
    <Calendar mode="range" selected={range} onSelect={setRange} {...common} />
  ) : (
    <Calendar mode="single" selected={date} onSelect={setDate} {...common} />
  );
}

const meta = {
  title: "Components/Calendar",
  // docs-only association; the playground args are story-level props
  component: Calendar as React.ComponentType<StoryProps>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A date field component that allows users to select dates; standalone or inside date-picker. react-day-picker",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "inline-radio", options: ["single", "range"], name: "Mode" },
    numberOfMonths: { control: { type: "range", min: 1, max: 3, step: 1 }, name: "Months" },
    showOutsideDays: { control: "boolean", name: "Outside days" },
  },
  args: { mode: "single", numberOfMonths: 1, showOutsideDays: true },
  // Remount on mode change so single/range selection state stays consistent.
  render: (args) => <CalendarDemo key={args.mode} {...args} />,
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Single: Story = { args: { mode: "single", numberOfMonths: 1 } };

export const Range: Story = { args: { mode: "range", numberOfMonths: 2 } };

// Every day before today is disabled and non-interactive.
export const Disabled: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ before: new Date() }}
        className="rounded-lg border [border-color:var(--ds-color-border)]"
      />
    );
  },
};
