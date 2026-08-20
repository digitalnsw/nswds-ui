/**
 * Tests for `generatePushMenuBreadcrumb`.
 *
 * This function is the one piece of non-trivial pure logic in the package, and
 * it ships on BOTH channels — exported from the npm barrel, and copied verbatim
 * into consumer repos as part of the `push-menu` registry item. It had no test
 * coverage at all: push-menu.stories.tsx asserts only that the trail element
 * appears and disappears, never what it contains.
 *
 * Two defects motivated these tests, both against the published build:
 *
 *   - The middle-elision branch returned without re-checking `maxLength`, so a
 *     50-char budget could return 79 chars for four realistic NSW nav titles.
 *     With exactly four levels, elision replaces ONE title with "…", which
 *     saves nothing at all when that title is short.
 *   - The truncation fallback used `String.slice`, which cuts by UTF-16 unit
 *     and so could split a surrogate pair, emitting a lone surrogate that
 *     renders as U+FFFD.
 *
 * Run against `dist/`, not `src/`: the source is TSX (Node cannot strip JSX),
 * and testing the built artefact is what the rest of this repo's guards already
 * do — check:cascade, check:registry-resolves and the consumer fixture all
 * assert against build output rather than source.
 */

import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const builtModule = path.join(dirname, '../dist/components/push-menu.js')

assert.ok(
  existsSync(builtModule),
  `Missing ${builtModule} — run \`npm run build -w @nswds/ui\` before \`npm test -w @nswds/ui\`.`,
)

const { generatePushMenuBreadcrumb } = await import(builtModule)

/** Levels carry only `title`, which is all the function reads. */
const levels = (...titles) => titles.map((title) => ({ title }))

/**
 * A lone surrogate — a high surrogate not followed by a low one, or a low one
 * not preceded by a high one. Its presence means a code point was cut in half.
 */
const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/

function assertWithinBound(result, maxLength, context) {
  assert.ok(
    result.length <= maxLength,
    `${context}: expected at most ${maxLength} UTF-16 units, got ${result.length} — ${JSON.stringify(result)}`,
  )
}

