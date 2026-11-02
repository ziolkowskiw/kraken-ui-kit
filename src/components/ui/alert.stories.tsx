import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { icons, AlertCircle, CheckCircle2, Info, AlertTriangle, Bell, X } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from './alert'
import { Button } from './button'

const VARIANT_OPTIONS = ['default', 'destructive', 'success', 'informational', 'warning'] as const
const BUTTON_VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'destructive-outline', 'destructive-ghost'] as const
const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg'] as const

const iconMap = {
  default: <Bell size={16} />,
  destructive: <AlertCircle size={16} />,
  success: <CheckCircle2 size={16} />,
  informational: <Info size={16} />,
  warning: <AlertTriangle size={16} />,
}

type IconName = 'none' | keyof typeof icons
const ICON_OPTIONS: IconName[] = ['none', ...(Object.keys(icons) as (keyof typeof icons)[])]
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : undefined
}

type AlertStoryProps = React.ComponentProps<typeof Alert> & {
  titleText: string
  descriptionText: string
  hasIcon: boolean
  iconName: IconName
  hasDescription: boolean
  showCloseIcon: boolean
  showButton: boolean
  actionVerb: string
  actionButtonVariant: (typeof BUTTON_VARIANTS)[number]
  actionButtonSize: (typeof BUTTON_SIZES)[number]
  actionButtonIconOnly: boolean
  actionButtonLeftIconName: IconName
  actionButtonRightIconName: IconName
}

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'padded', docs: { description: { component: 'displays a callout for user attention; inline, non-blocking messages (info, success, warning, error)' } } },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANT_OPTIONS, name: 'Variant' },
    titleText: { control: 'text', name: 'Title' },
    hasIcon: { control: 'boolean', name: 'hasIcon' },
    iconName: {
      control: 'select',
      options: ICON_OPTIONS,
      name: 'Icon',
      if: { arg: 'hasIcon' },
    },
    hasDescription: { control: 'boolean', name: 'hasDescription' },
    descriptionText: { control: 'text', name: 'Description', if: { arg: 'hasDescription' } },
    showCloseIcon: { control: 'boolean', name: 'Close icon' },
    showButton: { control: 'boolean', name: 'Show Button' },
    actionButtonVariant: {
      control: 'select',
      options: BUTTON_VARIANTS,
      name: 'Variant',
      table: { category: 'Nested: action-button' },
      if: { arg: 'showButton' },
    },
    actionButtonSize: {
      control: 'select',
      options: BUTTON_SIZES,
      name: 'Size',
      table: { category: 'Nested: action-button' },
      if: { arg: 'showButton' },
    },
    actionButtonIconOnly: {
      control: 'boolean',
      name: 'iconOnly',
      table: { category: 'Nested: action-button' },
      if: { arg: 'showButton' },
    },
    actionVerb: {
      control: 'text',
      name: 'Action verb',
      table: { category: 'Nested: action-button' },
      if: { arg: 'showButton' },
    },
    actionButtonLeftIconName: {
      control: 'select',
      options: ICON_OPTIONS,
      name: 'Left icon',
      table: { category: 'Nested: action-button' },
      if: { arg: 'showButton' },
    },
    actionButtonRightIconName: {
      control: 'select',
      options: ICON_OPTIONS,
      name: 'Right icon',
      table: { category: 'Nested: action-button' },
      if: { arg: 'showButton' },
    },
    icon: { table: { disable: true } },
    closeIcon: { table: { disable: true } },
    onClose: { table: { disable: true } },
    action: { table: { disable: true } },
  },
  args: {
    variant: 'default',
    titleText: 'This action cannot be undone',
    descriptionText: 'Please make sure your data is correct',
    hasIcon: true,
    iconName: 'Bell' as IconName,
    hasDescription: true,
    showCloseIcon: true,
    showButton: true,
    actionVerb: 'Action verb',
    actionButtonVariant: 'outline',
    actionButtonSize: 'sm',
    actionButtonIconOnly: false,
    actionButtonLeftIconName: 'none',
    actionButtonRightIconName: 'none',
  },
  render: ({
    variant,
    titleText,
    descriptionText,
    hasIcon,
    iconName,
    hasDescription,
    showCloseIcon,
    showButton,
    actionVerb,
    actionButtonVariant,
    actionButtonSize,
    actionButtonIconOnly,
    actionButtonLeftIconName,
    actionButtonRightIconName,
    ...args
  }) => {
    const t = variant ?? 'default'
    return (
      <Alert
        {...args}
        variant={t}
        icon={hasIcon ? renderIcon(iconName) : undefined}
        closeIcon={<X />}
        onClose={showCloseIcon ? () => {} : undefined}
        action={
          showButton ? (
            <Button
              variant={actionButtonVariant}
              size={actionButtonSize}
              iconOnly={actionButtonIconOnly}
              leftIcon={renderIcon(actionButtonLeftIconName)}
              rightIcon={renderIcon(actionButtonRightIconName)}
            >
              {actionButtonIconOnly ? renderIcon(actionButtonLeftIconName) : actionVerb}
            </Button>
          ) : undefined
        }
        className="max-w-md"
      >
        <AlertTitle>{titleText}</AlertTitle>
        {hasDescription && (
          <AlertDescription>{descriptionText}</AlertDescription>
        )}
      </Alert>
    )
  },
} satisfies Meta<AlertStoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Default: Story = {}

export const WithIcon: Story = {
  args: { hasIcon: true },
}

export const WithCloseIcon: Story = {
  args: { showCloseIcon: true },
}

export const WithButton: Story = {
  args: { showButton: true, hasIcon: true },
}

export const Error: Story = {
  args: { variant: 'destructive', hasIcon: true },
}

export const Success: Story = {
  args: { variant: 'success', hasIcon: true },
}

export const Informational: Story = {
  args: { variant: 'informational', hasIcon: true },
}

export const Warning: Story = {
  args: { variant: 'warning', hasIcon: true },
}

export const FullFeatured: Story = {
  args: {
    variant: 'informational',
    hasIcon: true,
    hasDescription: true,
    showCloseIcon: true,
    showButton: true,
  },
}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      {VARIANT_OPTIONS.map((t) => (
        <Alert key={t} variant={t} icon={iconMap[t]} closeIcon={<X />} onClose={() => {}}>
          <AlertTitle className="capitalize">{t}</AlertTitle>
          <AlertDescription>
            This is a {t} alert with icon and description.
          </AlertDescription>
        </Alert>
      ))}
    </div>
  ),
}
