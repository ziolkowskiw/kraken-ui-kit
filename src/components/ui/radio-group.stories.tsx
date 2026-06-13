import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  render: () => (
    <RadioGroup defaultValue="comfortable" className="flex flex-col gap-2">
      {['default', 'comfortable', 'compact'].map((v) => (
        <label key={v} className="flex items-center gap-2 text-sm capitalize">
          <RadioGroupItem value={v} />
          {v}
        </label>
      ))}
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
