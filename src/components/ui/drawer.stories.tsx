import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from './drawer'
import { Button } from './button'
import { InputField } from './input'

type StoryArgs = { side?: 'top' | 'right' | 'bottom' | 'left' }

const meta = {
  title: 'Components/Drawer',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
  },
  args: { side: 'right' },
  render: (args: StoryArgs) => (
    <Drawer>
      <DrawerTrigger render={<Button variant="secondary">Open drawer</Button>} />
      <DrawerContent side={args.side}>
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile here. Click save when you're done.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 py-4">
          <InputField label="Name" defaultValue="Kraken" />
          <InputField label="Username" defaultValue="@kraken" />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost">Cancel</Button>} />
          <DrawerClose render={<Button variant="primary">Save changes</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Bottom: Story = { args: { side: 'bottom' } }
export const Left: Story = { args: { side: 'left' } }
