import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons } from 'lucide-react'
import { DataTableCell, type CellType } from './data-table-cell'

const TYPES: CellType[] = [
  'text',
  'text 2 rows',
  'link',
  'diff',
  'icon + text',
  'icon only',
  'checkbox',
  'badge',
  'file',
  'action text',
  'actions icon',
  'action overflow',
  'input',
]
const ALIGNMENTS = ['left', 'right'] as const
const BADGE_COLORS = ['neutral', 'brand', 'green', 'red', 'orange', 'amber', 'blue', 'purple'] as const

type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : undefined
}

type StoryProps = React.ComponentProps<typeof DataTableCell> & {
  iconName?: IconName
}

const meta = {
  title: 'Components/DataTable/Cell',
  component: DataTableCell,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: TYPES, name: 'Type', table: { category: 'Content' } },
    alignment: { control: 'inline-radio', options: ALIGNMENTS, name: 'Alignment', table: { category: 'Content' } },
    value: { control: 'text', name: 'Value', table: { category: 'Content' } },
    oldValue: { control: 'text', name: 'Old value (diff)', table: { category: 'Content' }, if: { arg: 'type', eq: 'diff' } },
    secondValue: { control: 'text', name: '2nd row value', table: { category: 'Content' }, if: { arg: 'type', eq: 'text 2 rows' } },
    showLeftDecoration: { control: 'boolean', name: 'show left decoration', table: { category: 'Content' } },
    showRightDecoration: { control: 'boolean', name: 'show right decoration', table: { category: 'Content' } },
    iconName: { control: 'select', options: ICON_OPTIONS, name: 'Icon', table: { category: 'Content' } },
    badgeColor: { control: 'select', options: BADGE_COLORS, name: 'Badge colour', table: { category: 'Nested: Badge' }, if: { arg: 'type', eq: 'badge' } },
    badgeLabel: { control: 'text', name: 'Badge label', table: { category: 'Nested: Badge' }, if: { arg: 'type', eq: 'badge' } },
    fileName: { control: 'text', name: 'File name', table: { category: 'Nested: File' }, if: { arg: 'type', eq: 'file' } },
    actionLabel: { control: 'text', name: 'Action label', table: { category: 'Nested: Action' } },
    icon: { table: { disable: true } },
    leftDecoration: { table: { disable: true } },
    rightDecoration: { table: { disable: true } },
    input: { table: { disable: true } },
  },
  args: {
    type: 'text',
    alignment: 'left',
    value: 'Value',
    oldValue: 'Old value',
    secondValue: 'Value',
    showLeftDecoration: false,
    showRightDecoration: false,
    iconName: 'none',
    badgeColor: 'brand',
    badgeLabel: 'Status label',
    fileName: 'filename.pdf',
    actionLabel: 'Action verb',
  },
  render: ({ iconName, ...args }: StoryProps) => (
    <div role="table" className="w-[260px] border border-dashed border-border">
      <div role="row">
        <DataTableCell {...args} icon={renderIcon(iconName)} />
      </div>
    </div>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllTypes: Story = {
  render: () => (
    <div role="table" className="flex w-[280px] flex-col divide-y divide-border border border-border">
      {TYPES.map((t) => (
        <div key={t} role="row" className="flex items-center">
          <span role="cell" className="w-28 shrink-0 px-2 text-xs text-muted-foreground">{t}</span>
          <DataTableCell type={t} />
        </div>
      ))}
    </div>
  ),
}

export const RightAligned: Story = {
  args: { alignment: 'right', showRightDecoration: true },
}
