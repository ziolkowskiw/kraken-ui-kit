import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel";
import { Card, CardContent } from "./card";

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A carousel with motion and swipe built using Embla; browse a set of images/cards.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
  args: { orientation: "horizontal" },
  render: (args) => (
    <Carousel {...args} className="w-64" opts={{ align: "start" }}>
      <CarouselContent className={args.orientation === "vertical" ? "h-64" : ""}>
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem key={i} className={args.orientation === "vertical" ? "basis-1/2" : ""}>
            <Card filled>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-3xl font-semibold [color:var(--ds-color-content-primary)]">
                  {i + 1}
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = { args: { orientation: "vertical" } };
