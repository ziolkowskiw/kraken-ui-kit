import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Kbd, KbdGroup } from './kbd'

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  parameters: { layout: 'centered', docs: { description: { component: 'Keyboard shortcut display.' } } },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', name: 'Label' },
  },
  args: { children: '⌘' },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Chord: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
}

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>C</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⇧</Kbd>
        <span>+</span>
        <Kbd>⌘</Kbd>
        <span>+</span>
        <Kbd>P</Kbd>
      </KbdGroup>
      <Kbd>Esc</Kbd>
    </div>
  ),
}
