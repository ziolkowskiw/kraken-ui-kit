import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './navigation-menu'

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-80 gap-1">
              <NavigationMenuLink href="#">
                <span className="font-medium">Introduction</span>
                <span className="[color:var(--ds-color-content-secondary)]">Re-usable components built with Base UI and tokens.</span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium">Installation</span>
                <span className="[color:var(--ds-color-content-secondary)]">How to install dependencies and structure your app.</span>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-96 grid-cols-2 gap-1">
              {['Alert', 'Badge', 'Button', 'Card', 'Dialog', 'Tabs'].map((c) => (
                <NavigationMenuLink key={c} href="#">
                  <span className="font-medium">{c}</span>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
