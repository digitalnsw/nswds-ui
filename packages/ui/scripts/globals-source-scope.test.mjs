/**
 * Pins the scope of globals.css's `@source` directives — and those of the
 * stylesheets it imports — to packages/ui/src.
 *
 * globals.css is shared by Storybook, apps/web and apps/infographics, so an
 * `@source` reaching outside packages/ui compiles one app's classes into every
 * other app's CSS. Nothing else in CI can see that: extra CSS changes no
 * pixels, so builds, Storybook and Chromatic all stay green. Each app gets its
 * own classes from Tailwind's automatic source detection instead (see the
 * header of globals.css).
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, relative, resolve, sep } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const globalsPath = resolve(here, '../src/styles/globals.css')
const srcDir = resolve(here, '../src')

/**
 * `css` with comments removed. String-aware, because the globs themselves
 * contain `/**\/` — a regex strip would read `apps/**\/*` as a comment.
 */
function stripComments(css) {
  let out = ''
  let quote = null
  for (let i = 0; i < css.length; i++) {
    const ch = css[i]
    if (quote) {
      out += ch
      if (ch === '\\') out += css[++i] ?? ''
      else if (ch === quote) quote = null
    } else if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      i = end === -1 ? css.length : end + 1
    } else {
      if (ch === '"' || ch === "'") quote = ch
      out += ch
    }
  }
  return out
}

/**
 * Every source path in `css` — `@source '…'` and `@import '…' source('…')` —
 * ignoring commented-out directives. `source(none)` is unquoted, so skipped.
 */
function sourcePaths(css) {
  const code = stripComments(css)
  return [
    ...[...code.matchAll(/@source\s+(?:not\s+)?['"]([^'"]+)['"]/g)].map((m) => m[1]),
    ...[...code.matchAll(/\bsource\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]),
  ]
}

/** `entry` plus every stylesheet it reaches through relative `@import`s. */
function reachableStylesheets(entry) {
  const seen = new Set()
  const queue = [entry]
  while (queue.length > 0) {
    const file = queue.shift()
    if (seen.has(file)) continue
    seen.add(file)
    const code = stripComments(readFileSync(file, 'utf8'))
    for (const m of code.matchAll(/@import\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
      queue.push(resolve(dirname(file), m[1]))
    }
  }
  return [...seen]
}

/** The `@source` paths in `css` whose static prefix resolves outside srcDir. */
function outOfScope(css, fromDir) {
  return sourcePaths(css).filter((p) => {
    const staticPrefix = p.split(/[*{]/)[0]
    const rel = relative(srcDir, resolve(fromDir, staticPrefix))
    return rel === '..' || rel.startsWith(`..${sep}`)
  })
}

test('globals.css declares no @source outside packages/ui/src', () => {
  const css = readFileSync(globalsPath, 'utf8')
  // Exact list, not just "non-empty": a parser that mangles the globs would
  // otherwise pass this test while checking nothing.
  assert.deepEqual(sourcePaths(css), ['../**/*.{ts,tsx}', '../**/*.mdx'])
  assert.deepEqual(outOfScope(css, dirname(globalsPath)), [])
})

// globals.css imports theme.css (which imports nswds-shadcn.css): a source
// declared in either reaches every app just the same, and theme.css also feeds
// the published stylesheet through package.css and tailwind.css.
test('no stylesheet globals.css imports declares a source outside packages/ui/src', () => {
  const imported = reachableStylesheets(globalsPath).filter((f) => f !== globalsPath)
  assert.deepEqual(imported.map((f) => relative(dirname(globalsPath), f)).sort(), [
    'nswds-shadcn.css',
    'theme.css',
  ])
  for (const file of imported) {
    assert.deepEqual(outOfScope(readFileSync(file, 'utf8'), dirname(file)), [], file)
  }
})

test('flags an @import source() outside packages/ui/src', () => {
  const css = [
    "@import 'tailwindcss' source(none);",
    "@import 'tailwindcss' source('../../../../apps');",
  ].join('\n')
  assert.deepEqual(outOfScope(css, dirname(globalsPath)), ['../../../../apps'])
})

test('flags the apps/** source this guards against, ignoring commented-out ones', () => {
  const css = [
    // A commented-out directive is ignored. (No glob here: `**/` contains the
    // `*/` that closes a CSS comment, in a browser as in this parser.)
    "/* @source '../../../../apps'; */",
    "@source '../**/*.{ts,tsx}';",
    "@source '../../../../apps/**/*.{ts,tsx}';",
  ].join('\n')
  assert.deepEqual(outOfScope(css, dirname(globalsPath)), ['../../../../apps/**/*.{ts,tsx}'])
})
