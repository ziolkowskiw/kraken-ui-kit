import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Toaster, toast } from './sonner'
import { Button } from './button'
import { BUTTON_VARIANTS, type ButtonVariant } from '@/lib/story-helpers'

const TYPES = ['success', 'error', 'warning', 'info'] as const
type ToastType = (typeof TYPES)[number]

type StoryProps = {
  type: ToastType
  message: string
  description: string
  hasAction: boolean
  actionLabel: string
  triggerLabel: string
  triggerVariant: ButtonVariant
}

function fire({ type, message, description, hasAction, actionLabel }: StoryProps) {
  const opts = {
    description: description || undefined,
    ...(hasAction ? { action: { label: actionLabel, onClick: () => {} } } : {}),
  }
  toast[type](message, opts)
}

const meta: Meta<StoryProps> = {
  title: 'Components/Sonner',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'inline-radio', options: TYPES, name: 'Type', table: { category: 'Toast' } },
    message: { control: 'text', name: 'Message', table: { category: 'Toast' } },
    description: { control: 'text', name: 'Description', table: { category: 'Toast' } },
    hasAction: { control: 'boolean', name: 'Action button', table: { category: 'Toast' } },
    actionLabel: { control: 'text', name: 'Action label', table: { category: 'Toast' }, if: { arg: 'hasAction' } },
    triggerLabel: { control: 'text', name: 'Label', table: { category: 'Nested: Trigger' } },
    triggerVariant: { control: 'select', options: BUTTON_VARIANTS, name: 'Variant', table: { category: 'Nested: Trigger' } },
  },
  args: {
    type: 'success',
    message: 'Changes saved',
    description: 'Your profile has been updated.',
    hasAction: false,
    actionLabel: 'Undo',
    triggerLabel: 'Show toast',
    triggerVariant: 'secondary',
  },
  render: (args) => (
    <>
      <Button variant={args.triggerVariant} onClick={() => fire(args)}>
        {args.triggerLabel}
      </Button>
      <Toaster />
    </>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

// All controls active — click the trigger to fire the configured toast.
export const Playground: Story = {}

// One button per toast type — the full status set at a glance.
export const AllTypes: Story = {
  render: () => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => toast.success('Changes saved', { description: 'Your profile has been updated.' })}>Success</Button>
        <Button variant="secondary" onClick={() => toast.error('Something went wrong', { description: 'Please try again in a moment.' })}>Error</Button>
        <Button variant="secondary" onClick={() => toast.warning('Heads up', { description: 'Your trial ends in 3 days.' })}>Warning</Button>
        <Button variant="secondary" onClick={() => toast.info('New update available', { description: 'Version 2.1 is ready to install.' })}>Info</Button>
      </div>
      <Toaster />
    </>
  ),
}
