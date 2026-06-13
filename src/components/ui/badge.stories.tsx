import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Check, X, Wrench, Star, Circle, Clock, User, Tag, Info } from 'lucide-react'
import { Badge } from './badge'

const COLORS = ['neutral', 'brand', 'green', 'red', 'orange', 'amber', 'blue', 'purple'] as const
const APPEARANCES = ['filled', 'outlined', 'ghost'] as const

// Story-side icon picker — stands in for Figma's left/right icon instance-swap.
// The real props (leftIcon/rightIcon) accept any ReactNode; here we map a
// selectable name to a lucide icon.
const ICONS = {
  none: null,
  check: Check,
  x: X,
  wrench: Wrench,
  star: Star,
  circle: Circle,
  clock: Clock,
  user: User,
  tag: Tag,
  info: Info,
} as const
type IconName = keyof typeof ICONS
const ICON_NAMES = Object.keys(ICONS) as IconName[]
const renderIcon = (name?: IconName) => {
  const Icon = name ? ICONS[name] : null
  return Icon ? <Icon /> : undefined
}

type StoryProps = React.ComponentProps<typeof Badge> & {
  leftIconName?: IconName
  rightIconName?: IconName
}

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: COLORS },
    appearance: { control: 'select', options: APPEARANCES },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['round', 'square'] },
    leftIconName: { control: 'select', options: ICON_NAMES, name: 'Left icon' },
    rightIconName: { control: 'select', options: ICON_NAMES, name: 'Right icon' },
    // hide the raw ReactNode props from the controls table
    leftIcon: { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },
  args: {
    children: 'Badge',
    color: 'amber',
    appearance: 'filled',
    size: 'md',
    shape: 'round',
    leftIconName: 'none',
    rightIconName: 'none',
  },
  render: ({ leftIconName, rightIconName, ...args }: StoryProps) => (
    <Badge
      {...args}
      leftIcon={renderIcon(leftIconName)}
      rightIcon={renderIcon(rightIconName)}
    />
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithIcons: Story = {
  args: { leftIconName: 'wrench', rightIconName: 'x', children: 'Assignee' },
}

// The full Figma matrix: every color × appearance.
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {APPEARANCES.map((appearance) => (
        <div key={appearance} className="flex flex-wrap items-center gap-2">
          {COLORS.map((color) => (
            <Badge key={color} color={color} appearance={appearance}>
              {color}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge color="blue" size="sm" leftIcon={<Check />}>sm</Badge>
      <Badge color="blue" size="md" leftIcon={<Check />}>md</Badge>
      <Badge color="blue" size="lg" leftIcon={<Check />}>lg</Badge>
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge color="green" shape="round">round</Badge>
      <Badge color="green" shape="square">square</Badge>
    </div>
  ),
}
