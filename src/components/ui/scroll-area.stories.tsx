import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScrollArea } from './scroll-area'
import { Separator } from './separator'

type StoryProps = {
  orientation: 'vertical' | 'horizontal'
  count: number
}

const meta: Meta<StoryProps> = {
  title: 'Components/ScrollArea',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'], name: 'Orientation' },
    count: { control: { type: 'range', min: 4, max: 60, step: 1 }, name: 'Item count' },
  },
  args: { orientation: 'vertical', count: 40 },
  render: ({ orientation, count }) => {
    const items = Array.from({ length: count })
    if (orientation === 'horizontal') {
      return (
        <ScrollArea className="w-80 rounded-md border [border-color:var(--ds-color-border)] whitespace-nowrap">
          <div className="flex w-max gap-3 p-4">
            {items.map((_, i) => (
              <div
                key={i}
                className="flex size-28 shrink-0 items-center justify-center rounded-md [background-color:var(--ds-color-muted)] text-sm [color:var(--ds-color-content-secondary)]"
              >
                #{i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      )
    }
    return (
      <ScrollArea className="h-72 w-56 rounded-md border [border-color:var(--ds-color-border)]">
        <div className="p-4">
          <div className="[color:var(--ds-color-content-primary)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium">
            Tags
          </div>
          {items.map((_, i) => (
            <div key={i}>
              <div className="py-2 text-sm [color:var(--ds-color-content-secondary)]">
                v1.2.0-beta.{count - i}
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
    )
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Vertical: Story = { args: { orientation: 'vertical' } }

export const Horizontal: Story = { args: { orientation: 'horizontal', count: 12 } }
