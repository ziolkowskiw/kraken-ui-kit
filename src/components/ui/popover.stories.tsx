import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { X } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverTitle,
  PopoverDescription,
} from './popover'
import { Button } from './button'
import { InputField } from './input'
import { BUTTON_VARIANTS, type ButtonVariant } from '@/lib/story-helpers'

type StoryProps = {
  triggerLabel: string
  triggerVariant: ButtonVariant
  title: string
  description: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

const meta: Meta<StoryProps> = {
  title: 'Components/Popover',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    triggerLabel: { control: 'text', name: 'Label', table: { category: 'Nested: Trigger' } },
    triggerVariant: { control: 'select', options: BUTTON_VARIANTS, name: 'Variant', table: { category: 'Nested: Trigger' } },
    title: { control: 'text', name: 'Title', table: { category: 'Content' } },
    description: { control: 'text', name: 'Description', table: { category: 'Content' } },
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'], table: { category: 'Position' } },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'], table: { category: 'Position' } },
  },
  args: {
    triggerLabel: 'Open popover',
    triggerVariant: 'secondary',
    title: 'Dimensions',
    description: 'Set the dimensions for the layer.',
    side: 'bottom',
    align: 'center',
  },
  render: ({ triggerLabel, triggerVariant, title, description, side, align }) => (
    <Popover>
      <PopoverTrigger render={<Button variant={triggerVariant}>{triggerLabel}</Button>} />
      <PopoverContent side={side} align={align}>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <PopoverTitle className="[color:var(--ds-color-content-primary)] [font-size:var(--ds-typography-labellg-fontsize)] font-medium">
                {title}
              </PopoverTitle>
              <PopoverDescription className="[color:var(--ds-color-content-secondary)] [font-size:var(--ds-typography-bodysm-fontsize)]">
                {description}
              </PopoverDescription>
            </div>
            <PopoverClose
              render={
                <Button variant="ghost" size="sm" iconOnly aria-label="Close" leftIcon={<X />} />
              }
            />
          </div>
          <InputField label="Width" defaultValue="100%" size="sm" />
          <InputField label="Height" defaultValue="25px" size="sm" />
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
