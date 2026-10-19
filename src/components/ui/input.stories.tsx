import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons } from 'lucide-react'
import { InputField } from './input'

type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName, size = 16): React.ReactNode => {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon size={size} /> : undefined
}

const SIZES = ['sm', 'md', 'lg'] as const
const STATES = ['rest', 'error', 'disabled'] as const

type FieldStoryProps = React.ComponentProps<typeof InputField> & {
  state: 'rest' | 'error' | 'disabled'
  showLabel?: boolean
  showDescription?: boolean
  leftIconName?: IconName
  rightIconName?: IconName
  hasTooltip?: boolean
  tooltipText?: string
}

const meta = {
  title: 'Components/InputField',
  component: InputField,
  parameters: { layout: 'centered', docs: { description: { component: 'displays a form input field; single-line text entry in forms' } } },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: STATES, name: 'State' },
    size: { control: 'select', options: SIZES, name: 'Size' },
    label: { control: 'text', name: 'Label' },
    defaultValue: { control: 'text', name: 'Value' },
    description: { control: 'text', name: 'Description' },
    errorMessage: { control: 'text', name: 'Error message' },
    placeholder: { control: 'text', name: 'Placeholder' },
    showLabel: { control: 'boolean', name: 'Show label' },
    showDescription: { control: 'boolean', name: 'Show description' },
    mandatory: { control: 'boolean', name: 'Mandatory field' },
    hasTooltip: { control: 'boolean', name: 'Show info tooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
    leftIconName: { control: 'select', options: ICON_OPTIONS, name: 'Left decoration' },
    rightIconName: { control: 'select', options: ICON_OPTIONS, name: 'Right decoration' },
    leftDecoration: { table: { disable: true } },
    rightDecoration: { table: { disable: true } },
    error: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  args: {
    state: 'rest',
    size: 'md',
    label: 'Label',
    defaultValue: '',
    placeholder: 'Placeholder',
    description: 'Help text',
    errorMessage: 'Error message',
    showLabel: true,
    showDescription: true,
    mandatory: false,
    hasTooltip: true,
    tooltipText: 'Extra context for this field.',
    leftIconName: 'none',
    rightIconName: 'none',
  },
  render: ({ state, label, description, showLabel, showDescription, leftIconName, rightIconName, errorMessage, hasTooltip, tooltipText, ...args }: FieldStoryProps) => (
    <InputField
      // Remount when Value changes so the uncontrolled input picks it up.
      key={String(args.defaultValue)}
      {...args}
      label={showLabel ? label : undefined}
      description={showDescription ? description : undefined}
      tooltip={showLabel && hasTooltip ? tooltipText : undefined}
      error={state === 'error'}
      errorMessage={state === 'error' ? errorMessage : undefined}
      disabled={state === 'disabled'}
      leftDecoration={renderIcon(leftIconName)}
      rightDecoration={renderIcon(rightIconName)}
      className="w-80"
    />
  ),
} satisfies Meta<FieldStoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Default: Story = {}

export const Filled: Story = {
  args: { defaultValue: 'Text field value' },
}

export const WithError: Story = {
  args: { state: 'error', mandatory: true, defaultValue: 'Text field value' },
}

export const Disabled: Story = {
  args: { state: 'disabled', defaultValue: 'Text field value' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Medium: Story = {
  args: { size: 'md' },
}

export const WithDecorations: Story = {
  args: {
    leftIconName: 'Search',
    rightIconName: 'X',
    placeholder: 'Search...',
  },
}

export const Mandatory: Story = {
  args: { mandatory: true },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      {SIZES.map((s) => (
        <InputField key={s} size={s} label={`Size: ${s}`} placeholder="Placeholder" />
      ))}
    </div>
  ),
}
