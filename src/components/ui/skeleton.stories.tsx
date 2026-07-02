import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Skeleton } from './skeleton'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered', docs: { description: { component: 'Muted, pulsing placeholder.' } } },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text', description: 'Tailwind utilities set the footprint' },
  },
  args: { className: 'h-10 w-40' },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Card: Story = {
  render: () => (
    <div className="flex w-72 items-center gap-3">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  ),
}

export const Block: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}
