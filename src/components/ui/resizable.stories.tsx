import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable'

const meta = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  args: { orientation: 'horizontal' },
  render: (args) => (
    <ResizablePanelGroup
      {...args}
      className="h-64 w-[480px] rounded-lg border [border-color:var(--ds-color-border)]"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 text-sm [color:var(--ds-color-content-secondary)]">
          One
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 text-sm [color:var(--ds-color-content-secondary)]">
          Two
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Vertical: Story = { args: { orientation: 'vertical' } }
