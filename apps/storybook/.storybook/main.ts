import type { StorybookConfig } from '@storybook/react-vite'
import { createRequire } from 'module'
import { dirname } from 'path'

// `storybook` CLI is hoisted to the root node_modules, but the framework
// adapter lives in this workspace's node_modules. Resolve to the package
// directory (not the entry point) so that Storybook's preset validator can
// find `<frameworkDir>/preset.js` — which is what it looks for internally.
const require = createRequire(import.meta.url)
const frameworkDir = dirname(require.resolve('@storybook/react-vite/package.json'))

const config: StorybookConfig = {
  stories: ['../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
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
    config.resolve = { ...config.resolve, tsconfigPaths: true }
    return config
  },
}

export default config
