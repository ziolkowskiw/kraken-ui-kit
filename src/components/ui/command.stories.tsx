import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { Calendar, Smile, Calculator, User, CreditCard, Settings } from 'lucide-react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandShortcut,
} from './command'

type Cmd = { label: string; icon: typeof Calendar; shortcut?: string }

const commands: Cmd[] = [
  { label: 'Calendar', icon: Calendar, shortcut: '⌘C' },
  { label: 'Search Emoji', icon: Smile },
  { label: 'Calculator', icon: Calculator },
  { label: 'Profile', icon: User, shortcut: '⌘P' },
  { label: 'Billing', icon: CreditCard, shortcut: '⌘B' },
  { label: 'Settings', icon: Settings, shortcut: '⌘S' },
]

const groups: { value: string; items: Cmd[] }[] = [
  {
    value: 'Suggestions',
    items: [
      { label: 'Calendar', icon: Calendar, shortcut: '⌘C' },
      { label: 'Search Emoji', icon: Smile },
      { label: 'Calculator', icon: Calculator },
    ],
  },
  {
    value: 'Settings',
    items: [
      { label: 'Profile', icon: User, shortcut: '⌘P' },
      { label: 'Billing', icon: CreditCard, shortcut: '⌘B' },
      { label: 'Settings', icon: Settings, shortcut: '⌘S' },
    ],
  },
]

function renderItem(cmd: Cmd) {
  const Icon = cmd.icon
  return (
    <CommandItem key={cmd.label} value={cmd.label}>
      <Icon className="size-4" />
      <span>{cmd.label}</span>
      {cmd.shortcut && <CommandShortcut>{cmd.shortcut}</CommandShortcut>}
    </CommandItem>
  )
}

type StoryProps = {
  placeholder: string
  emptyText: string
}

const meta: Meta<StoryProps> = {
  title: 'Components/Command',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', name: 'Input placeholder', table: { category: 'Nested: Input' } },
    emptyText: { control: 'text', name: 'Empty state', table: { category: 'Content' } },
  },
  args: {
    placeholder: 'Type a command or search…',
    emptyText: 'No results found.',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Flat command palette: input, empty state, and a single ungrouped list.
export const Playground: Story = {
  render: ({ placeholder, emptyText }) => (
    <Command items={commands.map((c) => c.label)} className="w-80">
      <CommandInput placeholder={placeholder} />
      <CommandEmpty>{emptyText}</CommandEmpty>
      <CommandList>
        {(label: string) => renderItem(commands.find((c) => c.label === label)!)}
      </CommandList>
    </Command>
  ),
}

// Grouped command palette: labelled groups, items, and ⌘-key shortcut hints —
// mirrors the Command/Input/List/Empty/Group/Item/Shortcut surface 1:1.
export const Grouped: Story = {
  render: () => (
    <Command items={groups} className="w-80">
      <CommandInput placeholder="Type a command or search…" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(group: { value: string; items: Cmd[] }) => (
          <CommandGroup key={group.value} items={group.items}>
            <CommandGroupLabel>{group.value}</CommandGroupLabel>
            <Autocomplete.Collection>
              {(cmd: Cmd) => renderItem(cmd)}
            </Autocomplete.Collection>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  ),
}
