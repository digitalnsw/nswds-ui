import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
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
          return Object.entries(collectEntries(path))
        }

        const extension = extname(name)

        if (!extensions.has(extension) || name.endsWith('.stories.tsx')) {
          return []
        }

        const entryName = relative(srcDir, path).slice(0, -extension.length)

        return [[entryName, path]]
      })
      .sort(([entryNameA], [entryNameB]) =>
        (entryNameA ?? '').localeCompare(entryNameB ?? '')
      )
  )
}

function restoreUseClientDirectives(entries: Record<string, string>) {
  for (const [entryName, sourcePath] of Object.entries(entries)) {
    const source = readFileSync(sourcePath, 'utf8')

    if (
      !source.startsWith('"use client"') &&
      !source.startsWith("'use client'")
    ) {
      continue
    }

    const outputPath = join('dist', `${entryName}.js`)

    if (!existsSync(outputPath)) {
      continue
    }

    const output = readFileSync(outputPath, 'utf8')

    if (
      !output.startsWith('"use client"') &&
      !output.startsWith("'use client'")
    ) {
      writeFileSync(outputPath, `"use client"\n${output}`)
    }
  }
}

const entries = collectEntries(srcDir)

export default defineConfig({
  entry: entries,
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  bundle: false,
  splitting: false,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
  async onSuccess() {
    restoreUseClientDirectives(entries)
  },
})
