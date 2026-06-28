import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion'
import { Button } from './button'

const VARIANTS = ['in-box', 'standalone'] as const

type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : undefined
}

type StoryProps = {
  type?: 'single' | 'multiple'
  variant?: (typeof VARIANTS)[number]
  title?: string
  hasSubtitle?: boolean
  subtitle?: string
  hasIcon?: boolean
  iconName?: IconName
  compact?: boolean
  contentTitle?: string
  hasTitle?: boolean
  content?: string
  hasLinkButton?: boolean
  linkButtonLabel?: string
}

const meta = {
  title: 'Components/Accordion',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      name: 'Type',
    },
    variant: { control: 'select', options: VARIANTS, name: 'Variant' },
    compact: { control: 'boolean', name: 'Compact' },
    title: { control: 'text', name: 'Title' },
    hasSubtitle: { control: 'boolean', name: 'hasSubtitle' },
    subtitle: { control: 'text', name: 'Subtitle' },
    hasIcon: { control: 'boolean', name: 'hasIcon' },
    iconName: {
      control: 'select',
      options: ICON_OPTIONS,
      name: 'Icon',
      table: { category: 'Nested: Header' },
    },
    hasTitle: {
      control: 'boolean',
      name: 'hasTitle',
      table: { category: 'Nested: Content' },
    },
    contentTitle: {
      control: 'text',
      name: 'Content title',
      table: { category: 'Nested: Content' },
    },
    content: {
      control: 'text',
      name: 'Content',
      table: { category: 'Nested: Content' },
    },
    hasLinkButton: {
      control: 'boolean',
      name: 'hasLinkButton',
      table: { category: 'Nested: Content' },
    },
    linkButtonLabel: {
      control: 'text',
      name: 'Link button label',
      table: { category: 'Nested: Content' },
    },
  },
  args: {
    type: 'single',
    variant: 'in-box',
    compact: false,
    title: 'Accordion title',
    hasSubtitle: true,
    subtitle: 'Accordion Subtitle',
    hasIcon: true,
    iconName: 'SquircleDashed' as IconName,
    hasTitle: true,
    contentTitle: 'Accordion content title',
    content:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.',
    hasLinkButton: false,
    linkButtonLabel: 'Learn more',
  },
  render: ({
    type,
    variant,
    compact,
    title,
    hasSubtitle,
    subtitle,
    hasIcon,
    iconName,
    hasTitle,
    contentTitle,
    content,
    hasLinkButton,
    linkButtonLabel,
  }: StoryProps) => (
    <Accordion type={type} className="w-[510px]" defaultValue={[0]}>
      <AccordionItem variant={variant}>
        <AccordionTrigger
          title={title}
          hasSubtitle={hasSubtitle}
          subtitle={subtitle}
          hasIcon={hasIcon}
          icon={renderIcon(iconName)}
          compact={compact}
        />
        <AccordionContent
          hasTitle={hasTitle}
          contentTitle={contentTitle}
          hasLinkButton={hasLinkButton}
          linkButton={
            <Button variant="ghost" size="sm">
              {linkButtonLabel}
            </Button>
          }
        >
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[510px]">
      {VARIANTS.map((variant) => (
        <Accordion key={variant} defaultValue={[0]} aria-label={`${variant === 'in-box' ? 'In-box' : 'Standalone'} variant`}>
          <AccordionItem variant={variant}>
            <AccordionTrigger
              title={`${variant === 'in-box' ? 'In-box' : 'Standalone'} accordion`}
              subtitle="Accordion Subtitle"
              icon={renderIcon('SquircleDashed' as IconName)}
            />
            <AccordionContent
              hasTitle
              contentTitle={`${variant === 'in-box' ? 'In-box' : 'Standalone'} content`}
            >
              Lorem ipsum dolor sit amet consectetur adipiscing elit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  ),
}

const sampleItems = (['First', 'Second', 'Third'] as const).map((label, i) => (
  <AccordionItem key={i} variant="in-box">
    <AccordionTrigger
      title={`${label} item`}
      subtitle="Details"
      icon={renderIcon('SquircleDashed' as IconName)}
    />
    <AccordionContent hasTitle contentTitle={`${label} content`}>
      Content for the {label.toLowerCase()} accordion item.
    </AccordionContent>
  </AccordionItem>
))

/** `type="single"` — opening one item closes the others. */
export const Single: Story = {
  render: () => (
    <Accordion type="single" className="w-[510px]" defaultValue={[0]}>
      {sampleItems}
    </Accordion>
  ),
}

/** `type="multiple"` — several items stay open at once (here items 0 and 2). */
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[510px]" defaultValue={[0, 2]}>
      {sampleItems}
    </Accordion>
  ),
}

export const Compact: Story = {
  args: { compact: true },
}

export const NoSubtitle: Story = {
  args: { hasSubtitle: false },
}

export const NoIcon: Story = {
  args: { hasIcon: false },
}

export const WithLinkButton: Story = {
  args: { hasLinkButton: true, linkButtonLabel: 'Learn more' },
}

/** `disabled` on an individual `AccordionItem` — the middle item can't open. */
export const DisabledItem: Story = {
  render: () => (
    <Accordion type="single" className="w-[510px]" defaultValue={[0]}>
      <AccordionItem variant="in-box">
        <AccordionTrigger title="Enabled item" subtitle="Open me" />
        <AccordionContent>This item opens and closes normally.</AccordionContent>
      </AccordionItem>
      <AccordionItem variant="in-box" disabled>
        <AccordionTrigger title="Disabled item" subtitle="Can't open" />
        <AccordionContent>You should not be able to reach this.</AccordionContent>
      </AccordionItem>
      <AccordionItem variant="in-box">
        <AccordionTrigger title="Another enabled item" subtitle="Open me too" />
        <AccordionContent>This item also opens and closes normally.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
