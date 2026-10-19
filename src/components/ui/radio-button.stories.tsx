import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { RadioGroup } from './radio-group'
import { RadioButton, RadioButtonGroup } from './radio-button'

const VARIANTS = ['button', 'standalone'] as const
const SIZES = ['sm', 'md', 'lg'] as const
const SEMANTICS = ['default', 'error'] as const

type StoryProps = React.ComponentProps<typeof RadioButton> & {
  checked: boolean
  semantic: (typeof SEMANTICS)[number]
  hasSecondLine: boolean
}

// Mirrors the Figma `radio-button` panel (1084:7716): Value, hasSecondLine,
// secondLineLabel, checked, Semantic, Size, Variant. A radio needs a group to
// live in, so each story wraps the item in a bare RadioGroup.
const meta = {
  title: 'Components/RadioButton',
  component: RadioButton,
  parameters: { layout: 'centered', docs: { description: { component: 'A labeled radio control; when the radio needs an inline label/description.' } } },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS, name: 'Variant' },
    size: { control: 'select', options: SIZES, name: 'Size' },
    checked: { control: 'boolean', name: 'checked' },
    semantic: { control: 'select', options: SEMANTICS, name: 'Semantic' },
    disabled: { control: 'boolean' },
    label: { control: 'text', name: 'Value' },
    hasSecondLine: { control: 'boolean', name: 'hasSecondLine' },
    secondLineLabel: { control: 'text', name: 'secondLineLabel', if: { arg: 'hasSecondLine' } },
    error: { table: { disable: true } },
    value: { table: { disable: true } },
  },
  args: {
    variant: 'button',
    size: 'lg',
    checked: false,
    semantic: 'default',
    disabled: false,
    label: 'Radio',
    value: 'radio',
    hasSecondLine: false,
    secondLineLabel: 'Second line label',
  },
  render: ({ checked, semantic, hasSecondLine, secondLineLabel, ...args }: StoryProps) => (
    <RadioGroup key={String(checked)} defaultValue={checked ? 'radio' : undefined} className="w-auto">
      <RadioButton
        {...args}
        value="radio"
        error={semantic === 'error'}
        secondLineLabel={hasSecondLine ? secondLineLabel : undefined}
      />
    </RadioGroup>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Checked: Story = {
  args: { checked: true },
}

export const Standalone: Story = {
  args: { variant: 'standalone', checked: true },
}

export const WithSecondLine: Story = {
  args: { hasSecondLine: true, checked: true },
}

export const ErrorState: Story = {
  args: { semantic: 'error', checked: true },
}

export const Disabled: Story = {
  args: { disabled: true, checked: true },
}

export const AllVariantsAndSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) =>
        SIZES.map((size) => (
          <RadioGroup key={`${variant}-${size}`} defaultValue="on" className="flex w-auto flex-row gap-2">
            <RadioButton variant={variant} size={size} value="off" label="Radio" />
            <RadioButton variant={variant} size={size} value="on" label="Radio" />
            <RadioButton variant={variant} size={size} value="err" label="Radio" error />
            <RadioButton variant={variant} size={size} value="dis" label="Radio" disabled />
          </RadioGroup>
        ))
      )}
    </div>
  ),
}

/** The tile group with a field label/help, as used in forms. */
export const Group: Story = {
  render: () => (
    <RadioButtonGroup label="Delivery speed" description="Choose how fast you need it." defaultValue="standard">
      <RadioButton value="standard" label="Standard" secondLineLabel="3–5 days" />
      <RadioButton value="express" label="Express" secondLineLabel="1–2 days" />
      <RadioButton value="overnight" label="Overnight" secondLineLabel="Next day" />
    </RadioButtonGroup>
  ),
}
