/**
 * Tests for the theme-parity gate.
 *
 * These exist for the reason the portal-boundary and workflow-interpolation
 * tests exist (AGENTS.md §5): the gate guards a drift nothing else in CI can
 * see — the npm `:root` map and the registry `cssVars.light` map are
 * hand-maintained copies of one thing — so a bug in the gate lets them diverge
 * silently. Every way they can drift is a failing case below; the passing
 * cases keep the gate from being so strict it gets switched off.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { checkThemeParity, parseReducedMotion, parseRootVars } from './check-theme-parity.mjs'

const REDUCED_MOTION = {
  'animation-duration': '0.01ms !important',
  'animation-iteration-count': '1 !important',
  'transition-duration': '0.01ms !important',
}

/** A theme.css with the given :root map and (by default) the reduced-motion block. */
const themeCss = (vars, { motion = REDUCED_MOTION } = {}) => {
  const root = Object.entries(vars)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n')
  const motionDecls = Object.entries(motion)
    .map(([k, v]) => `    ${k}: ${v};`)
    .join('\n')
  return [
    ':root {',
    root,
    '}',
    '@media (prefers-reduced-motion: reduce) {',
    '  *,',
    '  ::before,',
    '  ::after {',
    motionDecls,
    '  }',
    '}',
  ].join('\n')
}

/** A registry.json string with a registry:theme item carrying the given maps. */
const registryJson = (light, { dark = {}, motion = REDUCED_MOTION } = {}) =>
  JSON.stringify({
    items: [
      {
        name: 'theme',
        type: 'registry:theme',
        cssVars: { theme: { 'font-heading': 'var(--font-sans)' }, light, dark },
        css: { '@media (prefers-reduced-motion: reduce)': { '*, ::before, ::after': motion } },
      },
      { name: 'button', type: 'registry:ui' },
    ],
  })

const MAP = { background: 'var(--surface-default)', primary: 'var(--action-default)' }
const failures = (theme, registry) => checkThemeParity(theme, registry).failures

// ─── The parser ─────────────────────────────────────────────────────────────

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

test('parseReducedMotion returns {} when the block is absent', () => {
  assert.deepEqual(parseReducedMotion(':root { --x: 1; }'), {})
})

// ─── Shapes that must pass ──────────────────────────────────────────────────

test('passes when :root and cssVars.light agree (map, dark, reduced-motion)', () => {
  assert.deepEqual(failures(themeCss(MAP), registryJson(MAP)), [])
})

// ─── Drifts that must fail ──────────────────────────────────────────────────

test('fails when :root has a key cssVars.light lacks', () => {
  const [msg] = failures(themeCss({ ...MAP, ring: 'var(--border-strong)' }), registryJson(MAP))
  assert.match(msg, /theme\.css :root defines --ring but registry cssVars\.light does not/)
})

test('fails when cssVars.light has a key :root lacks', () => {
  const [msg] = failures(themeCss(MAP), registryJson({ ...MAP, ring: 'var(--border-strong)' }))
  assert.match(msg, /registry cssVars\.light defines "ring" but theme\.css :root does not/)
})

test('fails when a shared key has different values', () => {
  const [msg] = failures(themeCss(MAP), registryJson({ ...MAP, primary: 'var(--nsw-blue-800)' }))
  assert.match(msg, /--primary differs/)
})

test('fails when cssVars.dark is non-empty (no matching theme.css dark override)', () => {
  const [msg] = failures(themeCss(MAP), registryJson(MAP, { dark: { primary: 'var(--x)' } }))
  assert.match(msg, /cssVars\.dark is non-empty/)
})

test('fails when the reduced-motion rule differs', () => {
  const registry = registryJson(MAP, {
    motion: { ...REDUCED_MOTION, 'transition-duration': '0.02ms !important' },
  })
  const [msg] = failures(themeCss(MAP), registry)
  assert.match(msg, /reduced-motion rule differs for transition-duration/)
})

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
  assert.match(
    run.stdout,
    /✔ Theme parity: \d+ tokens agree across theme\.css :root and registry cssVars\.light\./,
  )
})
