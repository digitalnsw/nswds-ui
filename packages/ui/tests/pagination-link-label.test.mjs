/**
 * The icon-button label guard, as `PaginationLink` meets it.
 *
 * `Button` warns in development when it is icon-sized and carries no
 * accessible name. `PaginationLink` is icon-sized by design — the square a
 * page number sits in — and it used to spread the caller's `aria-label` onto
 * the anchor it hands `Button` through `render`, where the guard, which reads
 * `Button`'s own props, could not see it. A fully labelled
 * `<PaginationLink aria-label="Page 2">2</PaginationLink>` warned on every
 * render, and so did every page-number link in the package's own stories,
 * whose visible digit is a perfectly good name.
 *
 * Two things are asserted against the built output: the guard is quiet when a
 * name exists on either path — an `aria-label`, or a text child — and it still
 * speaks up for a genuinely nameless icon button, which is the case it exists
 * for. Run against `dist/`, like the rest of this directory.
 */

import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { Fragment, createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(dirname, '../dist/components')

for (const file of ['pagination.js', 'button.js']) {
  assert.ok(
    existsSync(path.join(dist, file)),
    `Missing ${path.join(dist, file)} — run \`npm run build -w @nswds/ui\` before \`npm test -w @nswds/ui\`.`,
  )
}

const { PaginationLink } = await import(path.join(dist, 'pagination.js'))
const { Button } = await import(path.join(dist, 'button.js'))

const GUARD = /Icon-only buttons/

/** Every `console.warn` the render produced that came from the guard. */
let warnings
const originalWarn = console.warn

beforeEach(() => {
  warnings = []
  console.warn = (...args) => {
    if (args.some((arg) => GUARD.test(String(arg)))) warnings.push(args)
  }
})

afterEach(() => {
  console.warn = originalWarn
})

describe('PaginationLink and the icon-button label guard', () => {
  test('is quiet for a labelled page link, and the label reaches the anchor', () => {
    const html = renderToStaticMarkup(h(PaginationLink, { href: '#2', 'aria-label': 'Page 2' }, 2))

    assert.equal(warnings.length, 0, 'a labelled page link must not warn')
    assert.match(html, /<a[^>]*\baria-label="Page 2"/, 'the label must land on the anchor')
    assert.equal(html.match(/aria-label=/g).length, 1, 'the label must be emitted once')
    assert.match(html, /data-slot="pagination-link"/)
  })

  test('is quiet for a bare page number, whose digit is the visible name', () => {
    renderToStaticMarkup(h(PaginationLink, { href: '#2' }, 2))
    renderToStaticMarkup(h(PaginationLink, { href: '#2' }, '2'))

    assert.equal(warnings.length, 0)
  })

  test('still warns for an icon-only page link with no name', () => {
    renderToStaticMarkup(h(PaginationLink, { href: '#first' }, h('svg', { 'aria-hidden': true })))

    assert.equal(warnings.length, 1)
  })

  test('accepts aria-labelledby on the same path', () => {
    const html = renderToStaticMarkup(
      h(PaginationLink, { href: '#first', 'aria-labelledby': 'first-page' }, h('svg', null)),
    )

    assert.equal(warnings.length, 0)
    assert.match(html, /<a[^>]*\baria-labelledby="first-page"/)
  })
})

describe('Button keeps the guard for real icon buttons', () => {
  test('warns for an icon-sized button with an element child and no name', () => {
    renderToStaticMarkup(h(Button, { size: 'icon' }, h('svg', null)))

    assert.equal(warnings.length, 1)
  })

  test('does not warn once a name is given', () => {
    renderToStaticMarkup(h(Button, { size: 'icon', 'aria-label': 'Close' }, h('svg', null)))

    assert.equal(warnings.length, 0)
  })

  test('does not count whitespace as a visible name', () => {
    renderToStaticMarkup(h(Button, { size: 'icon' }, ' '))

    assert.equal(warnings.length, 1)
  })

  test('finds text among mixed children, as React hands a word beside a number', () => {
    renderToStaticMarkup(h(Button, { size: 'icon' }, h('svg', null), 'Page ', 2))

    assert.equal(warnings.length, 0)
  })

  test('looks inside a Fragment, which Children.toArray hands back whole', () => {
    renderToStaticMarkup(h(Button, { size: 'icon' }, h(Fragment, null, 2)))
    renderToStaticMarkup(h(Button, { size: 'icon' }, h(Fragment, null, 'Page ', 2)))
    renderToStaticMarkup(h(Button, { size: 'icon' }, h(Fragment, null, h(Fragment, null, '2'))))

    assert.equal(warnings.length, 0)
  })

  test('an empty or whitespace-only Fragment is still nameless', () => {
    renderToStaticMarkup(h(Button, { size: 'icon' }, h(Fragment, null)))
    renderToStaticMarkup(h(Button, { size: 'icon' }, h(Fragment, null, ' ')))

    assert.equal(warnings.length, 2)
  })

  test('does not look inside other elements', () => {
    renderToStaticMarkup(h(Button, { size: 'icon' }, h('span', null, 'Previous')))

    assert.equal(warnings.length, 1)
  })
})
