import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'

import { createSignUpAllowlistHooks } from './auth-hooks'
import { authBasePath } from './base-path'
import { db } from './db'
import { schema } from './db/schema'
import { parseAllowedEmails } from './signup-allowlist'

/**
 * Origins Better Auth accepts requests from. It rejects a sign-in/up whose
 * request origin is not trusted with an "Invalid origin" error, and the trusted
 * set defaults to just the origin of `baseURL` (BETTER_AUTH_URL) — so a base URL
 * that does not match where the app is actually served is what triggers it.
 *
 * The dev servers' ports vary (each app has its own, and the local
 * microfrontends/zone proxies add more), so pinning a single `BETTER_AUTH_URL`
 * is fragile locally. Trust any localhost port in development instead; the
 * wildcard matches only localhost/127.0.0.1, never an external host. In
 * production the set is exactly `BETTER_AUTH_URL`'s origin, so that MUST be set
 * to the deployed origin.
 */
const trustedOrigins =
  process.env.NODE_ENV === 'development' ? ['http://localhost:*', 'http://127.0.0.1:*'] : []

/**
 * Email addresses permitted to register, from `SIGNUP_ALLOWED_EMAILS` (see the
 * root `.env.example` and `./signup-allowlist`). Read once at startup, matching
 * how `trustedOrigins` reads the environment above. The gate is fail-closed:
 * an empty allowlist permits nobody, so a missing env var cannot re-open public
 * self-registration.
 */
const allowedSignUpEmails = parseAllowedEmails(process.env.SIGNUP_ALLOWED_EMAILS)

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
}

/**
 * Build the Better Auth server instance for one app — the single source of auth
 * behaviour, shared by its route handler (`<basePath>/api/auth/[...all]`), its
 * proxy and any server-side session read.
 *
 * Every app in this repo calls this once (`lib/auth.ts`) with its own
 * `basePath` (and `nextBasePath` when that is Next's). They all read the same
 * `DATABASE_URL` and `BETTER_AUTH_SECRET`, so a session signed in on one app is
 * valid on every app of the shared domain: the cookie is set for the domain,
 * and each app validates it against the same `session` table with the same
 * secret.
 *
 * `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are read from the environment by
 * Better Auth itself. `BETTER_AUTH_URL` is the app's ORIGIN only (no path):
 * Better Auth appends `basePath` to it. `nextCookies()` must stay LAST in the
 * plugin list — it flushes Set-Cookie headers for calls made from Server
 * Actions, and only works there as the final plugin.
 *
 * Self-service sign-up stays enabled, but `databaseHooks.user.create.before`
 * restricts *who* may register to `allowedSignUpEmails`: any account creation
 * for an address not on the list is rejected with a 403 before the user (or a
 * session) is created, so the site-wide proxy gate actually limits access. The
 * hook guards every account-creation path, not only email/password.
 */
export function createAuth({ basePath, nextBasePath = false }: CreateAuthOptions = {}) {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: nextBasePath ? authBasePath() : authBasePath(basePath),
    trustedOrigins,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    databaseHooks: createSignUpAllowlistHooks(allowedSignUpEmails),
    plugins: [nextCookies()],
  })
}

export { authBasePath }

export type Auth = ReturnType<typeof createAuth>
