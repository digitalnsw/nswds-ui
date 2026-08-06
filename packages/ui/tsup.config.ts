import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

import { defineConfig } from 'tsup'

const srcDir = 'src'
const extensions = new Set(['.ts', '.tsx'])

function collectEntries(dir: string): Record<string, string> {
  return Object.fromEntries(
    readdirSync(dir)
      .flatMap((name) => {
        const path = join(dir, name)
        const stat = statSync(path)

        if (stat.isDirectory()) {
          // src/patterns/ holds registry-only worked examples (e.g. the form
          // patterns). They ship through the shadcn registry as blocks, never
          // in the npm tarball, so they are excluded from the bundle here.
          if (path === join(srcDir, 'patterns')) {
            return []
          }
          return Object.entries(collectEntries(path))
        }

        const extension = extname(name)

        if (
          !extensions.has(extension) ||
          name.endsWith('.stories.tsx') ||
          name === 'story-helpers.tsx' ||
          name.endsWith('.d.ts')
        ) {
          return []
        }

        const entryName = relative(srcDir, path).slice(0, -extension.length)

        return [[entryName, path]]
      })
      .sort(([entryNameA], [entryNameB]) => (entryNameA ?? '').localeCompare(entryNameB ?? '')),
  )
}

function restoreUseClientDirectives(entries: Record<string, string>) {
  for (const [entryName, sourcePath] of Object.entries(entries)) {
    const source = readFileSync(sourcePath, 'utf8')

    if (!source.startsWith('"use client"') && !source.startsWith("'use client'")) {
      continue
    }

    const outputPath = join('dist', `${entryName}.js`)

    if (!existsSync(outputPath)) {
      continue
    }

    const output = readFileSync(outputPath, 'utf8')

    if (!output.startsWith('"use client"') && !output.startsWith("'use client'")) {
      writeFileSync(outputPath, `"use client"\n${output}`)
    }
  }
}

// The ~3900 generated icon modules (src/icons/) are identical in shape, so
// running rollup-dts over them is pointless and slow — their declarations
// are written programmatically in onSuccess instead.
function writeIconDeclarations(entries: Record<string, string>) {
  for (const [entryName, sourcePath] of Object.entries(entries)) {
    if (!entryName.startsWith('icons/')) {
      continue
    }

    const outputPath = join('dist', `${entryName}.d.ts`)
    const source = readFileSync(sourcePath, 'utf8')

    if (entryName === 'icons/types' || entryName === 'icons/index') {
      // Both files are declaration-shaped already (type alias / re-exports).
      writeFileSync(outputPath, source.replace(/^\/\/ Generated[^\n]*\n/, ''))
      continue
    }

    const match = source.match(/export function (\w+)\(/)
    if (!match) {
      throw new Error(`Cannot find icon export in ${sourcePath}`)
    }

    writeFileSync(
      outputPath,
      `import type { IconProps } from './types.js'\nexport declare function ${match[1]}(props: IconProps): import('react').JSX.Element\n`,
    )
  }
}

const entries = collectEntries(srcDir)
const iconEntries = Object.fromEntries(
  Object.entries(entries).filter(([entryName]) => entryName.startsWith('icons/')),
)
const coreEntries = Object.fromEntries(
  Object.entries(entries).filter(([entryName]) => !entryName.startsWith('icons/')),
)

const shared = {
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
} satisfies Parameters<typeof defineConfig>[0]

// Clean ONCE, here, rather than via either config's `clean` option.
//
// tsup builds an exported array of configs in PARALLEL (`await Promise.all(...)`
// over the array — tsup 8.5.1, dist/index.js:1494), and `clean` is not scoped to
// the config that sets it: the dts task deletes `**/*.d.{ts,mts,cts}` across the
// whole outDir (dist/index.js:1365-1366). So `clean: true` on the core config
// raced writeIconDeclarations below — whenever the icons' onSuccess landed
// before the core dts task's clean, all ~3900 icon declarations were deleted
// while their .js siblings survived, which is precisely what publint reported
// (`exports["./icons"].types` missing, the matching `import` fine).
//
// It passed locally, where the core dts clean happens ~11s before the icons
// write, and failed on CI where the ordering flips — the worst kind of failure:
// green on the machine you develop on, red only sometimes on the machine that
// gates the merge.
//
// tsup loads and evaluates this module before starting any build, so cleaning at
// module scope is ordered before both configs by construction rather than by
// luck. Do not reintroduce `clean` on either config.
rmSync('dist', { recursive: true, force: true })

export default defineConfig([
  {
    ...shared,
    entry: coreEntries,
    dts: true,
    sourcemap: true,
    clean: false,
    async onSuccess() {
      restoreUseClientDirectives(coreEntries)
    },
  },
  // The ~3900 generated icon modules: no sourcemaps (trivial generated code
  // would triple the published size) and no rollup-dts (declarations are
  // formulaic and written programmatically instead).
  {
    ...shared,
    entry: iconEntries,
    dts: false,
    sourcemap: false,
    clean: false,
    async onSuccess() {
      writeIconDeclarations(iconEntries)
    },
  },
])
