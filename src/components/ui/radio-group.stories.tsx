import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RadioGroupField, RadioGroupItem } from './radio-group'

const DIRECTIONS = ['vertical', 'horizontal'] as const
const STATES = ['default', 'error'] as const

type RGFieldStoryProps = React.ComponentProps<typeof RadioGroupField> & {
  state: 'default' | 'error'
  hasTooltip?: boolean
  tooltipText?: string
}

const meta: Meta<RGFieldStoryProps> = {
  title: 'Components/RadioGroup',
  component: RadioGroupField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: STATES, name: 'State' },
    direction: { control: 'select', options: DIRECTIONS, name: 'Direction' },
    label: { control: 'text', name: 'Label' },
    description: { control: 'text', name: 'Help text' },
    errorMessage: { control: 'text', name: 'Error message' },
    mandatory: { control: 'boolean', name: 'Mandatory field' },
    hasTooltip: { control: 'boolean', name: 'hasTooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
    tooltip: { table: { disable: true } },
    error: { table: { disable: true } },
  },
  args: {
    state: 'default',
    direction: 'vertical',
    label: 'Label',
    description: 'Help text',
    errorMessage: 'Error message',
    mandatory: false,
    hasTooltip: true,
    tooltipText: 'Extra context for this field.',
  },
  render: ({ state, errorMessage, hasTooltip, tooltipText, ...args }) => (
    <RadioGroupField
      {...args}
      tooltip={hasTooltip ? tooltipText : undefined}
      error={state === 'error'}
      errorMessage={state === 'error' ? errorMessage : undefined}
      defaultValue="option-a"
      className="w-64"
    >
      {['option-a', 'option-b', 'option-c'].map((v) => (
        <label key={v} className="flex items-center gap-2 text-sm capitalize">
          <RadioGroupItem value={v} error={state === 'error'} />
          {v.replace('-', ' ')}
        </label>
      ))}
    </RadioGroupField>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Default: Story = {}

export const Horizontal: Story = {
  args: { direction: 'horizontal' },
}

export const WithError: Story = {
  args: { state: 'error' },
}

export const Mandatory: Story = {
  args: { mandatory: true },
}

export const AllDirections: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-80">
      {DIRECTIONS.map((dir) => (
        <RadioGroupField
          key={dir}
          label={`Direction: ${dir}`}
          description="Help text"
          direction={dir}
          defaultValue="a"
        >
          {['a', 'b', 'c'].map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={v} />
              Option {v.toUpperCase()}
            </label>
          ))}
        </RadioGroupField>
      ))}
    </div>
  ),
}
