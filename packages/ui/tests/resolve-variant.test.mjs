/**
 * `resolveVariant` is the one mechanism every variant-bearing component now
 * routes through, and its reason for using `||` over `??` is the empty
 * string: cva reads `''` as unset, `??` passes it through. The stories prove
 * the `null` spelling against the default; this pins the other two inputs and
 * the member case against the built output, like the rest of this directory.
 */

import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(dirname, '../dist/lib/variants.js')
assert.ok(
  existsSync(file),
  `Missing ${file} — run \`npm run build -w @nswds/ui\` before \`npm test -w @nswds/ui\`.`,
)
const { resolveVariant } = await import(file)

test('null, undefined and the empty string all resolve to the fallback', () => {
  assert.equal(resolveVariant(null, 'white'), 'white')
  assert.equal(resolveVariant(undefined, 'white'), 'white')
  assert.equal(resolveVariant('', 'white'), 'white')
})

test('a member value is returned unchanged', () => {
  assert.equal(resolveVariant('dark', 'white'), 'dark')
  assert.equal(resolveVariant('white', 'dark'), 'white')
})
