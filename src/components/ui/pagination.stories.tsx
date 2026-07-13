import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./pagination";

type StoryProps = {
  totalPages: number;
  currentPage: number;
  showPrevNext: boolean;
};

/** Windowed page list: always first + last, the current page ±1, ellipses for gaps. */
function pageList(total: number, current: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return out;
}

const meta = {
  title: "Components/Pagination",
  // docs-only association; the playground args are story-level props
  component: Pagination as React.ComponentType<StoryProps>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Pagination with page navigation, next and previous links; page through long lists/tables.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    totalPages: { control: { type: "range", min: 1, max: 20, step: 1 }, name: "Total pages" },
    currentPage: { control: { type: "number", min: 1 }, name: "Current page" },
    showPrevNext: { control: "boolean", name: "Prev / Next" },
  },
  args: {
    totalPages: 10,
    currentPage: 2,
    showPrevNext: true,
  },
  render: ({ totalPages, currentPage, showPrevNext }) => {
    const current = Math.min(Math.max(currentPage, 1), totalPages);
    return (
      <Pagination>
        <PaginationContent>
          {showPrevNext && (
            <PaginationItem>
              <PaginationPrevious href="#" aria-disabled={current === 1} />
            </PaginationItem>
          )}
          {pageList(totalPages, current).map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`e${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink href="#" isActive={p === current}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          {showPrevNext && (
            <PaginationItem>
              <PaginationNext href="#" aria-disabled={current === totalPages} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  },
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FewPages: Story = { args: { totalPages: 3, currentPage: 1 } };

export const ManyPages: Story = { args: { totalPages: 20, currentPage: 10 } };
