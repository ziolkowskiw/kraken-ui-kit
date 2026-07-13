import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Search, SearchField } from "./search";

type SearchStoryProps = React.ComponentProps<typeof SearchField> & {
  hasTooltip?: boolean;
  tooltipText?: string;
};

const meta = {
  title: "Components/Search",
  component: SearchField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A search input specialization (an Input with a search affordance); filter lists/tables, global search.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    state: { control: "inline-radio", options: ["default", "error", "warning"] },
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
  },
  args: {
    label: "Search",
    placeholder: "Search products…",
    size: "md",
    state: "default",
    mandatory: false,
    disabled: false,
    hasTooltip: false,
    tooltipText: "Searches by product name and SKU.",
  },
  render: ({ hasTooltip, tooltipText, ...args }: SearchStoryProps) => {
    const [value, setValue] = React.useState("");
    return (
      <div className="w-80">
        <SearchField
          {...args}
          tooltip={hasTooltip ? tooltipText : undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue("")}
        />
      </div>
    );
  },
} satisfies Meta<SearchStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Bare: Story = {
  render: () => {
    const [value, setValue] = React.useState("shoes");
    return (
      <div className="w-80">
        <Search
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue("")}
          placeholder="Search…"
        />
      </div>
    );
  },
};

export const Warning: Story = {
  args: { state: "warning", description: "No exact matches — showing similar results." },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Search…" },
};
