import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import TimeOffTrial from "./page";

const meta = {
  component: TimeOffTrial,
  parameters: { layout: "fullscreen" },
  tags: ["ai-generated"],
} satisfies Meta<typeof TimeOffTrial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// The dialog renders in a portal on document.body, not inside the canvas.
export const RequestDialog: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Request time off" }));
    const dialog = await body.findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).getByRole("button", { name: "Send request" })).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
  },
};

// The page heading reads --ds-typography-headingxl-fontsize (--ds-fontsize-2xl = 32px in jit).
// Fails if the kit's token CSS did not load into the preview.
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { name: "Time off" });
    await expect(getComputedStyle(heading).fontSize).toBe("32px");
  },
};
