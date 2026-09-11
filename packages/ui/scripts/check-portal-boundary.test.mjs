/**
 * Tests for the portal-boundary gate.
 *
 * These exist for the reason the workflow-interpolation tests exist (AGENTS.md
 * §5): the gate guards something nothing else in CI exercises, so a mistake in
 * it is invisible until it has already let a leak through. Its first version
 * did exactly that — it checked that a portal's first child STARTED WITH
 * `<ButtonGroupBoundary`, so a self-closing boundary, a boundary closed around
 * one branch, and a component merely named like it all passed while leaving
 * the popup inside the group's context. Every one of those is a case below.
 *
 * The passing cases matter as much as the failing ones: a gate that fails on
 * every real file gets switched off, so the shapes the nine real portals use —
 * a namespaced tag, props spread onto it, a JSX comment before the boundary —
 * are pinned as passes.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { checkPortals } from './check-portal-boundary.mjs'

/** A component whose only JSX is the given portal markup. */
const component = (jsx) =>
  `export function Example({ children, ...props }) {\n  return (\n${jsx}\n  )\n}\n`
const failures = (jsx) => checkPortals(component(jsx)).failures.map((failure) => failure.message)

// ─── Shapes that must pass ──────────────────────────────────────────────────

test('passes a boundary that encloses the whole portal', () => {
  const result = checkPortals(
    component(
      '<Dialog.Portal><ButtonGroupBoundary><Popup /></ButtonGroupBoundary></Dialog.Portal>',
    ),
  )
  assert.equal(result.portals, 1)
  assert.deepEqual(result.failures, [])
})

test('passes the shape the real portals use: props spread, a comment, then the boundary', () => {
  const jsx = [
    "    <SheetPrimitive.Portal data-slot='sheet-portal' {...props}>",
    '      {/* Stops a ButtonGroup context at the portal — see ButtonGroupBoundary. */}',
    '      <ButtonGroupBoundary>',
    '        <SheetPrimitive.Backdrop />',
    '        <SheetPrimitive.Popup>{children}</SheetPrimitive.Popup>',
    '      </ButtonGroupBoundary>',
    '    </SheetPrimitive.Portal>',
  ].join('\n')
  assert.deepEqual(failures(jsx), [])
})

test('passes a bare <Portal>', () => {
  assert.deepEqual(
    failures('<Portal><ButtonGroupBoundary>{children}</ButtonGroupBoundary></Portal>'),
    [],
  )
})

test('ignores a local wrapper, which renders a primitive portal of its own', () => {
  const result = checkPortals(component('<DrawerPortal><Popup /></DrawerPortal>'))
  assert.equal(result.portals, 0)
  assert.deepEqual(result.failures, [])
})

test('ignores a portal that is only mentioned in a comment', () => {
  const source = [
    '/** Wraps content the way `<Dialog.Portal>` does, then renders it. */',
    component(
      '<Dialog.Portal><ButtonGroupBoundary><Popup /></ButtonGroupBoundary></Dialog.Portal>',
    ),
  ].join('\n')
  const result = checkPortals(source)
  assert.equal(result.portals, 1)
  assert.deepEqual(result.failures, [])
})

// ─── Shapes that leak, and must fail ────────────────────────────────────────

test('fails a portal with no boundary', () => {
  assert.match(
    failures('<Dialog.Portal><Popup /></Dialog.Portal>')[0],
    /only child .* must be <ButtonGroupBoundary>/,
  )
})

test('fails a self-closing portal, which wraps nothing', () => {
  assert.match(failures('<Dialog.Portal />')[0], /self-closing, so it wraps nothing/)
})

test('fails a portal whose only content is whitespace and comments', () => {
  assert.match(
    failures('<Dialog.Portal>\n  {/* nothing */}\n</Dialog.Portal>')[0],
    /has no children/,
  )
})

