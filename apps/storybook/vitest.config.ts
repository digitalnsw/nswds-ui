import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // Pre-bundle the component library deps so Vite doesn't reload mid-test.
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      // The bare entry does NOT cover subpath imports — each subpath is its
      // own optimize entry, and one discovered mid-run (a late-collected
      // story file importing a not-yet-scanned primitive) triggers a Vite
      // re-optimisation that reloads the tester page: the run then dies with
      // "Browser connection was closed" on whichever file was executing.
      // List every subpath packages/ui/src imports (grep @base-ui/react/).
      '@base-ui/react',
      '@base-ui/react/autocomplete',
      '@base-ui/react/button',
      '@base-ui/react/collapsible',
      '@base-ui/react/dialog',
      '@base-ui/react/field',
      '@base-ui/react/input',
      '@base-ui/react/menu',
      '@base-ui/react/menubar',
      '@base-ui/react/navigation-menu',
      '@base-ui/react/popover',
      '@base-ui/react/preview-card',
      '@base-ui/react/scroll-area',
      '@base-ui/react/separator',
      '@base-ui/react/tooltip',
      '@base-ui/react/use-render',
      '@tabler/icons-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      // `storybook/test` is a subpath export used by stories for `fn()` mocks.
      // Without pre-bundling, Vite's scanner can't resolve it cleanly in an
      // npm workspace.
      'storybook/test',
      // `aria-query` is a CJS-only package consumed by @storybook/addon-vitest's
      // setup file. Without pre-bundling, Vite serves it raw and the named
      // exports (elementRoles, roles, aria) don't round-trip through ESM.
      'aria-query',
      // Storybook framework + addons. Pre-bundling these prevents Vite from
      // re-optimising mid-test (which knocks Vitest out of its suite context
      // and causes "Vitest failed to find the current suite" errors).
      '@storybook/react-vite',
      '@storybook/addon-a11y',
      'msw-storybook-addon',
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            // Vitest 4 requires a factory, not a string.
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          // No setupFiles needed — @storybook/addon-vitest 10.3+ applies
          // preview annotations automatically.
          //
          // 30s, not the 15s default: story files run in parallel pages of
          // one browser, and the heavily interactive plays (navigation
          // drills, dialog open/close, real transition settles) accumulate
          // many individually-bounded waits that stretch under that load —
          // none fails, but the sum can cross 15s and report as a bare
          // timeout. Genuine hangs still fail, just at 30s.
          testTimeout: 30_000,
        },
      },
    ],
  },
})
