/**
 * Tests for the web app's zones (zones.mjs): each owns one path no other route here takes, is
 * fetched from an origin a rewrite can reach, and is rewritten so its root cannot loop.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { refuseOrigin, zoneRewrites, zones } from './zones.mjs'

const registry = JSON.parse(
  readFileSync(new URL('../../registry.config.json', import.meta.url), 'utf8'),
)

test('each zone owns its own path, apart from the registry alias', () => {
  const paths = zones.map((zone) => zone.path)
  assert.equal(new Set(paths).size, paths.length)
  assert.ok(!paths.includes('/registry'), 'the registry is an alias with its own rules, not a zone')
})

test('each zone is fetched from a custom domain, never a vercel.app name', () => {
  for (const zone of zones) {
    assert.equal(refuseOrigin(zone.origin), undefined, zone.path)
    assert.ok(!new URL(zone.origin).hostname.endsWith('.vercel.app'), zone.path)
    assert.notEqual(new URL(zone.origin).origin, new URL(registry.origin).origin, zone.path)
  }
})

test('rewrites a Next zone root without a slash and a static zone root with one', () => {
  assert.deepEqual(zoneRewrites(), [
    {
      source: '/infographics',
      destination: 'https://infographics.design.nsw.gov.au/infographics',
    },
    {
      source: '/infographics/:path+',
      destination: 'https://infographics.design.nsw.gov.au/infographics/:path+',
    },
    { source: '/storybook', destination: 'https://storybook.design.nsw.gov.au/storybook/' },
    {
      source: '/storybook/:path+',
      destination: 'https://storybook.design.nsw.gov.au/storybook/:path+',
    },
  ])
})

test('takes a local origin for development', () => {
  const local = [
    { path: '/maker', project: 'p', origin: 'http://localhost:3001/', trailingSlash: false },
  ]
  assert.deepEqual(zoneRewrites(local), [
    { source: '/maker', destination: 'http://localhost:3001/maker' },
    { source: '/maker/:path+', destination: 'http://localhost:3001/maker/:path+' },
  ])
})

test('refuses a zone whose path or origin would not route', () => {
  const zone = (path, origin) => [{ path, project: 'p', origin, trailingSlash: false }]
  assert.throws(() => zoneRewrites(zone('/two/parts', 'https://a.example')), /one lowercase/)
  assert.throws(() => zoneRewrites(zone('/Storybook', 'https://a.example')), /one lowercase/)
  assert.throws(() => zoneRewrites(zone('/a', 'http://a.example')), /https/)
})

test('refuseOrigin takes a bare https origin, and http only on this machine', () => {
  assert.equal(refuseOrigin('https://storybook.design.nsw.gov.au'), undefined)
  assert.equal(refuseOrigin('http://localhost:6006'), undefined)
  assert.equal(refuseOrigin('http://127.0.0.1:3001'), undefined)
  assert.match(refuseOrigin('http://storybook.design.nsw.gov.au'), /https/)
  assert.match(refuseOrigin('storybook.design.nsw.gov.au'), /not an address/)
  assert.match(refuseOrigin('https://a.example/storybook'), /bare origin/)
  assert.match(refuseOrigin('https://a.example/?x=1'), /bare origin/)
  assert.match(refuseOrigin('https://user:pass@a.example'), /credentials/)
})
