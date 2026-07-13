import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckboxButton, CheckboxButtonGroup } from "./checkbox-button";

const VARIANTS = ["button", "standalone"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const CHECKED_OPTIONS = ["false", "true", "indeterminate"] as const;

type CBStoryProps = React.ComponentProps<typeof CheckboxButton> & {
  checkedState: "false" | "true" | "indeterminate";
};

const cbMeta = {
  title: "Components/CheckboxButton",
  component: CheckboxButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A labeled checkbox control; when the checkbox needs an inline label/description.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: VARIANTS, name: "Variant" },
    size: { control: "select", options: SIZES, name: "Size" },
    checkedState: { control: "select", options: CHECKED_OPTIONS, name: "checked" },
    error: { control: "boolean", name: "Error" },
    disabled: { control: "boolean" },
    label: { control: "text", name: "Value" },
    secondLineLabel: { control: "text", name: "Second line label" },
    defaultChecked: { table: { disable: true } },
    indeterminate: { table: { disable: true } },
  },
  args: {
    variant: "button",
    size: "lg",
    checkedState: "false",
    error: false,
    disabled: false,
    label: "Checkbox",
    secondLineLabel: "",
  },
  render: ({ checkedState, ...args }) => (
    <CheckboxButton
      {...args}
      defaultChecked={checkedState === "true"}
      indeterminate={checkedState === "indeterminate"}
    />
  ),
} satisfies Meta<CBStoryProps>;

export default cbMeta;
type Story = StoryObj<typeof cbMeta>;

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {};

export const Default: Story = {};

export const Checked: Story = {
  args: { checkedState: "true" },
};

export const Indeterminate: Story = {
  args: { checkedState: "indeterminate" },
};

export const Standalone: Story = {
  args: { variant: "standalone" },
};

export const StandaloneChecked: Story = {
  args: { variant: "standalone", checkedState: "true" },
};

export const WithSecondLine: Story = {
  args: { secondLineLabel: "Second line label" },
};

export const Error: Story = {
  args: { error: true },
};

export const ErrorChecked: Story = {
  args: { error: true, checkedState: "true" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checkedState: "true" },
};

export const SmallSize: Story = {
  args: { size: "sm" },
};

export const MediumSize: Story = {
  args: { size: "md" },
};

export const AllVariantsAndSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((v) => (
        <div key={v} className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground capitalize">variant: {v}</p>
          <div className="flex gap-3">
            {SIZES.map((s) => (
              <CheckboxButton key={s} variant={v} size={s} label={`Size ${s}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
