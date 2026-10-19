import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Search, SearchField } from './search'

const STATES = ['rest', 'error', 'warning', 'disabled'] as const

// `state` on SearchField only carries error/warning; the story's Figma State axis
// (incl. rest/disabled) lives in `fieldState`.
type SearchStoryProps = React.ComponentProps<typeof SearchField> & {
  fieldState: (typeof STATES)[number]
  defaultValue?: string
  showLabel?: boolean
  showDescription?: boolean
  hasTooltip?: boolean
  tooltipText?: string
}

const meta = {
  title: 'Components/Search',
  component: SearchField,
  parameters: { layout: 'centered', docs: { description: { component: 'A search input specialization (an Input with a search affordance); filter lists/tables, global search.' } } },
  tags: ['autodocs'],
  argTypes: {
    fieldState: { control: 'select', options: STATES, name: 'State' },
    state: { table: { disable: true } },
    size: { control: 'select', options: ['sm', 'md', 'lg'], name: 'Size' },
    label: { control: 'text', name: 'Label' },
    defaultValue: { control: 'text', name: 'Value' },
    description: { control: 'text', name: 'Description' },
    errorMessage: { control: 'text', name: 'Error message' },
    placeholder: { control: 'text', name: 'Placeholder' },
    showLabel: { control: 'boolean', name: 'Show label' },
    showDescription: { control: 'boolean', name: 'Show description' },
    mandatory: { control: 'boolean', name: 'Mandatory field' },
    hasTooltip: { control: 'boolean', name: 'Show info tooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
    disabled: { table: { disable: true } },
    value: { table: { disable: true } },
    onClear: { table: { disable: true } },
  },
  args: {
    fieldState: 'rest',
    size: 'md',
    label: 'Label',
    defaultValue: '',
    description: 'Help text',
    errorMessage: 'Error message',
    placeholder: 'Placeholder',
    showLabel: true,
    showDescription: true,
    mandatory: false,
    hasTooltip: true,
    tooltipText: 'Extra context for this field.',
  },
  render: ({ fieldState, state: _state, defaultValue, label, description, errorMessage, showLabel, showDescription, hasTooltip, tooltipText, ...args }: SearchStoryProps) => {
    const [value, setValue] = React.useState(defaultValue ?? '')
    React.useEffect(() => setValue(defaultValue ?? ''), [defaultValue])
    return (
      <div className="w-80">
        <SearchField
          {...args}
          state={fieldState === 'warning' ? 'warning' : 'default'}
          label={showLabel ? label : undefined}
          description={showDescription ? description : undefined}
          tooltip={showLabel && hasTooltip ? tooltipText : undefined}
          errorMessage={fieldState === 'error' ? errorMessage : undefined}
          disabled={fieldState === 'disabled'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
        />
      </div>
    )
  },
} satisfies Meta<SearchStoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Bare: Story = {
  render: () => {
    const [value, setValue] = React.useState('shoes')
    return (
      <div className="w-80">
        <Search value={value} onChange={(e) => setValue(e.target.value)} onClear={() => setValue('')} placeholder="Search…" />
      </div>
    )
  },
}

export const Filled: Story = {
  args: { defaultValue: 'Text field value' },
}

export const ErrorState: Story = {
  args: { fieldState: 'error', defaultValue: 'Text field value' },
}

export const Warning: Story = {
  args: { fieldState: 'warning', defaultValue: 'Text field value', description: 'No exact matches — showing similar results.' },
}

export const Disabled: Story = {
  args: { fieldState: 'disabled', defaultValue: 'Text field value' },
}
