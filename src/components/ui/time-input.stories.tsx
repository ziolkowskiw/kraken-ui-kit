import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { TimeInputField } from './time-input'

const SIZES = ['sm', 'md', 'lg'] as const
const STATES = ['rest', 'error', 'disabled'] as const

type TimeStoryProps = React.ComponentProps<typeof TimeInputField> & {
  state: (typeof STATES)[number]
  showLabel?: boolean
  showHelpText?: boolean
  hasTooltip?: boolean
  tooltipText?: string
}

const meta = {
  title: 'Components/TimeInput',
  component: TimeInputField,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A time field (native `type="time"` styled shell); enter a time of day. `size`.' } },
  },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: STATES, name: 'State' },
    size: { control: 'select', options: SIZES, name: 'Size' },
    label: { control: 'text', name: 'Label' },
    defaultValue: { control: 'text', name: 'Value' },
    description: { control: 'text', name: 'Help text' },
    errorMessage: { control: 'text', name: 'Error message' },
    showLabel: { control: 'boolean', name: 'Show label' },
    showHelpText: { control: 'boolean', name: 'Show help text' },
    mandatory: { control: 'boolean', name: 'Mandatory field' },
    hasTooltip: { control: 'boolean', name: 'Show info tooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
    error: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  args: {
    state: 'rest',
    size: 'md',
    label: 'Label',
    defaultValue: '22:15',
    description: 'Help text',
    errorMessage: 'Error message',
    showLabel: true,
    showHelpText: true,
    mandatory: false,
    hasTooltip: true,
    tooltipText: 'Times are shown in your local timezone.',
  },
  render: ({ state, showLabel, showHelpText, label, description, errorMessage, hasTooltip, tooltipText, ...args }: TimeStoryProps) => (
    <div className="w-56">
      <TimeInputField
        // Remount when Value changes so the uncontrolled input picks it up.
        key={String(args.defaultValue)}
        {...args}
        label={showLabel ? label : undefined}
        description={showHelpText ? description : undefined}
        tooltip={showLabel && hasTooltip ? tooltipText : undefined}
        error={state === 'error'}
        errorMessage={state === 'error' ? errorMessage : undefined}
        disabled={state === 'disabled'}
      />
    </div>
  ),
} satisfies Meta<TimeStoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Empty: Story = {
  args: { defaultValue: '' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-4">
      {SIZES.map((s) => (
        <TimeInputField key={s} size={s} label={`Size: ${s}`} defaultValue="22:15" description="Help text" />
      ))}
    </div>
  ),
}

export const ErrorState: Story = {
  args: { state: 'error' },
}

export const Disabled: Story = {
  args: { state: 'disabled' },
}
