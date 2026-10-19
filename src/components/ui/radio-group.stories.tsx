import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RadioGroupField } from './radio-group'
import { RadioButton } from './radio-button'

const DIRECTIONS = ['horizontal', 'vertical'] as const
const SIZES = ['sm', 'md', 'lg'] as const
const STATES = ['default', 'error'] as const

type RGFieldStoryProps = React.ComponentProps<typeof RadioGroupField> & {
  state: 'default' | 'error'
  size: (typeof SIZES)[number]
  optionCount: number
  showLabel?: boolean
  showHelpText?: boolean
  hasTooltip?: boolean
  tooltipText?: string
}

// Figma `radio-group` (1104:10652) fills its `input_options` slot with
// `radio-button` instances: button tiles when horizontal, standalone when vertical.
const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroupField,
  parameters: { layout: 'centered', docs: { description: { component: 'a set of checkable buttons where only one can be checked; choose one from a small visible set' } } },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: STATES, name: 'State' },
    size: { control: 'select', options: SIZES, name: 'Size' },
    direction: { control: 'select', options: DIRECTIONS, name: 'Direction' },
    label: { control: 'text', name: 'Label' },
    description: { control: 'text', name: 'Help text' },
    errorMessage: { control: 'text', name: 'Error message' },
    showLabel: { control: 'boolean', name: 'Show label' },
    showHelpText: { control: 'boolean', name: 'Show help text' },
    mandatory: { control: 'boolean', name: 'Mandatory field' },
    optionCount: { control: { type: 'range', min: 1, max: 6, step: 1 }, name: 'Number of options' },
    hasTooltip: { control: 'boolean', name: 'Show info tooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  args: {
    state: 'default',
    size: 'lg',
    direction: 'horizontal',
    label: 'Label',
    description: 'Help text',
    errorMessage: 'Error message',
    showLabel: true,
    showHelpText: true,
    mandatory: false,
    optionCount: 5,
    hasTooltip: true,
    tooltipText: 'Extra context for this field.',
  },
  render: ({ state, size, optionCount, label, description, showLabel, showHelpText, errorMessage, hasTooltip, tooltipText, ...args }) => (
    <RadioGroupField
      {...args}
      label={showLabel ? label : undefined}
      description={showHelpText ? description : undefined}
      tooltip={showLabel && hasTooltip ? tooltipText : undefined}
      error={state === 'error'}
      errorMessage={state === 'error' ? errorMessage : undefined}
    >
      {Array.from({ length: optionCount }, (_, i) => (
        <RadioButton
          key={i}
          value={`radio-${i + 1}`}
          label="Radio"
          size={size}
          variant={args.direction === 'vertical' ? 'standalone' : 'button'}
          error={state === 'error'}
        />
      ))}
    </RadioGroupField>
  ),
} satisfies Meta<RGFieldStoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Default: Story = {}

export const Vertical: Story = {
  args: { direction: 'vertical', size: 'md' },
}

export const Selected: Story = {
  args: { defaultValue: 'radio-1' },
}

export const WithError: Story = {
  args: { state: 'error', size: 'md' },
}

export const Mandatory: Story = {
  args: { mandatory: true },
}

export const AllDirections: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {DIRECTIONS.map((dir) => (
        <RadioGroupField key={dir} label={`Direction: ${dir}`} description="Help text" direction={dir} defaultValue="a">
          {['a', 'b', 'c'].map((v) => (
            <RadioButton key={v} value={v} label="Radio" size="md" variant={dir === 'vertical' ? 'standalone' : 'button'} />
          ))}
        </RadioGroupField>
      ))}
    </div>
  ),
}
