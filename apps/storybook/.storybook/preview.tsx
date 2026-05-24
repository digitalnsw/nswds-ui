import '@nswds/ui/globals.css'
import {
  DEFAULT_THEME,
  THEME_VAR_NAMES,
  buildThemeVars,
  getAccents,
  getPrimaries,
  type ThemeCategory,
} from '@nswds/ui/lib/theme-palette'
import { definePreview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'

import { mswHandlers } from './msw-handlers'

initialize({ onUnhandledRequest: 'bypass' })

// Discovery summary:
// - Pure component library; no providers, no data fetching, no portals.
// - CSS variables for light/dark are applied via the `.dark` class on a
//   parent element. The themeCategory/themePrimary/themeAccent globals
//   override the @nswds/tokens scale vars (--color-primary-50…-950, accent,
//   grey) via setProperty() on documentElement so previews update instantly.
// - Only `theme` (light/dark) and `themeCategory` live in the toolbar.
//   Primary/accent are picked from the Tools > Colour Tools story panel,
//   because Storybook's globalType `items` are static and can't reflect
//   the current category — listing all options in the toolbar would let
//   users pick IDs that don't exist in the active palette.

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
    themeCategory: {
      name: 'Theme category',
      description: 'NSW brand palette vs. Aboriginal palette',
      defaultValue: DEFAULT_THEME.category,
      toolbar: {
        icon: 'category',
        items: [
          { value: 'brand', title: 'Brand colors' },
          { value: 'aboriginal', title: 'Aboriginal colors' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    themeCategory: DEFAULT_THEME.category,
    themePrimary: DEFAULT_THEME.primaryId,
    themeAccent: DEFAULT_THEME.accentId,
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark'
      const category = (context.globals.themeCategory ??
        DEFAULT_THEME.category) as ThemeCategory
      const requestedPrimary =
        (context.globals.themePrimary as string | undefined) ??
        DEFAULT_THEME.primaryId
      const requestedAccent =
        (context.globals.themeAccent as string | undefined) ??
        DEFAULT_THEME.accentId

      // If the user switched category and the previously selected id no longer
      // exists in the new palette, fall back to the first option in that list.
      const primaries = getPrimaries(category)
      const accents = getAccents(category)
      const primaryId =
        primaries.find((p) => p.id === requestedPrimary)?.id ??
        primaries[0]?.id ??
        DEFAULT_THEME.primaryId
      const accentId =
        accents.find((a) => a.id === requestedAccent)?.id ??
        accents[0]?.id ??
        DEFAULT_THEME.accentId

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark)

        const root = document.documentElement
        const vars = buildThemeVars(category, primaryId, accentId)

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
