import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextareaField } from './textarea'

const STATES = ['rest', 'error', 'disabled'] as const

type TextareaFieldStoryProps = React.ComponentProps<typeof TextareaField> & {
  state: 'rest' | 'error' | 'disabled'
  showLabel?: boolean
  showHelpText?: boolean
  hasTooltip?: boolean
  tooltipText?: string
}

const meta = {
  title: 'Components/Textarea',
  component: TextareaField,
  parameters: { layout: 'centered', docs: { description: { component: 'displays a form textarea; multi-line text entry (comments, notes)' } } },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: STATES, name: 'State' },
    label: { control: 'text', name: 'Label' },
    defaultValue: { control: 'text', name: 'Value' },
    description: { control: 'text', name: 'Help text' },
    errorMessage: { control: 'text', name: 'Error message' },
    placeholder: { control: 'text', name: 'Placeholder' },
    showLabel: { control: 'boolean', name: 'Show label' },
    showHelpText: { control: 'boolean', name: 'Show help text' },
    mandatory: { control: 'boolean', name: 'Mandatory field' },
    hasTooltip: { control: 'boolean', name: 'Show info tooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
    showCounter: { control: 'boolean', name: 'Show counter' },
    maxLength: { control: 'number', name: 'Max length', if: { arg: 'showCounter' } },
    error: { table: { disable: true } },
    disabled: { table: { disable: true } },
    id: { table: { disable: true } },
  },
  args: {
    state: 'rest',
    label: 'Label',
    description: 'Help text',
    errorMessage: 'Error message',
    placeholder: 'Placeholder',
    defaultValue: '',
    showLabel: true,
    showHelpText: true,
    mandatory: false,
    hasTooltip: true,
    tooltipText: 'Extra context for this field.',
    showCounter: false,
    maxLength: 200,
  },
  render: ({ state, label, description, showLabel, showHelpText, errorMessage, hasTooltip, tooltipText, ...args }: TextareaFieldStoryProps) => (
    <TextareaField
      // Remount when Value changes so the uncontrolled textarea picks it up.
      key={String(args.defaultValue)}
      {...args}
      label={showLabel ? label : undefined}
      description={showHelpText ? description : undefined}
      tooltip={showLabel && hasTooltip ? tooltipText : undefined}
      error={state === 'error'}
      errorMessage={state === 'error' ? errorMessage : undefined}
      disabled={state === 'disabled'}
      className="w-72"
    />
  ),
} satisfies Meta<TextareaFieldStoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Default: Story = {}

export const Filled: Story = {
  args: { defaultValue: 'Text area value' },
}

export const WithError: Story = {
  args: { state: 'error', defaultValue: 'Text area value' },
}

export const Disabled: Story = {
  args: { state: 'disabled' },
}

export const Mandatory: Story = {
  args: { mandatory: true },
}

export const WithCounter: Story = {
  args: { showCounter: true, maxLength: 100 },
}

export const NoLabel: Story = {
  args: { showLabel: false },
}
