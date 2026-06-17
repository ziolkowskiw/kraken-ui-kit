import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons } from 'lucide-react'
import { Link, LinkButton } from './link'

type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : undefined
}

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive'] },
    children: { control: 'text' },
    'aria-disabled': { control: 'boolean', name: 'disabled' },
  },
  args: { variant: 'default', children: 'This is a link', href: '#' },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Inline: Story = {
  render: () => (
    <p className="max-w-sm [color:var(--ds-color-content-secondary)]">
      Sunt natus architecto. Ducimus sint <Link href="#">this is a link</Link>. Ut
      magni perspiciatis nulla aut est nemo fugiat.
    </p>
  ),
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete account' },
}

type LinkButtonStoryProps = React.ComponentProps<typeof LinkButton> & {
  leftIconName?: IconName
  rightIconName?: IconName
}

export const LinkButtons: StoryObj<LinkButtonStoryProps> = {
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    leftIconName: { control: 'select', options: ICON_OPTIONS, name: 'Left icon' },
    rightIconName: { control: 'select', options: ICON_OPTIONS, name: 'Right icon' },
  },
  args: { children: 'Action verb', size: 'md', leftIconName: 'none', rightIconName: 'ArrowRight' },
  render: ({ leftIconName, rightIconName, ...args }: LinkButtonStoryProps) => (
    <LinkButton {...args} leftIcon={renderIcon(leftIconName)} rightIcon={renderIcon(rightIconName)} />
  ),
}

export const LinkButtonSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <LinkButton key={size} size={size}>
          {size}
        </LinkButton>
      ))}
    </div>
  ),
}
