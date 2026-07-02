import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog'
import { Button } from './button'
import { Input } from './input'

const BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'tonal',
  'ghost',
  'destructive',
  'destructive-secondary',
  'destructive-ghost',
] as const

type DialogStoryProps = {
  titleLabel: string
  subtitleText: string
  hasSubtitle: boolean
  hasTitle: boolean
  showCloseButton: boolean
  triggerLabel: string
  triggerVariant: (typeof BUTTON_VARIANTS)[number]
  cancelLabel: string
  confirmLabel: string
  confirmVariant: (typeof BUTTON_VARIANTS)[number]
}

const meta = {
  title: 'Components/Dialog',
  // docs-only association; the playground args are story-level props
  component: Dialog as React.ComponentType<DialogStoryProps>,
  parameters: { layout: 'centered', docs: { description: { component: 'a window overlaid on the primary window, content underneath inert; focused tasks/forms needing confirmation' } } },
  tags: ['autodocs'],
  argTypes: {
    // ── Content ──
    hasTitle: { control: 'boolean', name: 'hasTitle', table: { category: 'Content' } },
    titleLabel: { control: 'text', name: 'Title', table: { category: 'Content' }, if: { arg: 'hasTitle' } },
    hasSubtitle: { control: 'boolean', name: 'hasSubtitle', table: { category: 'Content' } },
    subtitleText: { control: 'text', name: 'Subtitle', table: { category: 'Content' }, if: { arg: 'hasSubtitle' } },
    showCloseButton: { control: 'boolean', name: 'showCloseButton', table: { category: 'Content' } },
    // ── Nested: Trigger button ──
    triggerLabel: { control: 'text', name: 'Label', table: { category: 'Nested: Trigger' } },
    triggerVariant: { control: 'select', options: BUTTON_VARIANTS, name: 'Variant', table: { category: 'Nested: Trigger' } },
    // ── Nested: Footer buttons ──
    cancelLabel: { control: 'text', name: 'Cancel label', table: { category: 'Nested: Footer' } },
    confirmLabel: { control: 'text', name: 'Confirm label', table: { category: 'Nested: Footer' } },
    confirmVariant: { control: 'select', options: BUTTON_VARIANTS, name: 'Confirm variant', table: { category: 'Nested: Footer' } },
  },
  args: {
    titleLabel: 'Title',
    subtitleText: 'This is supporting text',
    hasTitle: true,
    hasSubtitle: true,
    showCloseButton: true,
    triggerLabel: 'Open dialog',
    triggerVariant: 'secondary',
    cancelLabel: 'Cancel',
    confirmLabel: 'Confirm',
    confirmVariant: 'primary',
  },
  render: ({
    titleLabel,
    subtitleText,
    hasTitle,
    hasSubtitle,
    showCloseButton,
    triggerLabel,
    triggerVariant,
    cancelLabel,
    confirmLabel,
    confirmVariant,
  }) => (
    <Dialog>
      <DialogTrigger render={<Button variant={triggerVariant}>{triggerLabel}</Button>} />
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          {hasTitle && <DialogTitle>{titleLabel}</DialogTitle>}
          {hasSubtitle && (
            <DialogDescription>{subtitleText}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary">{cancelLabel}</Button>} />
          <DialogClose render={<Button variant={confirmVariant}>{confirmLabel}</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<DialogStoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Default: Story = {}

export const NoCloseButton: Story = {
  args: { showCloseButton: false },
}

export const TitleOnly: Story = {
  args: { hasSubtitle: false },
}

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Create project</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Enter a name for your new project.
          </DialogDescription>
        </DialogHeader>
        <Input placeholder="Project name" />
        <DialogFooter showCloseButton>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive">Delete</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. It will permanently delete the item.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancel</Button>} />
          <DialogClose render={<Button variant="destructive">Delete</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
