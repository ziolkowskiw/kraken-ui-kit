import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './calendar'

// Figma `calendar` Variant (897:4967) → react-day-picker props:
//   only month     → captionLayout="dropdown-months" (month picker + year label)
//   only year      → captionLayout="dropdown-years"
//   month and year → captionLayout="dropdown"
//   1 / 2 / 3 months → plain caption, numberOfMonths=1/2/3
const VARIANTS = ['only month', 'only year', 'month and year', '1 month', '2 months', '3 months'] as const
type Variant = (typeof VARIANTS)[number]
const VARIANT_PROPS: Record<Variant, { captionLayout: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'; numberOfMonths: number }> = {
  'only month': { captionLayout: 'dropdown-months', numberOfMonths: 1 },
  'only year': { captionLayout: 'dropdown-years', numberOfMonths: 1 },
  'month and year': { captionLayout: 'dropdown', numberOfMonths: 1 },
  '1 month': { captionLayout: 'label', numberOfMonths: 1 },
  '2 months': { captionLayout: 'label', numberOfMonths: 2 },
  '3 months': { captionLayout: 'label', numberOfMonths: 3 },
}

type StoryProps = {
  variant: Variant
  mode: 'single' | 'range'
  showOutsideDays: boolean
}

function CalendarDemo({ variant, mode, showOutsideDays }: StoryProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [range, setRange] = React.useState<DateRange | undefined>()
  const common = {
    ...VARIANT_PROPS[variant],
    showOutsideDays,
    startMonth: new Date(2020, 0),
    endMonth: new Date(2030, 11),
    className: 'rounded-lg border [border-color:var(--ds-color-border)]',
  }
  return mode === 'range' ? (
    <Calendar mode="range" selected={range} onSelect={setRange} {...common} />
  ) : (
    <Calendar mode="single" selected={date} onSelect={setDate} {...common} />
  )
}

const meta = {
  title: 'Components/Calendar',
  // docs-only association; the playground args are story-level props
  component: Calendar as React.ComponentType<StoryProps>,
  parameters: { layout: 'centered', docs: { description: { component: 'A date field component that allows users to select dates; standalone or inside date-picker. Built on react-day-picker.' } } },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS, name: 'Variant' },
    mode: { control: 'inline-radio', options: ['single', 'range'], name: 'Mode' },
    showOutsideDays: { control: 'boolean', name: 'Outside days' },
  },
  args: { variant: 'only month', mode: 'single', showOutsideDays: true },
  // Remount on mode change so single/range selection state stays consistent.
  render: (args) => <CalendarDemo key={`${args.mode}-${args.variant}`} {...args} />,
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Single: Story = { args: { mode: 'single', variant: '1 month' } }

export const MonthAndYear: Story = { args: { variant: 'month and year' } }

export const Range: Story = { args: { mode: 'range', variant: '2 months' } }

// Every day before today is disabled and non-interactive.
export const Disabled: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>()
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ before: new Date() }}
        className="rounded-lg border [border-color:var(--ds-color-border)]"
      />
    )
  },
}
