import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import * as React from 'react'
import { Switch } from './switch'

type SwitchStoryProps = React.ComponentProps<typeof Switch> & {
  showLeftLabel?: boolean
  showRightLabel?: boolean
  hasTooltip?: boolean
  tooltipText?: string
}

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered', docs: { description: { component: 'a control that toggles between checked and not checked; instant on/off settings (no submit)' } } },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['default', 'compact'], name: 'Compact' },
    defaultChecked: { control: 'boolean', name: 'Active' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean', name: 'Error' },
    showLeftLabel: { control: 'boolean', name: 'Show left label' },
    leftLabel: { control: 'text', name: 'Left label', if: { arg: 'showLeftLabel' } },
    showRightLabel: { control: 'boolean', name: 'Show right label' },
    rightLabel: { control: 'text', name: 'Right label', if: { arg: 'showRightLabel' } },
    hasTooltip: { control: 'boolean', name: 'showTooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
  },
  args: {
    size: 'default',
    defaultChecked: false,
    disabled: false,
    error: false,
    showLeftLabel: true,
    leftLabel: 'Label',
    showRightLabel: true,
    rightLabel: 'Label',
    hasTooltip: false,
    tooltipText: 'Turning this on enables email notifications.',
  },
  render: ({ showLeftLabel, showRightLabel, leftLabel, rightLabel, hasTooltip, tooltipText, ...args }: SwitchStoryProps) => (
    <Switch
      // Remount when Active changes so the uncontrolled switch picks it up.
      key={String(args.defaultChecked)}
      {...args}
      leftLabel={showLeftLabel ? leftLabel : undefined}
      rightLabel={showRightLabel ? rightLabel : undefined}
      tooltip={hasTooltip ? tooltipText : undefined}
    />
  ),
} satisfies Meta<SwitchStoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Rest: Story = {}

export const Active: Story = {
  args: { defaultChecked: true },
}

export const Compact: Story = {
  args: { size: 'compact' },
}

export const CompactActive: Story = {
  args: { size: 'compact', defaultChecked: true },
}

export const WithLeftLabel: Story = {
  args: { leftLabel: 'Off', rightLabel: 'On' },
}

export const WithTooltip: Story = {
  args: { hasTooltip: true, rightLabel: 'Email notifications' },
}

export const Error: Story = {
  args: { error: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledActive: Story = {
  args: { disabled: true, defaultChecked: true },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch rightLabel="Default off" />
      <Switch rightLabel="Default on" defaultChecked />
      <Switch rightLabel="Compact off" size="compact" />
      <Switch rightLabel="Compact on" size="compact" defaultChecked />
      <Switch rightLabel="Error" error />
      <Switch rightLabel="Disabled" disabled />
      <Switch rightLabel="Disabled on" disabled defaultChecked />
      <Switch leftLabel="Left" rightLabel="Right" defaultChecked />
    </div>
  ),
}

// Interaction test: the switch flips on click.
export const Toggles: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch')
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
  },
}
