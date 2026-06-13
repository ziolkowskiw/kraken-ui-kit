import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Terminal } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from './alert'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive'] },
  },
  args: { variant: 'default' },
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Destructive: Story = { args: { variant: 'destructive' } }
