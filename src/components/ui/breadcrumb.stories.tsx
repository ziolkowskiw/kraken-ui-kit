import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './breadcrumb'

// Industry-standard collapse model (MUI / Ant Design):
//   - itemCount            → total number of crumbs (incl. current page)
//   - maxItems             → collapse into an ellipsis once itemCount exceeds this
//   - itemsBeforeCollapse  → how many leading crumbs stay visible
//   - itemsAfterCollapse   → how many trailing crumbs stay visible (incl. current page)
//   - separator            → glyph rendered between crumbs
// The primitive components in breadcrumb.tsx mirror Figma 1:1; this story composes
// them dynamically so the controls panel behaves like a real breadcrumb API.

const SEPARATORS = ['chevron', 'slash'] as const
type Separator = (typeof SEPARATORS)[number]

// Realistic labels so the collapse behaviour reads clearly when sliding itemCount.
const LABEL_POOL = [
  'Home',
  'Products',
  'Electronics',
  'Computers',
  'Laptops',
  'Accessories',
  'Keyboards',
  'Mechanical',
  'Switches',
  'Details',
]

const renderSeparator = (separator: Separator) =>
  separator === 'slash' ? (
    <BreadcrumbSeparator>
      <span className="[font-size:var(--ds-typography-labelsm-fontsize)]">/</span>
    </BreadcrumbSeparator>
  ) : (
    <BreadcrumbSeparator />
  )

type StoryProps = {
  itemCount: number
  maxItems: number
  itemsBeforeCollapse: number
  itemsAfterCollapse: number
  separator: Separator
  currentPageLabel: string
}

type Crumb = { label: string; isCurrent: boolean }
type Node = Crumb | 'ellipsis'

function buildNodes({
  itemCount,
  maxItems,
  itemsBeforeCollapse,
  itemsAfterCollapse,
  currentPageLabel,
}: StoryProps): Node[] {
  const count = Math.max(1, Math.min(itemCount, LABEL_POOL.length))
  const crumbs: Crumb[] = Array.from({ length: count }, (_, i) => ({
    label: i === count - 1 ? currentPageLabel : LABEL_POOL[i],
    isCurrent: i === count - 1,
  }))

  const before = Math.max(0, itemsBeforeCollapse)
  const after = Math.max(1, itemsAfterCollapse)

  // Only collapse when over the threshold AND something would actually be hidden.
  const shouldCollapse = count > maxItems && before + after < count
  if (!shouldCollapse) return crumbs

  return [...crumbs.slice(0, before), 'ellipsis', ...crumbs.slice(count - after)]
}

function renderBreadcrumb(args: StoryProps) {
  const nodes = buildNodes(args)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {nodes.map((node, i) => {
          const isLastNode = i === nodes.length - 1
          return (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                {node === 'ellipsis' ? (
                  <BreadcrumbEllipsis />
                ) : node.isCurrent ? (
                  <BreadcrumbPage>{node.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="#">{node.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastNode && renderSeparator(args.separator)}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const meta = {
  title: 'Components/Breadcrumb',
  // No `component:` here — this meta uses a custom args type (StoryProps) whose
  // keys don't overlap Breadcrumb's DOM props, so setting `component` would make
  // the typed `render` unassignable. Matches the popover.stories.tsx pattern.
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    // ── Content ──
    itemCount: {
      control: { type: 'range', min: 1, max: LABEL_POOL.length, step: 1 },
      name: 'Number of items',
      table: { category: 'Content' },
    },
    currentPageLabel: {
      control: 'text',
      name: 'Current page label',
      table: { category: 'Content' },
    },
    separator: {
      control: 'inline-radio',
      options: SEPARATORS,
      name: 'Separator',
      table: { category: 'Content' },
    },
    // ── Collapse (ellipsis) ──
    maxItems: {
      control: { type: 'range', min: 1, max: LABEL_POOL.length, step: 1 },
      name: 'Collapse after (max items)',
      table: { category: 'Collapse' },
    },
    itemsBeforeCollapse: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      name: 'Items before ellipsis',
      table: { category: 'Collapse' },
    },
    itemsAfterCollapse: {
      control: { type: 'range', min: 1, max: 4, step: 1 },
      name: 'Items after ellipsis',
      table: { category: 'Collapse' },
    },
  },
  args: {
    // Defaults reproduce the Figma default: crumb · ellipsis · crumb · current
    itemCount: 4,
    maxItems: 3,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 2,
    separator: 'chevron',
    currentPageLabel: 'Action verb',
  },
  render: (args: StoryProps) => renderBreadcrumb(args),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" + real breadcrumb API experience.
export const Playground: Story = {}

// Few enough items that nothing collapses.
export const Expanded: Story = {
  args: { itemCount: 3, maxItems: 8 },
}

// Long path collapsed into a single ellipsis (1 leading, 2 trailing).
export const Collapsed: Story = {
  args: { itemCount: 7, maxItems: 4, itemsBeforeCollapse: 1, itemsAfterCollapse: 2 },
}

// Keep more context on each side of the ellipsis.
export const CollapsedWide: Story = {
  args: { itemCount: 8, maxItems: 5, itemsBeforeCollapse: 2, itemsAfterCollapse: 3 },
}

// Slash separator instead of the default chevron.
export const SlashSeparator: Story = {
  args: { itemCount: 4, maxItems: 8, separator: 'slash' },
}
