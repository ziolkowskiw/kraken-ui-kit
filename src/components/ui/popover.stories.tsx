import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
} from './popover'
import { Button } from './button'
import { InputField } from './input'

type PopoverStoryArgs = {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

const meta = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  args: { side: 'bottom', align: 'center' },
} satisfies Meta<PopoverStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args: PopoverStoryArgs) => (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary">Open popover</Button>} />
      <PopoverContent side={args.side} align={args.align}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <PopoverTitle className="[color:var(--ds-color-content-primary)] [font-size:var(--ds-typography-labellg-fontsize)] font-medium">
              Dimensions
            </PopoverTitle>
            <PopoverDescription className="[color:var(--ds-color-content-secondary)] [font-size:var(--ds-typography-bodysm-fontsize)]">
              Set the dimensions for the layer.
            </PopoverDescription>
          </div>
          <InputField label="Width" defaultValue="100%" size="sm" />
          <InputField label="Height" defaultValue="25px" size="sm" />
        </div>
      </PopoverContent>
    </Popover>
  ),
}
