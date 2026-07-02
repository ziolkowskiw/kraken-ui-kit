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

type StoryArgs = {
  label?: string
  placeholder?: string
  description?: string
  errorMessage?: string
  size?: 'sm' | 'md' | 'lg'
  mandatory?: boolean
}

const meta = {
  title: 'Components/Combobox',
  component: ComboboxField,
  parameters: { layout: 'padded', docs: { description: { component: 'Autocomplete input with a list of suggestions (popover + command); searchable single-select over many options.' } } },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text', name: 'Help text' },
    errorMessage: { control: 'text' },
    mandatory: { control: 'boolean' },
  },
  args: {
    label: 'Favourite fruit',
    placeholder: 'Search fruit…',
    description: 'Start typing to filter.',
    size: 'md',
    mandatory: false,
  },
  render: (args: StoryArgs) => (
    <div className="w-72">
      <ComboboxField {...args} items={fruits}>
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

export const ErrorState: Story = {
  args: { errorMessage: 'Please pick a fruit.' },
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
