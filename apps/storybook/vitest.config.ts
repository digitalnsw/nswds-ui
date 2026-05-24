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
      '@headlessui/react',
      '@tabler/icons-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
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
        },
      },
    ],
  },
})
