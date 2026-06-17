import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react'
import { ButtonGroup } from './button-group'
import { Button } from './button'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  args: { orientation: 'horizontal' },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">One</Button>
      <Button variant="secondary">Two</Button>
      <Button variant="secondary">Three</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const IconToolbar: Story = {
  render: () => (
    <div className="flex gap-4">
      <ButtonGroup>
        <Button variant="secondary" size="sm" iconOnly aria-label="Bold"><Bold /></Button>
        <Button variant="secondary" size="sm" iconOnly aria-label="Italic"><Italic /></Button>
        <Button variant="secondary" size="sm" iconOnly aria-label="Underline"><Underline /></Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary" size="sm" iconOnly aria-label="Align left"><AlignLeft /></Button>
        <Button variant="secondary" size="sm" iconOnly aria-label="Align center"><AlignCenter /></Button>
        <Button variant="secondary" size="sm" iconOnly aria-label="Align right"><AlignRight /></Button>
      </ButtonGroup>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}
