import { createProxy } from '@workspace/auth/proxy'

import { auth } from '@/lib/auth'

/**
 * Proxy (Next 16's renamed middleware) that puts the whole app behind sign-in
 * until launch: the gate itself is `createProxy` in @workspace/auth. `/sign-in`
 * and `/sign-up` stay public. Paths are compared without the `/infographics`
 * basePath and the redirects put it back, so the gate holds both through the
 * web app's rewrite and on this project's own address.
 */
export const proxy = createProxy(auth)

export const config = {
  // Run on every route except the auth API (must stay reachable while signed
  // out), Next internals, and static assets — otherwise the redirect would also
  // block the CSS/JS/fonts the sign-in page needs to render. Next prefixes the
  // basePath to these itself. The matcher must be a literal here: Next reads it
  // from this file statically.
  matcher: [
    '/((?!api/auth(?:/|$)|_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|woff|woff2|ttf|map)$).*)',
  ],
}
