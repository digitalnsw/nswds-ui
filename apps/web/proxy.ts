import type { NextRequest } from 'next/server'

import { createProxy } from '@workspace/auth/proxy'

import { auth } from '@/lib/auth'
import { analyticsProxy } from './analytics-proxy.mjs'

/**
 * Proxy (Next 16's renamed middleware) that puts the whole site behind sign-in
 * until launch: the gate itself is `createProxy` in @workspace/auth. `/sign-in`
 * and `/sign-up` stay public. Requests the web app rewrites to its zones
 * (`/infographics`, `/storybook`, zones.mjs) pass through here first, so they
 * are gated on this domain too. The infographics zone carries the same gate
 * and its own sign-in page, so that page and the zone's auth API are left to
 * it here: either sign-in page sets the one session the domain shares.
 */
const gate = createProxy(auth)

/**
 * The PostHog proxy runs first (analytics-proxy.mjs): `/nswa` requests skip the gate and lose the
 * session cookie before they are forwarded, and trailing-slash page paths are redirected. Every
 * other request goes to the gate unchanged.
 */
export async function proxy(request: NextRequest) {
  return analyticsProxy(request) ?? gate(request)
}

export const config = {
  // Run on every route except the auth APIs and the infographics zone's own
  // sign-in pages (must stay reachable while signed out; the zone gates them
  // itself), the legacy `/registry` proxy (consumers install components from it,
  // and a redirect there would break every install that still carries this
  // domain in its registryDependencies), Next internals, and static assets —
  // otherwise the redirect would also block the CSS/JS/fonts the sign-in page
  // needs to render. The matcher must be a literal here: Next reads it from
  // this file statically.
  //
  // `/nswa/:path*` is listed on its own because the catch-all below skips paths ending in `.js`, and
  // PostHog loads its config and extensions from `/nswa/.../*.js`: those must reach the proxy too,
  // or they would go to PostHog with the session cookie.
  matcher: [
    '/nswa/:path*',
    '/((?!api/auth(?:/|$)|infographics/api/auth(?:/|$)|infographics/sign-(?:in|up)(?:/|$)|registry(?:/|$)|_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|woff|woff2|ttf|map)$).*)',
  ],
}
