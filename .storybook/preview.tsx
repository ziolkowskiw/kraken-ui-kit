import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'

// Pull in the full token + shadcn theme layer so stories render with real styles.
import '../src/app/globals.css'

const preview: Preview = {
  // Brand switch in the Storybook toolbar — the live "change the semantic layer".
  initialGlobals: { brand: 'jit' },
  globalTypes: {
    brand: {
      description: 'Brand theme (semantic layer)',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'jit', title: 'JIT — yellow, rounded' },
          { value: 'randstadt', title: 'Randstadt — blue, sharp' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // jit is the :root default (no attribute); randstadt is the override.
      if (typeof document !== 'undefined') {
        const el = document.documentElement
        if (context.globals.brand === 'randstadt') el.dataset.theme = 'randstadt'
        else delete el.dataset.theme
      }
      return (
        <div className="bg-background text-foreground p-6">
          <Story />
        </div>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      test: 'todo',
    },
  },
}

export default preview
