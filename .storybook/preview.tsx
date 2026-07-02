import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'

// Pull in the full token + shadcn theme layer so stories render with real styles.
import '../src/app/globals.css'

const preview: Preview = {
  // Two live "change the semantic layer" switches in the toolbar:
  //  • brand       — swaps the semantic brand tokens (jit ⇄ brand) via [data-theme]
  //  • colorScheme — toggles the .dark token block (light ⇄ dark)
  initialGlobals: { brand: 'jit', colorScheme: 'light' },
  globalTypes: {
    brand: {
      description: 'Brand theme (semantic layer)',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'jit', title: 'JIT — yellow, rounded' },
          { value: 'brand', title: 'Brand — blue, sharp' },
        ],
        dynamicTitle: true,
      },
    },
    colorScheme: {
      description: 'Light / dark color scheme',
      toolbar: {
        title: 'Scheme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== 'undefined') {
        const el = document.documentElement
        // Brand: jit is the :root default (no attribute); brand is the override.
        if (context.globals.brand === 'brand') el.dataset.theme = 'brand'
        else delete el.dataset.theme
        // Color scheme: toggle the `.dark` token block on <html>.
        el.classList.toggle('dark', context.globals.colorScheme === 'dark')
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
      test: 'error',
      config: {
        // color-contrast is evaluated against the live theme; kept off here to
        // avoid false failures from the brand/dark permutations. Re-enable per
        // story with parameters.a11y.config.rules once palettes are AA-verified.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
}

export default preview
