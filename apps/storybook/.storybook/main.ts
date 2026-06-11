import type { StorybookConfig } from '@storybook/react-vite'
import { createRequire } from 'module'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// `storybook` CLI is hoisted to the root node_modules, but the framework
// adapter lives in this workspace's node_modules. Resolve to the package
// directory (not the entry point) so that Storybook's preset validator can
// find `<frameworkDir>/preset.js` — which is what it looks for internally.
const require = createRequire(import.meta.url)
const frameworkDir = dirname(
  require.resolve('@storybook/react-vite/package.json')
)

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.mdx',
    '../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    require.resolve('@storybook/addon-vitest'),
  ],
  framework: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: frameworkDir as any,
    options: {},
  },
  viteFinal: async (config) => {
    const { default: tailwindcss } = await import('@tailwindcss/vite')
    config.plugins = [...(config.plugins ?? []), tailwindcss()]

    // `@nswds/ui/globals.css` is a workspace-internal specifier that exists
    // ONLY through this alias (the package's exports map ships compiled CSS
    // as `./styles.css`). It points at the SOURCE dev entry so the Vite
    // Tailwind plugin can scan packages/ui/src (and apps/**) live and emit
    // utilities for whatever the stories actually use; the matching tsconfig
    // path in apps/storybook/tsconfig.json keeps typecheck happy.
    const here = dirname(fileURLToPath(import.meta.url))
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined),
      '@nswds/ui/globals.css': resolve(
        here,
        '../../../packages/ui/src/styles/globals.css'
      ),
    }

    return config
  },
}

export default config
