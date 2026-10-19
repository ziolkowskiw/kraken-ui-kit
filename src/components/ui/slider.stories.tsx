import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Slider } from './slider'

// Figma `slider` (1811:15452): Type=default|range × Direction.
type StoryProps = React.ComponentProps<typeof Slider> & { type: 'default' | 'range' }

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered', docs: { description: { component: 'An input where the user selects a value from within a given range; volume, ranges, numeric tuning.' } } },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['default', 'range'], name: 'Type' },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'], name: 'Direction' },
    defaultValue: { table: { disable: true } },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: { type: 'default', defaultValue: 40, min: 0, max: 100, step: 1, orientation: 'horizontal' },
  render: ({ type, defaultValue, ...args }: StoryProps) => {
    // Type drives the thumb count unless a story pins its own value shape.
    const value = Array.isArray(defaultValue) ? defaultValue : type === 'range' ? [25, 70] : defaultValue
    return (
      <div className={args.orientation === 'vertical' ? 'h-44' : 'w-72'}>
        <Slider key={`${type}-${String(value)}`} {...args} defaultValue={value} />
      </div>
    )
  },
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Range: Story = {
  args: { defaultValue: [25, 70] },
}

export const Vertical: Story = {
  args: { orientation: 'vertical', defaultValue: 50 },
}

export const VerticalRange: Story = {
  args: { orientation: 'vertical', defaultValue: [20, 80] },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 40 },
}

export const Steps: Story = {
  args: { step: 10, defaultValue: 30 },
}