describe('generatePushMenuBreadcrumb', () => {
  describe('trails that need no collapsing', () => {
    test('no levels falls back to "Menu"', () => {
      assert.equal(generatePushMenuBreadcrumb(levels()), 'Menu')
    })

    test('a single level returns its title verbatim', () => {
      assert.equal(generatePushMenuBreadcrumb(levels('Services')), 'Services')
    })

    test('a single level is the documented exception to the bound', () => {
      // Nothing to collapse, so an over-long single title is returned whole
      // rather than truncated. Asserted so the exception stays deliberate.
      const long = 'S'.repeat(120)
      assert.equal(generatePushMenuBreadcrumb(levels(long), 50), long)
    })

    test('a trail under the budget is joined with "›" and returned intact', () => {
      assert.equal(
        generatePushMenuBreadcrumb(levels('Menu', 'Services', 'Transport'), 50),
        'Menu › Services › Transport',
      )
    })

    test('a trail exactly at the budget is returned intact', () => {
      const result = generatePushMenuBreadcrumb(levels('A'.repeat(10), 'B'.repeat(10)), 23)
      assert.equal(result.length, 23) // 10 + 3 + 10
      assert.equal(result, `${'A'.repeat(10)} › ${'B'.repeat(10)}`)
    })
  })

  describe('middle elision', () => {
    test('elides the middle when that brings the trail under the budget', () => {
      const result = generatePushMenuBreadcrumb(
        levels('Services', 'Transport', 'Registration', 'Renew'),
        40,
      )
      assert.equal(result, 'Services › … › Registration › Renew')
      assertWithinBound(result, 40, 'elided trail')
    })

    test('keeps the first and last titles when eliding', () => {
      const result = generatePushMenuBreadcrumb(
        levels('First', 'Second', 'Third', 'Fourth', 'Last'),
        30,
      )
      assert.ok(result.startsWith('First'), `expected the first title to survive: ${result}`)
      assert.ok(result.endsWith('Last'), `expected the last title to survive: ${result}`)
    })

    test('elision is not attempted below four levels', () => {
      // Three levels go straight to truncation — there is no middle worth
      // collapsing, and the old code relied on this to stay within bound.
      const result = generatePushMenuBreadcrumb(levels('A'.repeat(30), 'B'.repeat(30)), 20)
      assert.ok(!result.includes('…  ›'), `unexpected elision marker: ${result}`)
      assertWithinBound(result, 20, 'three-level trail')
    })
  })

  describe('the bound is honoured when elision does not fit (regression)', () => {
    test('four realistic NSW nav titles stay within a 50-char budget', () => {
      // Previously returned 79 characters.
      const result = generatePushMenuBreadcrumb(
        levels(
          'Births, deaths and marriages',
          'Housing and property',
          'Transport and motoring',
          'Apply for a licence',
        ),
        50,
      )
      assertWithinBound(result, 50, 'four long titles')
    })

    test('five long titles stay within a 50-char budget', () => {
      // Previously returned 85 characters.
      const result = generatePushMenuBreadcrumb(
        levels('A'.repeat(25), 'B'.repeat(25), 'C'.repeat(25), 'D'.repeat(25), 'E'.repeat(25)),
        50,
      )
      assertWithinBound(result, 50, 'five long titles')
    })

    test('four one-character titles, where eliding saves nothing, stay within budget', () => {
      // The sharpest case: "A › B › C › D" and "A › … › C › D" are both 13
      // characters, so the old elision returned something no shorter than the
      // input it was meant to collapse, and still over the budget.
      const result = generatePushMenuBreadcrumb(levels('A', 'B', 'C', 'D'), 10)
      assertWithinBound(result, 10, 'four tiny titles')
    })
  })

  describe('truncation never splits a code point (regression)', () => {
    test('an astral character on the cut boundary does not leave a lone surrogate', () => {
      // The cut lands mid-emoji: `slice(0, 49)` used to bisect the pair.
      const result = generatePushMenuBreadcrumb(
        levels(`${'A'.repeat(46)}👍👍`, 'B'.repeat(20), 'C'.repeat(20)),
        50,
      )
      assert.doesNotMatch(result, LONE_SURROGATE, `lone surrogate in ${JSON.stringify(result)}`)
      assertWithinBound(result, 50, 'astral trail')
    })

    test('a trail of only astral characters truncates cleanly', () => {
      const result = generatePushMenuBreadcrumb(levels('👍'.repeat(40), '👍'.repeat(40)), 21)
      assert.doesNotMatch(result, LONE_SURROGATE, `lone surrogate in ${JSON.stringify(result)}`)
      assertWithinBound(result, 21, 'astral-only trail')
    })
  })

  describe('degenerate budgets', () => {
    test('a budget of 1 leaves room for the ellipsis alone', () => {
      assert.equal(generatePushMenuBreadcrumb(levels('Alpha', 'Beta'), 1), '…')
    })

    test('a budget of 0 returns an empty string rather than overflowing', () => {
      assert.equal(generatePushMenuBreadcrumb(levels('Alpha', 'Beta'), 0), '')
    })

    test('a negative budget returns an empty string', () => {
      assert.equal(generatePushMenuBreadcrumb(levels('Alpha', 'Beta'), -5), '')
    })
  })

  describe('property sweep', () => {
    test('never exceeds the budget and never splits a code point', () => {
      // Deterministic PRNG (mulberry32) so a failure reproduces exactly rather
      // than appearing once in CI and never again.
      let seed = 0x9e3779b9
      const random = () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
      const alphabet = [...'abcdef ', '👍', '，', 'é']

      for (let run = 0; run < 2000; run += 1) {
        const levelCount = 1 + Math.floor(random() * 7)
        const titles = Array.from({ length: levelCount }, () => {
          const titleLength = 1 + Math.floor(random() * 30)
          return Array.from(
            { length: titleLength },
            () => alphabet[Math.floor(random() * alphabet.length)],
          ).join('')
        })
        const maxLength = Math.floor(random() * 60)

        const result = generatePushMenuBreadcrumb(levels(...titles), maxLength)

        assert.doesNotMatch(
          result,
          LONE_SURROGATE,
          `run ${run}: lone surrogate in ${JSON.stringify(result)} (titles ${JSON.stringify(titles)}, maxLength ${maxLength})`,
        )
        // A single level is the documented exception — its title is returned
        // verbatim because there is nothing to collapse.
        if (levelCount > 1) {
          assertWithinBound(
            result,
            maxLength,
            `run ${run} (titles ${JSON.stringify(titles)}, maxLength ${maxLength})`,
          )
        }
      }
    })
  })
})
