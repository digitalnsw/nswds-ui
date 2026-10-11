/**
 * Tests for set-base-href.mjs, the step that lets the Storybook build serve from
 * ui.design.nsw.gov.au/storybook whether or not the page's URL ends in a slash.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import { setBaseHref, sitePath } from './set-base-href.mjs'

import { zones } from '../../web/zones.mjs'

const page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="./favicon.svg" />
    <link href="./sb-manager/runtime.js" rel="modulepreload" />
  </head>
  <body></body>
</html>`

test('puts the base first in <head>, before any relative URL', () => {
  const html = setBaseHref(page, '/storybook/')
  const base = html.indexOf('<base href="/storybook/" />')
  assert.ok(base > html.indexOf('<head>'))
  assert.ok(base < html.indexOf('<meta charset'))
  assert.ok(base < html.indexOf('./favicon.svg'))
})

test('is idempotent, and replaces a base already there', () => {
  const once = setBaseHref(page, '/storybook/')
  assert.equal(setBaseHref(once, '/storybook/'), once)
  const moved = setBaseHref(once, '/catalogue/')
  assert.equal(moved.match(/<base\b/g)?.length, 1)
  assert.match(moved, /<base href="\/catalogue\/" \/>/)
})

test('finds a <head> that carries attributes', () => {
  assert.match(
    setBaseHref('<html><head data-x="1"><title>t</title></head></html>', '/s/'),
    /<head data-x="1">\n {4}<base href="\/s\/" \/>/,
  )
})

test('refuses an href that would not resolve the relative URLs under one folder', () => {
  for (const href of ['/storybook', 'storybook/', 'https://a.example/storybook/', '/', '/a b/']) {
    assert.throws(() => setBaseHref(page, href), /absolute path ending in a slash/, href)
  }
})

test('refuses a page with no <head>', () => {
  assert.throws(() => setBaseHref('<html><body></body></html>', '/storybook/'), /no <head>/)
})

test('targets the path the web app serves Storybook at', () => {
  const storybook = zones.find((zone) => zone.project === 'nswds-ui-storybook')
  assert.equal(sitePath, `${storybook?.path}/`)
  assert.equal(storybook?.trailingSlash, true)
})
