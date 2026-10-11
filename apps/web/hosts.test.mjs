/**
 * Tests for the earlier domain's redirect (hosts.mjs), run through Next's own path matcher: every
 * path on ui.digital.nsw.gov.au moves to ui.design.nsw.gov.au except /registry, which older
 * registry items still fetch from it.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

import { canonicalOrigin, earlierHosts, hostRedirects, movedPaths } from './hosts.mjs'

const require = createRequire(import.meta.url)
const { getPathMatch } = require('next/dist/shared/lib/router/utils/path-match')
const match = getPathMatch(movedPaths, { removeUnnamedParams: true, strict: true })
const host = new RegExp(`^${earlierHosts}$`)

test('moves every page, the zones included, to the same path on ui.design', () => {
  for (const [path, rest] of [
    ['/', ''],
    ['/docs/button', 'docs/button'],
    ['/storybook', 'storybook'],
    ['/infographics/charts', 'infographics/charts'],
    ['/registryx', 'registryx'],
  ]) {
    assert.deepEqual(match(path), { path: rest }, path)
  }
  const [redirect] = hostRedirects()
  assert.equal(redirect.destination, `${canonicalOrigin}/:path`)
  assert.equal(redirect.permanent, true)
})

test('keeps /registry and everything under it answering here', () => {
  for (const path of [
    '/registry',
    '/registry/',
    '/registry/r/button.json',
    '/registry/r/registry.json',
  ]) {
    assert.equal(match(path), false, path)
  }
})

test('applies to the earlier domain and its www, and to no other host', () => {
  assert.ok(host.test('ui.digital.nsw.gov.au'))
  assert.ok(host.test('www.ui.digital.nsw.gov.au'))
  for (const other of [
    'ui.design.nsw.gov.au',
    'ui.digital.nsw.gov.au.example',
    'xui.digital.nsw.gov.au',
  ]) {
    assert.ok(!host.test(other), other)
  }
  assert.deepEqual(hostRedirects()[0].has, [{ type: 'host', value: earlierHosts }])
})
