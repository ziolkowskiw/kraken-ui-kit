import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons } from 'lucide-react'
import { Button } from './button'

const VARIANTS = [
  'primary',
  'secondary',
  'tonal',
  'ghost',
  'destructive',
  'destructive-secondary',
  'destructive-ghost',
] as const
const SIZES = ['xs', 'sm', 'md', 'lg'] as const

// Same icon-picker approach as Badge: the full lucide set as a control. The real
// leftIcon/rightIcon props accept any ReactNode. "none" = no icon.
type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : undefined
}

type StoryProps = React.ComponentProps<typeof Button> & {
  leftIconName?: IconName
  rightIconName?: IconName
}

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    iconOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    leftIconName: { control: 'select', options: ICON_OPTIONS, name: 'Left icon' },
    rightIconName: { control: 'select', options: ICON_OPTIONS, name: 'Right icon' },
    leftIcon: { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },
  args: {
    children: 'Action verb',
    variant: 'primary',
    size: 'md',
    iconOnly: false,
    disabled: false,
    leftIconName: 'none',
    rightIconName: 'none',
  },
  render: ({ leftIconName, rightIconName, ...args }: StoryProps) => (
    <Button
      {...args}
      leftIcon={renderIcon(leftIconName)}
      rightIcon={renderIcon(rightIconName)}
    />
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {SIZES.map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
}

export const IconOnly: Story = {
  args: { iconOnly: true, leftIconName: 'Plus', children: undefined, 'aria-label': 'Add' },
}
