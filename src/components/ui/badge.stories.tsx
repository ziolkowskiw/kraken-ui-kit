import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './badge'

const COLORS = ['neutral', 'brand', 'green', 'red', 'orange', 'amber', 'blue', 'purple'] as const
const APPEARANCES = ['filled', 'outlined', 'ghost'] as const

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
  },
  args: {
    children: 'Badge',
    color: 'amber',
    appearance: 'filled',
    size: 'md',
    shape: 'round',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

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
      <Badge color="blue" size="sm">sm</Badge>
      <Badge color="blue" size="md">md</Badge>
      <Badge color="blue" size="lg">lg</Badge>
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
