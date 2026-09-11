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
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
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

test('flags a #-commented line inside a run block', () => {
  // A shell `#` does not comment out an interpolation: substitution happens
  // before bash parses, so `#` only comments out the FIRST line of the value.
  // A PR title of "x\nid" turns this into two lines and runs the second.
  // An earlier version exempted these, on the false premise that release.yml
  // needed it — every `${{ }}` in that file's comments is a YAML comment
  // OUTSIDE the run scalar, which the scanner never sees anyway.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: |',
    '          # ${{ github.event.pull_request.title }}',
    '          echo hi',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ['github.event.pull_request.title'])
})

test('scans a multi-line plain scalar continuation of an inline run', () => {
  // A YAML plain scalar continues onto lines indented past its key, so this is
  // ONE script. Treating the inline form as single-line left the second line
  // unscanned and the gate silently reported the step clean.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: echo',
    '          ${{ github.ref }}',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ['github.ref'])
})

test('an inline run ends at a sibling key, not at the next interpolation', () => {
  // The continuation rule must not swallow the step's own env:/with: blocks —
  // those are expression context and flagging them would be a false positive
  // on the very pattern this gate tells people to use.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: echo "$TAG"',
    '        env:',
    '          TAG: ${{ steps.after.outputs.tag }}',
    '        with:',
    '          ref: ${{ github.head_ref }}',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), [])
})

test('flags an expression whose body contains a brace', () => {
  // `format()` takes `{N}` placeholders, so a `}` before the delimiter is an
  // ordinary form — and the dangerous one, since PR titles accept newlines.
  // Under the old `[^}]*` this matched nothing at all.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: |',
    "          echo ${{ format('{0}', github.event.pull_request.title) }}",
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ["format('{0}', github.event.pull_request.title)"])
})

test('a brace-carrying expression does not mask a second one on the same line', () => {
  // The old pattern reported only `github.ref` here, dropping the interpolation
  // that mattered — a partial result reads exactly like a complete one.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    "      - run: echo ${{ format('{0}', github.head_ref) }} ${{ github.ref }}",
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ["format('{0}', github.head_ref)", 'github.ref'])
})

test('scans the body of a block scalar whose header carries a comment', () => {
  // `run: | # why` is legal YAML. RUN_BLOCK now matches it directly; before, it
  // fell through to RUN_INLINE, which scanned the body correctly but only as an
  // emergent consequence of regex ordering.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: | # why',
    '          echo ${{ github.event.pull_request.title }}',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), ['github.event.pull_request.title'])
})

test('does NOT flag an expression inside the block header YAML comment', () => {
  // That comment is not part of the scalar, so Actions never substitutes into
  // it. Flagging it would be a false positive that pushes people to work around
  // the gate.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: | # see ${{ github.ref }}',
    '          echo hi',
    '',
  ].join('\n')
  assert.deepEqual(expressions(yaml), [])
})

test('flags an interpolation that spans lines rather than passing it silently', () => {
  // This scanner reads a line at a time, so a `${{` closed on a later line
  // matches nothing. Reporting the opener fails loudly on a form it cannot
  // read, instead of calling the file clean without finishing it.
  const yaml = [
    'jobs:',
    '  a:',
    '    steps:',
    '      - run: |',
    '          echo ${{',
    '            github.event.pull_request.title',
    '          }}',
    '',
  ].join('\n')
  const found = findViolations(yaml)
  assert.equal(found.length, 1)
  assert.equal(found[0].unterminated, true)
  assert.equal(found[0].line, 5)
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

test('fails a violating workflow when run from a path with a space, through a symlink', () => {
  // Every test above calls `findViolations` directly; this one tests that the
  // script CALLS it. The command-line entry is guarded so these tests can
  // import the module, and a guard that never fires leaves a gate that exits 0
  // having scanned nothing — indistinguishable from a pass. Two paths broke
  // the original `file://` + path template, and this one takes both: the
  // directory name contains a space (`import.meta.url` is percent-encoded),
  // and on macOS `tmpdir()` sits under `/var`, a symlink to `/private/var`
  // (Node resolves symlinks for `import.meta.url`, not for `process.argv[1]`).
  const root = mkdtempSync(join(tmpdir(), 'workflow gate '))
  try {
    mkdirSync(join(root, 'scripts'))
    mkdirSync(join(root, '.github', 'workflows'), { recursive: true })
    copyFileSync(
      fileURLToPath(new URL('./check-workflow-interpolation.mjs', import.meta.url)),
      join(root, 'scripts', 'check-workflow-interpolation.mjs'),
    )
    writeFileSync(
      join(root, '.github', 'workflows', 'leak.yml'),
      [
        'name: leak',
        'on: pull_request',
        'jobs:',
        '  echo:',
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - name: Echo the title',
        '        run: echo "${{ github.event.pull_request.title }}"',
        '',
      ].join('\n'),
    )
    const run = spawnSync(
      process.execPath,
      [join(root, 'scripts', 'check-workflow-interpolation.mjs')],
      {
        encoding: 'utf8',
      },
    )
    assert.equal(run.status, 1, `expected the gate to fail; stdout: ${run.stdout}`)
    assert.match(run.stderr, /\.github\/workflows\/leak\.yml:8/)
    assert.match(run.stderr, /\$\{\{ github\.event\.pull_request\.title \}\}/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
