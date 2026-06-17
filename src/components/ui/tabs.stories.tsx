import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const VARIANTS = ['line', 'badge'] as const
const ORIENTATIONS = ['horizontal', 'vertical'] as const
const DEPTHS = [1, 2] as const

// `variant`/`depth` live on TabsList and `orientation` on Tabs, so the Playground
// drives them through story-only args plus a dynamic tab count — the controls
// behave like a real tabs API rather than a fixed snapshot.
type StoryProps = {
  variant: (typeof VARIANTS)[number]
  depth: (typeof DEPTHS)[number]
  orientation: (typeof ORIENTATIONS)[number]
  tabCount: number
  disableLast: boolean
}

const TAB_LABELS = ['Account', 'Password', 'Settings', 'Billing', 'Team', 'Advanced']

function renderTabs({ variant, depth, orientation, tabCount, disableLast }: StoryProps) {
  const count = Math.max(2, Math.min(tabCount, TAB_LABELS.length))
  const labels = TAB_LABELS.slice(0, count)
  const pad = orientation === 'vertical' ? 'pl-3' : 'pt-3'
  return (
    <Tabs orientation={orientation} defaultValue={labels[0]} className="w-80">
      <TabsList variant={variant} depth={depth}>
        {labels.map((label, i) => (
          <TabsTrigger key={label} value={label} disabled={disableLast && i === count - 1}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {labels.map((label) => (
        <TabsContent key={label} value={label} className={`text-sm ${pad}`}>
          {label} panel content.
        </TabsContent>
      ))}
    </Tabs>
  )
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS, name: 'Variant', table: { category: 'Appearance' } },
    depth: { control: 'inline-radio', options: DEPTHS, name: 'Depth', table: { category: 'Appearance' } },
    orientation: { control: 'inline-radio', options: ORIENTATIONS, name: 'Orientation', table: { category: 'Appearance' } },
    tabCount: { control: { type: 'range', min: 2, max: TAB_LABELS.length, step: 1 }, name: 'Number of tabs', table: { category: 'Content' } },
    disableLast: { control: 'boolean', name: 'Disable last tab', table: { category: 'Content' } },
  },
  args: {
    variant: 'line',
    depth: 1,
    orientation: 'horizontal',
    tabCount: 3,
    disableLast: false,
  },
  render: (args: StoryProps) => renderTabs(args),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Line: Story = { args: { variant: 'line' } }

export const Badge: Story = { args: { variant: 'badge' } }

export const Depth2: Story = { args: { variant: 'line', depth: 2 } }

export const Vertical: Story = { args: { orientation: 'vertical' } }

export const WithDisabledTab: Story = { args: { disableLast: true } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-80">
      {VARIANTS.map((v) => (
        <div key={v}>
          <p className="text-xs text-muted-foreground mb-2 capitalize">variant: {v}</p>
          <Tabs defaultValue="tab-1">
            <TabsList variant={v}>
              <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab-3">Tab 3</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ))}
    </div>
  ),
}
