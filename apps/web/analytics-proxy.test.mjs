/**
 * Tests for the PostHog proxy (analytics-proxy.mjs): which paths it owns, that a real request goes
 * on without the session cookie, and that page paths keep one URL each.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import { NextRequest } from 'next/server.js'

import {
  analyticsProxy,
  isPostHogProxyPath,
  POSTHOG_PROXY_STRIPPED_HEADERS,
  posthogRewrites,
  trailingSlashRedirectTarget,
} from './analytics-proxy.mjs'

const origin = 'https://ui.design.nsw.gov.au'

// Next forwards to the rewrite destination only the request headers named in
// `x-middleware-override-headers`; anything absent from that list is dropped.
const forwarded = (response) =>
  (response.headers.get('x-middleware-override-headers') ?? '').split(',').filter(Boolean)

test('the proxy owns its prefix exactly or as a segment, nothing else', () => {
  assert.equal(isPostHogProxyPath('/nswa'), true)
  assert.equal(isPostHogProxyPath('/nswa/i/v0/e/'), true)
  assert.equal(isPostHogProxyPath('/nswautomation'), false)
  assert.equal(isPostHogProxyPath('/infographics/nswa'), false)
  assert.equal(isPostHogProxyPath('/'), false)
})

test('a proxy request goes on without the session cookie, authorization or referer', () => {
  const response = analyticsProxy(
    new NextRequest(`${origin}/nswa/i/v0/e/`, {
      headers: {
        cookie: '__Secure-better-auth.session_token=secret',
        authorization: 'Bearer secret',
        referer: `${origin}/account`,
        'user-agent': 'test-agent',
      },
    }),
  )

  assert.ok(response)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('location'), null, 'a slashed ingestion path is not redirected')
  assert.ok(forwarded(response).includes('user-agent'))
  for (const header of POSTHOG_PROXY_STRIPPED_HEADERS) {
    assert.ok(!forwarded(response).includes(header), header)
    assert.equal(response.headers.get(`x-middleware-request-${header}`), null, header)
  }
})

test('a trailing-slash page path 308s to its slashless form, keeping the query', () => {
  const response = analyticsProxy(new NextRequest(`${origin}/storybook/?path=/docs`))

  assert.ok(response)
  assert.equal(response.status, 308)
  assert.equal(response.headers.get('location'), `${origin}/storybook?path=/docs`)
})

test('any other request is handed on to the sign-in gate', () => {
  assert.equal(analyticsProxy(new NextRequest(`${origin}/`)), null)
  assert.equal(analyticsProxy(new NextRequest(`${origin}/infographics`)), null)
})

test('root, slashless and slash-only paths are never redirected', () => {
  const at = (pathname) => {
    const url = new URL(origin)
    url.pathname = pathname
    return url
  }
  assert.equal(trailingSlashRedirectTarget(at('/')), null)
  assert.equal(trailingSlashRedirectTarget(at('/storybook')), null)
  assert.equal(trailingSlashRedirectTarget(at('///')), null)
  assert.equal(trailingSlashRedirectTarget(at('/a///'))?.pathname, '/a')
})

test('the asset rewrites come before the ingestion catch-all', () => {
  const sources = posthogRewrites().map((rewrite) => rewrite.source)
  assert.equal(sources.at(-1), '/nswa/:path*')
  assert.ok(sources.indexOf('/nswa/static/:path*') < sources.length - 1)
  assert.ok(sources.indexOf('/nswa/array/:path*') < sources.length - 1)
})
