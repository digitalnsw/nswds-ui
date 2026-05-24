import '@nswds/ui/globals.css'
import {
  DEFAULT_THEME,
  THEME_VAR_NAMES,
  buildThemeVars,
  resolveAccentHue,
  resolvePrimaryHue,
  type ThemeCategory,
} from '@nswds/ui/lib/theme-palette'
import { definePreview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'

import { mswHandlers } from './msw-handlers'

initialize({ onUnhandledRequest: 'bypass' })

// Discovery summary:
// - Pure component library; no providers, no data fetching, no portals.
// - CSS variables for light/dark are applied via the `.dark` class on a
//   parent element.
// - Primary, accent, and category globals override the @nswds/tokens scale
//   vars (--color-primary-50…-950, --color-accent-*, --color-grey-*) via
//   setProperty() on documentElement so previews update instantly.
// - The toolbar carries Light/Dark only. The full Category + Primary +
//   Accent picker lives in the Theme addon panel (apps/storybook/.storybook/
//   manager.tsx) so it's reachable from every story.

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
    themeCategory: DEFAULT_THEME.category,
    themePrimary: DEFAULT_THEME.primaryHue,
    themeAccent: DEFAULT_THEME.accentHue,
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark'
      const category = (context.globals.themeCategory ??
        DEFAULT_THEME.category) as ThemeCategory

      // Coerce against the active category so a hue that doesn't exist for
      // the current palette can't render — picks always stay in one palette.
      const primaryHue = resolvePrimaryHue(
        category,
        context.globals.themePrimary as string | undefined,
      )
      const accentHue = resolveAccentHue(
        category,
        primaryHue,
        context.globals.themeAccent as string | undefined,
      )

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark)

        const root = document.documentElement
        const vars = buildThemeVars(category, primaryHue, accentHue)

        for (const name of THEME_VAR_NAMES) {
          const next = vars[name]
          if (next) {
            root.style.setProperty(name, next)
          } else {
            root.style.removeProperty(name)
          }
        }
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
