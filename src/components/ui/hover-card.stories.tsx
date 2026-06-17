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

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger render={<LinkButton>@kraken</LinkButton>} />
      <HoverCardContent>
        <div className="flex flex-col gap-2">
          <HoverCardTitle>Kraken UI Kit</HoverCardTitle>
          <HoverCardCopy>
            A shadcn-based design system with a 3-layer token architecture and
            brand theming.
          </HoverCardCopy>
          <div className="flex items-center gap-2 pt-1 [color:var(--ds-color-content-tertiary)] [font-size:var(--ds-typography-bodyxs-fontsize)]">
            <CalendarDays className="size-3.5" />
            <span>Joined June 2026</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
