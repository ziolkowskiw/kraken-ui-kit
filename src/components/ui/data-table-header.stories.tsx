import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import {
  SortingIcons,
  TableHeaderDecoration,
  TableHeader,
  TableHeaderRow,
} from './data-table-header'

const ALIGNMENTS = ['left', 'right'] as const
const STATES = ['rest', 'selected'] as const
const DECORATIONS = ['none', 'icon', 'sortable', 'checkbox', 'tooltip', 'avatar'] as const
const SORTS = ['default', 'ascending', 'descending'] as const

type DecorationName = (typeof DECORATIONS)[number]
const renderDecoration = (
  name: DecorationName,
  sort: (typeof SORTS)[number]
): React.ReactNode =>
  name === 'none' ? undefined : (
    <TableHeaderDecoration type={name === 'icon' ? 'icon' : name} sort={sort} />
  )

type StoryProps = {
  label: string
  showLabel: boolean
  alignment: (typeof ALIGNMENTS)[number]
  selected: boolean
  showBorder: boolean
  empty: boolean
  leftDecoration: DecorationName
  rightDecoration: DecorationName
  sort: (typeof SORTS)[number]
}

const meta = {
  title: 'Components/DataTable/Header',
  component: TableHeader,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    showLabel: { control: 'boolean', name: 'showLabel', table: { category: 'Content' } },
    label: { control: 'text', name: 'Label', table: { category: 'Content' }, if: { arg: 'showLabel' } },
    empty: { control: 'boolean', name: 'Empty', table: { category: 'Content' } },
    alignment: { control: 'inline-radio', options: ALIGNMENTS, name: 'Alignment', table: { category: 'Layout' } },
    selected: { control: 'boolean', name: 'Selected (sorted column)', table: { category: 'State' } },
    showBorder: { control: 'boolean', name: 'Show border', table: { category: 'Layout' } },
    leftDecoration: { control: 'select', options: DECORATIONS, name: 'Left decoration', table: { category: 'Decorations' } },
    rightDecoration: { control: 'select', options: DECORATIONS, name: 'Right decoration', table: { category: 'Decorations' } },
    sort: { control: 'inline-radio', options: SORTS, name: 'Sort direction', table: { category: 'Decorations' } },
  },
  args: {
    label: 'Table heading',
    showLabel: true,
    alignment: 'left',
    selected: false,
    showBorder: false,
    empty: false,
    leftDecoration: 'none',
    rightDecoration: 'none',
    sort: 'default',
  },
  render: ({ leftDecoration, rightDecoration, sort, ...args }: StoryProps) => (
    <div role="table" className="w-[240px]">
      <div role="row">
        <TableHeader
          {...args}
          leftDecoration={renderDecoration(leftDecoration, sort)}
          rightDecoration={renderDecoration(rightDecoration, sort)}
        />
      </div>
    </div>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sortable: Story = {
  args: { rightDecoration: 'sortable', sort: 'ascending', selected: true },
}

export const WithCheckbox: Story = {
  args: { leftDecoration: 'checkbox' },
}

export const States: Story = {
  render: () => (
    <div role="table" className="flex w-[240px] flex-col gap-2">
      {STATES.map((s) => (
        <div key={s} role="row">
          <TableHeader label={`State: ${s}`} selected={s === 'selected'} />
        </div>
      ))}
    </div>
  ),
}

export const SortingIconStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {SORTS.map((v) => (
        <div key={v} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <SortingIcons variant={v} />
          {v}
        </div>
      ))}
    </div>
  ),
}

export const HeaderRow: Story = {
  render: () => (
    <div role="table" className="w-[600px]">
      <TableHeaderRow>
        <TableHeader label="Name" leftDecoration={<TableHeaderDecoration type="checkbox" />} />
        <TableHeader label="Status" />
        <TableHeader label="Amount" alignment="right" rightDecoration={<TableHeaderDecoration type="sortable" sort="descending" />} selected />
        <TableHeader label="Date" rightDecoration={<TableHeaderDecoration type="tooltip" />} />
      </TableHeaderRow>
    </div>
  ),
}
