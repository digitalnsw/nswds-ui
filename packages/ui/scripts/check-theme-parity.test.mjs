/**
 * Tests for the theme-parity gate.
 *
 * These exist for the reason the portal-boundary and workflow-interpolation
 * tests exist (AGENTS.md §5): the gate guards a drift nothing else in CI can
 * see — the npm (`theme.css`) and registry (`cssVars`/`css`) copies of one map
 * — so a bug in the gate lets them diverge silently. Every way they can drift
 * is a failing case below; the passing cases keep the gate from being so strict
 * it gets switched off.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  checkThemeParity,
  parseDarkVars,
  parseReducedMotion,
  parseRootVars,
} from './check-theme-parity.mjs'

const RM_AT_RULE = '@media (prefers-reduced-motion: reduce)'
const MOTION_SELECTOR = '*, ::before, ::after'
const REDUCED_MOTION = {
  'animation-duration': '0.01ms !important',
  'animation-iteration-count': '1 !important',
  'transition-duration': '0.01ms !important',
}

const declLines = (obj, indent) =>
  Object.entries(obj)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n')

const motionBlock = (selector, decls) =>
  `${RM_AT_RULE} {\n  ${selector} {\n${declLines(decls, '    ')}\n  }\n}`

/** A theme.css with the given :root map, optional .dark block, and a
 *  reduced-motion block (selector + decls overridable), plus any extra raw CSS. */
const varBlock = (selector, vars) =>
  `${selector} {\n${Object.entries(vars)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n')}\n}`

const themeCss = (
  vars,
  { dark = null, motionSelector = MOTION_SELECTOR, motion = REDUCED_MOTION, extra = '' } = {},
) => {
  const parts = [varBlock(':root', vars)]
  if (dark) parts.push(varBlock('.dark', dark))
  parts.push(motionBlock(motionSelector, motion))
  if (extra) parts.push(extra)
  return parts.join('\n')
}

/** A registry.json string with a registry:theme item carrying the given maps. */
const registryJson = (light, { dark = {}, motion = { [MOTION_SELECTOR]: REDUCED_MOTION } } = {}) =>
  JSON.stringify({
    items: [
      {
        name: 'theme',
        type: 'registry:theme',
        cssVars: { theme: { 'font-heading': 'var(--font-sans)' }, light, dark },
        css: { [RM_AT_RULE]: motion },
      },
      { name: 'button', type: 'registry:ui' },
    ],
  })

const MAP = { background: 'var(--surface-default)', primary: 'var(--action-default)' }
const failures = (theme, registry) => checkThemeParity(theme, registry).failures

// ─── The parsers ────────────────────────────────────────────────────────────

test('parseRootVars reads :root and ignores @theme blocks and comments', () => {
  const css = [
    ':root {',
    '  /* a comment */',
    '  --background: var(--surface-default);',
    '  --primary: var(--action-default); /* trailing */',
    '}',
    '@theme inline {',
    '  --color-primary: var(--primary);', // must NOT be picked up
    '}',
  ].join('\n')
  assert.deepEqual(parseRootVars(css), MAP)
})

test('parseDarkVars reads .dark / [data-theme=dark] blocks, not the @custom-variant', () => {
  const css = [
    "@custom-variant dark (&:is(.dark, .dark *, [data-theme='dark'], [data-theme='dark'] *));",
    ':root { --primary: var(--action-default); }',
    '.dark { --primary: var(--action-dark); }',
    "[data-theme='dark'] { --ring: var(--border-dark); }",
  ].join('\n')
  assert.deepEqual(parseDarkVars(css), {
    primary: 'var(--action-dark)',
    ring: 'var(--border-dark)',
  })
})

test('parseDarkVars is empty when there is no dark block (only the @custom-variant)', () => {
  const css = [
    "@custom-variant dark (&:is(.dark, .dark *, [data-theme='dark']));",
    ':root { --primary: var(--action-default); }',
  ].join('\n')
  assert.deepEqual(parseDarkVars(css), {})
})

test('parseReducedMotion is selector-aware and merges across media blocks', () => {
  const css = [
    motionBlock(MOTION_SELECTOR, REDUCED_MOTION),
    motionBlock('.marquee', { 'animation-iteration-count': '1 !important' }),
  ].join('\n')
  const rules = parseReducedMotion(css)
  assert.deepEqual(Object.keys(rules).sort(), ['*, ::before, ::after', '.marquee'])
  assert.equal(rules['*, ::before, ::after']['transition-duration'], '0.01ms !important')
  assert.equal(rules['.marquee']['animation-iteration-count'], '1 !important')
})

// ─── Shapes that must pass ──────────────────────────────────────────────────

test('passes when :root, dark and reduced-motion all agree (dark empty)', () => {
  assert.deepEqual(failures(themeCss(MAP), registryJson(MAP)), [])
})

