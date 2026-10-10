/**
 * Pins the scope of globals.css's `@source` directives to packages/ui/src.
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

/** Every `@source` path in `css`, ignoring commented-out directives. */
function sourcePaths(css) {
  const code = stripComments(css)
  return [...code.matchAll(/@source\s+(?:not\s+)?['"]([^'"]+)['"]/g)].map((m) => m[1])
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
