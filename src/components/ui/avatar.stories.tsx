import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Avatar, AvatarStack } from './avatar'

const SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
const ROUNDNESS_OPTIONS = ['round', 'square'] as const

// --- Avatar ---

type AvatarStoryProps = React.ComponentProps<typeof Avatar> & {
  picture: boolean
}

const avatarMeta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered', docs: { description: { component: 'An image element with a fallback for representing the user.' } } },
  tags: ['autodocs'],
  argTypes: {
    picture: { control: 'boolean', name: 'Picture' },
    size: { control: 'select', options: SIZE_OPTIONS, name: 'Size' },
    roundness: { control: 'select', options: ROUNDNESS_OPTIONS, name: 'Roundness' },
    fallback: { control: 'text', name: 'Initials', if: { arg: 'picture', eq: false } },
    src: { table: { disable: true } },
    alt: { table: { disable: true } },
  },
  args: {
    picture: true,
    size: '2xl',
    roundness: 'round',
    fallback: 'CN',
  },
  render: ({ picture, size, roundness, fallback }) => (
    <Avatar
      size={size}
      roundness={roundness}
      src={picture ? 'https://i.pravatar.cc/96?u=demo' : undefined}
      fallback={fallback}
    />
  ),
} satisfies Meta<AvatarStoryProps>

export default avatarMeta
type AvatarStory = StoryObj<typeof avatarMeta>

export const Playground: AvatarStory = {}

export const Sizes: AvatarStory = {
  render: ({ roundness }) => (
    <div className="flex items-end gap-3">
      {SIZE_OPTIONS.map((s) => (
        <Avatar
          key={s}
          size={s}
          roundness={roundness}
          src="https://i.pravatar.cc/96?u=sizes"
          fallback="CN"
        />
      ))}
    </div>
  ),
}

export const Initials: AvatarStory = {
  args: { picture: false },
  render: () => (
    <div className="flex items-end gap-3">
      {SIZE_OPTIONS.map((s) => (
        <Avatar key={s} size={s} fallback="CN" />
      ))}
    </div>
  ),
}

export const Square: AvatarStory = {
  args: { roundness: 'square' },
  render: () => (
    <div className="flex items-end gap-3">
      {SIZE_OPTIONS.map((s) => (
        <Avatar
          key={s}
          size={s}
          roundness="square"
          src="https://i.pravatar.cc/96?u=square"
          fallback="CN"
        />
      ))}
    </div>
  ),
}

export const SquareInitials: AvatarStory = {
  args: { picture: false, roundness: 'square' },
  render: () => (
    <div className="flex items-end gap-3">
      {SIZE_OPTIONS.map((s) => (
        <Avatar key={s} size={s} roundness="square" fallback="CN" />
      ))}
    </div>
  ),
}
