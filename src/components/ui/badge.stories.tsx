import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Wrench, Check, X } from 'lucide-react'
import { Badge } from './badge'

const COLORS = ['neutral', 'brand', 'green', 'red', 'orange', 'amber', 'blue', 'purple'] as const
const APPEARANCES = ['filled', 'outlined', 'ghost'] as const

// Story-only args: boolean toggles that stand in for Figma's "Left icon" /
// "Right icon" instance-swap booleans (the real props take a ReactNode, which
// Storybook controls can't supply).
type StoryProps = React.ComponentProps<typeof Badge> & {
  leftIconOn?: boolean
  rightIconOn?: boolean
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
    leftIconOn: { control: 'boolean', name: 'Left icon' },
    rightIconOn: { control: 'boolean', name: 'Right icon' },
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
    leftIconOn: false,
    rightIconOn: false,
  },
  render: ({ leftIconOn, rightIconOn, ...args }: StoryProps) => (
    <Badge
      {...args}
      leftIcon={leftIconOn ? <Wrench /> : undefined}
      rightIcon={rightIconOn ? <X /> : undefined}
    />
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithIcons: Story = {
  args: { leftIconOn: true, rightIconOn: true, children: 'Assignee' },
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
