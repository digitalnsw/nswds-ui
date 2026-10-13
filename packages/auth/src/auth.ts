import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'

import { createSignUpAllowlistHooks } from './auth-hooks'
import { authBasePath } from './base-path'
import { db } from './db'
import { schema } from './db/schema'
import { parseAllowedEmails } from './signup-allowlist'

/**
 * Origins Better Auth accepts requests from, besides `baseURL`'s own. It rejects
 * a sign-in/up whose request origin is not trusted with an "Invalid origin"
 * error, and the trusted set defaults to just the origin of `baseURL`
 * (BETTER_AUTH_URL) — so a base URL that does not match where the app is
 * actually served is what triggers it.
 *
 * The dev servers' ports vary (each app has its own, and the local
 * microfrontends/zone proxies add more), so pinning a single `BETTER_AUTH_URL`
 * is fragile locally. Trust any localhost port in development instead; the
 * wildcard matches only localhost/127.0.0.1, never an external host.
 *
 * Deployed, `BETTER_AUTH_URL` is the production origin, which a preview
 * deployment (`*.vercel.app`) or a project's own address is not, so those are
 * trusted from the addresses Vercel sets for the deployment itself
 * (`VERCEL_URL`, `VERCEL_BRANCH_URL`): a preview can then be signed in to.
 *
 * Not in production, though, where the session cookie is scoped to
 * design.nsw.gov.au (`sharedCookieDomain`): a browser drops that cookie when
 * it arrives on a `*.vercel.app` address, so a sign-in there would appear to
 * succeed and leave the visitor signed out. Leaving those addresses untrusted
 * turns that into a plain "Invalid origin" refusal instead. Production is
 * signed into on its own domain.
 *
 * An app adds its own further origins (a zone's own domain) through
 * `trustedOrigins`.
 */
function resolveTrustedOrigins(extra: readonly string[], cookieDomain?: string): string[] {
  if (process.env.NODE_ENV === 'development') {
    return ['http://localhost:*', 'http://127.0.0.1:*', ...extra]
  }
  if (cookieDomain) return [...extra]
  const vercel = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
    .filter((host): host is string => Boolean(host))
    .map((host) => `https://${host}`)
  return [...vercel, ...extra]
}

/**
 * Email addresses permitted to register, from `SIGNUP_ALLOWED_EMAILS` (see the
 * root `.env.example` and `./signup-allowlist`). Read once at startup, matching
 * how `trustedOrigins` reads the environment above. The gate is fail-closed:
 * an empty allowlist permits nobody, so a missing env var cannot re-open public
 * self-registration.
 */
const allowedSignUpEmails = parseAllowedEmails(process.env.SIGNUP_ALLOWED_EMAILS)

/** The parent domain every NSW Design site is served under: the root, `ui.` and `email.`. */
export const SHARED_COOKIE_DOMAIN = 'design.nsw.gov.au'

/**
 * The name every NSW Design site gives its sign-in cookies
 * (`__Secure-nswds-design.session_token`, …), in place of Better Auth's
 * `better-auth`. Renamed when the cookie became shared: design.nsw.gov.au had
 * already issued host-only cookies under the old name, which would otherwise
 * sit beside the shared one where a sign-out could clear only one of the two.
 * Must match nswds-design (`src/lib/cookie-domain.ts`) and the other toolkit.
 */
export const SESSION_COOKIE_PREFIX = 'nswds-design'

/**
 * The domain to scope the session cookie to, or `undefined` for a host-only one.
 *
 * Every NSW Design site (design.nsw.gov.au, ui.design.nsw.gov.au,
 * email.design.nsw.gov.au) signs in against one database with one secret, so
 * a cookie scoped to the parent domain makes one sign-in, and one sign-out,
 * count on all of them. That is only right for a production deployment
 * reached on that domain: a preview is served on `*.vercel.app`, where a
 * browser refuses a cookie for `design.nsw.gov.au`, and localhost has no
 * parent domain at all, so both keep a host-only cookie and sign in on their
 * own. The parent cookie reaches every subdomain of design.nsw.gov.au, which
 * is acceptable while every one of them is served by the team.
 */
export function sharedCookieDomain(
  baseURL: string | undefined,
  vercelEnv: string | undefined,
): string | undefined {
  if (vercelEnv !== 'production' || !baseURL) return undefined
  let host: string
  try {
    host = new URL(baseURL).hostname
  } catch {
    return undefined
  }
  const onDomain = host === SHARED_COOKIE_DOMAIN || host.endsWith(`.${SHARED_COOKIE_DOMAIN}`)
  return onDomain ? SHARED_COOKIE_DOMAIN : undefined
}

