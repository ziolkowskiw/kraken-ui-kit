import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Switch } from './switch'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { defaultChecked: true, disabled: false },
  render: (args) => (
    <label className="flex items-center gap-2 text-sm">
      <Switch {...args} />
      Airplane mode
    </label>
  ),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
