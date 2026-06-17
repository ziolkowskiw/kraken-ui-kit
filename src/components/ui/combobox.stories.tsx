import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  ComboboxField,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
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
  parameters: { layout: 'padded' },
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
