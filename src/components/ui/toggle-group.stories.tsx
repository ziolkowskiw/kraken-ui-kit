import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    skin: { control: 'inline-radio', options: ['outlined', 'ghost'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
  },
  args: { skin: 'outlined', size: 'md', orientation: 'horizontal' },
  render: (args) => (
    <ToggleGroup {...args} defaultValue={['left']}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const IconButtons: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup defaultValue={['bold']}>
        <ToggleGroupItem value="bold" iconOnly aria-label="Bold"><Bold /></ToggleGroupItem>
        <ToggleGroupItem value="italic" iconOnly aria-label="Italic"><Italic /></ToggleGroupItem>
        <ToggleGroupItem value="underline" iconOnly aria-label="Underline"><Underline /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup skin="ghost" defaultValue={['justify']}>
        <ToggleGroupItem value="align-left" iconOnly aria-label="Align left"><AlignLeft /></ToggleGroupItem>
        <ToggleGroupItem value="align-center" iconOnly aria-label="Align center"><AlignCenter /></ToggleGroupItem>
        <ToggleGroupItem value="align-right" iconOnly aria-label="Align right"><AlignRight /></ToggleGroupItem>
        <ToggleGroupItem value="justify" iconOnly aria-label="Justify"><AlignJustify /></ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}
