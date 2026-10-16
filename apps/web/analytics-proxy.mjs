// The PostHog reverse proxy for ui.design.nsw.gov.au: the same `/nswa` pattern every NSW Design
// site uses (nswds-contrast, nswds-public-sans, nswds-email). The browser posts to `/nswa` on this
// domain, `posthogRewrites()` forwards it to PostHog, and `analyticsProxy()` in proxy.ts strips the
// headers that must not leave with it. The infographics zone posts here too: `/nswa` is a root path,
// and this app owns the domain's root.
//
// Plain ESM, like zones.mjs and hosts.mjs, so `npm run test:scripts` can run its tests without a
// TypeScript loader. `next/server.js` with the extension, because Node's ESM resolver needs it and
// the bundler accepts it too.

import { NextResponse } from 'next/server.js'

/** The proxy prefix. Avoids the tracker blocklists that catch the conventional `/ingest`. */
export const POSTHOG_PROXY_PATH = '/nswa'

/**
 * The prefix exactly, or as a path segment. Not a bare `startsWith('/nswa')`, which would also
 * match an unrelated future route such as `/nswautomation`.
 *
 * @param {string} path
 * @returns {boolean}
 */
export function isPostHogProxyPath(path) {
  return path === POSTHOG_PROXY_PATH || path.startsWith(`${POSTHOG_PROXY_PATH}/`)
}

/**
 * Request headers removed before a `/nswa` request is forwarded to PostHog. A Next rewrite to an
 * external origin forwards the incoming headers unchanged, and these requests are same-origin, so
 * the browser attaches first-party data to them:
 *
 *   cookie         The sign-in session. It is scoped to design.nsw.gov.au, so every visit to this
 *                  domain carries it, and without this it would be handed to PostHog on every event.
 *   authorization  Never set by the SDK; removed so it cannot start leaking unnoticed.
 *   referer        A referrer policy trims cross-origin requests only; these are same-origin, so
 *                  the full page URL would go with them.
 *
 * @type {readonly string[]}
 */
export const POSTHOG_PROXY_STRIPPED_HEADERS = ['cookie', 'authorization', 'referer']

/**
 * The rewrites to PostHog's US region. Order matters: the catch-all must come last or it swallows
 * `/nswa/static` and `/nswa/array`, which are served from the assets origin, not ingestion.
 *
 * @returns {{ source: string, destination: string }[]}
 */
export function posthogRewrites() {
  return [
    {
      source: `${POSTHOG_PROXY_PATH}/static/:path*`,
      destination: 'https://us-assets.i.posthog.com/static/:path*',
    },
    {
      source: `${POSTHOG_PROXY_PATH}/array/:path*`,
      destination: 'https://us-assets.i.posthog.com/array/:path*',
    },
    { source: `${POSTHOG_PROXY_PATH}/:path*`, destination: 'https://us.i.posthog.com/:path*' },
  ]
}

/**
 * Where a trailing-slash path should 308 to, or null. Restores what `skipTrailingSlashRedirect`
 * (next.config.mjs) turns off: PostHog's ingestion paths end in a slash (`/e/`, `/i/v0/e/`), Next's
 * automatic redirect would strip it before the rewrite runs, and the SDK does not follow it, so
 * ingestion would stop silently. Everything else keeps one URL per page.
 *
 * Root is exempt. A path of only slashes is left alone rather than collapsing to root.
 *
 * @param {URL} url
 * @returns {URL | null}
 */
export function trailingSlashRedirectTarget(url) {
  if (url.pathname === '/' || !url.pathname.endsWith('/')) return null

  // Computed before assignment: setting `URL.pathname` to '' normalises straight back to '/'.
  const stripped = url.pathname.replace(/\/+$/, '')
  if (!stripped) return null

  const target = new URL(url)
  target.pathname = stripped
  return target
}

/**
 * The analytics half of proxy.ts, run before the sign-in gate. Returns the response for a request
 * it handles, or null to hand the request on to the gate.
 *
 * `/nswa` skips the gate: the sign-in page has to report too, and PostHog's ingestion is public
 * anyway. A trailing-slash page path is redirected here, before the gate, so the redirect reads the
 * same whether or not the visitor is signed in, and before the zone rewrites (which run after the
 * proxy), so `/storybook/` and `/infographics/` still 308 to their slashless form as they did.
 *
 * @param {import('next/server.js').NextRequest} request
 * @returns {import('next/server.js').NextResponse | null}
 */
export function analyticsProxy(request) {
  const { pathname } = request.nextUrl

  if (isPostHogProxyPath(pathname)) {
    const forwardedHeaders = new Headers(request.headers)
    for (const header of POSTHOG_PROXY_STRIPPED_HEADERS) forwardedHeaders.delete(header)
    return NextResponse.next({ request: { headers: forwardedHeaders } })
  }

  const slashRedirect = trailingSlashRedirectTarget(request.nextUrl)
  if (slashRedirect) return NextResponse.redirect(slashRedirect, 308)

  return null
}
