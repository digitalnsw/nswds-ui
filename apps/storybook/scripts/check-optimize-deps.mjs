// Drift guard for `optimizeDeps.include` in vitest.config.ts.
//
// Stories import `@nswds/ui` as a bare specifier, and it is a workspace-LINKED
// package, so Vite treats it as source and never pre-bundles it. That makes
// its third-party imports invisible to the cold-start dependency scanner: they
// are discovered one at a time, as whichever story first renders that
// component executes. Discovering a dependency mid-run triggers a
// re-optimisation and a full-page reload of the tester page, which kills
// whichever test file was running with a misleading error:
//
//     Cannot connect to the iframe […] don't forget to call event.preventDefault()
//     Caused by: TypeError: Failed to fetch dynamically imported module: …/<x>.stories.tsx
//
// The victim roams (it is whatever was executing) and it never reproduces
// locally, where a warm node_modules/.vite cache leaves nothing to discover —
// which is what made issue #83 so hard to pin down. Four of @nswds/ui's own
// runtime dependencies had gone missing from the list by the time it was
// filed, each one a guaranteed reload.
//
// So: every bare import reachable from packages/ui/src must be pre-bundled.
// This asserts that, because the list is maintained by hand and silently
// rots — a new component with a new dependency reintroduces the flake, and
// CI's only symptom is an unrelated story failing intermittently.
//
// One-directional on purpose: entries in the list that nothing under
// packages/ui/src imports are NOT flagged. Some are legitimately there for
// dependencies pulled in by @storybook/addon-vitest's own setup rather than by
// our source (`aria-query`, the Storybook framework packages).

import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(here, '..', 'vitest.config.ts')
const sourceRoot = path.join(here, '..', '..', '..', 'packages', 'ui', 'src')

// Resolved through the workspace link, deliberately NOT pre-bundled: doing so
// would freeze a copy of dist/ into the optimize cache, so a local rebuild of
// @nswds/ui would silently test the previous build.
const LINKED = '@nswds/ui'

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(full)
    return /\.(tsx?|mdx)$/.test(entry.name) ? [full] : []
  })
}

/** Bare (non-relative) specifiers imported anywhere under packages/ui/src. */
function importedPackages() {
  const found = new Map()
  for (const file of sourceFiles(sourceRoot)) {
    const contents = readFileSync(file, 'utf8')
    for (const match of contents.matchAll(/\bfrom\s+'([^'.][^']*)'/g)) {
      const specifier = match[1]
      if (specifier === LINKED || specifier.startsWith(`${LINKED}/`)) continue
      if (!found.has(specifier)) found.set(specifier, path.relative(sourceRoot, file))
    }
  }
  return found
}

/**
 * String literals inside the `include: [ … ]` array of vitest.config.ts.
 *
 * Read line by line with comments stripped first, because the comments in that
 * config are dense with apostrophes ("Vite's scanner", "@nswds/ui's runtime
 * dependencies") and a regex for quoted strings run over the raw text pairs
 * those apostrophes with each other, silently swallowing the entries between
 * them.
 */
function includedPackages() {
  const lines = readFileSync(configPath, 'utf8').split('\n')
  const start = lines.findIndex((line) => line.includes('include: ['))
  if (start === -1) {
    console.error(
      'Could not find `include: [` in apps/storybook/vitest.config.ts — has the config been restructured?',
    )
    process.exit(1)
  }
  const included = new Set()
  for (const raw of lines.slice(start + 1)) {
    const line = raw.replace(/\/\/.*$/, '')
    if (line.includes(']')) break
    for (const match of line.matchAll(/'([^']+)'/g)) included.add(match[1])
  }
  return included
}

const imported = importedPackages()
const included = includedPackages()
const missing = [...imported].filter(([specifier]) => !included.has(specifier))

if (missing.length > 0) {
  console.error('Dependencies imported by packages/ui/src are missing from optimizeDeps.include:\n')
  for (const [specifier, file] of missing) {
    console.error(`  - ${specifier}  (first seen in ${file})`)
  }
  console.error(
    `\nAdd them to \`optimizeDeps.include\` in apps/storybook/vitest.config.ts.\nLeaving one out makes the Storybook Vitest job intermittently fail on an\nunrelated story — see issue #83 and the comment above that list.`,
  )
  process.exit(1)
}

console.log(`✔ all ${imported.size} packages imported by packages/ui/src are pre-bundled.`)
