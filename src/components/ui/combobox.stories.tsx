import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Combobox,
  ComboboxValue,
  ComboboxField,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
} from './combobox'

const fruits = [
  'Apple',
  'Banana',
  'Blueberry',
  'Grapes',
  'Mango',
  'Orange',
  'Pineapple',
  'Strawberry',
  'Watermelon',
]

const STATES = ['rest', 'error', 'disabled'] as const

type StoryArgs = {
  state: (typeof STATES)[number]
  label?: string
  value?: string
  placeholder?: string
  description?: string
  errorMessage?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showDescription?: boolean
  mandatory?: boolean
  hasTooltip?: boolean
  tooltipText?: string
}

const meta = {
  title: 'Components/Combobox',
  component: ComboboxField,
  parameters: { layout: 'centered', docs: { description: { component: 'Autocomplete input with a list of suggestions (popover + command); searchable single-select over many options.' } } },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: STATES, name: 'State' },
    size: { control: 'select', options: ['sm', 'md', 'lg'], name: 'Size' },
    label: { control: 'text', name: 'Label' },
    value: { control: 'select', options: ['none', ...fruits], name: 'Value' },
    description: { control: 'text', name: 'Description' },
    errorMessage: { control: 'text', name: 'Error message' },
    placeholder: { control: 'text', name: 'Placeholder' },
    showLabel: { control: 'boolean', name: 'Show label' },
    showDescription: { control: 'boolean', name: 'Show description' },
    mandatory: { control: 'boolean', name: 'Mandatory field' },
    hasTooltip: { control: 'boolean', name: 'Show info tooltip', table: { category: 'Nested: Tooltip' } },
    tooltipText: { control: 'text', name: 'Tooltip content', table: { category: 'Nested: Tooltip' }, if: { arg: 'hasTooltip' } },
  },
  args: {
    state: 'rest',
    size: 'md',
    label: 'Label',
    value: 'none',
    description: 'Help text',
    errorMessage: 'Error message',
    placeholder: 'Placeholder',
    showLabel: true,
    showDescription: true,
    mandatory: false,
    hasTooltip: true,
    tooltipText: 'Extra context for this field.',
  },
  render: ({ state, value, label, description, errorMessage, showLabel, showDescription, hasTooltip, tooltipText, ...args }: StoryArgs) => (
    <div className="w-72">
      <ComboboxField
        // Remount when Value changes so the uncontrolled combobox picks it up.
        key={value}
        {...args}
        defaultValue={value === 'none' ? undefined : value}
        label={showLabel ? label : undefined}
        description={showDescription ? description : undefined}
        tooltip={showLabel && hasTooltip ? tooltipText : undefined}
        errorMessage={state === 'error' ? errorMessage : undefined}
        disabled={state === 'disabled'}
        items={fruits}
      >
        <ComboboxContent>
          <ComboboxEmpty>No fruit found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </ComboboxField>
    </div>
  ),
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Filled: Story = {
  args: { value: 'Banana' },
}

export const ErrorState: Story = {
  args: { state: 'error', value: 'Banana' },
}

export const Disabled: Story = {
  args: { state: 'disabled', value: 'Banana' },
}

/* Multi-select: selected values render as removable chips (--ds-chip-* tokens)
 * inside the input row. */
export const Multiple: Story = {
  render: () => (
    <div className="w-96">
      <Combobox multiple items={fruits} defaultValue={['Apple', 'Banana']}>
        <ComboboxChips>
          <ComboboxValue>
            {(value: string[]) =>
              value.map((v) => (
                <ComboboxChip key={v} aria-label={v}>
                  {v}
                </ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxChipsInput placeholder="Add fruit…" />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>No fruit found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
}