test('fails a self-closing boundary followed by the popup', () => {
  assert.match(
    failures('<Dialog.Portal><ButtonGroupBoundary /><Popup /></Dialog.Portal>')[0],
    /<ButtonGroupBoundary \/> inside <Dialog\.Portal> is self-closing/,
  )
})

test('fails a boundary that closes before the rest of the portal', () => {
  const [message] = failures(
    '<Dialog.Portal><ButtonGroupBoundary><Backdrop /></ButtonGroupBoundary><Popup /></Dialog.Portal>',
  )
  assert.match(message, /closes before the end of <Dialog\.Portal>: 1 more child sits outside it/)
  assert.match(message, /<Popup \/>/)
})

test('fails a component whose name only starts with the boundary name', () => {
  assert.match(
    failures(
      '<Dialog.Portal><ButtonGroupBoundaryLegacy><Popup /></ButtonGroupBoundaryLegacy></Dialog.Portal>',
    )[0],
    /only child .* found `<ButtonGroupBoundaryLegacy>/,
  )
})

test('fails a conditional child, which the check cannot prove is the boundary', () => {
  assert.match(
    failures(
      '<Dialog.Portal>{open && <ButtonGroupBoundary><Popup /></ButtonGroupBoundary>}</Dialog.Portal>',
    )[0],
    /only child .* found `\{open &&/,
  )
})

test('fails createPortal, which bypasses the component-level portal', () => {
  const result = checkPortals("import { createPortal } from 'react-dom'\n")
  assert.equal(result.failures.length, 1)
  assert.match(result.failures[0].message, /createPortal/)
})

// ─── Reporting ──────────────────────────────────────────────────────────────

test('checks every portal in a file, and reports each at its own line', () => {
  const source = [
    'export const A = () => (',
    '  <Dialog.Portal><ButtonGroupBoundary><Popup /></ButtonGroupBoundary></Dialog.Portal>',
    ')',
    'export const B = () => (',
    '  <Tooltip.Portal><Popup /></Tooltip.Portal>',
    ')',
  ].join('\n')
  const result = checkPortals(source)
  assert.equal(result.portals, 2)
  assert.equal(result.failures.length, 1)
  assert.equal(result.failures[0].line, 5)
})

// ─── The command line ───────────────────────────────────────────────────────

test('runs the check when invoked directly, and passes the real source tree', () => {
  // Everything above tests `checkPortals`. This tests that the script CALLS
  // it: the command-line entry is guarded so the tests can import the module,
  // and a guard that never fires leaves a gate that exits 0 having checked
  // nothing — which is what a `file://` + path template did from any path
  // containing a space.
  const script = fileURLToPath(new URL('./check-portal-boundary.mjs', import.meta.url))
  const run = spawnSync(process.execPath, [script], { encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
  assert.match(
    run.stdout,
    /✔ Portal boundary: \d+ components reset the button group at \d+ portals\./,
  )
})

test('fails a leaking file when run from a path containing a space', () => {
  // The exact regression the guard comment describes: from a spaced path the
  // old entry guard never fired, so this leak exited 0 with no output.
  const root = mkdtempSync(join(tmpdir(), 'portal gate '))
  try {
    mkdirSync(join(root, 'scripts'))
    mkdirSync(join(root, 'src'))
    copyFileSync(
      fileURLToPath(new URL('./check-portal-boundary.mjs', import.meta.url)),
      join(root, 'scripts', 'check-portal-boundary.mjs'),
    )
    // The gate imports `typescript`; resolve it from the repo's install.
    symlinkSync(
      fileURLToPath(new URL('../../../node_modules', import.meta.url)),
      join(root, 'node_modules'),
    )
    writeFileSync(
      join(root, 'src', 'leak.tsx'),
      'export const A = () => <X.Portal><Popup /></X.Portal>\n',
    )
    const run = spawnSync(process.execPath, [join(root, 'scripts', 'check-portal-boundary.mjs')], {
      encoding: 'utf8',
    })
    assert.equal(run.status, 1)
    assert.match(run.stderr, /src\/leak\.tsx:1: the only child of <X\.Portal>/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
