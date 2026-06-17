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
    <Accordion className="w-[510px]" defaultValue={[0]}>
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
        <Accordion key={variant} defaultValue={[0]}>
          <AccordionItem variant={variant}>
            <AccordionTrigger
              title="Accordion title"
              subtitle="Accordion Subtitle"
              icon={renderIcon('SquircleDashed' as IconName)}
            />
            <AccordionContent
              hasTitle
              contentTitle="Accordion content title"
            >
              Lorem ipsum dolor sit amet consectetur adipiscing elit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  ),
}

export const MultipleItems: Story = {
  render: () => (
    <Accordion className="w-[510px]" defaultValue={[0]}>
      {['First', 'Second', 'Third'].map((label, i) => (
        <AccordionItem key={i} variant="in-box">
          <AccordionTrigger
            title={`${label} item`}
            subtitle="Details"
            icon={renderIcon('SquircleDashed' as IconName)}
          />
          <AccordionContent
            hasTitle
            contentTitle={`${label} content`}
          >
            Content for the {label.toLowerCase()} accordion item.
          </AccordionContent>
        </AccordionItem>
      ))}
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
