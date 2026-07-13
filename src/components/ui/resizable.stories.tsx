import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable";

const meta = {
  title: "Components/Resizable",
  component: ResizablePanelGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible resizable panel groups and layouts; split views and adjustable panes (",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
  args: { orientation: "horizontal" },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

type StoryArgs = { orientation: "horizontal" | "vertical"; withHandle: boolean };

const PanelContent = ({ label }: { label: string }) => (
  <div className="flex h-full items-center justify-center p-6 text-sm [color:var(--ds-color-content-secondary)]">
    {label}
  </div>
);

export const Playground: Story = {
  args: { withHandle: true } as StoryArgs,
  render: (args) => {
    const { withHandle, ...groupArgs } = args as StoryArgs;
    return (
      <ResizablePanelGroup
        {...groupArgs}
        className="h-64 w-[480px] rounded-lg border [border-color:var(--ds-color-border)]"
      >
        <ResizablePanel defaultSize={50}>
          <PanelContent label="One" />
        </ResizablePanel>
        <ResizableHandle withHandle={withHandle} />
        <ResizablePanel defaultSize={50}>
          <PanelContent label="Two" />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" } as StoryArgs,
  parameters: {
    a11y: { config: { rules: [{ id: "scrollable-region-focusable", enabled: false }] } },
  },
  render: (args) => (
    <ResizablePanelGroup
      orientation="vertical"
      className="h-64 w-[480px] rounded-lg border [border-color:var(--ds-color-border)]"
    >
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Top" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Bottom" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const NoHandle: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-64 w-[480px] rounded-lg border [border-color:var(--ds-color-border)]"
    >
      <ResizablePanel defaultSize={50}>
        <PanelContent label="One" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <PanelContent label="Two" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
