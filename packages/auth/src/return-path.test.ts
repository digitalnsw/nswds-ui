import { describe, expect, it } from 'vitest'

import { replacementAddress, routerBasePath, safeReturnPath } from './return-path'

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

describe('routerBasePath', () => {
  it("reads Next's basePath off the page's two pathnames", () => {
    expect(routerBasePath('/sign-in', '/sign-in')).toBe('')
    expect(routerBasePath('/signature/sign-in', '/sign-in')).toBe('/signature')
    expect(routerBasePath('/infographics', '/')).toBe('/infographics')
    expect(routerBasePath('/infographics/', '/')).toBe('/infographics')
    expect(routerBasePath('/', '/')).toBe('')
    // The builder: its routes carry `/builder` themselves, with no Next basePath.
    expect(routerBasePath('/builder/sign-in', '/builder/sign-in')).toBe('')
    expect(routerBasePath('/elsewhere', '/sign-in')).toBeNull()
  })
})

describe('replacementAddress', () => {
  const at = (pathname: string, search = '?from=%2Fx', hash = '') => ({ pathname, search, hash })

  it('replaces an auth page whose address carries a query or fragment, under the basePath', () => {
    expect(replacementAddress(at('/sign-in'), '/sign-in', '/account')).toBe('/account')
    expect(replacementAddress(at('/infographics/sign-in'), '/sign-in', '/')).toBe('/infographics')
    expect(replacementAddress(at('/signature/sign-up', '', '#x'), '/sign-up', '/account')).toBe(
      '/signature/account',
    )
  })

  it('adds nothing to a builder route, which carries `/builder` itself', () => {
    expect(replacementAddress(at('/builder/sign-in'), '/builder/sign-in', '/builder/x')).toBe(
      '/builder/x',
    )
    expect(replacementAddress(at('/builder/sign-up'), '/builder/sign-up', '/builder')).toBe(
      '/builder',
    )
  })

  it('leaves a clean auth page, or one whose basePath cannot be read, to a client-side push', () => {
    expect(replacementAddress(at('/sign-in', ''), '/sign-in', '/account')).toBeNull()
    expect(replacementAddress(at('/elsewhere'), '/sign-in', '/account')).toBeNull()
  })
})
