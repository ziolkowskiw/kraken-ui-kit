import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons, Bold } from 'lucide-react'
import { Toggle } from './toggle'

const VARIANTS = ['outline', 'ghost'] as const
const SIZES = ['sm', 'md', 'lg'] as const

type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : undefined
}

type StoryProps = React.ComponentProps<typeof Toggle> & { iconName?: IconName }

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    defaultPressed: { control: 'boolean', name: 'Active' },
    disabled: { control: 'boolean' },
    iconName: { control: 'select', options: ICON_OPTIONS, name: 'Icon' },
  },
  args: {
    variant: 'outline',
    size: 'md',
    defaultPressed: false,
    disabled: false,
    iconName: 'none',
    children: 'Toggle',
  },
  render: ({ iconName, children, ...args }: StoryProps) => (
    <Toggle {...args}>
      {renderIcon(iconName)}
      {children}
    </Toggle>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle variant="outline">Outline</Toggle>
      <Toggle variant="outline" defaultPressed>Outline · on</Toggle>
      <Toggle variant="ghost">Ghost</Toggle>
      <Toggle variant="ghost" defaultPressed>Ghost · on</Toggle>
    </div>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <Toggle aria-label="Bold" className="aspect-square px-0">
      <Bold />
    </Toggle>
  ),
}
