import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { TimeInputField } from './time-input'

type TimeStoryProps = React.ComponentProps<typeof TimeInputField> & {
  hasTooltip?: boolean
  tooltipText?: string
}

const meta = {
  title: 'Components/TimeInput',
  component: TimeInputField,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    description: { control: 'text', name: 'Help text' },
    errorMessage: { control: 'text' },
    mandatory: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hasTooltip: { control: 'boolean', name: 'Show info tooltip', table: { category: 'Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
  },
  args: {
    label: 'Start time',
    description: '24-hour format.',
    size: 'md',
    defaultValue: '09:30',
    mandatory: false,
    disabled: false,
    hasTooltip: false,
    tooltipText: 'Times are shown in your local timezone.',
  },
  render: ({ hasTooltip, tooltipText, ...args }: TimeStoryProps) => (
    <div className="w-56">
      <TimeInputField {...args} tooltip={hasTooltip ? tooltipText : undefined} />
    </div>
  ),
} satisfies Meta<TimeStoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-4">
      <TimeInputField size="sm" label="Small" defaultValue="08:00" />
      <TimeInputField size="md" label="Medium" defaultValue="12:30" />
      <TimeInputField size="lg" label="Large" defaultValue="18:45" />
    </div>
  ),
}

export const ErrorState: Story = {
  args: { errorMessage: 'Time must be after 09:00.', defaultValue: '07:15' },
}
