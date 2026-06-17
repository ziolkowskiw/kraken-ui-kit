import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Calendar, Smile, Calculator, User, CreditCard, Settings } from 'lucide-react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandShortcut,
} from './command'

const commands = [
  { label: 'Calendar', icon: Calendar, shortcut: '⌘C' },
  { label: 'Search Emoji', icon: Smile },
  { label: 'Calculator', icon: Calculator },
  { label: 'Profile', icon: User, shortcut: '⌘P' },
  { label: 'Billing', icon: CreditCard, shortcut: '⌘B' },
  { label: 'Settings', icon: Settings, shortcut: '⌘S' },
]

const meta = {
  title: 'Components/Command',
  component: Command,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Command items={commands.map((c) => c.label)} className="w-80">
      <CommandInput placeholder="Type a command or search…" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(label: string) => {
          const cmd = commands.find((c) => c.label === label)!
          const Icon = cmd.icon
          return (
            <CommandItem key={label} value={label}>
              <Icon className="size-4" />
              <span>{label}</span>
              {cmd.shortcut && <CommandShortcut>{cmd.shortcut}</CommandShortcut>}
            </CommandItem>
          )
        }}
      </CommandList>
    </Command>
  ),
}
