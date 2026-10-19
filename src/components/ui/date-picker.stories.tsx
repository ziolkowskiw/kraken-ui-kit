import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { DatePickerField } from './date-picker'

const STATES = ['rest', 'error', 'disabled'] as const

type DatePickerStoryProps = React.ComponentProps<typeof DatePickerField> & {
  state: (typeof STATES)[number]
  filled?: boolean
  showLabel?: boolean
  showHelpText?: boolean
  hasTooltip?: boolean
  tooltipText?: string
}

const meta = {
  title: 'Components/DatePicker',
  component: DatePickerField,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A date picker component; pick a single date or range in forms. Composes `calendar` + `popover` + `button`.' } },
  },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: STATES, name: 'State' },
    size: { control: 'select', options: ['sm', 'md', 'lg'], name: 'Size' },
    mode: { control: 'inline-radio', options: ['single', 'range'], name: 'Mode' },
    label: { control: 'text', name: 'Label' },
    filled: { control: 'boolean', name: 'Filled' },
    description: { control: 'text', name: 'Help text' },
    errorMessage: { control: 'text', name: 'Error message' },
    placeholder: { control: 'text', name: 'Placeholder' },
    showLabel: { control: 'boolean', name: 'Show label' },
    showHelpText: { control: 'boolean', name: 'Show help text' },
    mandatory: { control: 'boolean', name: 'Mandatory field' },
    hasTooltip: { control: 'boolean', name: 'Show info tooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
    // Date / function props are set in code, not via the controls panel.
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    format: { table: { disable: true } },
  },
  args: {
    state: 'rest',
    size: 'md',
    mode: 'single',
    label: 'Label',
    filled: false,
    description: 'Help text',
    errorMessage: 'Error message',
    placeholder: 'DD/MM/YYYY',
    showLabel: true,
    showHelpText: true,
    mandatory: false,
    hasTooltip: true,
    tooltipText: 'Extra context for this field.',
  },
  render: ({ state, filled, label, description, errorMessage, showLabel, showHelpText, hasTooltip, tooltipText, ...args }: DatePickerStoryProps) => (
    <div className="w-56">
      <DatePickerField
        // Remount when Filled/Mode change so the uncontrolled picker picks it up.
        key={`${filled}-${args.mode}`}
        {...({
          ...args,
          ...(filled && !args.defaultValue
            ? { defaultValue: args.mode === 'range' ? { from: new Date(2026, 0, 20), to: new Date(2026, 0, 24) } : new Date(2026, 0, 20) }
            : {}),
        } as React.ComponentProps<typeof DatePickerField>)}
        label={showLabel ? label : undefined}
        description={showHelpText ? description : undefined}
        tooltip={showLabel && hasTooltip ? tooltipText : undefined}
        errorMessage={state === 'error' ? errorMessage : undefined}
        disabled={state === 'disabled'}
      />
    </div>
  ),
} satisfies Meta<DatePickerStoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Opens with a date already chosen, so the trigger shows the formatted value
 *  (not the placeholder). */
export const WithValue: Story = {
  args: {
    label: 'Start date',
    description: undefined,
    defaultValue: new Date(2026, 5, 23),
  },
}

/** Range selection: the trigger shows "from – to" and the popover stays open
 *  until both ends are picked. */
export const RangeSelection: Story = {
  args: {
    mode: 'range',
    label: 'Stay dates',
    placeholder: 'Pick a date range',
    description: 'Check-in to check-out.',
    defaultValue: { from: new Date(2026, 5, 23), to: new Date(2026, 5, 27) },
  },
}

export const ErrorState: Story = {
  args: { state: 'error', filled: true },
}

export const Disabled: Story = {
  args: { state: 'disabled', filled: true },
}
