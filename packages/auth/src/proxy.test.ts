import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createProxy, isGateLifted, isPublicRoute, safeReturnPath, underBasePath } from './proxy'

// A stand-in for an app's auth instance: the gate only reads `api.getSession`.
const getSession = vi.fn<(input: { headers: Headers }) => Promise<unknown>>()
const auth = { api: { getSession } }

const A_SESSION = { session: {}, user: {} }

function request(pathname: string, basePath = ''): NextRequest {
  // The request as Next hands it to the proxy for an app with that `basePath`:
  // the prefix is on the URL, and `nextUrl` strips it from `pathname` and keeps
  // it beside it.
  return new NextRequest(new URL(`${basePath}${pathname}`, 'http://localhost:3100'), {
    nextConfig: { basePath },
  })
}

/** A response is a redirect to `target` (an absolute URL). */
function expectsRedirectTo(response: Response, target: string) {
  expect(response.status).toBe(307)
  expect(response.headers.get('location')).toBe(target)
}

/** A response lets the request through (NextResponse.next()). */
function expectsPassThrough(response: Response) {
  expect(response.headers.get('location')).toBeNull()
  expect(response.headers.get('x-middleware-next')).toBe('1')
}

beforeEach(() => {
  getSession.mockReset()
})

describe('isPublicRoute', () => {
  it('matches the public routes and their subpaths', () => {
    expect(isPublicRoute('/sign-in')).toBe(true)
    expect(isPublicRoute('/sign-up')).toBe(true)
    expect(isPublicRoute('/sign-in/reset')).toBe(true)
  })

  it('does not match private routes or lookalike prefixes', () => {
    expect(isPublicRoute('/')).toBe(false)
    expect(isPublicRoute('/account')).toBe(false)
    expect(isPublicRoute('/components/button')).toBe(false)
    // A prefix that is not a whole-segment match must not count as public.
    expect(isPublicRoute('/sign-info')).toBe(false)
    expect(isPublicRoute('/sign-up-early')).toBe(false)
  })

  it('takes a custom list for an app whose routes live under a folder', () => {
    const routes = ['/builder/sign-in', '/builder/sign-up']
    expect(isPublicRoute('/builder/sign-in', routes)).toBe(true)
    expect(isPublicRoute('/sign-in', routes)).toBe(false)
  })
})

describe('proxy gate', () => {
  const proxy = createProxy(auth)

  it('redirects a signed-out visitor away from a private route to /sign-in, remembering it', async () => {
    getSession.mockResolvedValue(null)
    expectsRedirectTo(
      await proxy(request('/account')),
      'http://localhost:3100/sign-in?from=%2Faccount',
    )
    expectsRedirectTo(
      await proxy(request('/colour/blue?tab=ramps')),
      'http://localhost:3100/sign-in?from=%2Fcolour%2Fblue%3Ftab%3Dramps',
    )
  })

  it('sends a signed-out visitor to the root to plain /sign-in', async () => {
    getSession.mockResolvedValue(null)
    expectsRedirectTo(await proxy(request('/')), 'http://localhost:3100/sign-in')
  })

  it('lets a signed-out visitor reach a public route', async () => {
    getSession.mockResolvedValue(null)
    expectsPassThrough(await proxy(request('/sign-in')))
  })

  it('redirects a signed-in visitor away from an auth page to the app root', async () => {
    getSession.mockResolvedValue(A_SESSION)
    expectsRedirectTo(await proxy(request('/sign-in')), 'http://localhost:3100/')
  })

  it('sends a signed-in visitor on an auth page to the page `from` names, if safe', async () => {
    getSession.mockResolvedValue(A_SESSION)
    expectsRedirectTo(
      await proxy(request('/sign-in?from=%2Fcolour%2Fblue%3Ftab%3Dramps')),
      'http://localhost:3100/colour/blue?tab=ramps',
    )
    expectsRedirectTo(
      await proxy(request('/sign-in?from=%2F%2Fevil.example%2F')),
      'http://localhost:3100/',
    )
    expectsRedirectTo(
      await proxy(request('/sign-in?from=%2Faccount', '/infographics')),
      'http://localhost:3100/infographics/account',
    )
  })

  it('never sends a signed-in visitor from one auth page to another', async () => {
    getSession.mockResolvedValue(A_SESSION)
    expectsRedirectTo(await proxy(request('/sign-in?from=%2Fsign-up')), 'http://localhost:3100/')
    expectsRedirectTo(
      await proxy(request('/sign-up?from=%2Fsign-in%3Ffrom%3D%252Fsign-in')),
      'http://localhost:3100/',
    )
    expectsRedirectTo(
      await proxy(request('/sign-in?from=%2Fsign-up', '/infographics')),
      'http://localhost:3100/infographics',
    )
  })

  it('lets a signed-in visitor reach a private route', async () => {
    getSession.mockResolvedValue(A_SESSION)
    expectsPassThrough(await proxy(request('/account')))
  })

  it('fails closed: a getSession error is treated as signed out, not a 500', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    getSession.mockRejectedValue(new Error('database unreachable'))

    // Private route → redirected to sign-in rather than throwing.
    expectsRedirectTo(
      await proxy(request('/account')),
      'http://localhost:3100/sign-in?from=%2Faccount',
    )
    expect(consoleError).toHaveBeenCalled()

    consoleError.mockRestore()
  })
})

