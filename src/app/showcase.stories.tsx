import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import Showcase from "./page";

const meta = {
  component: Showcase,
  parameters: { layout: "fullscreen" },
  tags: ["ai-generated"],
} satisfies Meta<typeof Showcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Selecting a tab moves aria-selected from the first tab to the second.
export const SwitchTab: Story = {
  play: async ({ canvas, userEvent }) => {
    const overview = canvas.getByRole("tab", { name: "Overview" });
    const activity = canvas.getByRole("tab", { name: "Activity" });
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await userEvent.click(activity);
    await expect(activity).toHaveAttribute("aria-selected", "true");
    await expect(overview).toHaveAttribute("aria-selected", "false");
  },
};
