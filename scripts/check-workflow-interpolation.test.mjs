/**
 * Tests for the workflow-interpolation gate.
 *
 * These exist for the reason the semantic-release-config tests exist (AGENTS.md
 * §5): the gate guards a path nothing else in CI exercises, so a mistake in it
 * is invisible until it has already let something through. A scanner that
 * silently stops scanning still exits 0, which looks exactly like success.
 *
 * The cases that matter are the ones where the block-scalar rule could go
 * wrong — where a hit sits outside a run block and must NOT be reported, and
 * where one sits inside and must be.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { findViolations, shellLines } from './check-workflow-interpolation.mjs'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const expressions = (yaml) => findViolations(yaml).map((v) => v.expression)

test('flags an interpolation inside a block-scalar run', () => {
  const yaml = [
    'jobs:',
    '  release:',
    '    steps:',
    '      - name: Verify',
    '        run: |',
    '          expected="${{ steps.after_release.outputs.tag }}"',
    '          echo "$expected"',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ['steps.after_release.outputs.tag'])
  assert.equal(findViolations(yaml)[0].line, 6)
})

test('flags an interpolation in an inline run', () => {
  const yaml = ['jobs:', '  a:', '    steps:', '      - run: echo ${{ github.head_ref }}', ''].join(
    '\n',
  )
  assert.deepEqual(expressions(yaml), ['github.head_ref'])
})

test('does NOT flag if:, with: or env: — expression context, not shell', () => {
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - name: Verify',
    '        if: ${{ steps.before.outputs.tag != steps.after.outputs.tag }}',
    '        env:',
    '          RELEASE_TAG: ${{ steps.after.outputs.tag }}',
    '        with:',
    '          ref: ${{ github.head_ref }}',
    '        run: |',
    '          echo "$RELEASE_TAG"',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), [])
})

test('ends the block at a sibling key of the same indent', () => {
  // The `env:` here follows the run block at the SAME indent as `run:`, so its
  // interpolation is outside the script. Treating "everything after run:" as
  // shell would report it.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: |',
    '          echo safe',
    '        env:',
    '          TOKEN: ${{ secrets.NPM_TOKEN }}',
    '      - run: |',
    '          echo also-safe',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), [])
})

test('keeps scanning a block across blank lines and deeper nesting', () => {
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: |',
    '          echo one',
    '',
    '          if true; then',
    '            echo ${{ github.event.issue.title }}',
    '          fi',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ['github.event.issue.title'])
})

test('handles block-scalar chomping and indent modifiers', () => {
  for (const marker of ['|', '|-', '|+', '>', '>-', '>2']) {
    const yaml = [
      'jobs:',
      '  a:',
      '    steps:',
      `      - run: ${marker}`,
      '          echo ${{ github.ref }}',
      '',
    ].join('\n')
    assert.deepEqual(expressions(yaml), ['github.ref'], `marker ${marker}`)
  }
})

test('ignores a #-commented line inside a run block', () => {
  // release.yml quotes the banned pattern in its own comments to explain the
  // rule. A gate that fails on its own rationale gets deleted.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: |',
    '          # never write expected="${{ steps.x.outputs.tag }}" here',
    '          echo "$RELEASE_TAG"',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), [])
})

test('honours the ALLOWED list, and only for an exact match', () => {
  const allowed = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: |',
    '          [ "${{ github.event.pull_request.head.repo.fork }}" = "true" ]',
    '',
  ].join('\n')
  assert.deepEqual(expressions(allowed), [])

  const notAllowed = allowed.replace('head.repo.fork', 'head.repo.full_name')
  assert.deepEqual(expressions(notAllowed), ['github.event.pull_request.head.repo.full_name'])
})

test('secrets are NOT exempt', () => {
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: |',
    '          if [ -n "${{ secrets.CHROMATIC_PROJECT_TOKEN }}" ]; then echo yes; fi',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ['secrets.CHROMATIC_PROJECT_TOKEN'])
})

test('reports every hit on a line, not just the first', () => {
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: echo ${{ github.ref }} ${{ github.sha }}',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ['github.ref', 'github.sha'])
})

test("the real release.yml is clean — the gate's original motivating file", () => {
  const yaml = readFileSync(join(repoRoot, '.github/workflows/release.yml'), 'utf8')
  assert.deepEqual(findViolations(yaml), [])
})

test('shellLines does not treat a non-run key as script', () => {
  const yaml = ['jobs:', '  a:', '    steps:', '      - name: run: not really', ''].join('\n')
  assert.deepEqual(shellLines(yaml), [])
})
