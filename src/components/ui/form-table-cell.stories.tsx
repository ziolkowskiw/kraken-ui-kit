import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormTableCell, type InputType } from './form-table-cell'

const INPUT_TYPES: InputType[] = [
  'text field',
  'select',
  'search',
  'date',
  'file uploader',
  'switch',
  'checkbox',
  'radio',
  'textarea',
]

const meta = {
  title: 'Components/DataTable/FormCell',
  component: FormTableCell,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    inputType: { control: 'select', options: INPUT_TYPES, name: 'Input type' },
    placeholder: { control: 'text', name: 'Placeholder' },
  },
  args: {
    inputType: 'text field',
    placeholder: 'Placeholder',
  },
  render: (args) => (
    <div className="w-[420px]">
      <FormTableCell {...args} />
    </div>
  ),
} satisfies Meta<typeof FormTableCell>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllInputTypes: Story = {
  render: () => (
    <div className="flex w-[460px] flex-col gap-4">
      {INPUT_TYPES.map((t) => (
        <div key={t} className="flex flex-col gap-1">
          <span className="px-2 text-xs text-muted-foreground">{t}</span>
          <FormTableCell inputType={t} />
        </div>
      ))}
    </div>
  ),
}
