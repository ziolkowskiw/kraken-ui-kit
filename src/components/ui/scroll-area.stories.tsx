import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScrollArea } from './scroll-area'
import { Separator } from './separator'

const tags = Array.from({ length: 40 }).map((_, i) => `v1.2.0-beta.${40 - i}`)

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <ScrollArea className="h-72 w-56 rounded-md border [border-color:var(--ds-color-border)]">
      <div className="p-4">
        <div className="[color:var(--ds-color-content-primary)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium">
          Tags
        </div>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="py-2 text-sm [color:var(--ds-color-content-secondary)]">{tag}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-80 rounded-md border [border-color:var(--ds-color-border)] whitespace-nowrap">
      <div className="flex w-max gap-3 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex size-28 shrink-0 items-center justify-center rounded-md [background-color:var(--ds-color-muted)] text-sm [color:var(--ds-color-content-secondary)]"
          >
            #{i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
