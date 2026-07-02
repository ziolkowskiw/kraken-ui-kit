import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Separator } from './separator'

const SPACINGS = [0, 4, 8, 12, 16, 24, 32] as const

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: { layout: 'centered', docs: { description: { component: 'Visually or semantically separates content; between sections, list items, toolbar groups.' } } },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    spacing: { control: 'select', options: SPACINGS },
  },
  args: { orientation: 'horizontal', spacing: 16 },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <div className={args.orientation === 'vertical' ? 'flex h-16 items-center' : 'w-64'}>
      <span className="[color:var(--ds-color-content-secondary)] text-sm">Above</span>
      <Separator {...args} />
      <span className="[color:var(--ds-color-content-secondary)] text-sm">Below</span>
    </div>
  ),
}

export const SpacingScale: Story = {
  render: () => (
    <div className="w-72">
      {SPACINGS.map((spacing) => (
        <div key={spacing}>
          <span className="[color:var(--ds-color-content-tertiary)] text-xs">spacing {spacing}</span>
          <Separator orientation="horizontal" spacing={spacing} />
        </div>
      ))}
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center [color:var(--ds-color-content-secondary)] text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" spacing={12} />
      <span>Source</span>
      <Separator orientation="vertical" spacing={12} />
      <span>About</span>
    </div>
  ),
}
