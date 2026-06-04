import '@nswds/ui/globals.css'
import {
  DEFAULT_THEME,
  THEME_VAR_NAMES,
  buildThemeVars,
  resolveAccentHue,
  resolvePrimaryHue,
  type ThemeCategory,
} from '@nswds/ui/lib/theme-palette'
import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'
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

// Languages relevant to NSW Government communications. When `language` is set
// to one of these RTL codes, the decorator flips `direction` to `rtl` unless
// the user has explicitly overridden it.
const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur'])

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
    language: {
      name: 'Language',
      description: 'Locale for content previews — sets the `lang` attribute',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'ar', title: 'Arabic' },
          { value: 'zh-Hans', title: 'Chinese (Simplified)' },
          { value: 'zh-Hant', title: 'Chinese (Traditional)' },
          { value: 'vi', title: 'Vietnamese' },
          { value: 'ko', title: 'Korean' },
          { value: 'hi', title: 'Hindi' },
          { value: 'el', title: 'Greek' },
          { value: 'es', title: 'Spanish' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      name: 'Direction',
      description: 'Text direction — sets the `dir` attribute',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'left-to-right (ltr)' },
          { value: 'rtl', title: 'right-to-left (rtl)' },
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
    language: 'en',
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
        context.globals.themePrimary as string | undefined
      )
      const accentHue = resolveAccentHue(
        category,
        primaryHue,
        context.globals.themeAccent as string | undefined
      )

      const language = (context.globals.language as string | undefined) ?? 'en'
      // If the chosen language is RTL and the user hasn't explicitly set
      // direction to something else, default to rtl.
      const requestedDirection = context.globals.direction as string | undefined
      const direction =
        requestedDirection ?? (RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr')

      if (typeof document !== 'undefined') {
        const root = document.documentElement
        root.classList.toggle('dark', isDark)
        root.setAttribute('lang', language)
        root.setAttribute('dir', direction)

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
          'Getting Started',
          ['Welcome'],
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
      test: 'error',
      // Pin axe-core to WCAG 2.x AA tags only. NSW Government digital products
      // are required to meet WCAG 2.1 AA (not AAA), so:
      //   - AA contrast (4.5:1 normal, 3:1 large/UI) is enforced
      //   - AAA contrast (7:1 / 4.5:1) is NOT enforced
      //   - Best-practice / experimental / needs-review rules are NOT enforced
      // Drop 'wcag22aa' if a 2.2 AA rule starts producing false positives
      // before NSW formally adopts 2.2.
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      },
    },
    msw: {
      handlers: mswHandlers,
    },
  },

  addons: [addonDocs(), addonA11y()],
})
