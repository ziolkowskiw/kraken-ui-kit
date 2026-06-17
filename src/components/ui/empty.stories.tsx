import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons, Inbox } from 'lucide-react'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from './empty'
import { Button } from './button'

type IconName = keyof typeof icons
const ICON_OPTIONS: IconName[] = Object.keys(icons) as IconName[]
const renderIcon = (name: IconName): React.ReactNode => {
  const Icon = icons[name]
  return Icon ? <Icon /> : null
}

type StoryProps = {
  iconName: IconName
  showIcon: boolean
  title: string
  description: string
  showPrimary: boolean
  showSecondary: boolean
  showGhost: boolean
}

const meta = {
  title: 'Components/Empty',
  component: Empty,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    iconName: { control: 'select', options: ICON_OPTIONS, name: 'Icon' },
    showIcon: { control: 'boolean', name: 'Show icon' },
    title: { control: 'text', name: 'Title' },
    description: { control: 'text', name: 'Body' },
    showPrimary: { control: 'boolean', name: 'Primary button' },
    showSecondary: { control: 'boolean', name: 'Secondary button' },
    showGhost: { control: 'boolean', name: 'Ghost button' },
  },
  args: {
    iconName: 'Inbox',
    showIcon: true,
    title: 'No messages yet',
    description: 'When you receive messages they will show up here.',
    showPrimary: true,
    showSecondary: true,
    showGhost: false,
  },
  render: (args: StoryProps) => (
    <div className="mx-auto max-w-md rounded-lg border [border-color:var(--ds-color-border)]">
      <Empty>
        <EmptyHeader>
          {args.showIcon && <EmptyMedia>{renderIcon(args.iconName)}</EmptyMedia>}
          <EmptyTitle>{args.title}</EmptyTitle>
          <EmptyDescription>{args.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {args.showPrimary && <Button variant="primary">Get started</Button>}
          {args.showSecondary && <Button variant="secondary">Import</Button>}
          {args.showGhost && <Button variant="ghost">Learn more</Button>}
        </EmptyContent>
      </Empty>
    </div>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Minimal: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>Nothing here</EmptyTitle>
        <EmptyDescription>Your inbox is empty.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}
