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

/**
 * Hosts a browser gate serves the built app on. `NSWDS_AUTH_GATE=off` lifts the
 * gate only for these, and never on Vercel (`VERCEL=1` is set on every
 * deployment), so the switch cannot open a deployment. The hostname comes
 * from the request's Host header, which is why the Vercel check is there too:
 * off Vercel, a server started with the variable set would otherwise answer a
 * forged `Host: localhost`.
 */
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])

/**
 * Whether the gate is lifted for this request: the Playwright suites run the
 * built app with `NSWDS_AUTH_GATE=off` (each app's `playwright.config.ts`
 * passes it to `next start`), because they have no database to sign in
 * against. Read per request so a test can set the variables; fail-closed, so
 * an unset or any other value keeps the gate.
 */
export function isGateLifted(hostname: string): boolean {
  return (
    process.env.NSWDS_AUTH_GATE === 'off' &&
    process.env.VERCEL !== '1' &&
    LOOPBACK_HOSTS.has(hostname)
  )
}

/** The query parameter the gate uses to carry the page a visitor was after. */
export const RETURN_PARAM = 'from'

/**
 * `value` if it is a path of this app the forms may send a visitor to after
 * sign-in, else `null`: an absolute path, so never another origin
 * (`https://…`, `//evil`, or anything the URL parser would resolve off this
 * origin) or a scheme; `basePath`-relative, which `router.push` prefixes. Read
 * on both ends — the gate writes it, the forms read it.
 */
export function safeReturnPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return null
  }
  // No control characters anywhere: a newline or NUL has no place in a path
  // and is how a value tries to smuggle a header or a second URL.
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code < 0x20 || code === 0x7f) return null
  }
  // And what a browser would make of it stays on this origin: the URL parser
  // drops some characters (a tab, say) before it looks for `//`, so the text
  // checks above are not the last word.
  let resolved: URL
  try {
    resolved = new URL(value, SAME_ORIGIN)
  } catch {
    return null
  }
  if (resolved.origin !== SAME_ORIGIN || !resolved.pathname.startsWith('/')) return null
  return value
}

/** A stand-in origin to resolve a return path against; only equality matters. */
const SAME_ORIGIN = 'https://same-origin.invalid'

/**
 * `path` under the app's `basePath`, without the `/infographics/` a plain join
 * would produce for the root: Next 308s that to `/infographics`, and a zone's
 * rewrite on the shared domain only matches the slash-less form directly.
 */
export function underBasePath(basePath: string, path: string): string {
  return basePath && path === '/' ? basePath : `${basePath}${path}`
}

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
 * runs on the Node.js runtime by default in Next 16, so the full auth stack is
 * available here. Most requests are answered from the signed cookie cache
 * `createAuth` turns on (one minute): a page's assets, previews and prefetches
 * cost no database round-trip, and a session revoked in the database stays
 * accepted for at most that long; sign-out clears the cached cookie at once.
 *
 * A signed-out visitor is sent to the sign-in page with the path they asked for
 * in `from` (`RETURN_PARAM`), which the forms honour after sign-in when it is a
 * path of this app (`safeReturnPath`).
 *
 * Paths are compared without the app's `basePath` (`nextUrl.pathname` strips
 * it), and redirects put it back, so the same `publicRoutes` serve an app at the
 * root and a zone under `/infographics` or `/signature`. The app's own
 * `proxy.ts` must still export the `config.matcher` literal: Next reads it
 * statically from that file and prefixes `basePath` itself.
 *
 * `NSWDS_AUTH_GATE=off` lifts the gate on localhost only (`isGateLifted`), for
 * the browser suites that run the built app without a database.
 */
export function createProxy(auth: SessionReader, options: ProxyOptions = {}) {
  const { publicRoutes = PUBLIC_ROUTES, signInPath = '/sign-in', homePath = '/' } = options

  return async function proxy(request: NextRequest) {
    const { pathname, basePath, hostname } = request.nextUrl

    if (isGateLifted(hostname)) {
      return NextResponse.next()
    }

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

    // Signed out and heading somewhere private → send to sign-in, remembering
    // where they were going (basePath-relative, as `router.push` wants it).
    if (!hasSession && !publicRoute) {
      const target = new URL(underBasePath(basePath, signInPath), request.url)
      const wanted = `${pathname}${request.nextUrl.search}`
      if (wanted !== '/') target.searchParams.set(RETURN_PARAM, wanted)
      return NextResponse.redirect(target)
    }

    // Already signed in but on an auth page → send to the app: to the page a
    // `from` on the URL names (they signed in elsewhere since the gate wrote
    // it), else home.
    if (hasSession && publicRoute) {
      const wanted = safeReturnPath(request.nextUrl.searchParams.get(RETURN_PARAM)) ?? homePath
      return NextResponse.redirect(new URL(underBasePath(basePath, wanted), request.url))
    }

    return NextResponse.next()
  }
}
