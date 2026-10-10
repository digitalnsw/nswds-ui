/**
 * Tests for the font-stack guard.
 *
 * The guard exists because two font failures shipped silently (see the header
 * of check-font-stack.mjs), so a bug in it would let them ship again. Every
 * known way the NSW stacks can lose is a failing case below; the passing cases
 * are the real shapes the package and the documented consumer setups emit, so
 * the guard cannot become so strict it gets switched off.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { checkFontStack, findCycles, parseCss, resolveRoot } from './check-font-stack.mjs'

const SANS = `"Public Sans", -apple-system, BlinkMacSystemFont, sans-serif`
const MONO = `"JetBrains Mono", ui-monospace, monospace`
const TW_SANS = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
const TW_MONO = `ui-monospace, SFMono-Regular, Menlo, monospace`

/** What dist/styles.css carries after the fix: raw families unlayered, bridges in @layer theme. */
const OURS =
  `@layer theme{:root,:host{--font-sans:${SANS};--font-mono:${MONO};` +
  `--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}` +
  `:root{--font-family-sans:${SANS};--font-family-mono:${MONO}}`

/** What the app's own `@import 'tailwindcss'` appends in the two-build setup. */
const APP_DEFAULTS =
  `@layer theme{:root,:host{--font-sans:${TW_SANS};--font-mono:${TW_MONO};` +
  `--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}`

test('passes the fixed package stylesheet on its own', () => {
  assert.deepEqual(checkFontStack(OURS), [])
})

test('fails the theme.css self-reference cycle and names it', () => {
  const css = `@layer theme{:root,:host{--font-sans:var(--font-sans);--font-mono:var(--font-mono);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}`
  const problems = checkFontStack(css)
  assert.equal(problems.length, 4)
  assert.match(problems.join('\n'), /references itself/)
})

test('fails the two-build setup when the app does not map the families', () => {
  const problems = checkFontStack(OURS + APP_DEFAULTS, 'two-build')
  assert.equal(problems.length, 4)
  assert.match(problems[0], /^two-build: --default-font-family resolves to '-apple-system/)
})

test('passes the README mapping, with @theme and @theme inline output', () => {
  const plain =
    `@layer theme{:root,:host{--font-sans:var(--font-family-sans);--font-mono:var(--font-family-mono);` +
    `--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}`
  const inline =
    `@layer theme{:root,:host{--font-sans:var(--font-family-sans);--font-mono:var(--font-family-mono);` +
    `--default-font-family:var(--font-family-sans);--default-mono-font-family:var(--font-family-mono)}}`
  assert.deepEqual(checkFontStack(OURS + plain), [])
  assert.deepEqual(checkFontStack(OURS + inline), [])
})

test('fails a mapping whose target variable is not shipped (no fail-open on var())', () => {
  const withoutRaw = OURS.replace(/:root\{--font-family-sans[^}]*\}/, '')
  const mapping = `@layer theme{:root,:host{--font-sans:var(--font-family-sans);--default-font-family:var(--font-sans)}}`
  const problems = checkFontStack(withoutRaw + mapping)
  assert.match(problems.join('\n'), /--font-family-sans: not declared on :root/)
})

test('uses a var() fallback when the referenced property is undeclared', () => {
  const parsed = parseCss(`:root{--a:var(--missing, ${SANS})}`)
  assert.deepEqual(resolveRoot(parsed, '--a'), {
    ok: true,
    value: SANS,
    chain: ['--a'],
  })
})

test('unlayered beats layered regardless of source order', () => {
  const parsed = parseCss(`:root{--x:unlayered}@layer theme{:root{--x:layered}}`)
  assert.equal(resolveRoot(parsed, '--x').value, 'unlayered')
})

test('layer order comes from first appearance, including @layer statements', () => {
  const parsed = parseCss(
    `@layer base, theme;@layer theme{:root{--x:theme}}@layer base{:root{--x:base}}`,
  )
  assert.equal(resolveRoot(parsed, '--x').value, 'theme')
})

test('refuses to guess when a needed property is declared under @media or another selector', () => {
  const media = OURS + `@media (min-width:1px){:root{--font-sans:${TW_SANS}}}`
  assert.match(checkFontStack(media).join('\n'), /does not model/)
  // Only properties on the resolution path matter: the mapping pulls
  // --font-family-sans into the chain, so a scoped redeclaration of it must stop the check.
  const mapping = `@layer theme{:root,:host{--font-sans:var(--font-family-sans);--default-font-family:var(--font-family-sans)}}`
  const scoped = OURS + mapping + `.dark{--font-family-sans:${TW_SANS}}`
  assert.match(checkFontStack(scoped).join('\n'), /--font-family-sans: declared under/)
  // …and the same scoped declaration off the path is irrelevant, not an error.
  assert.deepEqual(checkFontStack(OURS + `.dark{--font-family-sans:${TW_SANS}}`), [])
})

