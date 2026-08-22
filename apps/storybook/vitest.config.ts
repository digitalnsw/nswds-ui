import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // Pre-bundle the component library deps so Vite doesn't reload mid-test.
  //
  // Why this list has to be maintained by hand: stories import `@nswds/ui` as
  // a bare specifier, and it is a workspace-LINKED package, so Vite treats it
  // as source and never pre-bundles it. Its own third-party imports are
  // therefore invisible to the cold-start scanner and get discovered one at a
  // time, as whichever story first pulls in that component executes.
  // Discovering a new dependency mid-run triggers a re-optimisation and a
  // FULL-PAGE RELOAD of the tester page (Vite's documented behaviour — see
  // `holdUntilCrawlEnd`), which kills whichever test file was running:
  //
  //     Cannot connect to the iframe […] don't forget to call event.preventDefault()
  //     Caused by: TypeError: Failed to fetch dynamically imported module: …/<random>.stories.tsx
  //
  // The victim is whatever happened to be executing, which is why the failure
  // roams and why it never reproduced locally, where a warm
  // node_modules/.vite cache means there is nothing left to discover. See
  // issue #83.
  //
  // This list is now the ONLY thing standing between the suite and that
  // failure. `msw-storybook-addon` used to mask it accidentally — its
  // `worker.start()` made startup slow enough (~100s vs ~25s) that discovery
  // settled before the suite got going — and MSW has since been removed, so
  // there is no longer any accidental cushion. A faster runner or a Storybook
  // upgrade would have taken it away regardless.
  //
  // `npm run check:optimize-deps -w @workspace/storybook` fails the build when
  // packages/ui/src grows an import that is missing here.
  optimizeDeps: {
    // Belt and braces over the list below: with discovery off, Vite cannot
    // re-optimise mid-run at all, so the reload race above is impossible by
    // construction rather than by the list happening to be complete. A
    // dependency that IS missing degrades to being served unbundled — slower,
    // still correct — except for CJS-only ones, which must be listed
    // explicitly under this setting or their named exports will not survive
    // the ESM round-trip (`react/jsx-dev-runtime` and `aria-query` below).
    noDiscovery: true,
    include: [
      'react',
      'react-dom',
      // Required by `noDiscovery` above: these are CJS and reach Vite only
      // through the JSX transform and @storybook/addon-vitest's setup file,
      // never through an import we wrote, so nothing else would list them.
      // Unbundled, their named exports do not round-trip through ESM and
      // every one of the 65 story files dies at import with "does not provide
      // an export named 'jsxDEV'" — verified, not theoretical.
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom/client',
      // The bare entry does NOT cover subpath imports — each subpath is its
      // own optimize entry. List every subpath packages/ui/src imports
      // (grep @base-ui/react/).
      '@base-ui/react',
      '@base-ui/react/autocomplete',
      '@base-ui/react/button',
      '@base-ui/react/collapsible',
      '@base-ui/react/dialog',
      '@base-ui/react/field',
      '@base-ui/react/input',
      '@base-ui/react/navigation-menu',
      '@base-ui/react/popover',
      '@base-ui/react/preview-card',
      '@base-ui/react/scroll-area',
      '@base-ui/react/separator',
      '@base-ui/react/slider',
      '@base-ui/react/tooltip',
      '@tabler/icons-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      // The rest of @nswds/ui's runtime `dependencies`. These were the four
      // missing entries behind #83: every one of them is imported by a
      // component that HAS a story (sonner.tsx, drawer.tsx → vaul,
      // resizable.tsx → react-resizable-panels, theme-switcher/sonner →
      // next-themes), so each was guaranteed to be discovered mid-run — a
      // reload apiece, at whatever point in the suite that story ran.
      // Keep in step with `dependencies` in packages/ui/package.json.
      'next-themes',
      'react-resizable-panels',
      'sonner',
      'vaul',
      // Imported by the .mdx docs pages, which sit under the same stories
      // glob as the test files (apps/storybook/.storybook/main.ts).
      '@storybook/addon-docs/blocks',
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
          browser: {
            enabled: true,
            // Vitest 4 requires a factory, not a string.
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          // Storybook needs no setupFiles — @storybook/addon-vitest 10.3+
          // applies preview annotations automatically. This one exists solely
          // for the vitest#9437 disk-leak workaround; see its header for the
          // mechanism and the removal condition.
          setupFiles: ['./vitest.setup.ts'],
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
