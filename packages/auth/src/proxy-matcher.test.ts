import { resolve } from 'node:path'

import { getPageStaticInfo } from 'next/dist/build/analysis/get-page-static-info'
import { loadBindings } from 'next/dist/build/swc'
import type { PAGE_TYPES } from 'next/dist/lib/page-types'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * Which requests reach each app's proxy at all. `createProxy` only gates what
 * Next hands it, and Next decides that from the `config.matcher` literal in the
 * app's own `proxy.ts`, compiled with the app's `basePath` prefixed. A matcher
 * that misses a page leaves it public with no error anywhere: the infographics
 * root went ungated that way, because a basePath turns the catch-all's leading
 * slash into `/infographics/…`, which the bare `/infographics` never matches.
 *
 * So the matchers are read the way the build reads them, by Next's own static
 * analysis of each app's file and config, and the compiled patterns are tested
 * as Next tests them at request time (`getMiddlewareRouteMatcher`: the regexp
 * against the full, basePath-included pathname). Neither app declares
 * `has`/`missing`, so the regexp is the whole match.
 */

const repoRoot = resolve(import.meta.dirname, '../../..')

interface AppCase {
  app: string
  /** Paths the proxy must run on, basePath included. */
  gated: string[]
  /** Paths that must stay reachable while signed out, basePath included. */
  open: string[]
}

const APPS: AppCase[] = [
  {
    app: 'infographics',
    gated: [
      '/infographics',
      '/infographics/',
      '/infographics/index.rsc',
      '/infographics/account',
      '/infographics/account.rsc',
      // The proxy runs on the auth pages too, to send a signed-in visitor on.
      '/infographics/sign-in',
      '/infographics/sign-up',
    ],
    open: [
      '/infographics/api/auth',
      '/infographics/api/auth/get-session',
      '/infographics/_next/static/chunks/main.js',
      '/infographics/_next/image',
      '/infographics/favicon.ico',
      '/infographics/fonts/public-sans.woff2',
    ],
  },
  {
    app: 'web',
    gated: [
      '/',
      '/index.rsc',
      '/account',
      '/sign-in',
      // The zones it rewrites, on the shared domain.
      '/infographics',
      '/infographics/account',
      '/storybook',
      // Not gated: the PostHog proxy, which the proxy must still see to strip the session cookie
      // (apps/web/analytics-proxy.mjs). Its `.js` paths are the case the catch-all would miss.
      '/nswa',
      '/nswa/i/v0/e/',
      '/nswa/static/array.js',
      '/nswa/array/phc_test/config.js',
    ],
    open: [
      '/api/auth/get-session',
      '/infographics/api/auth/get-session',
      '/infographics/sign-in',
      '/registry/r/button.json',
      '/_next/static/chunks/main.js',
      '/favicon.ico',
    ],
  },
]

async function compiledMatchers(app: string): Promise<RegExp[]> {
  const { default: nextConfig } = (await import(`${repoRoot}/apps/${app}/next.config.mjs`)) as {
    default: { basePath?: string }
  }
  const info = await getPageStaticInfo({
    pageFilePath: `${repoRoot}/apps/${app}/proxy.ts`,
    nextConfig: { basePath: nextConfig.basePath ?? '' },
    isDev: false,
    page: '/proxy',
    // A `const enum`, which an isolated module cannot read at runtime.
    pageType: 'root' as PAGE_TYPES,
  })
  const matchers = info.middleware?.matchers ?? []
  return matchers.map((matcher) => new RegExp(matcher.regexp))
}

beforeAll(async () => {
  // Static analysis parses with SWC, and fails silently (no config, so no
  // matchers) until the native bindings are loaded, as the build does first.
  await loadBindings()
})

describe.each(APPS)('$app proxy matcher', ({ app, gated, open }) => {
  let matchers: RegExp[]

  beforeAll(async () => {
    matchers = await compiledMatchers(app)
  })

  const runsOn = (pathname: string) => matchers.some((matcher) => matcher.test(pathname))

  it('is read from proxy.ts', () => {
    expect(matchers.length).toBeGreaterThan(0)
  })

  it.each(gated)('runs on %s', (pathname) => {
    expect(runsOn(pathname)).toBe(true)
  })

  it.each(open)('leaves %s to load signed out', (pathname) => {
    expect(runsOn(pathname)).toBe(false)
  })
})
