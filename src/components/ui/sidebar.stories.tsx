import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Home, Inbox, Calendar, Search, Settings, ChevronRight } from 'lucide-react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './sidebar'

const items = [
  { title: 'Home', icon: Home, active: true },
  { title: 'Inbox', icon: Inbox },
  { title: 'Calendar', icon: Calendar },
  { title: 'Search', icon: Search },
  { title: 'Settings', icon: Settings },
]

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    collapsed: { control: 'boolean' },
  },
  args: { collapsed: false },
  render: (args) => (
    <div className="flex h-96">
      <Sidebar {...args}>
        <SidebarHeader>
          <div className="flex size-8 items-center justify-center rounded-md [background-color:var(--ds-color-primary)] [color:var(--ds-color-primary-foreground)] font-semibold">
            K
          </div>
          {!args.collapsed && <span className="font-medium">Kraken</span>}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.active}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton>
            <ChevronRight />
            <span>Account</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 p-6 text-sm [color:var(--ds-color-content-secondary)]">Main content area</div>
    </div>
  ),
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Collapsed: Story = { args: { collapsed: true } }