describe('proxy gate under a basePath', () => {
  // A zone such as /infographics: Next strips the prefix from `pathname`, and
  // the redirects must put it back or they would leave the zone.
  const proxy = createProxy(auth)

  it('sends a signed-out visitor to the sign-in page inside the zone', async () => {
    getSession.mockResolvedValue(null)
    // `from` is basePath-relative: the zone's form pushes it and Next prefixes.
    expectsRedirectTo(
      await proxy(request('/account', '/infographics')),
      'http://localhost:3100/infographics/sign-in?from=%2Faccount',
    )
  })

  it('sends a signed-in visitor on an auth page to the zone root, no trailing slash', async () => {
    getSession.mockResolvedValue(A_SESSION)
    expectsRedirectTo(
      await proxy(request('/sign-in', '/infographics')),
      'http://localhost:3100/infographics',
    )
  })
})

describe('underBasePath', () => {
  it('joins a path under the basePath and keeps the root slash-less', () => {
    expect(underBasePath('', '/')).toBe('/')
    expect(underBasePath('', '/sign-in')).toBe('/sign-in')
    expect(underBasePath('/infographics', '/')).toBe('/infographics')
    expect(underBasePath('/infographics', '/sign-in')).toBe('/infographics/sign-in')
  })
})

describe('proxy gate for routes under a folder (no basePath)', () => {
  // A microfrontend child such as the builder: its routes live under /builder
  // in the app itself, so the public routes and both targets carry the prefix.
  const proxy = createProxy(auth, {
    publicRoutes: ['/builder/sign-in', '/builder/sign-up'],
    signInPath: '/builder/sign-in',
    homePath: '/builder',
  })

  it('sends a signed-out visitor to the sign-in page under the folder', async () => {
    getSession.mockResolvedValue(null)
    expectsRedirectTo(
      await proxy(request('/builder/workbench')),
      'http://localhost:3100/builder/sign-in?from=%2Fbuilder%2Fworkbench',
    )
  })

  it('lets a signed-out visitor reach the sign-in page under the folder', async () => {
    getSession.mockResolvedValue(null)
    expectsPassThrough(await proxy(request('/builder/sign-in')))
  })

  it('sends a signed-in visitor on an auth page to the folder root', async () => {
    getSession.mockResolvedValue(A_SESSION)
    expectsRedirectTo(await proxy(request('/builder/sign-up')), 'http://localhost:3100/builder')
  })
})

describe('NSWDS_AUTH_GATE=off (the browser suites)', () => {
  const proxy = createProxy(auth)

  it('is off unless the variable says exactly off', () => {
    vi.stubEnv('NSWDS_AUTH_GATE', undefined)
    expect(isGateLifted('localhost')).toBe(false)
    vi.stubEnv('NSWDS_AUTH_GATE', 'true')
    expect(isGateLifted('localhost')).toBe(false)
    vi.stubEnv('NSWDS_AUTH_GATE', 'off')
    expect(isGateLifted('localhost')).toBe(true)
  })

  it('lifts the gate on localhost without reading the session', async () => {
    vi.stubEnv('NSWDS_AUTH_GATE', 'off')
    expectsPassThrough(await proxy(request('/account')))
    expectsPassThrough(await proxy(request('/sign-in')))
    expect(getSession).not.toHaveBeenCalled()
  })

  it('never lifts the gate on Vercel, whatever the Host header says', () => {
    vi.stubEnv('NSWDS_AUTH_GATE', 'off')
    vi.stubEnv('VERCEL', '1')
    expect(isGateLifted('localhost')).toBe(false)
  })

  it('never lifts the gate for a deployed host', async () => {
    vi.stubEnv('NSWDS_AUTH_GATE', 'off')
    expect(isGateLifted('email.design.nsw.gov.au')).toBe(false)
    getSession.mockResolvedValue(null)
    const req = new NextRequest(new URL('/account', 'https://email.design.nsw.gov.au'))
    expectsRedirectTo(await proxy(req), 'https://email.design.nsw.gov.au/sign-in?from=%2Faccount')
  })
})

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

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})
