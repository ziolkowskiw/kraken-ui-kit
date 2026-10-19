import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './carousel'
import { Card, CardContent } from './card'

const SLIDES = ['1 slide', '2 slides', '3 slides'] as const
const BASIS = { '1 slide': 'basis-full', '2 slides': 'basis-1/2', '3 slides': 'basis-1/3' } as const
const WIDTH = { '1 slide': 'w-64', '2 slides': 'w-80', '3 slides': 'w-[36rem]' } as const

type StoryProps = React.ComponentProps<typeof Carousel> & { slides: (typeof SLIDES)[number] }

// Figma `carousel` (950:4516): Slides=1|2|3 visible per view, ghost arrow buttons outside.
const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: { layout: 'centered', docs: { description: { component: 'A carousel with motion and swipe built using Embla; browse a set of images/cards.' } } },
  tags: ['autodocs'],
  argTypes: {
    slides: { control: 'select', options: SLIDES, name: 'Slides' },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'], name: 'Orientation' },
    opts: { table: { disable: true } },
    plugins: { table: { disable: true } },
    setApi: { table: { disable: true } },
  },
  args: { slides: '1 slide', orientation: 'horizontal' },
  render: ({ slides, ...args }: StoryProps) => (
    <Carousel {...args} className={args.orientation === 'vertical' ? 'w-64' : WIDTH[slides]} opts={{ align: 'start' }}>
      <CarouselContent className={args.orientation === 'vertical' ? 'h-64' : ''}>
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem key={i} className={args.orientation === 'vertical' ? 'basis-1/2' : BASIS[slides]}>
            <Card filled>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="[font-size:var(--ds-fontsize-2xl)] [font-weight:var(--ds-fontweight-bold)] [color:var(--ds-color-content-primary)]">{i + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ThreeSlides: Story = { args: { slides: '3 slides' } }

export const Vertical: Story = { args: { orientation: 'vertical' } }
