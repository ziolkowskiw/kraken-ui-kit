import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SelectField, SelectGroup, SelectItem, SelectLabel, SelectSeparator } from "./select";

const SIZES = ["sm", "md", "lg"] as const;
const STATES = ["rest", "error", "disabled"] as const;

type SelectFieldStoryProps = React.ComponentProps<typeof SelectField> & {
  state: "rest" | "error" | "disabled";
  hasTooltip?: boolean;
  tooltipText?: string;
};

const sampleItems = (
  <>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry">Cherry</SelectItem>
    <SelectItem value="grape">Grape</SelectItem>
  </>
);

const meta = {
  title: "Components/Select",
  component: SelectField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "displays a list of options to pick from, triggered by a button; single-choice selection in forms",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    state: { control: "select", options: STATES, name: "State" },
    size: { control: "select", options: SIZES, name: "Size" },
    label: { control: "text", name: "Label" },
    description: { control: "text", name: "Description" },
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
    error: { table: { disable: true } },
    disabled: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    state: "rest",
    size: "md",
    label: "Label",
    description: "Help text",
    errorMessage: "Error message",
    placeholder: "Placeholder",
    mandatory: false,
    hasTooltip: true,
    tooltipText: "Extra context for this field.",
    children: sampleItems,
  },
  render: ({ state, errorMessage, hasTooltip, tooltipText, ...args }) => (
    <SelectField
      {...args}
      tooltip={hasTooltip ? tooltipText : undefined}
      error={state === "error"}
      errorMessage={state === "error" ? errorMessage : undefined}
      disabled={state === "disabled"}
      className="w-72"
    />
  ),
} satisfies Meta<SelectFieldStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {};

export const Default: Story = {};

export const Filled: Story = {
  render: ({ state, ...args }) => <SelectField {...args} defaultValue="banana" className="w-72" />,
};

export const WithError: Story = {
  args: { state: "error" },
};

export const Disabled: Story = {
  args: { state: "disabled" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Mandatory: Story = {
  args: { mandatory: true },
};

export const WithGroups: Story = {
  render: (args) => (
    <SelectField {...args} className="w-72">
      <SelectGroup>
        <SelectLabel>Frontend</SelectLabel>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
        <SelectItem value="svelte">Svelte</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Backend</SelectLabel>
        <SelectItem value="express">Express</SelectItem>
        <SelectItem value="fastify">Fastify</SelectItem>
      </SelectGroup>
    </SelectField>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-start w-72">
      {SIZES.map((s) => (
        <SelectField key={s} size={s} label={`Size: ${s}`} placeholder="Pick an option">
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectField>
      ))}
    </div>
  ),
};
