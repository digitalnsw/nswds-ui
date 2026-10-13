import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * The shape of `auth` the gate needs: only the server-side session read. Typed
 * structurally so the proxy can be tested with a stub and so an app's
 * `lib/auth.ts` instance (whatever plugins it adds) satisfies it.
 */
export interface SessionReader {
  api: { getSession: (input: { headers: Headers }) => Promise<unknown> }
}

export interface ProxyOptions {
  /** Routes reachable while signed out. Everything else requires a session. */
  publicRoutes?: readonly string[]
  /** The page a signed-out visitor is sent to. Resolved under the app's `basePath`. */
  signInPath?: string
  /** Where a signed-in visitor on an auth page is sent. Resolved under the app's `basePath`. */
  homePath?: string
}

/** Routes reachable while signed out, by default. */
export const PUBLIC_ROUTES = ['/sign-in', '/sign-up'] as const

export function isPublicRoute(
  pathname: string,
  publicRoutes: readonly string[] = PUBLIC_ROUTES,
): boolean {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

/**
 * Build a proxy (Next 16's renamed middleware) that puts an app behind sign-in.
 *
 * The session is validated server-side via `auth.api.getSession`, not by cookie
 * presence: `getSessionCookie` only reports that *some* session cookie exists,
 * so a fabricated, invalid or expired value would otherwise pass the gate. Proxy
 * runs on the Node.js runtime by default in Next 16, so the full auth stack —
 * including its database-backed session lookup — is available here. The cost is
 * one session lookup per matched request; that is the right default for "the
 * whole app is behind sign-in", and can be traded for Better Auth's signed
 * cookie cache later if that per-request latency ever matters.
 *
 * Paths are compared without the app's `basePath` (`nextUrl.pathname` strips
 * it), and redirects put it back, so the same `publicRoutes` serve an app at the
 * root and a zone under `/infographics` or `/signature`. The app's own
 * `proxy.ts` must still export the `config.matcher` literal: Next reads it
 * statically from that file and prefixes `basePath` itself.
 */
export function createProxy(auth: SessionReader, options: ProxyOptions = {}) {
  const { publicRoutes = PUBLIC_ROUTES, signInPath = '/sign-in', homePath = '/' } = options

  return async function proxy(request: NextRequest) {
    const { pathname, basePath } = request.nextUrl
    const publicRoute = isPublicRoute(pathname, publicRoutes)

    // Fail closed: if the session can't be validated (e.g. the database is briefly
    // unreachable) treat the request as signed out rather than 500ing every page.
    // Private routes then fall through to the sign-in redirect below.
    let hasSession = false
    try {
      const session = await auth.api.getSession({ headers: request.headers })
      hasSession = Boolean(session)
    } catch (error) {
      console.error('[proxy] session validation failed', error)
    }

    // Signed out and heading somewhere private → send to sign-in.
    if (!hasSession && !publicRoute) {
      return NextResponse.redirect(new URL(`${basePath}${signInPath}`, request.url))
    }

    // Already signed in but on an auth page → send to the app.
    if (hasSession && publicRoute) {
      return NextResponse.redirect(new URL(`${basePath}${homePath}`, request.url))
    }

    return NextResponse.next()
  }
}
