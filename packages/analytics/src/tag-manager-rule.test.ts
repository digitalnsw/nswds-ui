import { describe, expect, it } from 'vitest'

import { type PageAddress, tagManagerAllowed } from './tag-manager-rule'

const clean: PageAddress = { pathname: '/components/button', search: '', hash: '' }
const allowed = {
  hostname: 'ui.design.nsw.gov.au',
  current: clean,
  first: clean,
  referrer: 'https://www.google.com/',
}

describe('tagManagerAllowed', () => {
  it('loads on a production address whose addresses and referrer are clean', () => {
    expect(tagManagerAllowed(allowed)).toBe(true)
    expect(tagManagerAllowed({ ...allowed, referrer: '' })).toBe(true)
    expect(tagManagerAllowed({ ...allowed, first: null })).toBe(true)
    expect(
      tagManagerAllowed({ ...allowed, current: { ...clean, search: '?utm_source=newsletter' } }),
    ).toBe(true)
  })

  it('stays off any other host', () => {
    expect(tagManagerAllowed({ ...allowed, hostname: 'nswds-ui-git-x.vercel.app' })).toBe(false)
    expect(tagManagerAllowed({ ...allowed, hostname: 'localhost' })).toBe(false)
  })

  it('stays off when the current address needs redacting', () => {
    for (const current of [
      { ...clean, search: '?from=%2Faccount' },
      { ...clean, hash: '#install' },
      { ...clean, pathname: '/account/person@example.com' },
    ]) {
      expect(tagManagerAllowed({ ...allowed, current }), JSON.stringify(current)).toBe(false)
    }
  })

  it("stays off for the document's life when its first address needed redacting", () => {
    expect(tagManagerAllowed({ ...allowed, first: { ...clean, search: '?from=%2Fa' } })).toBe(false)
    expect(tagManagerAllowed({ ...allowed, first: { ...clean, pathname: '/a@b.c' } })).toBe(false)
  })

  it('stays off for a referrer with more than an origin', () => {
    expect(
      tagManagerAllowed({ ...allowed, referrer: 'https://example.com/inbox?email=a@b.c' }),
    ).toBe(false)
  })
})
