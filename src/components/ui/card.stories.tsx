import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card'
import { Button } from './button'
import { Input } from './input'
import { BUTTON_VARIANTS, type ButtonVariant } from '@/lib/story-helpers'

// Card is compositional: a single Figma variant (filled) plus structural slots.
// The Playground exposes those slots as story-only controls so the panel behaves
// like a real card builder — text overrides + toggles for the optional regions,
// and the nested footer Buttons' labels/variant.
type StoryProps = {
  filled: boolean
  title: string
  description: string
  contentText: string
  showAction: boolean
  showFooter: boolean
  cancelLabel: string
  confirmLabel: string
  confirmVariant: ButtonVariant
}

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    filled: { control: 'boolean', name: 'Filled', table: { category: 'Appearance' } },
    title: { control: 'text', name: 'Title', table: { category: 'Content' } },
    description: { control: 'text', name: 'Description', table: { category: 'Content' } },
    contentText: { control: 'text', name: 'Body text', table: { category: 'Content' } },
    showAction: { control: 'boolean', name: 'Show header action', table: { category: 'Slots' } },
    showFooter: { control: 'boolean', name: 'Show footer', table: { category: 'Slots' } },
    cancelLabel: { control: 'text', name: 'Cancel label', table: { category: 'Nested: Footer' }, if: { arg: 'showFooter' } },
    confirmLabel: { control: 'text', name: 'Confirm label', table: { category: 'Nested: Footer' }, if: { arg: 'showFooter' } },
    confirmVariant: { control: 'select', options: BUTTON_VARIANTS, name: 'Confirm variant', table: { category: 'Nested: Footer' }, if: { arg: 'showFooter' } },
  },
  args: {
    filled: true,
    title: 'Create project',
    description: 'Deploy your new project in one click.',
    contentText: 'Project name',
    showAction: false,
    showFooter: true,
    cancelLabel: 'Cancel',
    confirmLabel: 'Deploy',
    confirmVariant: 'primary',
  },
  render: ({ filled, title, description, contentText, showAction, showFooter, cancelLabel, confirmLabel, confirmVariant }: StoryProps) => (
    <Card filled={filled} className="w-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {showAction && (
          <CardAction>
            <Button variant="ghost" size="xs">
              Edit
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <Input placeholder={contentText} />
      </CardContent>
      {showFooter && (
        <CardFooter className="justify-end gap-2">
          <Button variant="secondary" size="sm">
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} size="sm">{confirmLabel}</Button>
        </CardFooter>
      )}
    </Card>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Default: Story = {}

export const Unfilled: Story = {
  args: { filled: false },
  render: ({ filled }) => (
    <Card filled={filled} className="w-80">
      <CardHeader>
        <CardTitle>Outlined card</CardTitle>
        <CardDescription>No background fill</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card with transparent background and visible border.</p>
      </CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  args: { showAction: true },
  render: ({ filled }) => (
    <Card filled={filled} className="w-80">
      <CardHeader>
        <CardTitle>Card with action</CardTitle>
        <CardDescription>Has a top-right action slot</CardDescription>
        <CardAction>
          <Button variant="ghost" size="xs">Edit</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>The action button sits in the header&apos;s top-right corner.</p>
      </CardContent>
    </Card>
  ),
}
