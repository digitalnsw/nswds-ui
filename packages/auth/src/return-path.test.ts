import { describe, expect, it } from 'vitest'

import { replacementAddress, safeReturnPath } from './return-path'

describe('safeReturnPath', () => {
  it('accepts a path of this app, query included', () => {
    expect(safeReturnPath('/account')).toBe('/account')
    expect(safeReturnPath('/colour/blue?tab=ramps')).toBe('/colour/blue?tab=ramps')
  })

  it('refuses anything that could leave the app', () => {
    for (const value of [
      null,
      undefined,
      '',
      'account',
      'https://evil.example/',
      '//evil.example/',
      '/\\evil.example/',
      'javascript:alert(1)',
      '/account\r\nSet-Cookie: x=1',
      // The URL parser drops a tab, leaving `//evil.example/`.
      '/\t/evil.example/',
      // Dot segments would walk out of a zone's basePath.
      '/../builder',
      '/account/../../builder',
      '/./account',
      '/account/..',
      '/%2e%2e/account',
      '/account/%2E%2E/%2e%2e/builder',
      '/%2e/account',
      '/\\/evil.example/',
      '/account\u0000',
      '/account\u007f',
    ]) {
      expect(safeReturnPath(value), String(value)).toBeNull()
    }
  })
})

describe('replacementAddress', () => {
  it('replaces an auth page whose address carries a query or fragment, under the basePath', () => {
    expect(replacementAddress({ search: '?from=%2Faccount', hash: '' }, '', '/account')).toBe(
      '/account',
    )
    expect(replacementAddress({ search: '?from=%2F', hash: '' }, '/infographics', '/')).toBe(
      '/infographics',
    )
    expect(replacementAddress({ search: '', hash: '#x' }, '/signature', '/account')).toBe(
      '/signature/account',
    )
  })

  it('leaves a clean auth page to a client-side push', () => {
    expect(replacementAddress({ search: '', hash: '' }, '', '/account')).toBeNull()
  })
})
