import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Avatar, AvatarStack } from "./avatar";

const SIZE_OPTIONS = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
const ROUNDNESS_OPTIONS = ["round", "square"] as const;

type StackStoryProps = React.ComponentProps<typeof AvatarStack> & {
  count: number;
  avatarPicture: boolean;
  avatarRoundness: "round" | "square";
  avatarFallback: string;
};

const meta = {
  title: "Components/AvatarStack",
  component: AvatarStack,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: SIZE_OPTIONS, name: "Size" },
    max: { control: { type: "range", min: 1, max: 10, step: 1 }, name: "Max visible" },
    count: { control: { type: "range", min: 1, max: 10, step: 1 }, name: "Total avatars" },
    // Nested: Avatar
    avatarPicture: {
      control: "boolean",
      name: "Picture",
      table: { category: "Nested: Avatar" },
    },
    avatarRoundness: {
      control: "select",
      options: ROUNDNESS_OPTIONS,
      name: "Roundness",
      table: { category: "Nested: Avatar" },
    },
    avatarFallback: {
      control: "text",
      name: "Fallback",
      table: { category: "Nested: Avatar" },
    },
    // hide pass-through
    roundness: { table: { disable: true } },
  },
  args: {
    size: "sm",
    max: 4,
    count: 6,
    avatarPicture: true,
    avatarRoundness: "round",
    avatarFallback: "CN",
  },
  render: ({ size, max, count, avatarPicture, avatarRoundness, avatarFallback }) => (
    <AvatarStack size={size} roundness={avatarRoundness} max={max}>
      {Array.from({ length: count }, (_, i) => (
        <Avatar
          key={i}
          src={avatarPicture ? `https://i.pravatar.cc/64?u=stack${i}` : undefined}
          fallback={avatarFallback}
        />
      ))}
    </AvatarStack>
  ),
} satisfies Meta<StackStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      {SIZE_OPTIONS.map((s) => (
        <AvatarStack key={s} size={s} max={4}>
          {Array.from({ length: 6 }, (_, i) => (
            <Avatar key={i} src={`https://i.pravatar.cc/64?u=${s}${i}`} fallback="CN" />
          ))}
        </AvatarStack>
      ))}
    </div>
  ),
};

export const WithInitials: Story = {
  args: { avatarPicture: false },
  render: () => (
    <AvatarStack size="md" max={3}>
      <Avatar fallback="CN" />
      <Avatar fallback="JD" />
      <Avatar fallback="AB" />
      <Avatar fallback="XY" />
      <Avatar fallback="QR" />
    </AvatarStack>
  ),
};

export const NoOverflow: Story = {
  args: { count: 3, max: 5 },
};

export const SquareStack: Story = {
  args: { avatarRoundness: "square" },
};
