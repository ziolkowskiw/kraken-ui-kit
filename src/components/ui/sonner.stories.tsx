import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Toaster, toast } from './sonner'
import { Button } from './button'

const meta = {
  title: 'Components/Sonner',
  component: Toaster,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => toast.success('Changes saved', { description: 'Your profile has been updated.' })}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => toast.error('Something went wrong', { description: 'Please try again in a moment.' })}>
          Error
        </Button>
        <Button variant="secondary" onClick={() => toast.warning('Heads up', { description: 'Your trial ends in 3 days.' })}>
          Warning
        </Button>
        <Button variant="secondary" onClick={() => toast.info('New update available', { description: 'Version 2.1 is ready to install.' })}>
          Info
        </Button>
      </div>
      <Toaster />
    </>
  ),
}
