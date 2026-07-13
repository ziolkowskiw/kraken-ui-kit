import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipIcon, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Button } from "./button";

const SIDES = ["top", "bottom", "left", "right"] as const;

// ─── Tooltip (box) ──────────────────────────────────────────────────────────

type TooltipBoxStoryProps = {
  side?: (typeof SIDES)[number];
  content?: string;
};

// All controls active — the "Figma property panel" experience (the tooltip box).
export const Playground: StoryObj<TooltipBoxStoryProps> = {
  argTypes: {
    side: { control: "select", options: SIDES, name: "Side" },
    content: { control: "text", name: "Content" },
  },
  args: {
    side: "top",
    content: "Tooltip message",
  },
  render: ({ side, content }: TooltipBoxStoryProps) => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="ghost" size="sm" />}>Hover me</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const TooltipBoxSides: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-16 p-16">
        {SIDES.map((side) => (
          <Tooltip key={side} defaultOpen>
            <TooltipTrigger render={<Button variant="ghost" size="sm" />}>{side}</TooltipTrigger>
            <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

// ─── Tooltip icon ───────────────────────────────────────────────────────────

type TooltipIconStoryProps = {
  side?: (typeof SIDES)[number];
  content?: string;
};

export const TooltipIconPlayground: StoryObj<TooltipIconStoryProps> = {
  argTypes: {
    side: { control: "select", options: SIDES, name: "Side" },
    content: { control: "text", name: "Content" },
  },
  args: {
    side: "top",
    content: "Tooltip message",
  },
  render: ({ side, content }: TooltipIconStoryProps) => (
    <TooltipProvider>
      <TooltipIcon side={side} content={content} />
    </TooltipProvider>
  ),
};

export const TooltipIconSides: StoryObj = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-16 p-16">
        {SIDES.map((side) => (
          <TooltipIcon key={side} side={side} content={`Tooltip on ${side}`} />
        ))}
      </div>
    </TooltipProvider>
  ),
};

// ─── Meta ───────────────────────────────────────────────────────────────────

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A popup that displays information when an element gets focus or is hovered; short hints on icons/controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
