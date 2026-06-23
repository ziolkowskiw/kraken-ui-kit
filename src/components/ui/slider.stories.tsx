import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Slider } from './slider'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: { defaultValue: 40, min: 0, max: 100, step: 1, orientation: 'horizontal' },
  render: (args) => (
    <div className={args.orientation === 'vertical' ? 'h-44' : 'w-72'}>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>

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
