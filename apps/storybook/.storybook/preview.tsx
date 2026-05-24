import '@nswds/ui/globals.css'
import { definePreview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'

import { mswHandlers } from './msw-handlers'

initialize({ onUnhandledRequest: 'bypass' })

// Discovery summary:
// - Pure component library; no providers, no data fetching, no portals.
// - CSS variables for light/dark are applied via the `.dark` class on a
//   parent element.

export default definePreview({
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for component previews',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark'

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark)
      }

      return Story()
    },
  ],
  loaders: [mswLoader],
  parameters: {
    options: {
      storySort: {
        order: [
          'Components',
          [
            'Button',
            [
              'Docs',
              'Default',
              'Playground',
              'Features',
              'Tests',
              'Accessibility',
            ],
          ],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      codePanel: true,
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    msw: {
      handlers: mswHandlers,
    },
  },
})
