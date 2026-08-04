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
      '@base-ui/react',
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
          // Load story files one at a time. Until MSW was removed, its
          // `worker.start()` awaited service-worker activation on every file
          // and throttled startup as a side effect (~100s of setup vs ~25s
          // without). Nothing replaced that, so all 54 files began loading at
          // once; on a 2-core CI runner the dev server dropped module
          // requests and the browser reloaded mid-run, surfacing as
          // "Cannot connect to the iframe" / "Failed to fetch dynamically
          // imported module" against a different, random story each time.
          // Passes locally either way — this only bites under CI's core count.
          fileParallelism: false,
          browser: {
            enabled: true,
            // Vitest 4 requires a factory, not a string.
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          // No setupFiles needed — @storybook/addon-vitest 10.3+ applies
          // preview annotations automatically.
        },
      },
    ],
  },
})