export interface CreateAuthOptions {
  /**
   * The path the app is served under, when it is not the domain's root: Next's
   * `basePath` for a zone (`/infographics`), or the folder a microfrontend's
   * routes live in (`/builder`). The browser reaches the endpoints at
   * `<basePath>/api/auth` either way (`getAuthClient` takes the same value).
   * Leave unset for an app at the root.
   */
  basePath?: string
  /**
   * Whether `basePath` is Next's own `basePath` config. Next strips that prefix
   * from the request before a route handler runs, so the handler at
   * `app/api/auth/[...all]` sees `/api/auth/…` and Better Auth must match the
   * request without the prefix. Leave unset when the prefix is a folder the
   * routes live in (`app/builder/api/auth/[...all]`), which Next hands over
   * whole.
   */
  nextBasePath?: boolean
  /**
   * Further origins to accept sign-in requests from, e.g. a zone's own domain
   * (`https://infographics.design.nsw.gov.au`) so its sign-in page also works
   * there. `BETTER_AUTH_URL`'s origin, localhost in development and the
   * deployment's own Vercel addresses are trusted without listing them.
   */
  trustedOrigins?: readonly string[]
}

/**
 * Build the Better Auth server instance for one app — the single source of auth
 * behaviour, shared by its route handler (`<basePath>/api/auth/[...all]`), its
 * proxy and any server-side session read.
 *
 * Every app in this repo calls this once (`lib/auth.ts`) with its own
 * `basePath` (and `nextBasePath` when that is Next's). Every NSW Design site —
 * these apps, the other toolkit's and design.nsw.gov.au itself — reads the same
 * `DATABASE_URL` and `BETTER_AUTH_SECRET`, and in production the session
 * cookie is scoped to design.nsw.gov.au (`sharedCookieDomain`), so one sign-in
 * covers them all: each app validates the cookie against the same `session`
 * table with the same secret.
 *
 * `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are read from the environment by
 * Better Auth itself. `BETTER_AUTH_URL` is the app's ORIGIN only (no path):
 * Better Auth appends `basePath` to it. For a `nextBasePath` app that makes the
 * resolved `baseURL` `<origin>/api/auth`, the root app's endpoint rather than
 * the zone's, which is fine for email + password (nothing builds an absolute
 * URL) but would misdirect a flow that does — verification or reset emails,
 * OAuth callbacks — so such a flow needs its own public URL before it is added
 * to a zone. `nextCookies()` must stay LAST in the plugin list — it flushes
 * Set-Cookie headers for calls made from Server Actions, and only works there
 * as the final plugin.
 *
 * The session is also cached in a signed cookie for one minute (`cookieCache`),
 * so the proxy's per-request `getSession` reads the cookie rather than the
 * database for the burst of requests a page costs — its assets, framed previews
 * and RSC prefetches each pass the gate. Sign-out clears the cached cookie at
 * once; a session revoked in the database any other way is still honoured for
 * at most that minute, which is the trade this gate makes.
 *
 * Who may register is the allowlist's business (`SIGNUP_ALLOWED_EMAILS`), and
 * registration is one-shot per address: with no email verification, the first
 * person to sign up with an allowlisted address owns it. Claim each address
 * before the site is shared; verification or seeded accounts (`disableSignUp`)
 * would close that window, at the cost of an email provider or a script.
 *
 * Self-service sign-up stays enabled, but `databaseHooks.user.create.before`
 * restricts *who* may register to `allowedSignUpEmails`: any account creation
 * for an address not on the list is rejected with a 403 before the user (or a
 * session) is created, so the site-wide proxy gate actually limits access. The
 * hook guards every account-creation path, not only email/password.
 */
export function createAuth({
  basePath,
  nextBasePath = false,
  trustedOrigins = [],
}: CreateAuthOptions = {}) {
  const cookieDomain = sharedCookieDomain(process.env.BETTER_AUTH_URL, process.env.VERCEL_ENV)
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: nextBasePath ? authBasePath() : authBasePath(basePath),
    trustedOrigins: resolveTrustedOrigins(trustedOrigins, cookieDomain),
    session: {
      cookieCache: { enabled: true, maxAge: 60 },
    },
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    databaseHooks: createSignUpAllowlistHooks(allowedSignUpEmails),
    advanced: {
      cookiePrefix: SESSION_COOKIE_PREFIX,
      ...(cookieDomain ? { crossSubDomainCookies: { enabled: true, domain: cookieDomain } } : {}),
    },
    plugins: [nextCookies()],
  })
}

export { authBasePath }

export type Auth = ReturnType<typeof createAuth>
