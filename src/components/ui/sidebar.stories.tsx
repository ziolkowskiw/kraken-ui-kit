import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Home, Inbox, Calendar, Search, Settings, ChevronRight } from 'lucide-react'
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarSeparator,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuSub,
  SidebarMenuBadge,
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

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen', docs: { description: { component: 'A composable, themeable sidebar component; primary app navigation.' } } },
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

/* The app-shell composition: SidebarProvider owns the collapsed state
 * (toggle via SidebarTrigger, the rail, or ⌘/Ctrl+B); SidebarInset is the
 * content column. */
export const AppShell: Story = {
  render: () => (
    <SidebarProvider className="h-96 min-h-0 overflow-hidden rounded-lg border [border-color:var(--ds-color-border)]">
      <Sidebar className="h-auto">
        <SidebarHeader>
          <div className="flex size-8 items-center justify-center rounded-md font-semibold [background-color:var(--ds-sidebar-primary)] [color:var(--ds-sidebar-primaryforeground)]">
            K
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>12</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Inbox />
                    <span>Projects</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#">Design system</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#" isActive>
                        Kraken UI
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-0">
        <header className="flex h-12 items-center gap-2 border-b px-4 [border-color:var(--ds-color-border)]">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <div className="p-6 text-sm [color:var(--ds-color-content-secondary)]">
          Toggle the sidebar with the trigger, the rail on the sidebar edge, or ⌘/Ctrl+B.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
}
