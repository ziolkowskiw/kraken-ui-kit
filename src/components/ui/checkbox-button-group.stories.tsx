import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckboxButton, CheckboxButtonGroup } from "./checkbox-button";

const SIZES = ["sm", "md", "lg"] as const;
const DIRECTIONS = ["horizontal", "vertical"] as const;
const STATES = ["default", "error"] as const;
const CB_VARIANTS = ["button", "standalone"] as const;

const MAX_OPTIONS = 6;

type GroupStoryProps = React.ComponentProps<typeof CheckboxButtonGroup> & {
  state: "default" | "error";
  cbVariant: "button" | "standalone";
  hasSecondLine: boolean;
  secondLineLabel: string;
  hasTooltip: boolean;
  tooltipText: string;
  optionCount: number;
  option1Label: string;
  option2Label: string;
  option3Label: string;
  option4Label: string;
  option5Label: string;
  option6Label: string;
};

const meta: Meta<GroupStoryProps> = {
  title: "Components/CheckboxButtonGroup",
  component: CheckboxButtonGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    state: { control: "select", options: STATES, name: "State" },
    direction: { control: "select", options: DIRECTIONS, name: "Direction" },
    size: { control: "select", options: SIZES, name: "Size" },
    label: { control: "text", name: "Label" },
    description: { control: "text", name: "Help text" },
    errorMessage: { control: "text", name: "Error message" },
    mandatory: { control: "boolean", name: "Mandatory field" },
    hasTooltip: { control: "boolean", name: "hasTooltip", table: { category: "Nested: Tooltip" } },
    tooltipText: {
      control: "text",
      name: "Tooltip content",
      table: { category: "Nested: Tooltip" },
      if: { arg: "hasTooltip" },
    },
    cbVariant: { control: "select", options: CB_VARIANTS, name: "checkbox-button / Variant" },
    hasSecondLine: { control: "boolean", name: "checkbox-button / hasSecondLine" },
    secondLineLabel: {
      control: "text",
      name: "checkbox-button / secondLineLabel",
      if: { arg: "hasSecondLine" },
    },
    optionCount: {
      control: { type: "range", min: 1, max: MAX_OPTIONS, step: 1 },
      name: "Number of options",
      table: { category: "Options" },
    },
    option1Label: { control: "text", name: "Option 1", table: { category: "Options" } },
    option2Label: { control: "text", name: "Option 2", table: { category: "Options" } },
    option3Label: { control: "text", name: "Option 3", table: { category: "Options" } },
    option4Label: { control: "text", name: "Option 4", table: { category: "Options" } },
    option5Label: { control: "text", name: "Option 5", table: { category: "Options" } },
    option6Label: { control: "text", name: "Option 6", table: { category: "Options" } },
    error: { table: { disable: true } },
    children: { table: { disable: true } },
    tooltip: { table: { disable: true } },
  },
  args: {
    state: "default",
    direction: "horizontal",
    size: "lg",
    label: "Label",
    description: "Help text",
    errorMessage: "Error message",
    mandatory: false,
    hasTooltip: true,
    tooltipText: "Pick the options that apply to you.",
    cbVariant: "button",
    hasSecondLine: false,
    secondLineLabel: "Second line label",
    optionCount: 3,
    option1Label: "Option A",
    option2Label: "Option B",
    option3Label: "Option C",
    option4Label: "Option D",
    option5Label: "Option E",
    option6Label: "Option F",
  },
  render: ({
    state,
    errorMessage,
    size,
    cbVariant,
    hasSecondLine,
    secondLineLabel,
    hasTooltip,
    tooltipText,
    optionCount,
    option1Label,
    option2Label,
    option3Label,
    option4Label,
    option5Label,
    option6Label,
    ...args
  }) => {
    const isError = state === "error";
    const allLabels = [
      option1Label,
      option2Label,
      option3Label,
      option4Label,
      option5Label,
      option6Label,
    ];
    const labels = allLabels.slice(0, optionCount);
    return (
      <CheckboxButtonGroup
        {...args}
        size={size}
        error={isError}
        errorMessage={isError ? errorMessage : undefined}
        tooltip={hasTooltip ? tooltipText : undefined}
        className="w-96"
      >
        {labels.map((label, i) => (
          <CheckboxButton
            key={i}
            size={size}
            variant={cbVariant}
            label={label}
            secondLineLabel={hasSecondLine ? secondLineLabel : undefined}
            error={isError}
          />
        ))}
      </CheckboxButtonGroup>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {};

export const Default: Story = {};

export const Vertical: Story = {
  args: { direction: "vertical" },
};

export const WithError: Story = {
  args: { state: "error" },
};

export const Mandatory: Story = {
  args: { mandatory: true },
};

export const SmallSize: Story = {
  args: { size: "sm" },
};

export const StandaloneVariant: Story = {
  args: { cbVariant: "standalone" },
};

export const VerticalStandaloneSmall: Story = {
  args: { cbVariant: "standalone", direction: "vertical", size: "sm", optionCount: 5 },
};

export const WithSecondLine: Story = {
  args: { hasSecondLine: true },
};

export const AllDirections: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      {DIRECTIONS.map((dir) => (
        <CheckboxButtonGroup
          key={dir}
          label={`Direction: ${dir}`}
          description="Help text"
          direction={dir}
        >
          <CheckboxButton label="Option A" />
          <CheckboxButton label="Option B" />
          <CheckboxButton label="Option C" />
        </CheckboxButtonGroup>
      ))}
    </div>
  ),
};
