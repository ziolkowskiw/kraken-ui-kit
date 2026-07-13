import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Progress } from './progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: { layout: 'padded', docs: { description: { component: 'Rounded track + indicator with optional label row.' } } },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    showLabels: { control: 'boolean' },
    label: { control: 'text', if: { arg: 'showLabels' } },
  },
  args: { value: 60, label: 'Uploading…', showLabels: true },
  render: (args) => (
    <div className="w-80">
      <Progress {...args} />
    </div>
  ),
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const NoLabels: Story = {
  args: { showLabels: false, value: 40 },
  render: (args) => (
    <div className="w-80">
      <Progress {...args} aria-label="Progress" />
    </div>
  ),
}

export const Steps: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      {[0, 25, 50, 75, 100].map((v) => (
        <Progress key={v} value={v} label={`${v}%`} showLabels />
      ))}
    </div>
  ),
}
