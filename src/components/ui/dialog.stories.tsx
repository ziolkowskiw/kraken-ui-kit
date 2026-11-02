import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
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
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'destructive-outline',
  'destructive-ghost',
] as const

type DialogStoryProps = {
  type: 'desktop' | 'desktop scrollable'
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
    // ── Content ── (Figma Type=desktop|desktop scrollable)
    type: { control: 'select', options: ['desktop', 'desktop scrollable'], name: 'Type', table: { category: 'Content' } },
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
    type: 'desktop',
    titleLabel: 'Title',
    subtitleText: 'This is supporting text',
    hasTitle: true,
    hasSubtitle: true,
    showCloseButton: true,
    triggerLabel: 'Open dialog',
    triggerVariant: 'outline',
    cancelLabel: 'Cancel',
    confirmLabel: 'Confirm',
    confirmVariant: 'default',
  },
  render: ({
    type,
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
        {type === 'desktop scrollable' && (
          // Scrollable body between the fixed header and footer.
          <div className="max-h-64 overflow-y-auto [color:var(--ds-color-content-primary)] [font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-bodymd-lineheight)]">
            {Array.from({ length: 8 }, (_, i) => (
              <p key={i} className="mb-3">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
              </p>
            ))}
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline">{cancelLabel}</Button>} />
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
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose render={<Button variant="destructive">Delete</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Interaction test: opens from the trigger, closes with Escape.
export const OpensAndCloses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getAllByRole('button')[0])
    const dialog = await body.findByRole('dialog')
    // the dialog fades in, so wait for it instead of asserting on the first frame
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
}
