import '@nswds/ui/globals.css'
import {
  ALL_ACCENTS,
  ALL_PRIMARIES,
  DEFAULT_THEME,
  THEME_VAR_NAMES,
  buildThemeVars,
  findAccent,
  findPrimary,
  type CategorizedOption,
} from '@nswds/ui/lib/theme-palette'
import { definePreview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'

import { mswHandlers } from './msw-handlers'

initialize({ onUnhandledRequest: 'bypass' })

// Discovery summary:
// - Pure component library; no providers, no data fetching, no portals.
// - CSS variables for light/dark are applied via the `.dark` class on a
//   parent element.
// - Primary and accent globals override the @nswds/tokens scale vars
//   (--color-primary-50…-950, --color-accent-*, --color-grey-*) via
//   setProperty() on documentElement so previews update instantly.
// - The toolbar lists the UNION of brand + aboriginal options, prefixed
//   with their category (e.g. "Brand · Green", "Aboriginal · Earth Red"),
//   because Storybook's globalType items are static and can't react to a
//   category global. The category each chosen id belongs to is derived
//   from the palette data, so picks are always category-correct.

const categoryLabel: Record<CategorizedOption['category'], string> = {
  brand: 'Brand',
  aboriginal: 'Aboriginal',
}

const buildToolbarItems = (options: CategorizedOption[]) =>
  options.map((option) => ({
    value: option.id,
    title: `${categoryLabel[option.category]} · ${option.label}`,
  }))

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
    themePrimary: {
      name: 'Primary',
      description: 'Primary palette',
      defaultValue: DEFAULT_THEME.primaryId,
      toolbar: {
        icon: 'circlehollow',
        items: buildToolbarItems(ALL_PRIMARIES),
        dynamicTitle: true,
      },
    },
    themeAccent: {
      name: 'Accent',
      description: 'Accent palette',
      defaultValue: DEFAULT_THEME.accentId,
      toolbar: {
        icon: 'circlehollow',
        items: buildToolbarItems(ALL_ACCENTS),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    themePrimary: DEFAULT_THEME.primaryId,
    themeAccent: DEFAULT_THEME.accentId,
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark'

      const requestedPrimary =
        (context.globals.themePrimary as string | undefined) ??
        DEFAULT_THEME.primaryId
      const requestedAccent =
        (context.globals.themeAccent as string | undefined) ??
        DEFAULT_THEME.accentId

      // Look the ids up in the union. If a serialised global from an old URL
      // doesn't match anything, fall back to the defaults.
      const primaryId =
        findPrimary(requestedPrimary)?.id ?? DEFAULT_THEME.primaryId
      const accentId =
        findAccent(requestedAccent)?.id ?? DEFAULT_THEME.accentId

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark)

        const root = document.documentElement
        const vars = buildThemeVars(primaryId, accentId)

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
