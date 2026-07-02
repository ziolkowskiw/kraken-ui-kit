import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './navigation-menu'
import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu'

const ALL_COMPONENTS = ['Alert', 'Badge', 'Button', 'Card', 'Dialog', 'Tabs', 'Select', 'Tooltip']

type StoryProps = {
  startLabel: string
  componentsLabel: string
  linkLabel: string
  componentCount: number
}

const meta: Meta<StoryProps> = {
  title: 'Components/NavigationMenu',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    startLabel: { control: 'text', name: 'Menu 1 label', table: { category: 'Nested: Triggers' } },
    componentsLabel: { control: 'text', name: 'Menu 2 label', table: { category: 'Nested: Triggers' } },
    linkLabel: { control: 'text', name: 'Plain link label', table: { category: 'Nested: Triggers' } },
    componentCount: { control: { type: 'range', min: 2, max: 8, step: 1 }, name: 'Component links', table: { category: 'Content' } },
  },
  args: {
    startLabel: 'Getting started',
    componentsLabel: 'Components',
    linkLabel: 'Documentation',
    componentCount: 6,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default usage: `NavigationMenu` renders the shared floating `NavigationMenuViewport`
// (which itself mounts the `NavigationMenuIndicator` arrow) internally. Triggers reveal
// rich panels; the last item is a plain link rendered with the trigger style.
export const Playground: Story = {
  render: ({ startLabel, componentsLabel, linkLabel, componentCount }) => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{startLabel}</NavigationMenuTrigger>
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
          <NavigationMenuTrigger>{componentsLabel}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-96 grid-cols-2 gap-1">
              {ALL_COMPONENTS.slice(0, componentCount).map((c) => (
                <NavigationMenuLink key={c} href="#">
                  <span className="font-medium">{c}</span>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            {linkLabel}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

// Explicit composition: opt out of the `NavigationMenu` convenience wrapper and mount
// the standalone `NavigationMenuViewport` (the shared floating panel, including the
// `NavigationMenuIndicator` arrow) directly inside a raw Root. Same single-panel
// behaviour, just the granular form the Figma/shadcn surface exposes.
export const ExplicitViewport: Story = {
  render: () => (
    <NavigationMenuPrimitive.Root className="relative flex max-w-max flex-1 items-center justify-center">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-80 gap-1">
              <NavigationMenuLink href="#">
                <span className="font-medium">Overview</span>
                <span className="[color:var(--ds-color-content-secondary)]">Everything in one place.</span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium">Pricing</span>
                <span className="[color:var(--ds-color-content-secondary)]">Plans for every team size.</span>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Changelog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  ),
}
