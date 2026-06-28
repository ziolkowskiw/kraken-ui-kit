import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { DataTable, TableRow, TableTitle } from './data-table'
import { TableHeader, TableHeaderRow, TableHeaderDecoration } from './data-table-header'
import { DataTableCell } from './data-table-cell'

const TITLE_VARIANTS = ['title', 'section'] as const

type StoryProps = React.ComponentProps<typeof TableTitle>

const meta = {
  title: 'Components/DataTable/Title',
  component: TableTitle,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: TITLE_VARIANTS, name: 'Variant' },
    title: { control: 'text', name: 'Title' },
    showTooltip: { control: 'boolean', name: 'Show info tooltip' },
    showAction: { control: 'boolean', name: 'Show action' },
    tooltip: { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    variant: 'title',
    title: 'Table title',
    showTooltip: true,
    showAction: true,
  },
  render: (args: StoryProps) => (
    <div className="w-[900px]">
      <TableTitle {...args} />
    </div>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SectionTitle: Story = { args: { variant: 'section', title: 'Section title' } }

// ─── Full assembled data table ────────────────────────────────────────────────

const COLS = ['col-checkbox', 'name', 'status', 'amount', 'actions'] as const

export const FullTable: Story = {
  parameters: {
    a11y: { config: { rules: [
      { id: 'aria-required-children', enabled: false },
      { id: 'color-contrast', enabled: false },
    ]}},
  },
  render: () => (
    <div className="w-[900px]">
      <DataTable>
        <TableTitle title="Invoices" />

        <TableHeaderRow>
          <TableHeader
            className="max-w-12"
            showLabel={false}
            leftDecoration={<TableHeaderDecoration type="checkbox" />}
          />
          <TableHeader label="Name" />
          <TableHeader label="Status" />
          <TableHeader
            label="Amount"
            alignment="right"
            selected
            rightDecoration={<TableHeaderDecoration type="sortable" sort="descending" />}
          />
          <TableHeader label="Date" rightDecoration={<TableHeaderDecoration type="tooltip" />} />
        </TableHeaderRow>

        {[
          { variant: 'white', checked: true, name: 'Acme Corp', amount: '$1,200.00' },
          { variant: 'grey', name: 'Globex', amount: '$840.00' },
          { variant: 'selected', checked: true, name: 'Initech', amount: '$2,310.00' },
          { variant: 'white', name: 'Umbrella', amount: '$95.00' },
        ].map((row, i) => (
          <TableRow key={i} variant={row.variant as 'white' | 'grey' | 'selected'} interactive>
            <DataTableCell className="max-w-12" type="checkbox" checked={row.checked} />
            <DataTableCell type="text" value={row.name} />
            <DataTableCell type="badge" badgeColor={i % 2 ? 'green' : 'brand'} badgeLabel={i % 2 ? 'Paid' : 'Pending'} />
            <DataTableCell type="text" value={row.amount} alignment="right" />
            <DataTableCell type="actions icon" />
          </TableRow>
        ))}

        <TableTitle variant="section" title="Archived" showAction={false} />

        <TableRow variant="white" interactive>
          <DataTableCell className="max-w-12" type="checkbox" />
          <DataTableCell type="link" value="Old invoice" />
          <DataTableCell type="badge" badgeColor="neutral" badgeLabel="Closed" />
          <DataTableCell type="diff" oldValue="$500.00" value="$0.00" alignment="right" />
          <DataTableCell type="action overflow" />
        </TableRow>
      </DataTable>
    </div>
  ),
}