test('passes when a dark override matches on both sides', () => {
  const theme = themeCss(MAP, { dark: { primary: 'var(--action-dark)' } })
  const registry = registryJson(MAP, { dark: { primary: 'var(--action-dark)' } })
  assert.deepEqual(failures(theme, registry), [])
})

// ─── Light-map drifts ───────────────────────────────────────────────────────

test('fails when :root has a key cssVars.light lacks', () => {
  const [msg] = failures(themeCss({ ...MAP, ring: 'var(--border-strong)' }), registryJson(MAP))
  assert.match(msg, /theme\.css :root defines --ring but registry cssVars\.light does not/)
})

test('fails when cssVars.light has a key :root lacks', () => {
  const [msg] = failures(themeCss(MAP), registryJson({ ...MAP, ring: 'var(--border-strong)' }))
  assert.match(msg, /registry cssVars\.light defines "ring" but theme\.css :root does not/)
})

test('fails when a shared light key has different values', () => {
  const [msg] = failures(themeCss(MAP), registryJson({ ...MAP, primary: 'var(--nsw-blue-800)' }))
  assert.match(msg, /--primary differs/)
})

// ─── Dark-map drifts (qodo #1) ──────────────────────────────────────────────

test('fails a CSS-only dark override (theme.css .dark, empty cssVars.dark)', () => {
  const [msg] = failures(
    themeCss(MAP, { dark: { primary: 'var(--action-dark)' } }),
    registryJson(MAP),
  )
  assert.match(msg, /defines --primary but registry cssVars\.dark does not/)
})

test('fails a registry-only dark override (cssVars.dark, no theme.css .dark)', () => {
  const [msg] = failures(
    themeCss(MAP),
    registryJson(MAP, { dark: { primary: 'var(--action-dark)' } }),
  )
  assert.match(msg, /registry cssVars\.dark defines "primary" but theme\.css/)
})

test('fails a differing dark value', () => {
  const theme = themeCss(MAP, { dark: { primary: 'var(--a)' } })
  const registry = registryJson(MAP, { dark: { primary: 'var(--b)' } })
  assert.match(failures(theme, registry)[0], /--primary differs/)
})

// ─── Reduced-motion drifts (qodo #2) ────────────────────────────────────────

test('fails when a reduced-motion value differs', () => {
  const registry = registryJson(MAP, {
    motion: {
      [MOTION_SELECTOR]: { ...REDUCED_MOTION, 'transition-duration': '0.02ms !important' },
    },
  })
  const [msg] = failures(themeCss(MAP), registry)
  assert.match(msg, /reduced-motion:.*transition-duration.*differs/)
})

test('fails when the theme narrows the reduced-motion selector', () => {
  const [msg] = failures(themeCss(MAP, { motionSelector: '.only-this' }), registryJson(MAP))
  assert.match(msg, /selector "\.only-this"|selector "\*, ::before, ::after"/)
})

test('fails when the registry adds an extra reduced-motion selector', () => {
  const registry = registryJson(MAP, {
    motion: { [MOTION_SELECTOR]: REDUCED_MOTION, '.extra': { 'animation-duration': '0s' } },
  })
  const [msg] = failures(themeCss(MAP), registry)
  assert.match(msg, /registry defines selector "\.extra" that theme\.css does not/)
})

test('catches drift in a SECOND reduced-motion media block in theme.css', () => {
  const theme = themeCss(MAP, { extra: motionBlock('.second', { 'animation-duration': '0s' }) })
  const [msg] = failures(theme, registryJson(MAP))
  assert.match(msg, /theme\.css defines selector "\.second" that the registry does not/)
})

// ─── Structural failures ────────────────────────────────────────────────────

test('fails when there is no registry:theme item', () => {
  const registry = JSON.stringify({ items: [{ name: 'button', type: 'registry:ui' }] })
  assert.match(failures(themeCss(MAP), registry)[0], /no `registry:theme` item/)
})

test('fails when :root has no custom properties', () => {
  assert.match(
    failures(':root {\n}', registryJson(MAP))[0],
    /No `:root \{ \}` custom properties found/,
  )
})

test('fails on invalid registry JSON', () => {
  assert.match(failures(themeCss(MAP), '{ not json')[0], /not valid JSON/)
})

// ─── The command line ───────────────────────────────────────────────────────

test('runs the check when invoked directly, and passes the real source tree', () => {
  const script = fileURLToPath(new URL('./check-theme-parity.mjs', import.meta.url))
  const cwd = fileURLToPath(new URL('..', import.meta.url)) // packages/ui
  const run = spawnSync(process.execPath, [script], { cwd, encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
  assert.match(run.stdout, /✔ Theme parity: \d+ tokens agree/)
})
