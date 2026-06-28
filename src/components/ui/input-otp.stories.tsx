import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './input-otp'

type StoryArgs = { size?: 'xs' | 'sm' | 'md' | 'lg' }

const meta = {
  title: 'Components/InputOTP',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
  render: (args: StoryArgs) => (
    <InputOTP maxLength={6} aria-label="One-time password">
      <InputOTPGroup>
        <InputOTPSlot index={0} size={args.size} />
        <InputOTPSlot index={1} size={args.size} />
        <InputOTPSlot index={2} size={args.size} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} size={args.size} />
        <InputOTPSlot index={4} size={args.size} />
        <InputOTPSlot index={5} size={args.size} />
      </InputOTPGroup>
    </InputOTP>
  ),
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const FourDigits: Story = {
  render: () => (
    <InputOTP maxLength={4} aria-label="One-time password">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
}
