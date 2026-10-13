import { createProxy } from '@workspace/auth/proxy'

import { auth } from '@/lib/auth'

/**
 * Proxy (Next 16's renamed middleware) that puts the whole site behind sign-in
 * until launch: the gate itself is `createProxy` in @workspace/auth. `/sign-in`
 * and `/sign-up` stay public. Requests the web app rewrites to its zones
 * (`/infographics`, `/storybook`, zones.mjs) pass through here first, so they
 * are gated on this domain too; the zones' own domains are their own concern.
 */
export const proxy = createProxy(auth)

export const config = {
  // Run on every route except the auth API (must stay reachable while signed
  // out), the legacy `/registry` proxy (consumers install components from it,
  // and a redirect there would break every install that still carries this
  // domain in its registryDependencies), Next internals, and static assets —
  // otherwise the redirect would also block the CSS/JS/fonts the sign-in page
  // needs to render. The matcher must be a literal here: Next reads it from
  // this file statically.
  matcher: [
    '/((?!api/auth|registry(?:/|$)|_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|woff|woff2|ttf|map)$).*)',
  ],
}
