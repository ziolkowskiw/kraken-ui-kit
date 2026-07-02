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

type StoryProps = {
  collapsed: boolean
  showHeader: boolean
  showFooter: boolean
  groupLabel: string
  itemCount: number
}

const meta: Meta<StoryProps> = {
  title: 'Components/Sidebar',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    collapsed: { control: 'boolean', name: 'Collapsed', table: { category: 'Layout' } },
    showHeader: { control: 'boolean', name: 'Header', table: { category: 'Slots' } },
    showFooter: { control: 'boolean', name: 'Footer', table: { category: 'Slots' } },
    groupLabel: { control: 'text', name: 'Group label', table: { category: 'Content' } },
    itemCount: { control: { type: 'range', min: 1, max: 5, step: 1 }, name: 'Menu items', table: { category: 'Content' } },
  },
  args: { collapsed: false, showHeader: true, showFooter: true, groupLabel: 'Platform', itemCount: 5 },
  render: ({ collapsed, showHeader, showFooter, groupLabel, itemCount }) => (
    <div className="flex h-96">
      <Sidebar collapsed={collapsed}>
        {showHeader && (
          <SidebarHeader>
            <div className="flex size-8 items-center justify-center rounded-md [background-color:var(--ds-sidebar-primary)] [color:var(--ds-sidebar-primaryforeground)] font-semibold">
              K
            </div>
            {!collapsed && <span className="font-medium">Kraken</span>}
          </SidebarHeader>
        )}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            <SidebarMenu>
              {items.slice(0, itemCount).map((item) => (
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
        {showFooter && (
          <SidebarFooter>
            <SidebarMenuButton>
              <ChevronRight />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarFooter>
        )}
      </Sidebar>
      <div className="flex-1 p-6 text-sm [color:var(--ds-color-content-secondary)]">Main content area</div>
    </div>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Collapsed: Story = { args: { collapsed: true } }

export const WithSubItems: Story = {
  render: () => (
    <div className="flex h-96">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Inbox />
                  <span>Inbox</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton sub>
                  <span>All mail</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton sub>
                  <span>Drafts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 p-6 text-sm [color:var(--ds-color-content-secondary)]">Main content area</div>
    </div>
  ),
}
