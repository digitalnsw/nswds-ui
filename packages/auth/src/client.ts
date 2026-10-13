import { createAuthClient } from 'better-auth/react'

import { authBasePath } from './base-path'

/**
 * The browser-side auth client for one app, by the app's `basePath` — the same
 * value the app passes to `createAuth`, so the client calls the endpoints where
 * that app mounted them. No origin is set: the React client defaults to the
 * current origin, which is what we want here — the API is mounted on this same
 * app, and the dev servers' ports vary, so same-origin inference is more robust
 * than pinning a URL. Only the path is given, so a zone under `/infographics`
 * or `/signature` reaches its own endpoints.
 *
 * One client per path, built on first use and cached: the components take the
 * path as a prop (a string a server component can pass; the client itself,
 * being a bag of functions, is not serialisable across that boundary) and all
 * share the one instance, so `useSession` in the header and a sign-out
 * elsewhere observe the same session store.
 *
 * Exposes `signIn`, `signUp`, `signOut`, `useSession`, `getSession`, etc.
 */
const clients = new Map<string, AppAuthClient>()

export function getAuthClient(basePath = ''): AppAuthClient {
  const path = authBasePath(basePath)
  let client = clients.get(path)
  if (!client) {
    client = createAuthClient({ basePath: path })
    clients.set(path, client)
  }
  return client
}

export type AppAuthClient = ReturnType<typeof createAuthClient>

/** What `signOutEverywhere` needs of a client; typed structurally so a test can stub it. */
interface SignOutClient {
  revokeOtherSessions: () => Promise<{ error: { message?: string } | null }>
  signOut: () => Promise<{ error: { message?: string } | null }>
}

/**
 * Sign out of every session the user holds: first every session but this one,
 * then this one, which `signOut` ends while clearing this browser's cookie.
 *
 * One sign-in covers every NSW Design site, and a session design.nsw.gov.au
 * issued before the cookies were renamed (`SESSION_COOKIE_PREFIX`) is not the
 * one a browser presents, so a plain sign-out would leave it valid in the
 * database, where a rollback to the old cookie name would read it again.
 * Revoking the *other* sessions first keeps this one valid until `signOut`
 * succeeds, so a sign-out that fails part-way can simply be retried. On a
 * failure nothing further is tried and the error is returned, so the caller
 * keeps the visitor in place.
 */
export async function signOutEverywhere(
  client: SignOutClient,
): Promise<{ error: { message?: string } | null }> {
  const revoked = await client.revokeOtherSessions()
  if (revoked.error) return revoked
  return client.signOut()
}
