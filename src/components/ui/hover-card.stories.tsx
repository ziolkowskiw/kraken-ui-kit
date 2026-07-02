import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CalendarDays } from 'lucide-react'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardTitle,
  HoverCardCopy,
} from './hover-card'
import { LinkButton } from './link'

type StoryProps = {
  triggerLabel: string
  title: string
  copy: string
  meta: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

const meta: Meta<StoryProps> = {
  title: 'Components/HoverCard',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    triggerLabel: { control: 'text', name: 'Label', table: { category: 'Nested: Trigger' } },
    title: { control: 'text', name: 'Title', table: { category: 'Content' } },
    copy: { control: 'text', name: 'Body', table: { category: 'Content' } },
    meta: { control: 'text', name: 'Meta line', table: { category: 'Content' } },
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'], table: { category: 'Position' } },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'], table: { category: 'Position' } },
  },
  args: {
    triggerLabel: '@kraken',
    title: 'Kraken UI Kit',
    copy: 'A shadcn-based design system with a 3-layer token architecture and brand theming.',
    meta: 'Joined June 2026',
    side: 'bottom',
    align: 'center',
  },
  render: ({ triggerLabel, title, copy, meta, side, align }) => (
    <HoverCard>
      <HoverCardTrigger render={<LinkButton>{triggerLabel}</LinkButton>} />
      <HoverCardContent side={side} align={align}>
        <div className="flex flex-col gap-2">
          <HoverCardTitle>{title}</HoverCardTitle>
          <HoverCardCopy>{copy}</HoverCardCopy>
          {meta && (
            <div className="flex items-center gap-2 pt-1 [color:var(--ds-color-content-tertiary)] [font-size:var(--ds-typography-bodyxs-fontsize)]">
              <CalendarDays className="size-3.5" />
              <span>{meta}</span>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
