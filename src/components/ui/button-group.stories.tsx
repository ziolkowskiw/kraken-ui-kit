import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './button-group'
import { Button } from './button'
import { BUTTON_VARIANTS, type ButtonVariant } from '@/lib/story-helpers'

const SIZES = ['xs', 'sm', 'md', 'lg'] as const

type StoryProps = {
  orientation: 'horizontal' | 'vertical'
  count: number
  variant: ButtonVariant
  size: (typeof SIZES)[number]
  iconOnly: boolean
}

const ICONS = [AlignLeft, AlignCenter, AlignRight] as const
const LABELS = ['One', 'Two', 'Three', 'Four', 'Five'] as const

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'], name: 'Orientation' },
    count: { control: { type: 'range', min: 2, max: 5, step: 1 }, name: 'Buttons' },
    variant: { control: 'select', options: BUTTON_VARIANTS, name: 'Variant', table: { category: 'Nested: Buttons' } },
    size: { control: 'inline-radio', options: SIZES, name: 'Size', table: { category: 'Nested: Buttons' } },
    iconOnly: { control: 'boolean', name: 'Icon only', table: { category: 'Nested: Buttons' } },
  },
  args: {
    orientation: 'horizontal',
    count: 3,
    variant: 'secondary',
    size: 'md',
    iconOnly: false,
  },
  render: ({ orientation, count, variant, size, iconOnly }) => (
    <ButtonGroup orientation={orientation}>
      {Array.from({ length: count }).map((_, i) => {
        const Icon = ICONS[i % ICONS.length]
        return iconOnly ? (
          <Button key={i} variant={variant} size={size} iconOnly aria-label={LABELS[i]}>
            <Icon />
          </Button>
        ) : (
          <Button key={i} variant={variant} size={size}>
            {LABELS[i]}
          </Button>
        )
      })}
    </ButtonGroup>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Vertical: Story = { args: { orientation: 'vertical' } }

// Two joined icon-only toolbars — the common formatting-bar composition.
export const IconToolbar: Story = {
  render: () => (
    <div className="flex gap-4">
      <ButtonGroup>
        <Button variant="secondary" size="sm" iconOnly aria-label="Bold"><Bold /></Button>
        <Button variant="secondary" size="sm" iconOnly aria-label="Italic"><Italic /></Button>
        <Button variant="secondary" size="sm" iconOnly aria-label="Underline"><Underline /></Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary" size="sm" iconOnly aria-label="Align left"><AlignLeft /></Button>
        <Button variant="secondary" size="sm" iconOnly aria-label="Align center"><AlignCenter /></Button>
        <Button variant="secondary" size="sm" iconOnly aria-label="Align right"><AlignRight /></Button>
      </ButtonGroup>
    </div>
  ),
}

// Mixed toolbar: a text cell and an explicit separator between segments.
export const WithTextAndSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Align</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="md" iconOnly leftIcon={<AlignLeft />} aria-label="Align left" />
      <Button variant="secondary" size="md" iconOnly leftIcon={<AlignCenter />} aria-label="Align center" />
      <Button variant="secondary" size="md" iconOnly leftIcon={<AlignRight />} aria-label="Align right" />
    </ButtonGroup>
  ),
}