test('refuses to guess on !important custom properties', () => {
  const css = OURS + `:root{--font-sans:${SANS} !important}`
  assert.match(checkFontStack(css).join('\n'), /does not model/)
})

test('is not fooled by structural characters inside url() and strings', () => {
  const css = `:root{--icon:url(data:image/svg+xml;base64,AAA{}=);--quote:"a;b}c"}` + OURS
  assert.deepEqual(checkFontStack(css), [])
  assert.equal(resolveRoot(parseCss(css), '--quote').value, '"a;b}c"')
})

test('escaped quotes and parens in selectors do not swallow the rest of the file', () => {
  // Real Tailwind output: an arbitrary-variant class with escaped `'`, `(` and `[`.
  const selector = String.raw`.\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]\:size-4 svg:not([class*='size-'])`
  const css =
    `${selector}{width:1rem}` +
    OURS +
    `:root{--font-sans:'Public Sans Variable', var(--font-family-sans)}`
  const parsed = parseCss(css)
  assert.equal(parsed.decls.filter((d) => d.prop === '--font-sans').length, 2)
  assert.match(resolveRoot(parsed, '--font-sans').value, /^'Public Sans Variable', "Public Sans"/)
})

test('findCycles reports direct and indirect cycles, and only cycles', () => {
  const css = `:root{--a:var(--a);--b:var(--c);--c:var(--b);--d:var(--undefined);--e:1px}`
  assert.deepEqual(findCycles(parseCss(css)).sort(), [
    '--a → --a',
    '--b → --c → --b',
    '--c → --b → --c',
  ])
})

test('an unused fallback reference is not a cycle; a primary-reference cycle is', () => {
  // Pinned against Chromium 151 (the engine the Storybook suite and the
  // consumer fixture's users run): with --base declared, `var(--base,
  // var(--font-sans))` computes to --base's value, so the self-reference in
  // the untaken fallback creates no cycle. Mutual primary references do.
  const css = `:root{--base:"Public Sans", sans-serif;--font-sans:var(--base, var(--font-sans));--a:var(--b, red);--b:var(--a, blue)}`
  const parsed = parseCss(css)
  assert.equal(resolveRoot(parsed, '--font-sans').value, '"Public Sans", sans-serif')
  assert.deepEqual(findCycles(parsed).sort(), ['--a → --b → --a', '--b → --a → --b'])
})

test('var( inside a quoted string or another identifier is not a reference', () => {
  // `content`-style string values and functions whose name ends in "var" are
  // text, not references: treating them as var() invents false cycles.
  const css = `:root{--q:"var(--q)";--s:'see var(--s) here';--f:myvar(--f);--r:var(--q)}`
  const parsed = parseCss(css)
  assert.deepEqual(findCycles(parsed), [])
  assert.equal(resolveRoot(parsed, '--q').value, '"var(--q)"')
  assert.equal(resolveRoot(parsed, '--f').value, 'myvar(--f)')
  assert.equal(resolveRoot(parsed, '--r').value, '"var(--q)"')
})

test('CLI exits 1 with ::error:: lines on failure and 0 on success', () => {
  const script = fileURLToPath(new URL('./check-font-stack.mjs', import.meta.url))
  const dir = mkdtempSync(join(tmpdir(), 'font-stack-'))
  const bad = join(dir, 'bad.css')
  const good = join(dir, 'good.css')
  writeFileSync(bad, OURS + APP_DEFAULTS)
  writeFileSync(good, OURS)

  const failed = spawnSync(process.execPath, [script, '--css', bad, '--label', 'fixture'], {
    encoding: 'utf8',
  })
  assert.equal(failed.status, 1)
  assert.match(failed.stderr, /::error::fixture: --default-font-family/)

  const passed = spawnSync(process.execPath, [script, '--css', good], { encoding: 'utf8' })
  assert.equal(passed.status, 0)

  // Usage errors exit 2, never 0 or 1: no --css, a flag as its value, an
  // unknown flag, and anything that is not an existing .css file.
  const notCss = join(dir, 'styles.txt')
  writeFileSync(notCss, OURS)
  for (const argv of [
    [],
    ['--css', '--label', 'x'],
    ['--css', good, '--verbose'],
    ['--css', join(dir, 'missing.css')],
    ['--css', notCss],
    ['--css', dir],
  ]) {
    const run = spawnSync(process.execPath, [script, ...argv], { encoding: 'utf8' })
    assert.equal(run.status, 2, `expected usage error for ${JSON.stringify(argv)}`)
  }
})
