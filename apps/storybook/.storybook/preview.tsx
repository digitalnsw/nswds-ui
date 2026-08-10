import '@nswds/ui/globals.css'
import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'
import { definePreview } from '@storybook/react-vite'
import {
  DEFAULT_THEME,
  THEME_VAR_NAMES,
  buildThemeVars,
  resolveAccentHue,
  resolvePrimaryHue,
  type ThemeCategory,
} from '@workspace/theme-tools'
import addonMsw from 'msw-storybook-addon'
import { setupWorker } from 'msw/browser'
import { useEffect, useState, type PropsWithChildren } from 'react'

import './docs.css'
import { mswHandlers } from './msw-handlers'

// msw-storybook-addon v3 owns the worker lifecycle: instead of a top-level
// `initialize()`, the addon takes a setup function and starts/stops the
// worker around each story. Per-story handlers go through `beforeEach({ msw })`
// (`msw.use(...)`), not the removed `parameters.msw` block.
const mswSetup = async () => {
  const worker = setupWorker(...mswHandlers)
  await worker.start({ onUnhandledRequest: 'bypass' })
  return worker
}

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
// to one of these RTL codes, the theme applier flips `direction` to `rtl` unless
// the user has explicitly overridden it.
const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur'])

type PreviewGlobals = {
  theme?: string
  themeCategory?: string
  themePrimary?: string
  themeAccent?: string
  language?: string
  direction?: string
}

// Storybook hands the preview its boot globals as `?globals=key:value;key2:v2`.
// Only the initial load is covered — the manager pushes later changes over the
// channel rather than rewriting the iframe URL — which is exactly what this is
// for: seeding `lastGlobals` before any story or docs page has rendered.
const globalsFromPreviewUrl = (): PreviewGlobals => {
  if (typeof window === 'undefined') return {}
  const raw = new URLSearchParams(window.location.search).get('globals')
  if (!raw) return {}

  return Object.fromEntries(
    raw
      .split(';')
      .map((pair) => pair.split(':'))
      .filter((parts) => parts.length === 2),
  )
}

// The most recent globals we've applied. A standalone MDX docs page (one with a
// bare `<Meta title>` and no attached CSF file, e.g. getting-started/welcome)
// has no story to read globals from, so it starts from this instead of
// defaulting to light. Every applyPreviewTheme call keeps it current, which
// covers both story renders and the docs container's channel subscription.
let lastGlobals: PreviewGlobals = globalsFromPreviewUrl()

// Writes the toolbar/panel selection onto <html>: the `.dark` class, lang/dir,
// and the @nswds/tokens scale overrides. Shared by the story decorator and the
// docs container — decorators only wrap STORIES, so a docs page whose custom
// `docs.page` renders no story never ran this, leaving <html> with no class and
// no theme vars. That is why Dark, Category, Primary and Accent did nothing on
// a docs page while working everywhere else.
const applyPreviewTheme = (globals: PreviewGlobals) => {
  if (typeof document === 'undefined') return

  lastGlobals = globals

  const isDark = globals.theme === 'dark'
  const category = (globals.themeCategory ?? DEFAULT_THEME.category) as ThemeCategory

  // Coerce against the active category so a hue that doesn't exist for the
  // current palette can't render — picks always stay in one palette.
  const primaryHue = resolvePrimaryHue(category, globals.themePrimary)
  const accentHue = resolveAccentHue(category, primaryHue, globals.themeAccent)

  const language = globals.language ?? 'en'
  // If the chosen language is RTL and the user hasn't explicitly set direction
  // to something else, default to rtl.
  const direction = globals.direction ?? (RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr')

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

// Keeps a docs page in sync with the toolbar. The initial value comes from any
// story in the attached CSF file (they all carry the same globals), falling back
// to the last globals seen for a standalone MDX page that has none; after that
// `globalsUpdated` fires on every toolbar/panel change. Renders nothing.
const DocsThemeSync = ({ context }: { context: DocsContainerProps['context'] }) => {
  const [story] = context.componentStories()
  const [globals, setGlobals] = useState<PreviewGlobals>(() =>
    story ? (context.getStoryContext(story).globals as PreviewGlobals) : lastGlobals,
  )

  useEffect(() => {
    const onGlobalsUpdated = ({ globals: next }: { globals: PreviewGlobals }) => setGlobals(next)
    // 'globalsUpdated' is GLOBALS_UPDATED from storybook/internal/core-events —
    // inlined as a literal to avoid importing from an `internal/` entry point.
    context.channel.on('globalsUpdated', onGlobalsUpdated)
    return () => context.channel.off('globalsUpdated', onGlobalsUpdated)
  }, [context])

  applyPreviewTheme(globals)

  return null
}

// Storybook injects its own docs typography as UNLAYERED rules shaped like
//   .css-<hash> :where(h1:not(.sb-anchor, .sb-unstyled, .sb-unstyled h1)) { … }
// Unlayered CSS beats anything in a cascade layer regardless of specificity, so
// those rules defeat Tailwind v4 utilities (which live in `@layer utilities`) on
// every docs page: `text-4xl` renders at 32px, `text-base` at 14px,
// `text-muted-foreground` gets repainted, h2 grows a border, and the font falls
// back to Storybook's Nunito Sans. `.sb-unstyled` is Storybook's supported opt-out
// — every one of those selectors excludes its subtree. Applying it once here, at
// the docs container, covers every hand-authored `docs.page` in the library and
// anything added later, instead of relying on each story file to remember.
//
// The opt-out also strips the inline `<code>` chip, so it is restored in token
// terms below. `:not(pre) > code` keeps fenced/Source code blocks untouched.
const docsContainer = ({ children, ...props }: PropsWithChildren<DocsContainerProps>) => (
  <DocsContainer {...props}>
    <DocsThemeSync context={props.context} />
    <div className='sb-unstyled bg-background text-foreground [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[0.85em] [&_:not(pre)>code]:font-medium [&_:not(pre)>code]:text-foreground'>
      {children}
    </div>
  </DocsContainer>
)

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
      applyPreviewTheme(context.globals as PreviewGlobals)
      return Story()
    },
  ],

  parameters: {
    options: {
      storySort: {
        order: [
          'Getting Started',
          ['Welcome'],
          'Components',
          ['Button', ['Docs', 'Default', 'Playground', 'Features', 'Tests', 'Accessibility']],
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
      container: docsContainer,
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
  },

  addons: [addonDocs(), addonA11y(), addonMsw(mswSetup)],
})
