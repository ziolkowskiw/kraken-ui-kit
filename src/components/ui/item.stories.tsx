import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons, ChevronRight } from 'lucide-react'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from './item'
import { Button } from './button'
import { Badge } from './badge'

type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === 'none') return null
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : null
}

type StoryProps = React.ComponentProps<typeof Item> & {
  title?: string
  description?: string
  iconName?: IconName
  showAction?: boolean
}

const meta = {
  title: 'Components/Item',
  component: Item,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'muted', 'outline'] },
    title: { control: 'text', name: 'Title' },
    description: { control: 'text', name: 'Description' },
    iconName: { control: 'select', options: ICON_OPTIONS, name: 'Left icon' },
    showAction: { control: 'boolean', name: 'Right action' },
  },
  args: {
    variant: 'outline',
    title: 'Notifications',
    description: 'Manage how you receive alerts and updates.',
    iconName: 'Bell',
    showAction: true,
  },
  render: ({ title, description, iconName, showAction, ...args }: StoryProps) => (
    <div className="w-96">
      <Item {...args}>
        {iconName !== 'none' && <ItemMedia>{renderIcon(iconName)}</ItemMedia>}
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          {description && <ItemDescription>{description}</ItemDescription>}
        </ItemContent>
        {showAction && (
          <ItemActions>
            <Button variant="ghost" size="sm" iconOnly aria-label="Open">
              <ChevronRight />
            </Button>
          </ItemActions>
        )}
      </Item>
    </div>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      {(['default', 'muted', 'outline'] as const).map((variant) => (
        <Item key={variant} variant={variant}>
          <ItemContent>
            <ItemTitle>{variant} item</ItemTitle>
            <ItemDescription>Variant = {variant}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge color="brand">New</Badge>
          </ItemActions>
        </Item>
      ))}
    </div>
  ),
}

export const WithButtonAction: Story = {
  render: () => (
    <div className="w-96">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Upgrade your plan</ItemTitle>
          <ItemDescription>Unlock advanced analytics and more seats.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="primary" size="sm">Upgrade</Button>
        </ItemActions>
      </Item>
    </div>
  ),
}
