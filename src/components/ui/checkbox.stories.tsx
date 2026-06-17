import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Checkbox } from './checkbox'

const CHECKED_OPTIONS = ['false', 'true', 'indeterminate'] as const

type StoryProps = React.ComponentProps<typeof Checkbox> & {
  checkedState: 'false' | 'true' | 'indeterminate'
  label: string
}

const meta: Meta<StoryProps> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    checkedState: { control: 'select', options: CHECKED_OPTIONS, name: 'checked' },
    error: { control: 'boolean', name: 'Error' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    defaultChecked: { table: { disable: true } },
    indeterminate: { table: { disable: true } },
    hoverScope: { table: { disable: true } },
  },
  args: {
    checkedState: 'false',
    error: false,
    disabled: false,
    label: 'Accept terms and conditions',
  },
  render: ({ checkedState, label, ...args }) => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox
        {...args}
        defaultChecked={checkedState === 'true'}
        indeterminate={checkedState === 'indeterminate'}
      />
      {label}
    </label>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Rest: Story = {}

export const Checked: Story = {
  args: { checkedState: 'true' },
}

export const Indeterminate: Story = {
  args: { checkedState: 'indeterminate' },
}

export const Error: Story = {
  args: { error: true },
}

export const ErrorChecked: Story = {
  args: { error: true, checkedState: 'true' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, checkedState: 'true' },
}

export const DisabledIndeterminate: Story = {
  args: { disabled: true, checkedState: 'indeterminate' },
}

// Full matrix: default × error × disabled across all checked states.
export const AllStates: Story = {
  render: () => {
    const checkedStates = ['false', 'true', 'indeterminate'] as const
    const rows = [
      { label: 'Default', error: false, disabled: false },
      { label: 'Error', error: true, disabled: false },
      { label: 'Disabled', error: false, disabled: true },
    ]
    return (
      <div className="grid grid-cols-[auto_repeat(3,1fr)] items-center gap-x-6 gap-y-4 text-sm">
        <span />
        {checkedStates.map((c) => (
          <span key={c} className="[color:var(--ds-color-content-tertiary)]">
            {c}
          </span>
        ))}
        {rows.map((row) => (
          <React.Fragment key={row.label}>
            <span className="[color:var(--ds-color-content-tertiary)]">{row.label}</span>
            {checkedStates.map((c) => (
              <Checkbox
                key={c}
                error={row.error}
                disabled={row.disabled}
                defaultChecked={c === 'true'}
                indeterminate={c === 'indeterminate'}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}
