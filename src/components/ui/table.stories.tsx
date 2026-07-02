import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableZebra,
} from './table'
import { Badge } from './badge'

const rows = [
  { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
]

const meta = {
  title: 'Components/Table',
  // docs-only association; the playground args are story-level props
  component: Table as React.ComponentType<{ zebra?: boolean }>,
  parameters: { layout: 'padded', docs: { description: { component: 'A responsive table component; display rows/columns of data.' } } },
  tags: ['autodocs'],
  argTypes: {
    zebra: { control: 'boolean', name: 'Zebra (even/odd parity)' },
  },
  args: { zebra: true },
  render: ({ zebra }: { zebra?: boolean }) => (
    <Table className="w-[560px]">
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className={zebra ? tableZebra : undefined}>
        {rows.map((r) => (
          <TableRow key={r.invoice}>
            <TableCell className="font-medium">{r.invoice}</TableCell>
            <TableCell>
              <Badge
                color={r.status === 'Paid' ? 'green' : r.status === 'Pending' ? 'amber' : 'red'}
                appearance="outlined"
                size="sm"
              >
                {r.status}
              </Badge>
            </TableCell>
            <TableCell>{r.method}</TableCell>
            <TableCell className="text-right">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$1,200.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
} satisfies Meta<{ zebra?: boolean }>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const NoZebra: Story = { args: { zebra: false } }
