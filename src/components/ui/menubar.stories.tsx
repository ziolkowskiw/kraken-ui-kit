import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarGroup,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from './menubar'

type StoryProps = {
  showShortcuts: boolean
  showSubmenu: boolean
  destructiveItem: boolean
}

const meta: Meta<StoryProps> = {
  title: 'Components/Menubar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    showShortcuts: { control: 'boolean', name: 'Shortcut hints', table: { category: 'Content' } },
    showSubmenu: { control: 'boolean', name: 'Submenu (File ▸ Share)', table: { category: 'Content' } },
    destructiveItem: { control: 'boolean', name: 'Destructive item', table: { category: 'Content' } },
  },
  args: {
    showShortcuts: true,
    showSubmenu: true,
    destructiveItem: true,
  },
  render: ({ showShortcuts, showSubmenu, destructiveItem }) => {
    const [showStatusBar, setShowStatusBar] = React.useState(true)
    const [showActivityBar, setShowActivityBar] = React.useState(false)
    const [profile, setProfile] = React.useState('benoit')

    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab {showShortcuts && <MenubarShortcut>⌘T</MenubarShortcut>}
            </MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            {showSubmenu && (
              <>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Share</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Email link</MenubarItem>
                    <MenubarItem>Messages</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </>
            )}
            {destructiveItem && (
              <>
                <MenubarSeparator />
                <MenubarItem variant="destructive">
                  Print {showShortcuts && <MenubarShortcut>⌘P</MenubarShortcut>}
                </MenubarItem>
              </>
            )}
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarLabel>History</MenubarLabel>
              <MenubarItem>
                Undo {showShortcuts && <MenubarShortcut>⌘Z</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem>
                Redo {showShortcuts && <MenubarShortcut>⇧⌘Z</MenubarShortcut>}
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
              Status Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={showActivityBar} onCheckedChange={setShowActivityBar}>
              Activity Bar
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel inset>People</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value={profile} onValueChange={setProfile}>
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Minimal: Story = {
  args: { showShortcuts: false, showSubmenu: false, destructiveItem: false },
}
